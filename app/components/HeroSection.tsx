"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const heroProducts = [
  { id: "1", name: "Almond Milk", image: "/images/products/almond-milk/almond_doodh.png", is_hero: true },
  { id: "2", name: "Desi Ghee", image: "/images/products/ghee/desi_ghee.png", is_hero: false },
  { id: "3", name: "Lassi", image: "/images/products/lassi/lassi.png", is_hero: false },
  { id: "4", name: "Milk Packets", image: "/images/products/milk-packet/milk.png", is_hero: false },
  { id: "5", name: "Yogurt Packets", image: "/images/products/yogurt-packet/yogurt.png", is_hero: false },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);
  const heroRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 20]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-20%"]);

  const heroProduct = heroProducts.find((p) => p.is_hero);
  const secondaryProducts = heroProducts.filter((p) => !p.is_hero);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full overflow-hidden">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#92CCFC]/30 via-[#FAFAF8] to-[#FAFAF8] z-0" />

        {secondaryProducts.map((product, index) => {
          const offsets = [{ x: -180, y: -120 }, { x: 180, y: -120 }, { x: -180, y: 120 }, { x: 180, y: 120 }];
          const offset = offsets[index % offsets.length];
          const px = useTransform(scrollYProgress, [0, 0.5], [`${offset.x}px`, `${offset.x * 3}px`]);
          const py = useTransform(scrollYProgress, [0, 0.5], [`${offset.y}px`, `${offset.y * 3}px`]);
          const ps = useTransform(scrollYProgress, [0, 0.5], [0.8, 0.3]);
          const po = useTransform(scrollYProgress, [0, 0.4], [0.9, 0]);

          return (
            <motion.div key={product.id} style={{ x: px, y: py, scale: ps, opacity: po }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative w-36 h-36 md:w-52 md:h-52">
                <Image src={product.image} alt={product.name} fill className="object-contain" />
              </div>
            </motion.div>
          );
        })}

        <motion.div style={{ scale: heroScale, rotateY: heroRotateY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="relative w-56 h-56 md:w-80 md:h-80">
            <Image src={heroProduct?.image || ""} alt={heroProduct?.name || "Almond Milk"} fill className="object-contain drop-shadow-2xl" priority />
          </div>
        </motion.div>

        <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#001A57]">Cow Fresh</h1>
          <p className="text-xl md:text-2xl mb-2 text-[#1C1C1E]">Farm Fresh Dairy Products</p>
          <p className="text-base md:text-lg mb-8 text-[#1C1C1E]/70">Almond Milk &bull; Lassi &bull; Milk &bull; Yogurt &bull; Desi Ghee</p>
          <a href="/products" className="inline-block bg-[#45C517] hover:bg-[#45C517]/90 text-white font-semibold py-3 px-10 rounded-full transition-colors text-lg">Shop Now</a>
        </motion.div>
      </div>
    </section>
  );
}