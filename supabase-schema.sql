-- ============================================
-- COW FRESH E-COMMERCE - DATABASE SCHEMA
-- ============================================
-- Run this FIRST in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('milk_bottle', 'lassi', 'milk_packet', 'yogurt', 'ghee')),
  description TEXT,
  short_tagline TEXT,
  is_hero_product BOOLEAN DEFAULT false,
  nutrition_info JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants Table
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false
);

-- Product Images Table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  image_type TEXT DEFAULT 'gallery' CHECK (image_type IN ('gallery', 'hero_scroll', 'thumbnail'))
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_hero ON products(is_hero_product);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_type ON product_images(image_type);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "products_select_allow_anonymous" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin_only" ON products FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "products_update_admin_only" ON products FOR UPDATE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "products_delete_admin_only" ON products FOR DELETE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));

-- Product Variants Policies
CREATE POLICY "product_variants_select_allow_anonymous" ON product_variants FOR SELECT USING (true);
CREATE POLICY "product_variants_insert_admin_only" ON product_variants FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product_variants_update_admin_only" ON product_variants FOR UPDATE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product_variants_delete_admin_only" ON product_variants FOR DELETE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));

-- Product Images Policies
CREATE POLICY "product_images_select_allow_anonymous" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_insert_admin_only" ON product_images FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product_images_update_admin_only" ON product_images FOR UPDATE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product_images_delete_admin_only" ON product_images FOR DELETE WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "product-images-public-read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product-images-admin-upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product-images-admin-update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));
CREATE POLICY "product-images-admin-delete" ON storage.objects FOR DELETE WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin'));

-- ============================================
-- ORDERS & ORDER ITEMS TABLES
-- ============================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_slot TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'COD',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Out for Delivery', 'Delivered', 'Cancelled')),
  total_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Indexes for Orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "orders_select_public" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert_public" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE WITH CHECK (true);
CREATE POLICY "order_items_select_public" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_insert_public" ON order_items FOR INSERT WITH CHECK (true);