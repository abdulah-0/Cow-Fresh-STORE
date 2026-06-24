"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect mobile viewport (SSR safe)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero product transform values
  // Desktop: scales 1 -> 1.25, Y-rotation 0 -> 15deg
  // Mobile: scales 1 -> 1.1, Y-rotation remains 0 for performance and clarity
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    shouldReduceMotion ? [1, 1, 1] : isMobile ? [1, 1.1, 1.15] : [1, 1.2, 1.35]
  );
  
  const heroRotateY = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    shouldReduceMotion ? [0, 0, 0] : isMobile ? [0, 0, 0] : [0, 10, 18]
  );

  const heroRotateX = useTransform(
    scrollYProgress,
    [0, 0.6],
    shouldReduceMotion ? [0, 0] : isMobile ? [0, 0] : [0, 5]
  );

  // Text fading/translation
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], ["0%", "-15%"]);

  const heroProduct = heroProducts.find((p) => p.is_hero);
  const secondaryProducts = heroProducts.filter((p) => !p.is_hero);

  // Responsive offsets for the 4 secondary products (drift targets)
  // [Ghee, Lassi, Milk, Yogurt]
  const desktopOffsets = [
    { x: -280, y: -150, scale: 0.8 }, // Top Left
    { x: 280, y: -150, scale: 0.8 },  // Top Right
    { x: -250, y: 150, scale: 0.75 }, // Bottom Left
    { x: 250, y: 150, scale: 0.75 },  // Bottom Right
  ];

  const mobileOffsets = [
    { x: -80, y: -120, scale: 0.6 },  // Top Left
    { x: 80, y: -120, scale: 0.6 },   // Top Right
    { x: -85, y: 90, scale: 0.55 },   // Bottom Left
    { x: 85, y: 90, scale: 0.55 },    // Bottom Right
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative h-[130vh] md:h-[200vh] w-full overflow-hidden bg-cf-off-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Sky gradient to represent cow fresh dairy aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-cf-sky/20 via-cf-off-white to-cf-off-white z-0 pointer-events-none" />

        {/* 3D Scene Wrapper */}
        <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center z-20" style={{ perspective: 1000 }}>
          
          {/* Secondary Products Layer */}
          {secondaryProducts.map((product, index) => {
            const offsets = isMobile ? mobileOffsets : desktopOffsets;
            const offset = offsets[index % offsets.length];

            // Scroll-linked transforms
            // Secondary products drift outwards and scale down to create depth
            const px = useTransform(
              scrollYProgress,
              [0, 0.5],
              shouldReduceMotion 
                ? [`${offset.x}px`, `${offset.x}px`]
                : [`${offset.x}px`, `${offset.x * (isMobile ? 2.5 : 3)}px`]
            );
            
            const py = useTransform(
              scrollYProgress,
              [0, 0.5],
              shouldReduceMotion
                ? [`${offset.y}px`, `${offset.y}px`]
                : [`${offset.y}px`, `${offset.y * (isMobile ? 2.5 : 3)}px`]
            );

            const ps = useTransform(
              scrollYProgress,
              [0, 0.5],
              [offset.scale, shouldReduceMotion ? offset.scale : 0.2]
            );

            const po = useTransform(
              scrollYProgress,
              [0, 0.45],
              [0.9, 0] // Fade out completely by 45% scroll
            );

            return (
              <motion.div
                key={product.id}
                style={{ 
                  x: px, 
                  y: py, 
                  scale: ps, 
                  opacity: po,
                  transformStyle: "preserve-3d"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-56 md:h-56 filter drop-shadow-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 120px, 240px"
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Hero Product (Almond Milk Bottle) */}
          <motion.div
            style={{
              scale: heroScale,
              rotateY: heroRotateY,
              rotateX: heroRotateX,
              transformStyle: "preserve-3d",
              y: isMobile ? "-10%" : "0%"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 filter drop-shadow-2xl">
              <Image
                src={heroProduct?.image || ""}
                alt={heroProduct?.name || "Almond Milk"}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 220px, 350px"
              />
            </div>
          </motion.div>

          {/* Text Content Overlay */}
          <motion.div
            style={{ 
              opacity: textOpacity, 
              y: textY,
            }}
            className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-30 text-center w-full px-4"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-cf-green/10 text-cf-green text-xs md:text-sm font-extrabold mb-3 uppercase tracking-wider">
              100% Grass-Fed Dairy
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading mb-4 text-cf-navy tracking-tight leading-none">
              Cow <span className="text-cf-green">Fresh</span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl mb-1 text-cf-charcoal font-semibold max-w-xl mx-auto">
              Pure Dairy Products Delivered Direct
            </p>
            <p className="text-xs sm:text-sm md:text-lg mb-8 text-cf-charcoal/60 max-w-md mx-auto leading-relaxed">
              Almond Milk &bull; Lassi &bull; Milk &bull; Yogurt &bull; Desi Ghee
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/products"
                className="w-full sm:w-auto bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3.5 px-10 rounded-full transition-all text-base shadow-md hover:shadow-lg hover:scale-105 duration-300 text-center"
              >
                Shop Now
              </a>
              <button
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight * (isMobile ? 1.0 : 1.3),
                    behavior: "smooth"
                  });
                }}
                className="w-full sm:w-auto bg-white/80 hover:bg-white text-cf-navy font-bold py-3.5 px-8 rounded-full border border-cf-sky/30 transition-all text-sm text-center"
              >
                Learn More ↓
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}