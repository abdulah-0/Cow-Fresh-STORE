-- ===================================================
-- COW FRESH - COMPLETE SUPABASE SCHEMA & RLS POLICIES
-- ===================================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  sort_order int default 0
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id),
  base_price numeric(10,2) not null,
  unit text not null,              -- e.g. '1L', '500g', '250ml'
  image_urls text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  variant_name text not null,
  price numeric(10,2) not null,
  stock_quantity int not null default 0,
  sku text unique
);

-- Addresses
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  label text,                       -- 'Home', 'Work'
  address_line text not null,
  city text not null,
  phone text not null,
  is_default boolean default false
);

-- Cart items (server-synced for logged-in users)
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, variant_id)
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  status text not null default 'pending'
    check (status in ('pending','confirmed','packed','out_for_delivery','delivered','cancelled')),
  address_id uuid references addresses(id),
  delivery_slot text,
  payment_method text not null check (payment_method in ('cod','card')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Order items (snapshot of price/name at time of order)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  variant_id uuid references product_variants(id),
  product_name text not null,
  variant_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null,
  line_total numeric(10,2) not null
);

-- Discount codes
create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  expires_at timestamptz,
  is_active boolean default true
);

-- Wishlist
create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  unique (user_id, product_id)
);

-- ===================================================
-- ROW LEVEL SECURITY & HELPERS
-- ===================================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;
alter table addresses enable row level security;
alter table wishlist_items enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Products Policies
create policy "public read products" on products for select using (is_active = true or is_admin());
create policy "admin write products" on products for insert with check (is_admin());
create policy "admin update products" on products for update using (is_admin());
create policy "admin delete products" on products for delete using (is_admin());

-- Categories Policies
create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all using (is_admin());

-- Product Variants Policies
create policy "public read product_variants" on product_variants for select using (true);
create policy "admin write product_variants" on product_variants for all using (is_admin());

-- Orders Policies
create policy "customers read own orders" on orders for select using (user_id = auth.uid() or is_admin() or user_id is null);
create policy "customers create own orders" on orders for insert with check (true);
create policy "admin update orders" on orders for update using (is_admin());

-- Cart items Policies
create policy "own cart only" on cart_items for all using (user_id = auth.uid());

-- Profiles Policies
create policy "read own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles for update using (id = auth.uid());

-- Addresses Policies
create policy "own addresses only" on addresses for all using (user_id = auth.uid());

-- Wishlist Policies
create policy "own wishlist only" on wishlist_items for all using (user_id = auth.uid());

-- ===================================================
-- ATOMIC ORDER CREATION & STOCK DECREMENT RPC
-- ===================================================

create or replace function place_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_city text,
  p_delivery_slot text,
  p_payment_method text,
  p_subtotal numeric(10,2),
  p_discount_amount numeric(10,2),
  p_total numeric(10,2),
  p_items jsonb
) returns uuid as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_variant_id uuid;
  v_qty int;
  v_current_stock int;
begin
  -- 1. Create the order row
  insert into orders (
    user_id,
    status,
    delivery_slot,
    payment_method,
    payment_status,
    subtotal,
    discount_amount,
    delivery_fee,
    total
  ) values (
    auth.uid(),
    'pending',
    p_delivery_slot,
    p_payment_method,
    'unpaid',
    p_subtotal,
    p_discount_amount,
    0,
    p_total
  ) returning id into v_order_id;

  -- 2. Process order items and decrement stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_qty := (v_item->>'quantity')::int;

    -- Check stock availability if variant ID is provided
    if v_variant_id is not null then
      select stock_quantity into v_current_stock
      from product_variants
      where id = v_variant_id for update;

      if v_current_stock < v_qty then
        raise exception 'Insufficient stock for product variant ID: %', v_variant_id;
      end if;

      -- Decrement stock
      update product_variants
      set stock_quantity = stock_quantity - v_qty
      where id = v_variant_id;
    end if;

    -- Insert order item snapshot
    insert into order_items (
      order_id,
      variant_id,
      product_name,
      variant_name,
      unit_price,
      quantity,
      line_total
    ) values (
      v_order_id,
      v_variant_id,
      v_item->>'product_name',
      v_item->>'variant_name',
      (v_item->>'unit_price')::numeric(10,2),
      v_qty,
      ((v_item->>'unit_price')::numeric(10,2) * v_qty)
    );
  end loop;

  return v_order_id;
end;
$$ language plpgsql security definer;

