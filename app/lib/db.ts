import { supabase } from "./supabase/client";

// ============================================
// TYPES
// ============================================

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  stock_quantity: number;
  is_default: boolean;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  image_type: "gallery" | "hero_scroll" | "thumbnail";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "milk_bottle" | "lassi" | "milk_packet" | "yogurt" | "ghee";
  description: string;
  short_tagline: string;
  is_hero_product: boolean;
  nutrition_info: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    calcium?: string;
    [key: string]: string | undefined;
  };
  sort_order: number;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_slot: string;
  payment_method: string;
  status: "Pending" | "Out for Delivery" | "Delivered" | "Cancelled";
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

// ============================================
// STATIC SEED DATA (FALLBACK)
// ============================================

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "prod-almond-milk",
    slug: "almond-milk",
    name: "Almond Milk",
    category: "milk_bottle",
    description: "Premium almond milk made with carefully selected almonds, rich in protein and calcium. Perfect for breakfast, baking, or a healthy snack.",
    short_tagline: "100% Natural Almond Milk",
    is_hero_product: true,
    nutrition_info: { calories: "30", protein: "1g", carbs: "1g", fat: "2.5g", calcium: "450mg" },
    sort_order: 1,
    images: [
      { id: "img-almond-1", image_url: "/images/products/almond-milk/almond_doodh.png", alt_text: "Almond Milk Bottle", is_primary: true, image_type: "hero_scroll" }
    ],
    variants: [
      { id: "var-almond-500", label: "500ml", price: 199.00, compare_at_price: 250.00, sku: "COW-ALM-500", stock_quantity: 50, is_default: true },
      { id: "var-almond-1l", label: "1L", price: 350.00, compare_at_price: 400.00, sku: "COW-ALM-1L", stock_quantity: 30, is_default: false }
    ]
  },
  {
    id: "prod-lassi",
    slug: "lassi",
    name: "Lassi",
    category: "lassi",
    description: "Traditional yogurt-based drink, perfect for hot days. Available in sweet, salted, and mango flavors.",
    short_tagline: "Refreshing Yogurt Drink",
    is_hero_product: false,
    nutrition_info: { calories: "120", protein: "2g", carbs: "18g", fat: "3g", calcium: "200mg" },
    sort_order: 2,
    images: [
      { id: "img-lassi-1", image_url: "/images/products/lassi/lassi.png", alt_text: "Fresh Lassi Cup", is_primary: true, image_type: "hero_scroll" }
    ],
    variants: [
      { id: "var-lassi-250", label: "250ml cup", price: 120.00, compare_at_price: 150.00, sku: "COW-LAS-250", stock_quantity: 40, is_default: true },
      { id: "var-lassi-500", label: "500ml bottle", price: 220.00, compare_at_price: 250.00, sku: "COW-LAS-500", stock_quantity: 25, is_default: false },
      { id: "var-lassi-1l", label: "1L jug", price: 380.00, compare_at_price: 420.00, sku: "COW-LAS-1L", stock_quantity: 15, is_default: false }
    ]
  },
  {
    id: "prod-milk-packet",
    slug: "milk-packet",
    name: "Milk (Packets)",
    category: "milk_packet",
    description: "Fresh, pasteurized milk in convenient 250ml to 1L packets. Perfect for families and daily consumption.",
    short_tagline: "Farm Fresh Milk",
    is_hero_product: false,
    nutrition_info: { calories: "42", protein: "3.4g", carbs: "5g", fat: "1g", calcium: "280mg" },
    sort_order: 3,
    images: [
      { id: "img-milk-1", image_url: "/images/products/milk-packet/milk.png", alt_text: "Milk Packet Pouch", is_primary: true, image_type: "hero_scroll" }
    ],
    variants: [
      { id: "var-milk-250", label: "250ml", price: 90.00, compare_at_price: 100.00, sku: "COW-MIL-250", stock_quantity: 100, is_default: true },
      { id: "var-milk-500", label: "500ml", price: 170.00, compare_at_price: 200.00, sku: "COW-MIL-500", stock_quantity: 80, is_default: false },
      { id: "var-milk-1l", label: "1L", price: 340.00, compare_at_price: 380.00, sku: "COW-MIL-1L", stock_quantity: 60, is_default: false }
    ]
  },
  {
    id: "prod-yogurt-packet",
    slug: "yogurt-packet",
    name: "Yogurt (Packets)",
    category: "yogurt",
    description: "Creamy, tangy yogurt packed with probiotics for digestive health. Available in plain and Greek-style variants.",
    short_tagline: "Probiotic Rich Yogurt",
    is_hero_product: false,
    nutrition_info: { calories: "60", protein: "3.5g", carbs: "4g", fat: "2g", calcium: "200mg" },
    sort_order: 4,
    images: [
      { id: "img-yogurt-1", image_url: "/images/products/yogurt-packet/yogurt.png", alt_text: "Yogurt Packet Pouch", is_primary: true, image_type: "hero_scroll" }
    ],
    variants: [
      { id: "var-yogurt-200", label: "200g", price: 120.00, compare_at_price: 140.00, sku: "COW-YOG-200", stock_quantity: 70, is_default: true },
      { id: "var-yogurt-500", label: "500g", price: 280.00, compare_at_price: 320.00, sku: "COW-YOG-500", stock_quantity: 40, is_default: false },
      { id: "var-yogurt-1kg", label: "1kg", price: 540.00, compare_at_price: 600.00, sku: "COW-YOG-1K", stock_quantity: 20, is_default: false }
    ]
  },
  {
    id: "prod-desi-ghee",
    slug: "desi-ghee",
    name: "Desi Ghee",
    category: "ghee",
    description: "Traditional clarified butter, slowly simmered for richness and flavor. A premium cooking oil rich in healthy fats.",
    short_tagline: "Premium Clarified Butter",
    is_hero_product: false,
    nutrition_info: { calories: "120", protein: "0.2g", carbs: "0g", fat: "13g", calcium: "15mg" },
    sort_order: 5,
    images: [
      { id: "img-ghee-1", image_url: "/images/products/ghee/desi_ghee.png", alt_text: "Desi Ghee Jar", is_primary: true, image_type: "hero_scroll" }
    ],
    variants: [
      { id: "var-ghee-250", label: "250g jar", price: 650.00, compare_at_price: 750.00, sku: "COW-GHE-250", stock_quantity: 15, is_default: true },
      { id: "var-ghee-500", label: "500g jar", price: 1250.00, compare_at_price: 1400.00, sku: "COW-GHE-500", stock_quantity: 10, is_default: false },
      { id: "var-ghee-1kg", label: "1kg jar", price: 2450.00, compare_at_price: 2800.00, sku: "COW-GHE-1K", stock_quantity: 5, is_default: false }
    ]
  }
];

