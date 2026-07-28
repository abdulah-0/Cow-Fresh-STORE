# Product Requirements Document
## Cow Fresh — Dairy E-Commerce Platform

**Version:** 1.0
**Owner:** Abdullah
**Stack:** Next.js (App Router) + Supabase (Postgres, Auth, Storage, Row-Level Security) + Tailwind CSS + Framer Motion
**Document type:** Implementation-ready spec for AI code editors (Cursor / Windsurf)

---

## 1. Overview

Cow Fresh is a direct-to-consumer dairy e-commerce store selling milk, yogurt, butter, cheese, ghee, and related products. The platform consists of two applications sharing one Supabase backend:

1. **Storefront** — public-facing store with product browsing, cart, checkout, order tracking, and account management. Built for a modern, fast, mobile-first shopping experience.
2. **Admin Panel** — a separate, access-gated interface for managing products, orders, inventory, customers, and store content. Only accessible to users with an `admin` role; there is no public sign-up path into it.

Both apps read/write the same Supabase project but are deployed as logically separate route groups (or separate apps) so admin code and secrets never ship to the public bundle.

---

## 2. Rebuild Approach — Clean Slate

This is a **full rebuild, not an incremental change.** Before any new code is written, the AI code editor (Cursor/Windsurf) must:

1. Delete all existing project files (source code, config, generated build artifacts) **except**:
   - The existing product images folder in the project root — these are real assets and must be preserved and reused, not regenerated or replaced with stock/AI images.
   - Any `.env` / environment files containing live Supabase or payment credentials (back these up first, do not commit them, but do not delete the working local copy).
2. Re-initialize the project from scratch (fresh Next.js app scaffold) per Section 4.
3. Re-create the Supabase schema from Section 7 in a clean state (drop and recreate tables, or point to a fresh Supabase project if preferred — confirm which before running destructive SQL against a live project).
4. Copy the preserved product images into the new project's asset pipeline (e.g. `/public/products/` or upload directly to Supabase Storage — see Section 10.2a) rather than sourcing new photography or placeholder images.

**Safety check before deletion:** if the existing project has any live customer data, orders, or a production Supabase database already in use, confirm with Abdullah whether the Supabase project itself should be wiped/recreated or only the frontend codebase. This PRD assumes the frontend is being rebuilt; the Supabase backend should only be reset if explicitly confirmed, since that would destroy any existing orders/customers.

---

## 3. Goals & Non-Goals

### Goals
- A polished, trustworthy storefront that converts browsers into repeat dairy subscribers.
- A secure admin panel gated behind Supabase Auth + role check, not just a hidden URL.
- Real-time-ish inventory accuracy (stock decremented on order confirmation).
- Clean data model in Supabase that supports future subscription/recurring-delivery features.
- Sub-2.5s perceived load time on the storefront; smooth transitions everywhere (page transitions, cart drawer, image loading).

### Non-Goals (v1)
- No multi-vendor marketplace support.
- No native mobile app (responsive web only).
- No subscription/recurring orders in v1 (schema should allow adding it later).
- No multi-currency/multi-language support in v1.

---

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js 14+ (App Router) | Server Components for product/catalog pages, Client Components for cart/checkout interactivity |
| Styling | Tailwind CSS | Utility-first, paired with a small design-token file for brand colors/typography |
| Animation | Framer Motion | Page transitions, cart drawer, add-to-cart micro-interactions, skeleton loaders |
| Backend/DB | Supabase (Postgres) | Single source of truth for both storefront and admin |
| Auth | Supabase Auth (email/password + optional Google OAuth) | Role stored in a `profiles` table, enforced via RLS policies, not just client-side checks |
| File storage | Supabase Storage | Product images, category banners |
| Payments | Stripe (or JazzCash/EasyPaisa if targeting Pakistan-only checkout) | Payment intent created server-side via a Next.js Route Handler |
| Hosting | Vercel (frontend) + Supabase Cloud (backend) | |
| State management | React Context / Zustand for cart state | Persisted to `localStorage` for guests, synced to Supabase `cart_items` table for logged-in users |

