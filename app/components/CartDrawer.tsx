"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, itemCount, removeFromCart, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-cf-off-white shadow-2xl z-50 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-cf-navy text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading">Your Cart</h2>
                <p className="text-xs text-cf-sky mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-cf-green transition-colors p-2 -mr-2"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-5xl mb-4">🥛</span>
                  <h3 className="text-lg font-bold text-cf-navy mb-1">Your cart is empty</h3>
                  <p className="text-sm text-cf-charcoal/60 mb-6">Looks like you haven&apos;t added any farm-fresh goodness yet.</p>
                  <button
                    onClick={onClose}
                    className="bg-cf-green hover:bg-cf-green/90 text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-cf-sky/20"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 bg-gradient-to-b from-cf-sky/20 to-white rounded-xl overflow-hidden flex-shrink-0 p-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-cf-navy text-sm md:text-base truncate">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-cf-charcoal/40 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-cf-sky/30 text-cf-navy font-semibold mt-1">
                          {item.variant}
                        </span>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-cf-sky/40 rounded-lg overflow-hidden bg-cf-off-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-cf-navy hover:bg-cf-sky/20 transition-colors font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-cf-navy min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            className="px-2 py-1 text-cf-navy hover:bg-cf-sky/20 transition-colors font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-cf-navy text-sm md:text-base">
                          Rs {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & CTA */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-cf-sky/30 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-cf-charcoal/70">
                    <span>Subtotal</span>
                    <span>Rs {total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cf-charcoal/70">
                    <span>Delivery</span>
                    <span className="text-cf-green font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-cf-sky/20 my-2 pt-2 flex justify-between text-lg font-bold text-cf-navy">
                    <span>Total</span>
                    <span>Rs {total}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center bg-cf-green hover:bg-cf-green/90 text-white font-bold py-4 rounded-xl shadow-md transition-all text-base hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block w-full text-center text-cf-navy hover:text-cf-green font-semibold py-2 text-sm transition-colors"
                >
                  View Full Shopping Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
