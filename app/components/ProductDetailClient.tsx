"use client";

import { useState, useEffect } from "react";
import { Product, ProductVariant, getProducts } from "@/app/lib/db";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  
  // Find default variant or first variant
  const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];
  
  // Client state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Monitor scroll for mobile sticky bottom CTA bar
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when the user scrolls past the main buy button (approx 500px)
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Add item to global cart state
    addToCart({
      id: product.id,
      name: product.name,
      image: product.images[0]?.image_url || "/images/placeholder.png",
      price: selectedVariant.price,
      variant: selectedVariant.label
    }, quantity);

    // Provide visual success feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const activeImage = product.images[0]?.image_url || "/images/placeholder.png";

  return (
    <div className="space-y-16 pb-20">
      {/* Main product detail section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Left: Product Image Gallery */}
        <div className="relative aspect-square bg-gradient-to-b from-cf-sky/20 to-white rounded-3xl p-6 md:p-12 border border-cf-sky/15 flex items-center justify-center shadow-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain p-4 drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Breadcrumb / Category */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-cf-sky/30 text-cf-navy uppercase tracking-wider">
              {product.category.replace("_", " ")}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight">
              {product.name}
            </h1>
            <p className="text-cf-green font-bold text-base md:text-lg">
              {product.short_tagline}
            </p>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-cf-sky/15 flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-extrabold text-cf-navy">
              Rs {selectedVariant.price}
            </span>
            {selectedVariant.compare_at_price && (
              <span className="text-cf-charcoal/40 line-through text-lg md:text-xl">
                Rs {selectedVariant.compare_at_price}
              </span>
            )}
            <span className="text-xs text-cf-charcoal/40 ml-2">
              SKU: {selectedVariant.sku}
            </span>
          </div>

          {/* Variant Selector */}
          <div className="space-y-3">
            <h3 className="font-bold text-cf-navy text-sm uppercase tracking-wider">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant)}
                    className={`px-5 py-3 rounded-2xl border-2 transition-all text-sm font-semibold hover:scale-[1.02] active:scale-95 flex items-center justify-between min-w-[110px] ${
                      isSelected
                        ? "border-cf-green bg-cf-green/5 text-cf-green"
                        : "border-cf-sky/30 bg-white text-cf-navy hover:border-cf-green"
                    }`}
                  >
                    <span>{variant.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector and Cart Action */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-cf-navy text-sm uppercase tracking-wider">Quantity</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Counter */}
              <div className="flex items-center border-2 border-cf-sky/30 rounded-2xl overflow-hidden bg-white max-w-[150px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-cf-navy hover:bg-cf-sky/15 transition-colors font-extrabold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-cf-navy min-w-[40px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-cf-navy hover:bg-cf-sky/15 transition-colors font-extrabold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add To Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 font-bold py-4 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2 relative overflow-hidden ${
                  isAdding 
                    ? "bg-cf-navy text-white" 
                    : "bg-cf-green hover:bg-cf-green/90 text-white hover:scale-[1.01]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-5 h-5 text-cf-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Add to Cart &bull; Rs {selectedVariant.price * quantity}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-cf-sky/15">
            <h3 className="font-bold text-cf-navy text-sm uppercase tracking-wider">Description</h3>
            <p className="text-cf-charcoal/70 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Product Sourcing / Nutrition Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        {/* Sourcing Info Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-cf-sky/15 shadow-sm space-y-4">
          <h3 className="text-xl font-bold font-heading text-cf-navy">Why Choose This Product?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h4 className="font-bold text-sm text-cf-navy">100% Organic Origins</h4>
                <p className="text-xs text-cf-charcoal/60 mt-0.5">Sourced from pasture-raised cows fed purely on organic forage, ensuring rich nutritional density.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <h4 className="font-bold text-sm text-cf-navy">Tested for Purity</h4>
                <p className="text-xs text-cf-charcoal/60 mt-0.5">Undergoes stringent lab screening at farm gates for hormones, heavy metals, and adulterants.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">❄️</span>
              <div>
                <h4 className="font-bold text-sm text-cf-navy">Unbroken Cold Chain</h4>
                <p className="text-xs text-cf-charcoal/60 mt-0.5">Maintained at optimal refrigeration levels from farm gate to dispatch to lock in nutrient counts.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">♻️</span>
              <div>
                <h4 className="font-bold text-sm text-cf-navy">Eco-friendly Packaging</h4>
                <p className="text-xs text-cf-charcoal/60 mt-0.5">Sealed in clean, recyclable materials that preserve taste and integrity without plastic toxins.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Info Card */}
        <div className="bg-cf-navy text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-white mb-4">Nutritional Value</h3>
            <p className="text-xs text-cf-sky/80 mb-6">Per serving representation. Natural dairy value counts may vary slightly.</p>
            
            <div className="space-y-3">
              {Object.entries(product.nutrition_info).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                  <span className="capitalize text-cf-sky/90 font-medium">{key}</span>
                  <span className="font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 text-[10px] text-cf-sky/50 text-center">
            *Percentage Daily Values are based on a 2,000 calorie diet.
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-cf-sky/15">
          <h3 className="text-2xl font-bold font-heading text-cf-navy tracking-tight">
            You May Also Freshly Enjoy
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((rp) => {
              const rpImage = rp.images[0]?.image_url || "/images/placeholder.png";
              const rpDefaultVar = rp.variants.find((v) => v.is_default) || rp.variants[0];
              const rpPrice = rpDefaultVar ? rpDefaultVar.price : 0;
              return (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden border border-cf-sky/15 p-3 flex flex-col h-full shadow-sm hover:shadow-md transition-all">
                    <div className="relative aspect-square bg-gradient-to-b from-cf-sky/10 to-white rounded-xl flex items-center justify-center p-2">
                      <Image
                        src={rpImage}
                        alt={rp.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 30vw, 15vw"
                      />
                    </div>
                    <div className="mt-3 flex-1 flex flex-col">
                      <h4 className="font-bold text-sm text-cf-navy line-clamp-1 group-hover:text-cf-green transition-colors">
                        {rp.name}
                      </h4>
                      <p className="text-cf-green font-extrabold text-xs mt-1">
                        Rs {rpPrice}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom CTA Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-cf-sky/30 px-4 py-3.5 flex items-center justify-between z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] rounded-t-3xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 bg-gradient-to-b from-cf-sky/15 to-white rounded-xl p-1 flex-shrink-0">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-cf-navy truncate leading-tight">{product.name}</h4>
                <p className="text-[10px] text-cf-charcoal/60 mt-0.5">
                  Rs {selectedVariant.price} &bull; {selectedVariant.label}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`font-bold py-2.5 px-6 rounded-full text-xs transition-all flex items-center justify-center gap-1 shadow-sm ${
                isAdding
                  ? "bg-cf-navy text-white"
                  : "bg-cf-green hover:bg-cf-green/90 text-white active:scale-95"
              }`}
            >
              {isAdding ? "Added!" : "Quick Add"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