**Decision needed from Abdullah:** confirm payment processor (Stripe requires an internationally-enabled business account; if targeting Pakistani customers only, JazzCash/EasyPaisa or Cash-on-Delivery may be more practical). This PRD assumes **Cash on Delivery (COD) + optional Stripe** as the default until confirmed, since COD is the lowest-friction path to ship v1.

---

## 5. User Roles

| Role | Description | Access |
|---|---|---|
| **Guest** | Unauthenticated visitor | Browse, add to cart, must create account or checkout as guest at final step |
| **Customer** | Registered shopper | Order history, saved addresses, wishlist, profile |
| **Admin** | Store operator (Abdullah / staff) | Full access to `/admin/*` routes: products, orders, inventory, customers, discounts, content |

Role is stored as a column on a `profiles` table (`role: 'customer' | 'admin'`), **never** trusted from client state. Every admin-only Supabase query is additionally protected by Row-Level Security policies that check `auth.uid()` against the `profiles.role` column, so even a direct API call from outside the app cannot read/write admin data without the correct role.

---

## 6. Information Architecture

### Storefront routes
```
/                          Home (hero, featured products, brand story, testimonials)
/shop                      All products, filters (category, price, in-stock)
/shop/[category]           Category listing (Milk, Yogurt, Cheese, Butter, Ghee, ...)
/product/[slug]            Product detail page
/cart                      Cart drawer (also accessible as slide-over from any page)
/checkout                  Address → Delivery slot → Payment → Review
/checkout/success           Order confirmation
/account                   Profile, saved addresses
/account/orders            Order history
/account/orders/[id]       Order detail + tracking status
/wishlist                  Saved items
/login, /signup            Auth screens
/about, /contact           Static/content pages
```

### Admin routes (separate layout, auth-gated)
```
/admin/login                          Admin-only login (rejects non-admin accounts)
/admin                                Dashboard: today's orders, revenue, low-stock alerts
/admin/products                       Product list, search, filter
/admin/products/new                   Create product
/admin/products/[id]/edit             Edit product, manage variants & stock
/admin/orders                         Order queue with status filters
/admin/orders/[id]                    Order detail, update status, print invoice
/admin/customers                      Customer list, order history per customer
/admin/discounts                      Coupon/discount code management
/admin/content                        Manage homepage banners, featured products
/admin/settings                       Delivery zones, delivery slots, store hours
```

---

## 7. Supabase Data Model

```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  sort_order int default 0
);

-- Products
create table products (
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

-- Product variants (e.g. 500ml / 1L / 2L of the same milk)
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  variant_name text not null,
  price numeric(10,2) not null,
  stock_quantity int not null default 0,
  sku text unique
);

-- Addresses
create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  label text,                       -- 'Home', 'Work'
  address_line text not null,
  city text not null,
  phone text not null,
  is_default boolean default false
);

-- Carts (server-synced for logged-in users)
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, variant_id)
);

-- Orders
create table orders (
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
create table order_items (
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
create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  expires_at timestamptz,
  is_active boolean default true
);

-- Wishlist
create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  unique (user_id, product_id)
);
```

### Row-Level Security (RLS) — key policies

```sql
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Products: public read, admin-only write
create policy "public read products" on products for select using (is_active = true or is_admin());
create policy "admin write products" on products for insert with check (is_admin());
create policy "admin update products" on products for update using (is_admin());
create policy "admin delete products" on products for delete using (is_admin());

-- Orders: customers see only their own; admins see all
create policy "customers read own orders" on orders for select using (user_id = auth.uid() or is_admin());
create policy "customers create own orders" on orders for insert with check (user_id = auth.uid());
create policy "admin update orders" on orders for update using (is_admin());

-- Cart items: only the owning user
create policy "own cart only" on cart_items for all using (user_id = auth.uid());

-- Profiles: users read/update their own row; only admins can change role
create policy "read own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles for update using (id = auth.uid());
```

This is the security backbone: **the admin panel's "gate" is not a hidden route — it is enforced at the database layer.** Even if someone found `/admin` and had a valid Supabase session, every query would fail RLS unless their `profiles.role = 'admin'`.

---

## 8. Admin Panel — Access Control Flow

