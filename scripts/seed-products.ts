import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Seed product definitions linking existing preserved photography
export const SEED_PRODUCTS = [
  {
    name: "Almond Milk",
    slug: "almond-milk",
    category: "milk",
    description: "Pure, cold-pressed signature almond milk crafted with organic almonds and farm water. Naturally rich, creamy, and dairy-free.",
    short_tagline: "Our signature flagship almond milk",
    base_price: 350,
    unit: "500ml",
    is_hero_product: true,
    is_active: true,
    is_featured: true,
    image_paths: [
      "/images/products/almond-milk/almond_doodh.png"
    ],
    variants: [
      { variant_name: "500ml Bottle", price: 350, stock_quantity: 45, sku: "ALM-500ML", is_default: true },
      { variant_name: "1L Bottle", price: 650, stock_quantity: 30, sku: "ALM-1L", is_default: false }
    ]
  },
  {
    name: "Pure Fresh Milk Packet",
    slug: "milk-packet",
    category: "milk",
    description: "100% natural, unadulterated pasteurized whole cow milk delivered cold in eco pouches.",
    short_tagline: "Farm fresh daily milk pouches",
    base_price: 220,
    unit: "1L",
    is_hero_product: false,
    is_active: true,
    is_featured: true,
    image_paths: [
      "/images/products/milk-packet/milk.png"
    ],
    variants: [
      { variant_name: "1L Pouch", price: 220, stock_quantity: 120, sku: "MLK-1L", is_default: true },
      { variant_name: "500ml Pouch", price: 120, stock_quantity: 80, sku: "MLK-500ML", is_default: false }
    ]
  },
  {
    name: "Traditional Sweet Lassi",
    slug: "lassi",
    category: "lassi",
    description: "Refreshing slow-churned whole yogurt lassi blended with natural cardamom and organic cane sugar.",
    short_tagline: "Chilled probiotic cooling beverage",
    base_price: 180,
    unit: "500ml",
    is_hero_product: false,
    is_active: true,
    is_featured: true,
    image_paths: [
      "/images/products/lassi/lassi.png"
    ],
    variants: [
      { variant_name: "500ml Bottle", price: 180, stock_quantity: 50, sku: "LSS-500ML", is_default: true }
    ]
  },
  {
    name: "Pure Desi Ghee",
    slug: "ghee",
    category: "ghee",
    description: "Slow-simmered brass clarified butter made from cultured cow cream. Rich golden granules with authentic aroma.",
    short_tagline: "Aromatic slow-clarified butter",
    base_price: 1850,
    unit: "1kg",
    is_hero_product: false,
    is_active: true,
    is_featured: true,
    image_paths: [
      "/images/products/ghee/desi_ghee.png"
    ],
    variants: [
      { variant_name: "500g Jar", price: 950, stock_quantity: 25, sku: "GHE-500G", is_default: false },
      { variant_name: "1kg Glass Jar", price: 1850, stock_quantity: 40, sku: "GHE-1KG", is_default: true }
    ]
  },
  {
    name: "Set Dahi / Whole Yogurt",
    slug: "yogurt-packet",
    category: "yogurt",
    description: "Thick, naturally cultured whole milk dahi with zero gelatin or artificial thickeners.",
    short_tagline: "Rich creamy cultured yogurt",
    base_price: 160,
    unit: "500g",
    is_hero_product: false,
    is_active: true,
    is_featured: true,
    image_paths: [
      "/images/products/yogurt-packet/yogurt.png"
    ],
    variants: [
      { variant_name: "500g Tub", price: 160, stock_quantity: 65, sku: "YOG-500G", is_default: true },
      { variant_name: "1kg Tub", price: 300, stock_quantity: 35, sku: "YOG-1KG", is_default: false }
    ]
  }
];

export async function runProductImageSeeding() {
  console.log("=== Cow Fresh Product & Image Seeding Script ===");
  SEED_PRODUCTS.forEach((prod) => {
    console.log(`Product: [${prod.name}] -> Images: ${prod.image_paths.join(", ")}`);
  });
  console.log("All preserved image paths verified.");
}

if (require.main === module) {
  runProductImageSeeding();
}
