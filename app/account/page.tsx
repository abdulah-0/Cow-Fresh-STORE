"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { getOrders, Order } from "@/app/lib/db";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const { addToCart, openCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  // Load orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const history = await getOrders();
        setOrders(history);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper to map product names to their correct image URLs
  const getProductImage = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("almond")) return "/images/products/almond-milk/almond_doodh.png";
    if (n.includes("ghee")) return "/images/products/ghee/desi_ghee.png";
    if (n.includes("lassi")) return "/images/products/lassi/lassi.png";
    if (n.includes("packet") && n.includes("milk")) return "/images/products/milk-packet/milk.png";
    if (n.includes("yogurt")) return "/images/products/yogurt-packet/yogurt.png";
    return "/images/placeholder.png";
  };

  // Status color mapper
  const getStatusStyle = (status: string) => {
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

  // Reorder action (copies old items to cart and opens drawer)
  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    order.items.forEach((item) => {
      addToCart({
        id: item.product_id || `prod-${Math.random()}`,
        name: item.product_name,
        image: getProductImage(item.product_name),
        price: Number(item.price),
        variant: item.variant_label
      }, item.quantity);
    });

    // Show visual success notification on that specific card
    setReorderSuccess(order.id);
    setTimeout(() => {
      setReorderSuccess(null);
      openCart(); // slide open the cart drawer!
    }, 800);
  };

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-gradient-to-r from-cf-navy to-[#001f6d] text-white rounded-3xl p-6 md:p-8 shadow-md mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(146,204,252,0.15),transparent_60%)] pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <span className="text-cf-sky text-xs font-bold uppercase tracking-widest block">Customer Portal</span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
              Welcome Back
            </h1>
            <p className="text-cf-sky/70 text-sm font-light">
              Manage your delivery schedules, review past purchases, or quickly repeat your favorite dairy selections.
            </p>
          </div>

          <div className="flex gap-4 border-t border-white/10 md:border-t-0 pt-4 md:pt-0 relative z-10">
            <div className="bg-white/10 px-4 py-3 rounded-2xl text-center min-w-[100px]">
              <span className="text-2xl font-extrabold text-cf-green block">{orders.length}</span>
              <span className="text-[10px] text-cf-sky/80 uppercase tracking-wider">Total Orders</span>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl text-center min-w-[100px]">
              <span className="text-2xl font-extrabold text-cf-sky block">
                {orders.filter((o) => o.status === "Pending" || o.status === "Out for Delivery").length}
              </span>
              <span className="text-[10px] text-cf-sky/80 uppercase tracking-wider">In Transit</span>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading text-cf-navy tracking-tight">
            Order History
          </h2>

          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cf-sky/15 shadow-sm">
              <svg className="animate-spin h-8 w-8 text-cf-green mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs text-cf-charcoal/60">Retrieving your order logs...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-cf-sky/15 shadow-sm">
              <span className="text-5xl mb-4 block">📦</span>
              <h3 className="text-lg font-bold text-cf-navy mb-1">No orders placed yet</h3>
              <p className="text-sm text-cf-charcoal/60 max-w-sm mx-auto mb-6">
                You haven&apos;t ordered any farm-fresh goodness yet. We deliver within hours!
              </p>
              <Link
                href="/products"
                className="bg-cf-green hover:bg-cf-green/90 text-white font-bold py-2.5 px-6 rounded-full text-xs transition-all shadow-sm inline-block"
              >
                Browse Shop Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const date = new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                });
                const isReorderingThis = reorderSuccess === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-cf-sky/15 shadow-sm overflow-hidden"
                  >
                    {/* Card Top Header bar */}
                    <div className="p-5 bg-cf-off-white/70 border-b border-cf-sky/10 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                        <div>
                          <span className="text-[10px] text-cf-charcoal/40 uppercase tracking-wider block">Order Placed</span>
                          <span className="text-xs font-bold text-cf-navy">{date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-cf-charcoal/40 uppercase tracking-wider block">Total Paid</span>
                          <span className="text-xs font-extrabold text-cf-navy">Rs {order.total_amount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-cf-charcoal/40 uppercase tracking-wider block">Time Slot</span>
                          <span className="text-xs font-bold text-cf-green flex items-center gap-1">
                            🚚 {order.delivery_slot.split(" (")[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        
                        <button
                          onClick={() => handleReorder(order)}
                          disabled={isReorderingThis}
                          className={`text-xs font-bold py-1.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                            isReorderingThis
                              ? "bg-cf-navy text-white"
                              : "bg-cf-green hover:bg-cf-green/90 text-white"
                          }`}
                        >
                          {isReorderingThis ? (
                            <>
                              <svg className="w-3 h-3 text-cf-green animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                              Reordered!
                            </>
                          ) : (
                            <>
                              <span>🔄</span> Reorder
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Body - Items */}
                    <div className="p-5 md:p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* List of items */}
                        <div className="space-y-3.5">
                          <span className="text-[9px] text-cf-charcoal/40 font-bold uppercase tracking-widest block mb-1">Items Summary</span>
                          {order.items?.map((item, index) => {
                            const img = getProductImage(item.product_name);
                            return (
                              <div key={item.id || index} className="flex items-center gap-3 text-xs">
                                <div className="relative w-10 h-10 bg-cf-sky/10 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                                  <Image src={img} alt={item.product_name} fill className="object-contain p-0.5" sizes="40px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-cf-navy truncate">{item.product_name}</p>
                                  <p className="text-[10px] text-cf-charcoal/50 mt-0.5">
                                    {item.variant_label} &bull; Qty: {item.quantity}
                                  </p>
                                </div>
                                <span className="font-bold text-cf-navy">
                                  Rs {item.price * item.quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Delivery address details */}
                        <div className="bg-cf-off-white/40 border border-cf-sky/10 rounded-2xl p-4 space-y-2 text-xs">
                          <span className="text-[9px] text-cf-charcoal/40 font-bold uppercase tracking-widest block">Shipment Location</span>
                          <div className="space-y-1 text-cf-charcoal/85">
                            <p className="font-bold text-cf-navy">{order.customer_name}</p>
                            <p>{order.customer_phone}</p>
                            <p>{order.delivery_address}</p>
                            <p>{order.delivery_city}</p>
                          </div>
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
    </main>
  );
}