1. Admin visits `/admin/login` (a route that is not linked from the public storefront nav).
2. Supabase Auth signs them in via email/password.
3. Middleware (`middleware.ts`) runs on every `/admin/*` request:
   - Checks for a valid Supabase session.
   - Queries `profiles.role` for the session's user id.
   - If no session → redirect to `/admin/login`.
   - If session exists but `role !== 'admin'` → redirect to storefront home with a "not authorized" toast; **do not** reveal that `/admin` exists as a concept.
4. Admin accounts are **not created via public sign-up.** They are provisioned by:
   - Directly inserting a row into `profiles` with `role = 'admin'` via the Supabase dashboard, or
   - A one-time seed script run by Abdullah.
   - (Optional, later) A "manage staff" screen inside `/admin/settings` where an existing admin can promote another registered customer to admin.
5. Session refresh and logout handled via Supabase's standard client-side SDK; admin session cookies are `httpOnly` and separate in scope from customer-facing session handling only in that middleware checks role — the underlying Supabase Auth session mechanism is shared.

---

## 9. Storefront Feature Requirements

### 9.1 Home Page
- **Hero section is built around Almond Milk as the flagship/signature product** — not a generic rotating banner. The primary hero features the actual almond milk bottle product photography (reused from existing project assets, see Section 10.2a) large and prominent, with supporting copy ("Our signature almond milk" or similar), a direct "Shop Almond Milk" CTA into that product's detail page, and secondary bottle angles as accent imagery around the main shot.
- A secondary rotating promo banner slot (managed from `/admin/content`) can still run seasonal campaigns further down the page, but it does not replace or compete with the almond milk hero.
- "Shop by category" grid (Milk, Almond Milk, Yogurt, Butter, Cheese, Ghee) — Almond Milk gets its own category tile even if stored under "Milk" in the data model, since it is the emphasis product.
- Featured products carousel (`is_featured = true`), with almond milk variants pinned first.
- Trust strip: farm-to-door freshness, same-day delivery, quality guarantee.
- Smooth scroll-triggered fade/slide-in animations (Framer Motion `whileInView`); the hero product image gets its own entrance animation (fade + slight scale-in) rather than appearing instantly.

### 9.2 Product Listing & Filtering
- Grid layout, responsive (2 columns mobile, 4 columns desktop).
- Filters: category, price range, in-stock only.
- Sort: price low-high, high-low, newest.
- Skeleton loaders while fetching (no layout shift).

### 9.3 Product Detail Page
- Image gallery with zoom-on-hover.
- Variant selector (e.g. 500ml / 1L) that updates price and stock live.
- Quantity stepper with stock-aware max limit.
- "Add to cart" with a satisfying micro-interaction (button morph → checkmark, cart icon bump animation).
- Related products section.

### 9.4 Cart
- Slide-over drawer accessible from any page (not a full page navigation) for speed.
- Line-item quantity edit / remove with optimistic UI updates.
- Free-delivery progress bar ("Add PKR 500 more for free delivery").
- Persisted per-user in Supabase `cart_items`; persisted per-guest in `localStorage`, merged into Supabase on login.

### 9.5 Checkout
- Step flow: Address → Delivery Slot → Payment Method → Review & Place Order.
- Guest checkout allowed (creates a lightweight order tied to a phone/email, prompts optional account creation after).
- Discount code field with live validation against `discount_codes`.
- Order placement is a single server action that: creates `orders` row, creates `order_items` rows, decrements `product_variants.stock_quantity`, and (if card payment) confirms the Stripe payment intent — all inside one flow with rollback on failure.

### 9.6 Account Area
- Order history with status badges and a simple visual progress tracker (Pending → Confirmed → Packed → Out for Delivery → Delivered).
- Saved addresses (add/edit/delete, set default).
- Wishlist.

### 9.7 Visual/UX Requirements — Design System

The previous placeholder palette is replaced with a concrete, distinctive direction (see the companion mockup: `cowfresh-homepage-mockup.html`). This is not a generic "cream + accent color" template — it is built around a "morning pour" concept: soft dawn tones, a single diagonal pour-shape as the page's signature motif, and the almond milk bottle as an illustrated centerpiece rather than a stock photo in a rounded card.

