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
            className="fixed inset-0 bg-black/60 z-50 cursor-pointer"
          />

          {/* Drawer Panel (Solid Ivory #FAF6EF Background, 100% Opaque) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-[#FAF6EF] shadow-2xl z-50 flex flex-col h-full overflow-hidden border-l border-[#C9A876]/30"
          >
            {/* Header */}
            <div className="p-6 bg-[#12201A] text-[#FAF6EF] flex items-center justify-between border-b border-[#C9A876]/20">
              <div>
                <h2 className="text-xl font-serif font-bold">Your Cart</h2>
                <p className="text-xs font-mono text-[#DCEEF2]/80 mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
              </div>
              <button
                onClick={onClose}
                className="text-[#FAF6EF] hover:text-[#B5652E] transition-colors p-2 -mr-2"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            {items.length > 0 && (() => {
              const freeDeliveryThreshold = 1500;
              const remaining = Math.max(0, freeDeliveryThreshold - total);
              const progressPercentage = Math.min(100, (total / freeDeliveryThreshold) * 100);

              return (
                <div className="bg-white px-6 py-3.5 border-b border-[#C9A876]/20">
                  <div className="flex justify-between items-center text-xs font-sans font-semibold mb-1.5">
                    {remaining > 0 ? (
                      <span className="text-[#12201A]">
                        Add <span className="text-[#B5652E] font-bold">Rs {remaining}</span> more for <span className="text-[#B5652E] font-bold">FREE</span> delivery!
                      </span>
                    ) : (
                      <span className="text-[#B5652E] font-bold flex items-center gap-1">
                        🎉 You&apos;ve unlocked FREE delivery!
                      </span>
                    )}
                    <span className="text-[#1F3B2C]/50 font-mono text-[10px]">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#DCEEF2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B5652E] transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF6EF]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-5xl mb-4">🥛</span>
                  <h3 className="text-lg font-serif font-bold text-[#12201A] mb-1">Your cart is empty</h3>
                  <p className="text-xs font-sans text-[#1F3B2C]/70 mb-6">Looks like you haven&apos;t added any farm-fresh goodness yet.</p>
                  <button
                    onClick={onClose}
                    className="bg-[#12201A] hover:bg-[#B5652E] text-[#FAF6EF] font-sans font-semibold py-3 px-8 rounded-full text-xs transition-all duration-300 shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#C9A876]/30"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 bg-[#DCEEF2]/60 rounded-xl overflow-hidden flex-shrink-0 p-2 border border-[#C9A876]/20">
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
                          <h4 className="font-serif font-semibold text-[#12201A] text-sm md:text-base truncate">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-[#1F3B2C]/40 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#DCEEF2]/80 text-[#12201A] font-mono font-semibold mt-1">
                          {item.variant}
                        </span>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#C9A876]/30 rounded-lg overflow-hidden bg-[#FAF6EF]">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-[#12201A] hover:bg-[#DCEEF2]/60 transition-colors font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#12201A] min-w-[20px] text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            className="px-2 py-1 text-[#12201A] hover:bg-[#DCEEF2]/60 transition-colors font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-serif font-bold text-[#12201A] text-sm md:text-base">
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
              <div className="p-6 bg-white border-t border-[#C9A876]/30 space-y-4">
                <div className="space-y-1.5 font-sans">
                  <div className="flex justify-between text-xs text-[#1F3B2C]/70">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#12201A]">Rs {total}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1F3B2C]/70">
                    <span>Delivery</span>
                    <span className="text-[#B5652E] font-bold uppercase tracking-wider">FREE</span>
                  </div>
                  <div className="border-t border-[#C9A876]/20 my-2 pt-2 flex justify-between text-base font-serif font-bold text-[#12201A]">
                    <span>Total</span>
                    <span>Rs {total}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center bg-[#12201A] hover:bg-[#B5652E] text-[#FAF6EF] font-sans font-semibold py-4 rounded-xl shadow-md transition-all duration-300 text-sm hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block w-full text-center bg-[#FAF6EF] border border-[#12201A] text-[#12201A] hover:bg-[#12201A] hover:text-[#FAF6EF] font-sans font-semibold py-3 rounded-xl transition-all duration-300 text-xs"
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
