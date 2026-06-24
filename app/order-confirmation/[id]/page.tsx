"use client";

import { useEffect, useState } from "react";
import { getOrders, Order } from "@/app/lib/db";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const orders = await getOrders();
        const found = orders.find((o) => o.id === orderId);
        if (found) {
          setOrder(found);
        }
      } catch (error) {
        console.error("Error fetching order confirmation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-20 text-center bg-cf-off-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-cf-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-cf-navy font-bold text-sm">Generating your fresh invoice...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container mx-auto px-4 py-20 text-center bg-cf-off-white">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-cf-sky/15 shadow-sm">
          <span className="text-5xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-cf-navy mb-2">Order Not Found</h2>
          <p className="text-cf-charcoal/60 text-sm mb-6">
            We couldn&apos;t find an order with the ID: <br />
            <strong className="text-cf-navy text-xs select-all break-all">{orderId}</strong>
          </p>
          <Link
            href="/products"
            className="bg-cf-green hover:bg-cf-green/90 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all inline-block"
          >
            Go to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-cf-sky/15 shadow-sm text-center mb-8"
        >
          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-cf-green/10 text-cf-green rounded-full flex items-center justify-center text-3xl mx-auto border-2 border-cf-green/25 shadow-inner mb-6"
          >
            ✓
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading text-cf-navy tracking-tight mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-cf-charcoal/60 text-sm max-w-md mx-auto mb-4">
            Thank you for shopping with Cow Fresh. Your order has been registered and is being processed by our farm dispatch team.
          </p>
          
          <div className="inline-block bg-cf-off-white px-4 py-2 rounded-2xl border border-cf-sky/20 text-xs text-cf-charcoal/70 font-mono">
            Order ID: <span className="font-bold text-cf-navy select-all">{order.id}</span>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Left: Delivery Details */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm space-y-4"
          >
            <h3 className="text-lg font-bold font-heading text-cf-navy border-b border-cf-sky/10 pb-3">
              Delivery Information
            </h3>
            <div className="space-y-3.5 text-xs text-cf-charcoal/75">
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Recipient Name</span>
                <span className="font-bold text-cf-navy text-sm mt-0.5 block">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Contact Mobile</span>
                <span className="font-bold text-cf-navy text-sm mt-0.5 block">{order.customer_phone}</span>
              </div>
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Shipping Address</span>
                <span className="font-semibold text-cf-navy mt-0.5 block">
                  {order.delivery_address}, {order.delivery_city}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Delivery Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm space-y-4"
          >
            <h3 className="text-lg font-bold font-heading text-cf-navy border-b border-cf-sky/10 pb-3">
              Delivery Schedule & Payment
            </h3>
            <div className="space-y-4 text-xs text-cf-charcoal/75">
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Perishable-Safe Time Slot</span>
                <span className="font-bold text-cf-green text-sm mt-0.5 block flex items-center gap-1.5">
                  <span>🚚</span> {order.delivery_slot}
                </span>
              </div>
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Payment Method</span>
                <span className="font-bold text-cf-navy text-sm mt-0.5 block flex items-center gap-1.5">
                  <span>💵</span> {order.payment_method === "COD" ? "Cash on Delivery" : "Credit Card / Stripe"}
                </span>
              </div>
              <div>
                <span className="text-cf-charcoal/40 uppercase tracking-wider block text-[9px]">Milking Logistics</span>
                <span className="text-[11px] text-cf-charcoal/60 leading-relaxed block mt-0.5">
                  Your milk will be pasteurized and cold-packaged right before this slot, then delivered directly.
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Invoice Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm space-y-5"
        >
          <h3 className="text-lg font-bold font-heading text-cf-navy border-b border-cf-sky/10 pb-3">
            Invoice Summary
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={item.id || index} className="flex justify-between items-center text-xs text-cf-charcoal/80">
                <div className="min-w-0">
                  <span className="font-bold text-cf-navy truncate block">{item.product_name}</span>
                  <span className="text-[10px] text-cf-charcoal/50 mt-0.5 block">
                    {item.variant_label} &bull; Rs {item.price} each
                  </span>
                </div>
                <span className="text-cf-charcoal/65">
                  Qty: {item.quantity}
                </span>
                <span className="font-bold text-cf-navy text-right">
                  Rs {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-cf-sky/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-cf-charcoal/65">
              <span>Items Subtotal</span>
              <span className="font-bold text-cf-navy">Rs {order.total_amount}</span>
            </div>
            <div className="flex justify-between text-cf-charcoal/65">
              <span>Fresh Cold-Chain Delivery</span>
              <span className="text-cf-green font-bold uppercase">Free</span>
            </div>
            <div className="border-t border-cf-sky/10 pt-4 flex justify-between text-base font-extrabold text-cf-navy">
              <span>Amount Paid / Due</span>
              <span>Rs {order.total_amount}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
        >
          <Link
            href="/account"
            className="w-full sm:w-auto bg-cf-navy hover:bg-cf-navy/90 text-white font-bold py-3.5 px-8 rounded-full shadow-sm text-sm text-center"
          >
            Track Order History
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3.5 px-8 rounded-full shadow-sm text-sm text-center"
          >
            Continue Sourcing Dairy
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
