"use client";

import { useState } from "react";
import { Product } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProductsCatalogProps {
  initialProducts: Product[];
}

export function ProductsCatalog({ initialProducts }: ProductsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "milk", label: "Milk" }, // matches milk_bottle & milk_packet
    { id: "lassi", label: "Lassi" },
    { id: "yogurt", label: "Yogurt" },
    { id: "ghee", label: "Desi Ghee" },
  ];

  // Filtering logic
  const filteredProducts = initialProducts.filter((product) => {
    // Category filter
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "milk" && (product.category === "milk_bottle" || product.category === "milk_packet")) ||
      (activeCategory === "lassi" && product.category === "lassi") ||
      (activeCategory === "yogurt" && product.category === "yogurt") ||
      (activeCategory === "ghee" && product.category === "ghee");

    // Search query filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getProductStartingPrice = (product: Product) => {
    const defaultVar = product.variants.find((v) => v.is_default) || product.variants[0];
    return defaultVar ? defaultVar.price : 0;
  };

  const getProductBadge = (product: Product) => {
    if (product.is_hero_product) return "Flagship";
    if (product.category === "ghee") return "Premium";
    if (product.category === "milk_bottle") return "Natural";
    return null;
  };

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-cf-sky/15">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 order-2 md:order-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
                  isActive
                    ? "bg-cf-green text-white shadow-sm"
                    : "bg-cf-off-white text-cf-navy hover:bg-cf-sky/20"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative order-1 md:order-2 w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cf-off-white border border-cf-sky/40 rounded-full text-sm text-cf-navy placeholder-cf-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cf-green focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3.5 top-3 w-4.5 h-4.5 text-cf-charcoal/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dynamic Products Grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-cf-sky/15"
            >
              <span className="text-5xl mb-4 block">🥛</span>
              <h3 className="text-xl font-bold text-cf-navy mb-1">No products found</h3>
              <p className="text-sm text-cf-charcoal/60">Try adjusting your filters or search query.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product) => {
              const image = product.images[0]?.image_url || "/images/placeholder.png";
              const startingPrice = getProductStartingPrice(product);
              const badge = getProductBadge(product);
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                    <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex-1 flex flex-col border border-cf-sky/15 shadow-sm">
                      
                      {/* Image container */}
                      <div className="relative aspect-square bg-gradient-to-b from-cf-sky/15 to-white p-4 md:p-6 flex items-center justify-center overflow-hidden">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                        />
                        {badge && (
                          <span className={`absolute top-3 left-3 text-[9px] md:text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm text-white ${
                            badge === "Flagship" 
                              ? "bg-cf-green" 
                              : badge === "Premium" 
                                ? "bg-cf-navy" 
                                : "bg-cf-sky text-cf-navy"
                          }`}>
                            {badge}
                          </span>
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="p-4 md:p-5 flex flex-col flex-grow">
                        <span className="text-[9px] md:text-[10px] text-cf-charcoal/40 font-bold uppercase tracking-wider mb-1 block">
                          {product.category.replace("_", " ")}
                        </span>
                        
                        <h3 className="font-bold text-sm md:text-base text-cf-navy mb-1 line-clamp-1 group-hover:text-cf-green transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-cf-charcoal/60 text-xs line-clamp-2 leading-normal mb-4 flex-grow">
                          {product.short_tagline}
                        </p>

                        <div className="pt-3 border-t border-cf-sky/10 flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-[8px] md:text-[9px] text-cf-charcoal/40 block uppercase tracking-wider">Starting at</span>
                            <span className="text-cf-green font-extrabold text-sm md:text-base">Rs {startingPrice}</span>
                          </div>
                          <span className="w-8 h-8 rounded-full bg-cf-navy text-white flex items-center justify-center group-hover:bg-cf-green transition-all shadow-sm group-hover:scale-105">
                            →
                          </span>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
