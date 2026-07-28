"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getOrders,
  updateOrderStatus,
  Order,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductVariant
} from "@/app/lib/db";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Dashboard sections: "orders" | "products" | "customers" | "discounts" | "settings"
  const [currentSection, setCurrentSection] = useState<"orders" | "products" | "customers" | "discounts" | "settings">("orders");
  const [activeOrderTab, setActiveOrderTab] = useState<string>("all");

  // Discount code management state
  const [discountsList, setDiscountsList] = useState([
    { id: "d1", code: "FRESH10", type: "percentage", value: 10, min_order: 500, active: true },
    { id: "d2", code: "WELCOME50", type: "fixed", value: 50, min_order: 300, active: true },
    { id: "d3", code: "COWFRESH20", type: "percentage", value: 20, min_order: 1000, active: true }
  ]);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState("");

  // Store settings state
  const [storePhone, setStorePhone] = useState("+92 300 1234567");
  const [storeEmail, setStoreEmail] = useState("cowfreshdairy@gmail.com");
  const [deliverySlotsList, setDeliverySlotsList] = useState([
    "Early Morning (6:00 AM - 9:00 AM)",
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (2:00 PM - 5:00 PM)",
    "Evening (6:00 PM - 9:00 PM)"
  ]);

  // Product editor modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);
  
  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<"milk_bottle" | "lassi" | "milk_packet" | "yogurt" | "ghee">("milk_bottle");
  const [shortTagline, setShortTagline] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [calcium, setCalcium] = useState("");
  const [isHero, setIsHero] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const history = await getOrders();
      setOrders(history);
      const items = await getProducts();
      setProducts(items);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if logged in already
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("cow_fresh_admin_email");
      if (storedEmail === "cowfreshdairy@gmail.com") {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cow_fresh_admin_email");
    }
    setIsLoggedIn(false);
    router.push("/login");
  };

  // Handle order status change
  const handleStatusChange = async (orderId: string, newStatus: any) => {
    setUpdatingOrderId(orderId);
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Variant modifiers
  const addVariantField = () => {
    setVariantsList(prev => [
      ...prev,
      {
        id: `var-${Math.random().toString(36).substring(2, 10)}`,
        label: "",
        price: 0,
        compare_at_price: undefined,
        sku: `SKU-${slug.toUpperCase() || "NEW"}-${prev.length + 1}`,
        stock_quantity: 100,
        is_default: false
      }
    ]);
  };

  const updateVariantField = (id: string, field: keyof ProductVariant, value: any) => {
    setVariantsList(prev =>
      prev.map(v => {
        if (v.id !== id) {
          // If setting is_default to true, make others false
          if (field === "is_default" && value === true) {
            return { ...v, is_default: false };
          }
          return v;
        }
        return { ...v, [field]: value };
      })
    );
  };

  const removeVariantField = (id: string) => {
    if (variantsList.length <= 1) return;
    setVariantsList(prev => {
      const filtered = prev.filter(v => v.id !== id);
      // If we deleted the default, set the first remaining to default
      if (prev.find(v => v.id === id)?.is_default && filtered.length > 0) {
        filtered[0] = { ...filtered[0], is_default: true };
      }
      return filtered;
    });
  };

  // Open modal for new product
  const openAddProductModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategory("milk_bottle");
    setShortTagline("");
    setDescription("");
    setImageUrl("");
    setPrice("0");
    setCompareAtPrice("");
    setStockQuantity("100");
    setSku("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setCalcium("");
    setIsHero(false);
    setSortOrder("1");
    setVariantsList([
      {
        id: `var-${Math.random().toString(36).substring(2, 10)}`,
        label: "Standard",
        price: 0,
        compare_at_price: undefined,
        sku: "",
        stock_quantity: 100,
        is_default: true
      }
    ]);
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const openEditProductModal = (prod: Product) => {
    const variants = prod.variants || [];
    const defVariant = variants.find(v => v.is_default) || variants[0];
    setEditingProduct(prod);
    setName(prod.name || "");
    setSlug(prod.slug || "");
    setCategory(prod.category || "milk_bottle");
    setShortTagline(prod.short_tagline || "");
    setDescription(prod.description || "");
    setImageUrl(prod.images?.[0]?.image_url || "");
    setPrice(defVariant ? String(defVariant.price) : "");
    setCompareAtPrice(defVariant?.compare_at_price ? String(defVariant.compare_at_price) : "");
    setStockQuantity(defVariant ? String(defVariant.stock_quantity) : "");
    setSku(defVariant ? defVariant.sku : "");
    setCalories(prod.nutrition_info?.calories || "");
    setProtein(prod.nutrition_info?.protein || "");
    setCarbs(prod.nutrition_info?.carbs || "");
    setFat(prod.nutrition_info?.fat || "");
    setCalcium(prod.nutrition_info?.calcium || "");
    setIsHero(!!prod.is_hero_product);
    setSortOrder(String(prod.sort_order || 1));
    setVariantsList(variants.length > 0 ? JSON.parse(JSON.stringify(variants)) : [
      {
        id: `var-${Math.random().toString(36).substring(2, 10)}`,
        label: "Standard",
        price: defVariant ? defVariant.price : 0,
        compare_at_price: defVariant?.compare_at_price || undefined,
        sku: defVariant ? defVariant.sku : "",
        stock_quantity: defVariant ? defVariant.stock_quantity : 100,
        is_default: true
      }
    ]);
    setIsProductModalOpen(true);
  };

  // Handle product delete
  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const success = await deleteProduct(prodId);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== prodId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Handle product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      alert("Please fill in required fields (Name, Slug).");
      return;
    }

    if (variantsList.length === 0) {
      alert("Please add at least one product variant.");
      return;
    }

    // Validate each variant
    for (const v of variantsList) {
      if (!v.label.trim()) {
        alert("Each variant must have a size/label (e.g. '290 ml').");
        return;
      }
      if (Number(v.price) <= 0) {
        alert(`Variant '${v.label}' must have a valid price greater than 0.`);
        return;
      }
    }

    // Enforce default variant
    let finalVariants = [...variantsList];
    const hasDefault = finalVariants.some(v => v.is_default);
    if (!hasDefault && finalVariants.length > 0) {
      finalVariants[0] = { ...finalVariants[0], is_default: true };
    }

    const payload: Omit<Product, "id"> = {
      name,
      slug,
      category,
      short_tagline: shortTagline,
      description,
      is_hero_product: isHero,
      sort_order: Number(sortOrder) || 1,
      nutrition_info: {
        calories: calories || undefined,
        protein: protein || undefined,
        carbs: carbs || undefined,
        fat: fat || undefined,
        calcium: calcium || undefined,
      },
      variants: finalVariants.map(v => ({
        id: v.id,
        label: v.label,
        price: Number(v.price),
        compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : undefined,
        sku: v.sku || `SKU-${slug.toUpperCase()}-${v.label.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
        stock_quantity: Number(v.stock_quantity) || 0,
        is_default: v.is_default
      })),
      images: [
        {
          id: editingProduct?.images[0]?.id || `img-${Math.random().toString(36).substring(2, 10)}`,
          image_url: imageUrl || "/images/placeholder.png",
          alt_text: `${name} Bottle`,
          is_primary: true,
          image_type: "hero_scroll"
        }
      ]
    };

    try {
      if (editingProduct) {
        const success = await updateProduct(editingProduct.id, {
          ...payload,
          id: editingProduct.id
        });
        if (success) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
        }
      } else {
        const newProduct = await createProduct(payload);
        setProducts(prev => [...prev, newProduct]);
      }
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-cf-sky/20 text-cf-navy border border-cf-sky/40";
      case "Out for Delivery":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Delivered":
        return "bg-cf-green/10 text-cf-green border border-cf-green/20";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-cf-off-white text-cf-charcoal border border-cf-sky/10";
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Out for Delivery").length;
  const totalRevenue = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Orders filtering
  const filteredOrders = orders.filter((o) => {
    if (activeOrderTab === "all") return true;
    if (activeOrderTab === "pending") return o.status === "Pending" || o.status === "Out for Delivery";
    if (activeOrderTab === "delivered") return o.status === "Delivered";
    if (activeOrderTab === "cancelled") return o.status === "Cancelled";
    return true;
  });

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-20 text-center bg-cf-off-white min-h-screen">
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <svg className="animate-spin h-10 w-10 text-cf-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-cf-navy font-bold text-sm">Redirecting to secure login portal...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-cf-green font-bold text-xs tracking-widest uppercase mb-1 block">Staff Portal</span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-cf-charcoal/60 mt-1">
              Manage product listings, monitor order dispatches, and calculate telemetry metrics in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="bg-cf-navy text-white hover:bg-cf-navy-dark font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              🔄 Refresh Data
            </button>
            {currentSection === "products" && (
              <button
                onClick={openAddProductModal}
                className="bg-cf-green text-white hover:bg-cf-green-dark font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
              >
                ➕ Add New Product
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Unified Section Selectors */}
        <div className="flex flex-wrap bg-cf-navy/5 p-1 rounded-2xl max-w-2xl gap-2">
          <button
            onClick={() => setCurrentSection("orders")}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              currentSection === "orders" ? "bg-cf-navy text-white shadow-md" : "text-cf-navy/60 hover:text-cf-navy"
            }`}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            onClick={() => setCurrentSection("products")}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              currentSection === "products" ? "bg-cf-navy text-white shadow-md" : "text-cf-navy/60 hover:text-cf-navy"
            }`}
          >
            🥛 Products ({products.length})
          </button>
          <button
            onClick={() => setCurrentSection("customers")}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              currentSection === "customers" ? "bg-cf-navy text-white shadow-md" : "text-cf-navy/60 hover:text-cf-navy"
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setCurrentSection("discounts")}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              currentSection === "discounts" ? "bg-cf-navy text-white shadow-md" : "text-cf-navy/60 hover:text-cf-navy"
            }`}
          >
            🏷️ Discounts
          </button>
          <button
            onClick={() => setCurrentSection("settings")}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              currentSection === "settings" ? "bg-cf-navy text-white shadow-md" : "text-cf-navy/60 hover:text-cf-navy"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Telemetry Metrics Grid (Orders View) */}
        {currentSection === "orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
              <span className="text-2xl mb-2 block">🥛</span>
              <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Products</h3>
              <p className="text-3xl font-extrabold text-cf-navy mt-1">{products.length}</p>
              <span className="text-[10px] text-cf-green font-semibold mt-1 block">Active Catalog</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
              <span className="text-2xl mb-2 block">📦</span>
              <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Checkouts</h3>
              <p className="text-3xl font-extrabold text-cf-navy mt-1">{totalOrders}</p>
              <span className="text-[10px] text-cf-charcoal/40 mt-1 block">Lifetime checkouts</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
              <span className="text-2xl mb-2 block">🚚</span>
              <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Active Deliveries</h3>
              <p className="text-3xl font-extrabold text-cf-navy mt-1">{pendingOrders}</p>
              <span className="text-[10px] text-cf-green font-semibold mt-1 block animate-pulse">Needs dispatch</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
              <span className="text-2xl mb-2 block">💵</span>
              <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Revenue</h3>
              <p className="text-3xl font-extrabold text-cf-green mt-1">Rs {totalRevenue}</p>
              <span className="text-[10px] text-cf-charcoal/40 mt-1 block">Delivered earnings</span>
            </div>
          </div>
        )}

        {/* ── ORDERS SECTION ── */}
        {currentSection === "orders" && (
          <div className="space-y-6">
            <div className="flex border-b border-cf-sky/20 gap-6 text-sm">
              {[
                { id: "all", label: `All Orders (${orders.length})` },
                { id: "pending", label: `Pending / Dispatch (${pendingOrders})` },
                { id: "delivered", label: `Delivered (${orders.filter(o => o.status === "Delivered").length})` },
                { id: "cancelled", label: `Cancelled (${orders.filter(o => o.status === "Cancelled").length})` }
              ].map((tab) => {
                const isActive = activeOrderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOrderTab(tab.id)}
                    className={`pb-3 font-semibold relative transition-colors ${
                      isActive ? "text-cf-green font-bold" : "text-cf-navy/60 hover:text-cf-green"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cf-green rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl border border-cf-sky/15 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="text-center py-20">
                  <svg className="animate-spin h-8 w-8 text-cf-green mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xs text-cf-charcoal/50">Fetching orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 p-6">
                  <span className="text-5xl mb-4 block font-light">📋</span>
                  <h3 className="text-lg font-bold text-cf-navy mb-1">No orders found</h3>
                  <p className="text-sm text-cf-charcoal/50">No orders match the selected category.</p>
                </div>
              ) : (
                <div className="divide-y divide-cf-sky/10">
                  {filteredOrders.map((order) => {
                    const date = new Date(order.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const isThisUpdating = updatingOrderId === order.id;

                    return (
                      <div key={order.id} className="p-6 hover:bg-cf-off-white/30 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          
                          <div className="space-y-3 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="text-xs font-mono font-bold text-cf-navy select-all leading-none bg-cf-off-white border border-cf-sky/20 px-2.5 py-1 rounded-lg">
                                ID: {order.id.substring(0, 8)}...
                              </span>
                              <span className="text-[11px] text-cf-charcoal/45">{date}</span>
                              <span className="text-xs font-bold text-cf-green">🚚 {order.delivery_slot}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-cf-charcoal/70">
                              <div>
                                <p className="font-bold text-cf-navy">{order.customer_name}</p>
                                <p>{order.customer_phone}</p>
                              </div>
                              <div>
                                <p className="font-medium">{order.delivery_address}</p>
                                <p>{order.delivery_city}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1.5">
                              {order.items?.map((item, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cf-sky/20 text-cf-navy border border-cf-sky/10"
                                >
                                  {item.product_name} ({item.variant_label}) x{item.quantity}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col lg:items-end justify-between sm:justify-start gap-4 flex-shrink-0">
                            <div className="lg:text-right">
                              <span className="text-[9px] text-cf-charcoal/40 uppercase tracking-widest block">Order Value</span>
                              <span className="text-lg font-extrabold text-cf-navy">Rs {order.total_amount}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isThisUpdating && (
                                <svg className="animate-spin h-3.5 w-3.5 text-cf-green" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              )}
                              <select
                                value={order.status}
                                disabled={isThisUpdating}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cf-green transition-all cursor-pointer ${getStatusBadgeStyle(
                                  order.status
                                )}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS SECTION ── */}
        {currentSection === "products" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-cf-sky/15 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="text-center py-20">
                  <svg className="animate-spin h-8 w-8 text-cf-green mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xs text-cf-charcoal/50">Fetching catalog products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 p-6">
                  <span className="text-5xl mb-4 block font-light">🥛</span>
                  <h3 className="text-lg font-bold text-cf-navy mb-1">Catalog is empty</h3>
                  <p className="text-sm text-cf-charcoal/50">Add a product using the button in the top right.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-cf-navy/5 text-cf-navy text-xs font-bold border-b border-cf-sky/15">
                        <th className="p-4 pl-6">Product</th>
                        <th className="p-4">Slug & Category</th>
                        <th className="p-4">Price / Variant Details</th>
                        <th className="p-4">Sort</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cf-sky/10 text-xs">
                      {products.map((prod) => {
                        const defVar = prod.variants.find(v => v.is_default) || prod.variants[0];
                        const img = prod.images[0]?.image_url || "/images/placeholder.png";

                        return (
                          <tr key={prod.id} className="hover:bg-cf-off-white/30 transition-colors">
                            <td className="p-4 pl-6 flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-cf-off-white rounded-xl border border-cf-sky/10 flex-shrink-0 overflow-hidden">
                                <Image src={img} alt={prod.name} fill className="object-contain p-1" />
                              </div>
                              <div>
                                <h4 className="font-bold text-cf-navy text-sm flex items-center gap-1.5">
                                  {prod.name}
                                  {prod.is_hero_product && (
                                    <span className="text-[9px] bg-cf-green text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90">
                                      Flagship
                                    </span>
                                  )}
                                </h4>
                                <p className="text-cf-charcoal/40 text-[10px] line-clamp-1 max-w-xs">{prod.short_tagline}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-mono text-cf-navy">{prod.slug}</p>
                              <span className="text-[10px] font-bold text-cf-green uppercase tracking-wide bg-cf-green/10 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                                {prod.category.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-cf-navy text-sm">Rs {defVar?.price}</p>
                              {defVar?.compare_at_price && (
                                <p className="text-cf-charcoal/40 line-through text-[10px]">Rs {defVar.compare_at_price}</p>
                              )}
                              <p className="text-[10px] text-cf-charcoal/50 mt-0.5">
                                SKU: {defVar?.sku} · Stock: {defVar?.stock_quantity}
                              </p>
                              {prod.variants.length > 1 && (
                                <span className="inline-block text-[9px] bg-cf-navy/10 text-cf-navy font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                                  {prod.variants.length} Size Options
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-mono font-bold text-cf-navy">
                              {prod.sort_order}
                            </td>
                            <td className="p-4 pr-6 text-right space-x-2">
                              {/* Solid background buttons */}
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="bg-cf-navy text-white hover:bg-cf-navy-dark font-bold px-3 py-1.5 rounded-xl transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="bg-red-600 text-white hover:bg-red-700 font-bold px-3 py-1.5 rounded-xl transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── PRODUCT EDITOR DIALOG OVERLAY (MODAL) ── */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-cf-navy/40 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cf-sky/20 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-cf-sky/15 flex items-center justify-between bg-cf-navy text-white">
                <h3 className="text-lg font-bold font-heading">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Create New Product"}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all leading-none text-white font-bold w-7 h-7 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Section 1: Core Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-cf-green uppercase tracking-wider text-[10px]">1. Core Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!editingProduct) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                          }
                        }}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green"
                        placeholder="Almond Milk"
                      />
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Product Slug *</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-mono"
                        placeholder="almond-milk"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                      >
                        <option value="milk_bottle">Milk Bottle</option>
                        <option value="lassi">Lassi</option>
                        <option value="milk_packet">Milk Packet</option>
                        <option value="yogurt">Yogurt</option>
                        <option value="ghee">Desi Ghee</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex items-center pt-5 sm:pl-4">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-cf-navy select-none">
                        <input
                          type="checkbox"
                          checked={isHero}
                          onChange={(e) => setIsHero(e.target.checked)}
                          className="w-4 h-4 rounded text-cf-green border-cf-sky/30 focus:ring-cf-green focus:ring-offset-0"
                        />
                        Flagship Hero Product?
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-cf-navy font-bold mb-1">Short Tagline</label>
                    <input
                      type="text"
                      value={shortTagline}
                      onChange={(e) => setShortTagline(e.target.value)}
                      className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green"
                      placeholder="100% Pure Badami Milk"
                    />
                  </div>

                  <div>
                    <label className="block text-cf-navy font-bold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green leading-relaxed"
                      placeholder="Detailed overview about product sourcing, processing, and richness..."
                    />
                  </div>

                  <div>
                    <label className="block text-cf-navy font-bold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-mono"
                      placeholder="/images/products/almond-milk/almond_doodh.png"
                    />
                  </div>
                </div>

                {/* Section 2: Pricing & Size Variants */}
                <div className="space-y-4 pt-4 border-t border-cf-sky/10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-cf-green uppercase tracking-wider text-[10px]">2. Pricing & Size Variants</h4>
                    <button
                      type="button"
                      onClick={addVariantField}
                      className="bg-cf-navy hover:bg-cf-navy-dark text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-all flex items-center gap-1 shadow-sm"
                    >
                      ➕ Add Size/Pack Variant
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {variantsList.map((variant, idx) => (
                      <div
                        key={variant.id || idx}
                        className="bg-cf-off-white/50 border border-cf-sky/15 rounded-2xl p-4 space-y-3 relative text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-cf-sky/10 pb-2">
                          <span className="font-bold text-cf-navy text-[10px] uppercase flex items-center gap-2">
                            Variant #{idx + 1} 
                            {variant.is_default ? (
                              <span className="text-[9px] bg-cf-green text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">Primary Default</span>
                            ) : (
                              <span className="text-[9px] bg-cf-navy/10 text-cf-navy/60 font-bold px-1.5 py-0.5 rounded-full uppercase">Secondary Option</span>
                            )}
                          </span>
                          {variantsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariantField(variant.id)}
                              className="text-red-500 hover:text-red-700 font-bold hover:underline text-[10px]"
                            >
                              ✕ Remove Variant
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-cf-navy font-bold mb-1 text-[9px] uppercase">Size / Label *</label>
                            <input
                              type="text"
                              required
                              value={variant.label}
                              onChange={(e) => updateVariantField(variant.id, "label", e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-cf-sky/25 bg-white focus:outline-none focus:ring-1 focus:ring-cf-green font-semibold"
                              placeholder="e.g. 500 ml, 1 Litre"
                            />
                          </div>

                          <div>
                            <label className="block text-cf-navy font-bold mb-1 text-[9px] uppercase">Price (Rs) *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={variant.price || ""}
                              onChange={(e) => updateVariantField(variant.id, "price", Number(e.target.value))}
                              className="w-full p-2.5 rounded-lg border border-cf-sky/25 bg-white focus:outline-none focus:ring-1 focus:ring-cf-green font-semibold"
                              placeholder="199"
                            />
                          </div>

                          <div>
                            <label className="block text-cf-navy font-bold mb-1 text-[9px] uppercase">Compare At (Rs)</label>
                            <input
                              type="number"
                              value={variant.compare_at_price || ""}
                              onChange={(e) => updateVariantField(variant.id, "compare_at_price", e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full p-2.5 rounded-lg border border-cf-sky/25 bg-white focus:outline-none focus:ring-1 focus:ring-cf-green font-semibold"
                              placeholder="250"
                            />
                          </div>

                          <div>
                            <label className="block text-cf-navy font-bold mb-1 text-[9px] uppercase">Stock Qty</label>
                            <input
                              type="number"
                              value={variant.stock_quantity ?? 100}
                              onChange={(e) => updateVariantField(variant.id, "stock_quantity", Number(e.target.value))}
                              className="w-full p-2.5 rounded-lg border border-cf-sky/25 bg-white focus:outline-none focus:ring-1 focus:ring-cf-green font-semibold"
                              placeholder="100"
                            />
                          </div>

                          <div>
                            <label className="block text-cf-navy font-bold mb-1 text-[9px] uppercase">SKU Code</label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => updateVariantField(variant.id, "sku", e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-cf-sky/25 bg-white focus:outline-none focus:ring-1 focus:ring-cf-green font-mono"
                              placeholder="COW-MILK-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1.5 border-t border-cf-sky/10">
                          <label className="flex items-center gap-1.5 font-bold cursor-pointer text-cf-navy select-none text-[10px]">
                            <input
                              type="checkbox"
                              checked={variant.is_default}
                              onChange={(e) => updateVariantField(variant.id, "is_default", e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-cf-green border-cf-sky/30 focus:ring-cf-green focus:ring-offset-0"
                            />
                            Make this the primary default size for display
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Nutrition Panel */}
                <div className="space-y-4 pt-4 border-t border-cf-sky/10">
                  <h4 className="font-bold text-cf-green uppercase tracking-wider text-[10px]">3. Nutrition Content (Per 100ml / serving)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Calories</label>
                      <input
                        type="text"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="30 kcal"
                      />
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Protein</label>
                      <input
                        type="text"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="1g"
                      />
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Carbs</label>
                      <input
                        type="text"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="1g"
                      />
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Fat</label>
                      <input
                        type="text"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="2.5g"
                      />
                    </div>
                    <div>
                      <label className="block text-cf-navy font-bold mb-1">Calcium</label>
                      <input
                        type="text"
                        value={calcium}
                        onChange={(e) => setCalcium(e.target.value)}
                        className="w-full p-3 rounded-xl border border-cf-sky/20 bg-cf-off-white/40 focus:outline-none focus:ring-2 focus:ring-cf-green font-semibold"
                        placeholder="450mg"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Panel */}
                <div className="pt-6 border-t border-cf-sky/10 flex items-center justify-end gap-3">
                  {/* Solid close button */}
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="bg-cf-navy text-white hover:bg-cf-navy-dark font-bold px-5 py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  {/* Solid submit button */}
                  <button
                    type="submit"
                    className="bg-cf-green text-white hover:bg-cf-green-dark font-bold px-6 py-3 rounded-xl transition-all shadow-md"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}