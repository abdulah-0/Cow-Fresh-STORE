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
    { id: "all", label: "All Selection" },
    { id: "milk", label: "Milk Range" },
    { id: "lassi", label: "Lassi" },
    { id: "yogurt", label: "Dahi / Yogurt" },
    { id: "ghee", label: "Desi Ghee" },
  ];

  // Filtering logic
  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "milk" && (product.category === "milk_bottle" || product.category === "milk_packet" || product.category === "milk")) ||
      (activeCategory === "lassi" && product.category === "lassi") ||
      (activeCategory === "yogurt" && product.category === "yogurt") ||
      (activeCategory === "ghee" && product.category === "ghee");

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

  const getProductMetaTag = (product: Product) => {
    if (product.slug.includes("almond")) return "Unsweetened · 1L";
    if (product.slug.includes("ghee")) return "Slow-Clarified · 1kg";
    if (product.slug.includes("lassi")) return "Cardamom · 500ml";
    if (product.slug.includes("milk")) return "Pasture-Raised · 1L";
    if (product.slug.includes("yogurt")) return "Set Dahi · 500g";
    return "Farm Pure";
  };

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Controls (PRD 2.0 Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FAF6EF] p-6 rounded-3xl border border-[#C9A876]/30 shadow-sm">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 order-2 md:order-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#12201A] text-[#FAF6EF] shadow-md"
                    : "bg-[#EFE3C9]/60 text-[#1F3B2C] hover:bg-[#C9A876]/30"
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
            placeholder="Search fresh products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C9A876]/40 rounded-full text-xs font-sans text-[#12201A] placeholder-[#1F3B2C]/40 focus:outline-none focus:ring-2 focus:ring-[#B5652E] transition-all"
          />
          <svg
            className="absolute left-3.5 top-3 w-4 h-4 text-[#1F3B2C]/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dynamic Products Grid (PRD 2.0 Card Specifications) */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="col-span-full text-center py-20 bg-[#FAF6EF] rounded-3xl border border-[#C9A876]/30 shadow-sm"
            >
              <span className="text-5xl mb-4 block">🥛</span>
              <h3 className="text-xl font-serif font-bold text-[#12201A] mb-1">No fresh items found</h3>
              <p className="text-xs font-sans text-[#1F3B2C]/60">Try adjusting your active category filter or search keywords.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product) => {
              const image = product.images[0]?.image_url || "/images/placeholder.png";
              const startingPrice = getProductStartingPrice(product);
              const metaTag = getProductMetaTag(product);
              const isFlagship = product.is_hero_product;
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                    <div className="bg-[#FAF6EF] rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 flex-1 flex flex-col border border-[#C9A876]/30 shadow-sm">
                      
                      {/* Image Thumbnail Container (Soft Sky Background per PRD 2.0) */}
                      <div className="relative aspect-square bg-[#DCEEF2]/60 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                        />
                        {isFlagship && (
                          <span className="absolute top-3 left-3 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm text-[#FAF6EF] bg-[#B5652E]">
                            Flagship
                          </span>
                        )}
                      </div>

                      {/* Info Container (Serif Title + Mono Meta Tag + Circular Hover Button) */}
                      <div className="p-4 md:p-5 flex flex-col flex-grow justify-between space-y-3">
                        <div>
                          {/* JetBrains Mono Meta Line */}
                          <span className="font-mono text-[9px] text-[#B5652E] font-bold uppercase tracking-wider block mb-1">
                            {metaTag}
                          </span>
                          
                          {/* Fraunces Serif Product Name */}
                          <h3 className="font-serif font-semibold text-base text-[#12201A] line-clamp-1 group-hover:text-[#B5652E] transition-colors">
                            {product.name}
                          </h3>
                          
                          <p className="font-sans text-[#1F3B2C]/70 text-xs line-clamp-2 leading-relaxed mt-1">
                            {product.short_tagline}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#C9A876]/20 flex items-center justify-between mt-auto">
                          <div>
                            <span className="font-mono text-[8px] text-[#1F3B2C]/50 block uppercase tracking-wider">Starting at</span>
                            <span className="font-serif font-bold text-base text-[#12201A]">Rs {startingPrice}</span>
                          </div>
                          
                          {/* Circular Add Button with Dark Inversion Hover */}
                          <span className="w-8 h-8 rounded-full border border-[#12201A] text-[#12201A] font-mono font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-[#12201A] group-hover:text-[#FAF6EF] group-hover:scale-105 shadow-sm">
                            +
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
