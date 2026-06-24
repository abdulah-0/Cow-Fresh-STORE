"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { createOrder } from "@/app/lib/db";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  // Steps: 1 = Shipping, 2 = Delivery Slot, 3 = Payment, 4 = Review
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Lahore" // default city
  });

  const [deliverySlot, setDeliverySlot] = useState<string>("Morning (9:00 AM - 12:00 PM)");
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available slots (critical for fresh dairy)
  const deliverySlots = [
    { id: "slot1", label: "Early Morning (6:00 AM - 9:00 AM)", description: "Best for breakfast milk" },
    { id: "slot2", label: "Morning (9:00 AM - 12:00 PM)", description: "Standard morning delivery" },
    { id: "slot3", label: "Afternoon (2:00 PM - 5:00 PM)", description: "Mid-day cold dispatch" },
    { id: "slot4", label: "Evening (6:00 PM - 9:00 PM)", description: "Convenient evening slots" }
  ];

  // Cities we deliver to
  const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi"];

  // Validations
  const validateStep1 = () => {
    const tempErrors: Record<string, string> = {};
    if (!shippingData.name.trim()) tempErrors.name = "Full name is required.";
    if (!shippingData.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^((\+92)|(0092))?\s?3\d{2}\s?\d{7}$|^0\d{9,10}$/.test(shippingData.phone.replace(/[\s-]/g, ""))) {
      // Basic Pakistan mobile validation or generic phone check
      tempErrors.phone = "Invalid mobile number. Use format: 03001234567";
    }
    if (!shippingData.address.trim()) tempErrors.address = "Detailed delivery address is required.";
    if (!shippingData.city) tempErrors.city = "City is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Map cart items to order items schema
      const orderItems = items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        variant_label: item.variant,
        price: item.price,
        quantity: item.quantity
      }));

      // Call database layer (Supabase or local storage fallback)
      const order = await createOrder({
        customer_name: shippingData.name,
        customer_phone: shippingData.phone,
        delivery_address: shippingData.address,
        delivery_city: shippingData.city,
        delivery_slot: deliverySlot,
        payment_method: paymentMethod,
        total_amount: total,
        items: orderItems
      });

      // Clear cart
      clearCart();
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and not submitting, show warning
  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="container mx-auto px-4 py-16 text-center bg-cf-off-white">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-cf-sky/15 shadow-sm">
          <span className="text-5xl mb-4 block">🛒</span>
          <h2 className="text-xl font-bold text-cf-navy mb-2">Checkout is empty</h2>
          <p className="text-cf-charcoal/60 text-sm mb-6">
            You don&apos;t have any items in your cart to checkout.
          </p>
          <Link
            href="/products"
            className="bg-cf-green hover:bg-cf-green/90 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 bg-cf-off-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight mb-8">
          Secure Checkout
        </h1>

        {/* Checkout Steps Progress Bar */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Line connector */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-cf-sky/30 -translate-y-1/2 z-0" />
            <div
              className="absolute left-0 top-1/2 h-0.5 bg-cf-green -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Slot" },
              { num: 3, label: "Payment" },
              { num: 4, label: "Review" }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? "bg-cf-green text-white shadow-md scale-110"
                      : "bg-white border-2 border-cf-sky/40 text-cf-navy/50"
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-[10px] md:text-xs font-semibold mt-2 ${
                    step >= s.num ? "text-cf-navy font-bold" : "text-cf-charcoal/40"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Form (2 Cols) vs Order Summary (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Form: Progressive Steps */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: SHIPPING DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-cf-navy mb-2">
                    Step 1: Delivery Information
                  </h2>
                  <p className="text-xs text-cf-charcoal/55">Where should we deliver your farm-fresh products?</p>
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                        errors.name ? "border-red-500" : "border-cf-sky/30"
                      }`}
                      placeholder="e.g. Abdullah Khan"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                        errors.phone ? "border-red-500" : "border-cf-sky/30"
                      }`}
                      placeholder="e.g. 03001234567"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Address (2 cols) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                        Detailed Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-cf-off-white border rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all ${
                          errors.address ? "border-red-500" : "border-cf-sky/30"
                        }`}
                        placeholder="e.g. House 12, Street 3, Block H"
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>

                    {/* City (1 col) */}
                    <div>
                      <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
                        City
                      </label>
                      <select
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-cf-off-white border border-cf-sky/30 rounded-xl text-sm text-cf-navy focus:outline-none focus:ring-2 focus:ring-cf-green transition-all"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DELIVERY SLOT */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-cf-navy mb-2">
                    Step 2: Choose Delivery Time Slot
                  </h2>
                  <p className="text-xs text-cf-charcoal/55">
                    Dairy is highly perishable. Select a convenient time slot when someone is available to receive it.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {deliverySlots.map((slot) => {
                      const isSelected = deliverySlot === slot.label;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setDeliverySlot(slot.label)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between h-32 ${
                            isSelected
                              ? "border-cf-green bg-cf-green/5 text-cf-navy"
                              : "border-cf-sky/30 bg-white text-cf-navy hover:border-cf-green"
                          }`}
                        >
                          <span className="font-bold text-sm sm:text-base">{slot.label}</span>
                          <span className="text-xs text-cf-charcoal/50 mt-1">{slot.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-bold font-heading text-cf-navy mb-2">
                    Step 3: Select Payment Method
                  </h2>
                  <p className="text-xs text-cf-charcoal/55">Choose how you would like to pay for your order.</p>

                  <div className="space-y-4 pt-2">
                    {/* Cash on Delivery (COD) */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        paymentMethod === "COD"
                          ? "border-cf-green bg-cf-green/5 text-cf-navy"
                          : "border-cf-sky/30 bg-white text-cf-navy hover:border-cf-green"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">💵</span>
                        <div>
                          <h4 className="font-bold text-base">Cash on Delivery (Recommended)</h4>
                          <p className="text-xs text-cf-charcoal/50 mt-0.5">Pay with cash when your driver delivers.</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "COD" ? "border-cf-green bg-cf-green" : "border-cf-sky/40"
                      }`}>
                        {paymentMethod === "COD" && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>

                    {/* Credit Card / Stripe Placeholder */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CARD")}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between opacity-60 hover:opacity-80 ${
                        paymentMethod === "CARD"
                          ? "border-cf-green bg-cf-green/5 text-cf-navy"
                          : "border-cf-sky/30 bg-white text-cf-navy hover:border-cf-green"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">💳</span>
                        <div>
                          <h4 className="font-bold text-base">Credit / Debit Card (Stripe Integration)</h4>
                          <p className="text-xs text-cf-charcoal/50 mt-0.5">Pay online securely. (Card gateway coming in v2).</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "CARD" ? "border-cf-green bg-cf-green" : "border-cf-sky/40"
                      }`}>
                        {paymentMethod === "CARD" && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ORDER REVIEW & CONFIRM */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold font-heading text-cf-navy mb-1">
                    Step 4: Final Order Review
                  </h2>
                  <p className="text-xs text-cf-charcoal/55">Please review your delivery and payment details before finalizing.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Delivery summary */}
                    <div className="bg-cf-off-white p-5 rounded-2xl border border-cf-sky/25 space-y-3">
                      <h4 className="font-bold text-sm text-cf-navy flex justify-between">
                        <span>Delivery Address</span>
                        <button onClick={() => setStep(1)} className="text-xs text-cf-green hover:underline font-bold">Edit</button>
                      </h4>
                      <div className="text-xs space-y-1 text-cf-charcoal/75">
                        <p className="font-bold text-cf-navy">{shippingData.name}</p>
                        <p>{shippingData.phone}</p>
                        <p>{shippingData.address}</p>
                        <p>{shippingData.city}</p>
                      </div>
                    </div>

                    {/* Preferences summary */}
                    <div className="bg-cf-off-white p-5 rounded-2xl border border-cf-sky/25 space-y-3">
                      <h4 className="font-bold text-sm text-cf-navy">Preferences & Payment</h4>
                      <div className="text-xs space-y-2.5 text-cf-charcoal/75">
                        <div>
                          <p className="text-[10px] text-cf-charcoal/40 uppercase tracking-wider">Delivery Time Slot</p>
                          <p className="font-bold text-cf-navy mt-0.5">{deliverySlot}</p>
                          <button onClick={() => setStep(2)} className="text-[10px] text-cf-green hover:underline font-bold mt-0.5 block">Change Slot</button>
                        </div>
                        <div>
                          <p className="text-[10px] text-cf-charcoal/40 uppercase tracking-wider">Payment Method</p>
                          <p className="font-bold text-cf-navy mt-0.5">
                            {paymentMethod === "COD" ? "Cash on Delivery" : "Credit Card / Stripe"}
                          </p>
                          <button onClick={() => setStep(3)} className="text-[10px] text-cf-green hover:underline font-bold mt-0.5 block">Change Method</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cf-sky/10 border border-cf-sky/30 p-4 rounded-xl flex items-start gap-2.5">
                    <span className="text-lg">ℹ️</span>
                    <p className="text-[11px] text-cf-navy/80 leading-relaxed">
                      By clicking &ldquo;Place Order&rdquo; you agree to be present at the address during your selected delivery slot. All fresh products are dispatched under strict refrigeration.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-cf-sky/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 border-2 border-cf-sky/40 text-cf-navy font-bold rounded-xl text-sm transition-all hover:bg-cf-sky/10"
                >
                  Back
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="px-6 py-3 border-2 border-cf-sky/40 text-cf-navy font-bold rounded-xl text-sm transition-all hover:bg-cf-sky/10 text-center"
                >
                  Return to Cart
                </Link>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order &bull; Rs ${total}`
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Right Summary: Cart list (1 Col) */}
          <div className="bg-white rounded-3xl p-6 border border-cf-sky/15 shadow-sm space-y-5">
            <h3 className="text-lg font-bold font-heading text-cf-navy border-b border-cf-sky/10 pb-3">
              Your Items ({items.length})
            </h3>
            
            {/* Scrollable Items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative w-8 h-8 bg-cf-sky/15 rounded-lg p-0.5 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain" sizes="32px" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-cf-navy truncate leading-tight">{item.name}</p>
                      <p className="text-[9px] text-cf-charcoal/50 mt-0.5">
                        {item.variant} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-cf-navy flex-shrink-0">
                    Rs {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-cf-sky/10 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-cf-charcoal/70">
                <span>Subtotal</span>
                <span className="font-bold text-cf-navy">Rs {total}</span>
              </div>
              <div className="flex justify-between text-cf-charcoal/70">
                <span>Delivery Charge</span>
                <span className="text-cf-green font-bold uppercase">Free</span>
              </div>
              
              <div className="border-t border-cf-sky/10 pt-3 flex justify-between text-sm font-extrabold text-cf-navy">
                <span>Total Amount</span>
                <span>Rs {total}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}