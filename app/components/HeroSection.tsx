"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] bg-[#FAF6EF] overflow-hidden flex items-center pt-8 pb-16">
      
      {/* ── Signature Diagonal Pour-Shape Wedge ── */}
      <motion.div
        initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)", opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-0 bg-[#DCEEF2] pointer-events-none z-0"
      />

      {/* Subtle Oat Accent Radial */}
      <div
        className="absolute top-1/4 right-10 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, #C9A876 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Eyebrow + Serif Headline + Clay Hover CTA */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 max-w-2xl"
          >
            {/* JetBrains Mono Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12201A]/5 border border-[#1F3B2C]/15 text-[#1F3B2C]">
              <span className="w-2 h-2 rounded-full bg-[#B5652E] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold">
                OUR SIGNATURE ALMOND MILK
              </span>
            </div>

            {/* Display Serif Title (Fraunces) */}
            <h1 className="font-serif font-semibold text-[#12201A] tracking-tight leading-[1.05] text-[clamp(40px,5.4vw,74px)] max-w-xl">
              Pure dairy,&nbsp;
              <span className="italic font-light text-[#B5652E]">poured fresh</span> daily.
            </h1>

            {/* Body Description */}
            <p className="text-base sm:text-lg text-[#1F3B2C]/80 font-sans leading-relaxed max-w-lg">
              Cold-pressed organic almonds, zero preservatives, and unbroken cold-chain delivery straight from our farms to your breakfast table.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/products/almond-milk"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#12201A] text-[#FAF6EF] font-sans font-semibold text-sm transition-all duration-300 shadow-md hover:bg-[#B5652E] hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <span>Shop Almond Milk</span>
                <span className="ml-2 font-mono group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-6 py-4 rounded-full text-sm font-sans font-medium text-[#12201A] hover:text-[#B5652E] transition-colors"
              >
                <span>See how it&apos;s made</span>
                <span className="font-mono text-xs">→</span>
              </Link>
            </div>

            {/* Key Quality Chips */}
            <div className="pt-6 border-t border-[#1F3B2C]/10 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <span className="font-serif font-bold text-lg text-[#12201A] block">100%</span>
                <span className="font-mono text-[10px] uppercase text-[#1F3B2C]/70 tracking-wider">Organic Almonds</span>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#12201A] block">Sub-4°C</span>
                <span className="font-mono text-[10px] uppercase text-[#1F3B2C]/70 tracking-wider">Cold Storage</span>
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#12201A] block">Same-Day</span>
                <span className="font-mono text-[10px] uppercase text-[#1F3B2C]/70 tracking-wider">Farm Dispatch</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Almond Milk Hero Showcase + Floating Mono Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Center Graphic Frame */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl p-6 flex items-center justify-center">
              
              {/* Product Image */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/products/almond-milk/almond_doodh.png"
                  alt="Cow Fresh Signature Almond Milk"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 80vw, 450px"
                />
              </div>

              {/* Floating JetBrains Mono Product Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-6 right-2 sm:right-6 bg-[#FAF6EF]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#C9A876]/40 shadow-lg text-center pointer-events-none"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B5652E] block">
                  Unsweetened · 1L
                </span>
                <span className="font-serif text-xs font-semibold text-[#12201A]">
                  Rs 650
                </span>
              </motion.div>

              {/* Quality Seal Floating Pill */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-6 left-2 sm:left-6 bg-[#12201A] text-[#FAF6EF] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none"
              >
                <span className="text-xs">🌿</span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#EFE3C9]">
                  Farm Batch #042
                </span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}