**Color tokens**
| Token | Hex | Usage |
|---|---|---|
| `--ivory` | `#FAF6EF` | Page background |
| `--pine` | `#1F3B2C` | Secondary text, borders, category tags |
| `--pine-deep` | `#12201A` | Primary text, dark surfaces (nav, footer, trust strip) |
| `--oat` | `#C9A876` | Warm accent — almond-toned surfaces, badges |
| `--oat-light` | `#EFE3C9` | Light warm surfaces |
| `--sky` | `#DCEEF2` | Cool "fresh/cold" accent — product thumbnails, pour-shape |
| `--clay` | `#B5652E` | Single CTA/emphasis color — primary buttons, Almond Milk category card |

**Typography**
- Display: **Fraunces** (serif, weights 300/500/600) — used for all headings and the hero title, with an italic weight reserved for the one emphasized word per headline (e.g. "Poured *fresh*").
- Body: **Inter** — all paragraph text, nav links, buttons.
- Utility/labels: **JetBrains Mono**, small caps, wide letter-spacing — used for eyebrows ("Our signature almond milk"), product tags ("Unsweetened · 1L"), and category tags ("Signature", "Everyday", "Cultured"). This is the one place monospace appears; it should read as a deliberate labeling convention, not a second body font.

**Signature layout element — the pour-shape**
A soft diagonal wedge (sky-blue on ivory) cuts across the hero section, entering with a wipe-in animation on page load. This same diagonal seam reappears once more, subtly, as a section divider further down the page (not repeated as decoration on every section) — it is the one visual idea the page is built around, per the "spend your boldness in one place" principle.

**Hero section specifics**
- Two-column layout: copy + CTA on the left, an illustrated almond milk bottle (SVG line-art with a Cow Fresh label, not a generic photo-in-a-card) on the right, with a small mono-font badge ("Unsweetened · 1L") floating near it.
- Hero title uses the display serif at a large, condensed size (`clamp(40px, 5.4vw, 74px)`), max-width capped in character units so it wraps deliberately rather than stretching full-width.
- Primary CTA is a pill-shaped dark button that shifts to the clay accent color on hover; a secondary ghost-link CTA ("See how it's made →") sits beside it for users not ready to buy yet.

**Category & product cards**
- Category tiles are dark, rounded cards with a mono-font tag ("Signature", "Everyday", "Cultured", "Churned", "Aged") above the category name — the Almond Milk tile is the one rendered in the clay accent color, visually distinct from the rest, reinforcing it as the flagship.
- Product cards are light, bordered, with a soft-sky thumbnail area, serif product name, mono-font meta line (size/dietary tag), and a circular "+" add-to-cart button that inverts to filled dark on hover.

**Motion principles**
- Micro-interactions (button hover, add-to-cart, card lift): 200–350ms, `cubic-bezier(.22,.61,.36,1)` ease.
- Hero entrance: orchestrated, not scattered — the pour-shape wipes in first, then the bottle illustration fades/scales in slightly after, so the load feels like one sequence rather than several elements animating independently.
- Respect `prefers-reduced-motion`: all animations disabled via media query fallback.

**Mobile-first behavior**
- Below 900px: hero stacks to a single column with the bottle illustration first, nav links collapse into a bottom tab bar (Home, Shop, Cart, Account), category and product grids drop to 2 columns.
- Touch targets minimum 40x40px; the circular add-to-cart button and cart icon are sized accordingly.

**Reference implementation:** `cowfresh-homepage-mockup.html` is a working static build of this system (nav, hero, category grid, featured products, trust strip, footer) and should be used as the literal visual/interaction reference when building the real Next.js components — colors, type scale, spacing, and the pour-shape animation should be lifted directly from it rather than reinterpreted.

---

## 10. Admin Panel Feature Requirements

### 10.1 Dashboard
- Today's order count, today's revenue, pending orders needing action.
- Low-stock alert list (variants below a configurable threshold).
- Quick links to most recent orders.

### 10.2 Product Management
- List view: search by name, filter by category/active status.
- Create/edit form: name, description, category, images (upload to Supabase Storage), variants with price/stock per variant, active/inactive toggle, featured toggle.
- Bulk actions: activate/deactivate, delete.

#### 10.2a Reusing Existing Product Images
The project root already contains real product photography (including the almond milk bottle shots). These must be **reused as-is, not regenerated, replaced with stock photography, or re-shot/AI-generated.** Implementation steps:

