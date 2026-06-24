"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-cf-charcoal/60 text-sm mt-1">
              {itemCount > 0 
                ? `You have ${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart.` 
                : "Your cart is currently empty."}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 hover:underline bg-white px-4 py-2 rounded-xl border border-red-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Entire Cart
            </button>
          )}
        </div>

        {/* Cart Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl shadow-sm border border-cf-sky/15 p-12 text-center"
                >
                  <span className="text-6xl mb-6 block">🥛</span>
                  <h2 className="text-2xl font-bold font-heading text-cf-navy mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-cf-charcoal/60 text-sm max-w-md mx-auto mb-8">
                    Add our fresh, premium dairy products to your cart and enjoy free, temperature-controlled delivery.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all text-sm hover:scale-[1.02]"
                  >
                    Browse Our Products
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl p-5 border border-cf-sky/15 shadow-sm flex flex-col sm:flex-row items-center gap-5 group relative"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 bg-gradient-to-b from-cf-sky/15 to-white rounded-2xl p-2 flex-shrink-0 flex items-center justify-center border border-cf-sky/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="96px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-cf-navy truncate">
                        {item.name}
                      </h3>
                      <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-cf-sky/30 text-cf-navy mt-1">
                        {item.variant}
                      </span>
                      <p className="text-xs text-cf-charcoal/45 mt-1.5">
                        Unit Price: Rs {item.price}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                      {/* Quantity increments */}
                      <div className="flex items-center border border-cf-sky/40 rounded-xl overflow-hidden bg-cf-off-white shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 text-cf-navy hover:bg-cf-sky/20 transition-all font-extrabold text-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-bold text-cf-navy min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                          className="px-3 py-2 text-cf-navy hover:bg-cf-sky/20 transition-all font-extrabold text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal Price */}
                      <div className="text-center sm:text-right min-w-[90px]">
                        <span className="font-extrabold text-base md:text-lg text-cf-navy">
                          Rs {item.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="p-2.5 text-cf-charcoal/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        aria-label="Remove item from cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Right: Summary Box */}
          {items.length > 0 && (
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm space-y-6">
                <h3 className="text-xl font-bold font-heading text-cf-navy border-b border-cf-sky/10 pb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3.5">
                  <div className="flex justify-between text-sm text-cf-charcoal/70">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-cf-navy">Rs {total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cf-charcoal/70">
                    <span>Delivery Charges</span>
                    <span className="text-cf-green font-bold uppercase tracking-wider">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-cf-charcoal/70">
                    <span>Tax (GST)</span>
                    <span className="font-medium text-cf-navy">Rs 0</span>
                  </div>
                  
                  <div className="border-t border-cf-sky/10 pt-4 mt-2 flex justify-between text-lg font-extrabold text-cf-navy">
                    <span>Estimated Total</span>
                    <span>Rs {total}</span>
                  </div>
                </div>

                <div className="bg-cf-sky/15 p-4 rounded-2xl border border-cf-sky/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-cf-navy uppercase tracking-wider">
                    <span>🚚</span> Cold-Chain Delivery Guarantee
                  </div>
                  <p className="text-[11px] text-cf-charcoal/60 leading-relaxed">
                    Our drivers use insulated coolers to ensure that your dairy products are kept under 4°C right up to your doorstep.
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center bg-cf-green hover:bg-cf-green/90 text-white font-bold py-4 rounded-2xl shadow-md transition-all text-base hover:scale-[1.01] hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-cf-navy hover:text-cf-green transition-colors hover:underline"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}