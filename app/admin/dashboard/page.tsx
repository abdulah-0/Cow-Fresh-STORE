"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, Order } from "@/app/lib/db";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const fetchOrders = async () => {
    try {
      const history = await getOrders();
      setOrders(history);
    } catch (error) {
      console.error("Error loading admin orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: any) => {
    setUpdatingId(orderId);
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        // Optimistically update local state or re-fetch
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Status style mapper
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

  // Compute metrics dynamically in real-time!
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Out for Delivery"
  ).length;
  
  // Revenue is calculated only from "Delivered" orders
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Filtering orders based on tab selection
  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return o.status === "Pending" || o.status === "Out for Delivery";
    if (activeTab === "delivered") return o.status === "Delivered";
    if (activeTab === "cancelled") return o.status === "Cancelled";
    return true;
  });

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-cf-green font-bold text-xs tracking-widest uppercase mb-1 block">Staff Controls</span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-cf-charcoal/60 mt-1">
              Live e-commerce telemetry. Manage deliveries and update dispatch logs in real-time.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="self-start sm:self-center bg-white border border-cf-sky/30 text-cf-navy hover:text-cf-green font-semibold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Core telemetry Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Products */}
          <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
            <span className="text-2xl mb-2 block">🥛</span>
            <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Products</h3>
            <p className="text-3xl font-extrabold text-cf-navy mt-1">5</p>
            <span className="text-[10px] text-cf-green font-semibold mt-1 block">Active Catalog</span>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
            <span className="text-2xl mb-2 block">📦</span>
            <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Checkouts</h3>
            <p className="text-3xl font-extrabold text-cf-navy mt-1">{totalOrders}</p>
            <span className="text-[10px] text-cf-charcoal/40 mt-1 block">Lifetime orders registered</span>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
            <span className="text-2xl mb-2 block">🚚</span>
            <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Active Deliveries</h3>
            <p className="text-3xl font-extrabold text-cf-navy mt-1">{pendingOrders}</p>
            <span className="text-[10px] text-cf-green font-semibold mt-1 block animate-pulse">Needs dispatch</span>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm">
            <span className="text-2xl mb-2 block">💵</span>
            <h3 className="text-xs font-bold text-cf-charcoal/45 uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-cf-green mt-1">Rs {totalRevenue}</p>
            <span className="text-[10px] text-cf-charcoal/40 mt-1 block">Delivered earnings</span>
          </div>
        </div>

        {/* Tabs Filter Bar */}
        <div className="flex border-b border-cf-sky/20 gap-6 text-sm">
          {[
            { id: "all", label: `All Orders (${orders.length})` },
            { id: "pending", label: `Active / Pending (${pendingOrders})` },
            { id: "delivered", label: `Delivered (${orders.filter(o => o.status === "Delivered").length})` },
            { id: "cancelled", label: `Cancelled (${orders.filter(o => o.status === "Cancelled").length})` }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Orders List Table */}
        <div className="bg-white rounded-3xl border border-cf-sky/15 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <svg className="animate-spin h-8 w-8 text-cf-green mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs text-cf-charcoal/50">Fetching live orders...</p>
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
                const isThisUpdating = updatingId === order.id;

                return (
                  <div key={order.id} className="p-6 hover:bg-cf-off-white/30 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Order Core Info */}
                      <div className="space-y-3 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-xs font-mono font-bold text-cf-navy select-all leading-none bg-cf-off-white border border-cf-sky/20 px-2.5 py-1 rounded-lg">
                            ID: {order.id.substring(0, 8)}...
                          </span>
                          <span className="text-[11px] text-cf-charcoal/45">{date}</span>
                          <span className="text-xs font-bold text-cf-green">🚚 {order.delivery_slot}</span>
                        </div>
                        
                        {/* Customer & Address Details */}
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

                        {/* Items summary */}
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

                      {/* Right Panel: Price & Status Updater */}
                      <div className="flex flex-row sm:flex-col lg:items-end justify-between sm:justify-start gap-4 flex-shrink-0">
                        
                        {/* Price Tag */}
                        <div className="lg:text-right">
                          <span className="text-[9px] text-cf-charcoal/40 uppercase tracking-widest block">Order Value</span>
                          <span className="text-lg font-extrabold text-cf-navy">Rs {order.total_amount}</span>
                        </div>

                        {/* Dropdown status changer */}
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
    </main>
  );
}