// Helper to get mock orders from localStorage (SSR-safe)
const getLocalOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cow_fresh_orders");
  return stored ? JSON.parse(stored) : [];
};

// Helper to save mock orders to localStorage (SSR-safe)
const saveLocalOrders = (orders: Order[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cow_fresh_orders", JSON.stringify(orders));
};

// ============================================
// DATA FETCHING ACTIONS
// ============================================

/**
 * Fetches all active products, their variants, and images.
 */
export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    console.log("Supabase not configured, returning static products");
    return STATIC_PRODUCTS;
  }

  try {
    const { data: dbProducts, error: prodError } = await supabase
      .from("products")
      .select(`
        *,
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (prodError) throw prodError;
    if (!dbProducts || dbProducts.length === 0) return STATIC_PRODUCTS;

    // Map DB schema names to client interfaces if they differ
    return dbProducts.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      short_tagline: p.short_tagline,
      is_hero_product: p.is_hero_product,
      nutrition_info: p.nutrition_info || {},
      sort_order: p.sort_order || 0,
      variants: (p.variants || []).sort((a: any, b: any) => (a.is_default ? -1 : 1)),
      images: p.images || []
    }));
  } catch (error) {
    console.error("Error fetching products from Supabase, falling back to static data:", error);
    return STATIC_PRODUCTS;
  }
}

/**
 * Fetches a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    return STATIC_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data: p, error } = await supabase
      .from("products")
      .select(`
        *,
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!p) return null;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      short_tagline: p.short_tagline,
      is_hero_product: p.is_hero_product,
      nutrition_info: p.nutrition_info || {},
      sort_order: p.sort_order || 0,
      variants: (p.variants || []).sort((a: any, b: any) => (a.is_default ? -1 : 1)),
      images: p.images || []
    };
  } catch (error) {
    console.error(`Error fetching product ${slug} from Supabase, using static fallback:`, error);
    return STATIC_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Inserts a new order.
 */
export async function createOrder(orderData: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_slot: string;
  payment_method: string;
  total_amount: number;
  items: Omit<OrderItem, "id">[];
}): Promise<Order> {
  const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const newOrder: Order = {
    id: newId,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    delivery_address: orderData.delivery_address,
    delivery_city: orderData.delivery_city,
    delivery_slot: orderData.delivery_slot,
    payment_method: orderData.payment_method,
    status: "Pending",
    total_amount: orderData.total_amount,
    created_at: new Date().toISOString(),
    items: orderData.items.map((item, index) => ({
      id: `item-${index}`,
      ...item
    }))
  };

  if (!supabase) {
    const localOrders = getLocalOrders();
    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);
    return newOrder;
  }

  try {
    // Insert order header
    const { data: dbOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        delivery_address: orderData.delivery_address,
        delivery_city: orderData.delivery_city,
        delivery_slot: orderData.delivery_slot,
        payment_method: orderData.payment_method,
        total_amount: orderData.total_amount,
        status: "Pending"
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const itemsToInsert = orderData.items.map((item) => ({
      order_id: dbOrder.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      variant_label: item.variant_label,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
    if (itemsError) throw itemsError;

    return {
      ...dbOrder,
      items: orderData.items
    };
  } catch (error) {
    console.error("Error creating order in Supabase, saving locally instead:", error);
    const localOrders = getLocalOrders();
    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);
    return newOrder;
  }
}

/**
 * Fetches all orders (useful for Admin and customer portal).
 */
export async function getOrders(): Promise<Order[]> {
  if (!supabase) {
    return getLocalOrders();
  }

  try {
    const { data: dbOrders, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .order("created_at", { ascending: false });

    if (orderError) throw orderError;
    return dbOrders;
  } catch (error) {
    console.error("Error fetching orders from Supabase, returning local storage orders:", error);
    return getLocalOrders();
  }
}

/**
 * Updates the status of an order (Admin control).
 */
export async function updateOrderStatus(orderId: string, status: "Pending" | "Out for Delivery" | "Delivered" | "Cancelled"): Promise<boolean> {
  if (!supabase) {
    const localOrders = getLocalOrders();
    const index = localOrders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      localOrders[index].status = status;
      saveLocalOrders(localOrders);
      return true;
    }
    return false;
  }

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error updating order ${orderId} in Supabase:`, error);
    // Fallback update locally in case it was a local order
    const localOrders = getLocalOrders();
    const index = localOrders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      localOrders[index].status = status;
      saveLocalOrders(localOrders);
      return true;
    }
    return false;
  }
}
