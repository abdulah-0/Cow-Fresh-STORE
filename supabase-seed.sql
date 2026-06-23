-- ============================================
-- COW FRESH E-COMMERCE - SEED DATA
-- ============================================
-- Run this SECOND in Supabase SQL Editor (after schema)

-- Products
INSERT INTO products (slug, name, category, description, short_tagline, is_hero_product, nutrition_info, sort_order) VALUES
('almond-milk', 'Almond Milk', 'milk_bottle', 'Premium almond milk made with carefully selected almonds, rich in protein and calcium. Perfect for breakfast, baking, or a healthy snack.', '100% Natural Almond Milk', true, '{"calories": "30", "protein": "1g", "carbs": "1g", "fat": "2.5g", "calcium": "450mg"}', 1),
('lassi', 'Lassi', 'lassi', 'Traditional yogurt-based drink, perfect for hot days. Available in sweet, salted, and mango flavors.', 'Refreshing Yogurt Drink', false, '{"calories": "120", "protein": "2g", "carbs": "18g", "fat": "3g", "calcium": "200mg"}', 2),
('milk-packet', 'Milk (Packets)', 'milk_packet', 'Fresh, pasteurized milk in convenient 250ml to 1L packets. Perfect for families and daily consumption.', 'Farm Fresh Milk', false, '{"calories": "42", "protein": "3.4g", "carbs": "5g", "fat": "1g", "calcium": "280mg"}', 3),
('yogurt-packet', 'Yogurt (Packets)', 'yogurt', 'Creamy, tangy yogurt packed with probiotics for digestive health. Available in plain and Greek-style variants.', 'Probiotic Rich Yogurt', false, '{"calories": "60", "protein": "3.5g", "carbs": "4g", "fat": "2g", "calcium": "200mg"}', 4),
('desi-ghee', 'Desi Ghee', 'ghee', 'Traditional clarified butter, slowly simmered for richness and flavor. A premium cooking oil rich in healthy fats.', 'Premium Clarified Butter', false, '{"calories": "120", "protein": "0.2g", "carbs": "0g", "fat": "13g", "calcium": "15mg"}', 5);

-- Product Variants
INSERT INTO product_variants (product_id, label, price, compare_at_price, sku, stock_quantity, is_default) VALUES
((SELECT id FROM products WHERE slug = 'almond-milk'), '500ml', 199.00, 250.00, 'COW-ALM-500', 50, true),
((SELECT id FROM products WHERE slug = 'almond-milk'), '1L', 350.00, 400.00, 'COW-ALM-1L', 30, false),
((SELECT id FROM products WHERE slug = 'lassi'), '250ml cup', 120.00, 150.00, 'COW-LAS-250', 40, true),
((SELECT id FROM products WHERE slug = 'lassi'), '500ml bottle', 220.00, 250.00, 'COW-LAS-500', 25, false),
((SELECT id FROM products WHERE slug = 'lassi'), '1L jug', 380.00, 420.00, 'COW-LAS-1L', 15, false),
((SELECT id FROM products WHERE slug = 'milk-packet'), '250ml', 90.00, 100.00, 'COW-MIL-250', 100, true),
((SELECT id FROM products WHERE slug = 'milk-packet'), '500ml', 170.00, 200.00, 'COW-MIL-500', 80, false),
((SELECT id FROM products WHERE slug = 'milk-packet'), '1L', 340.00, 380.00, 'COW-MIL-1L', 60, false),
((SELECT id FROM products WHERE slug = 'yogurt-packet'), '200g', 120.00, 140.00, 'COW-YOG-200', 70, true),
((SELECT id FROM products WHERE slug = 'yogurt-packet'), '500g', 280.00, 320.00, 'COW-YOG-500', 40, false),
((SELECT id FROM products WHERE slug = 'yogurt-packet'), '1kg', 540.00, 600.00, 'COW-YOG-1K', 20, false),
((SELECT id FROM products WHERE slug = 'desi-ghee'), '250g jar', 650.00, 750.00, 'COW-GHE-250', 15, true),
((SELECT id FROM products WHERE slug = 'desi-ghee'), '500g jar', 1250.00, 1400.00, 'COW-GHE-500', 10, false),
((SELECT id FROM products WHERE slug = 'desi-ghee'), '1kg jar', 2450.00, 2800.00, 'COW-GHE-1K', 5, false);

-- Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, image_type) VALUES
((SELECT id FROM products WHERE slug = 'almond-milk'), '/images/products/almond-milk/almond_doodh.png', 'Almond Milk', true, 1, 'hero_scroll'),
((SELECT id FROM products WHERE slug = 'lassi'), '/images/products/lassi/lassi.png', 'Lassi', true, 1, 'hero_scroll'),
((SELECT id FROM products WHERE slug = 'milk-packet'), '/images/products/milk-packet/milk.png', 'Milk Packets', true, 1, 'hero_scroll'),
((SELECT id FROM products WHERE slug = 'yogurt-packet'), '/images/products/yogurt-packet/yogurt.png', 'Yogurt Packets', true, 1, 'hero_scroll'),
((SELECT id FROM products WHERE slug = 'desi-ghee'), '/images/products/ghee/desi_ghee.png', 'Desi Ghee', true, 1, 'hero_scroll');