1. During the clean-slate rebuild (Section 2), copy the existing image files out of the old project structure before deletion, into a temporary holding folder.
2. On re-scaffold, either:
   - Place them in `/public/products/` and reference by relative path in `products.image_urls`, **or**
   - Upload them to a Supabase Storage bucket (e.g. `product-images`) via a one-time seed script, and store the resulting public URLs in `products.image_urls` — this is the preferred approach since it keeps images manageable from the admin panel later.
3. Write a seed script (`scripts/seed-products.ts` or similar) that maps each existing image filename to its corresponding product/variant row, so the almond milk bottle images are explicitly linked to the Almond Milk product and its variants (not left to guesswork or manual re-upload).
4. The product image upload UI in `/admin/products/[id]/edit` should still support uploading *new* images going forward — the reuse instruction applies to the initial seed/migration, not to how the admin panel works long-term.
5. If any product is missing a corresponding existing image, flag it rather than silently generating a placeholder, so Abdullah can supply the correct photo.

### 10.3 Order Management
- Queue view grouped/filterable by status.
- Order detail: customer info, items, address, payment status, and a status-update control that customers see reflected in their order tracker.
- Printable/exportable invoice (simple PDF generation).

### 10.4 Customer Management
- List of registered customers with order count and lifetime value.
- Drill into a customer's order history.

### 10.5 Discounts
- Create/edit/deactivate discount codes with type (percentage/fixed), min order value, expiry.

### 10.6 Content Management
- Manage homepage hero banners and which products are "featured" without needing a code deploy.

### 10.7 Settings
- Delivery zones and delivery slot definitions.
- Store contact info shown in storefront footer.

---

## 11. Non-Functional Requirements

- **Performance:** Largest Contentful Paint < 2.5s on 4G; images served via Next/Image with responsive sizes; Supabase queries indexed on `slug`, `category_id`, `user_id`, `status`.
- **Security:** All admin mutations protected by RLS as described in Section 7; no service-role key ever exposed to the client; secrets only in server-side Route Handlers/Server Actions.
- **Accessibility:** Semantic HTML, sufficient color contrast, keyboard-navigable cart/checkout, `prefers-reduced-motion` respected.
- **Reliability:** Stock decrement and order creation wrapped in a single Postgres transaction (via a Supabase RPC function) to avoid overselling under concurrent checkouts.
- **Observability:** Basic error logging (e.g. Sentry) on both storefront and admin for checkout and admin-mutation failures.

---

## 12. Suggested Build Phases

| Phase | Scope |
|---|---|
| 1 | Supabase schema + RLS policies, project scaffolding, design tokens |
| 2 | Storefront: home, shop listing, product detail (static/read-only) |
| 3 | Cart + guest/localStorage sync + Supabase sync on login |
| 4 | Checkout flow + order creation RPC + stock decrement transaction |
| 5 | Account area: order history, addresses, wishlist |
| 6 | Admin: auth gate + dashboard + product management |
| 7 | Admin: order management + customer management |
| 8 | Admin: discounts + content management + settings |
| 9 | Polish pass: animations, loading states, empty states, accessibility audit |
| 10 | QA, seed data, deployment |

---

## 13. Open Questions for Abdullah

1. Confirm payment method(s): COD only, or COD + card via Stripe/local gateway?
2. Delivery model: fixed slots (e.g. "6–8 AM", "5–7 PM") or a delivery-zone-based ETA?
3. Should the admin panel support multiple staff accounts with different permission levels (e.g. order-packer vs full admin), or is a single `admin` role sufficient for v1?
4. Section 9.7 now proposes a specific "morning pour" design direction (ivory/pine/oat/sky/clay palette, Fraunces + Inter + JetBrains Mono) with a working mockup — confirm this direction before it's implemented in full, or flag if the existing logo/brand assets pull in a different direction that should override it.
5. Any existing product catalog data (CSV/Excel) to seed the database with, or should placeholder data be used for initial development?

---

*This PRD is written for direct use in an AI code editor (Cursor/Windsurf) as the spec driving implementation. Pair it with an `implementation.md` breaking each phase above into concrete, checkable tasks before starting Phase 1.*
