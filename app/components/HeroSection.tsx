"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

/* ── Product definitions ── */
const ALL_PRODUCTS = [
  { id: "ghee",       name: "Desi Ghee",   image: "/images/products/ghee/desi_ghee.png",             isHero: false },
  { id: "lassi",      name: "Lassi",        image: "/images/products/lassi/lassi.png",                isHero: false },
  { id: "almond",     name: "Almond Milk",  image: "/images/products/almond-milk/almond_doodh.png",   isHero: true  },
  { id: "milk",       name: "Milk Packets", image: "/images/products/milk-packet/milk.png",           isHero: false },
  { id: "yogurt",     name: "Yogurt",       image: "/images/products/yogurt-packet/yogurt.png",       isHero: false },
];

/* Exit direction for each secondary product (in order: ghee, lassi, milk, yogurt) */
const EXIT = [
  { x: -150, y: -70, rotate: -22 },
  { x: -75,  y: -55, rotate: -12 },
  { x: 75,   y: -55, rotate:  12 },
  { x: 150,  y: -70, rotate:  22 },
];

/* ── Isolated motion wrapper for each secondary product ── */
function SecondaryProduct({
  product,
  exitX, exitY, exitRotate,
  smooth,
  prefersReduced,
}: {
  product: typeof ALL_PRODUCTS[0];
  exitX: number; exitY: number; exitRotate: number;
  smooth: ReturnType<typeof useSpring>;
  prefersReduced: boolean | null;
}) {
  const x  = useTransform(smooth, [0, 0.55], prefersReduced ? [0, 0] : [0, exitX]);
  const y  = useTransform(smooth, [0, 0.55], prefersReduced ? [0, 0] : [0, exitY]);
  const s  = useTransform(smooth, [0, 0.50], [0.88, prefersReduced ? 0.88 : 0]);
  const o  = useTransform(smooth, [0, 0.45], [1, 0]);
  const r  = useTransform(smooth, [0, 0.55], prefersReduced ? [0, 0] : [0, exitRotate]);

  return (
    <motion.div
      style={{ x, y, scale: s, opacity: o, rotate: r, zIndex: 20, flex: "0 0 auto", transformStyle: "preserve-3d" }}
      className="flex-shrink-0 w-20 sm:w-28 md:w-36 lg:w-44"
    >
      <div className="relative w-full aspect-[3/5]">
        <Image src={product.image} alt={product.name} fill
          className="object-contain"
          priority
          sizes="(max-width:640px) 80px,(max-width:768px) 112px,176px"
        />
      </div>
      <p className="text-center text-[10px] sm:text-xs font-bold text-cf-navy/60 mt-2 tracking-wide">
        {product.name}
      </p>
    </motion.div>
  );
}

/* ── Hero bottle (almond milk) ── */
function HeroBottle({
  product,
  smooth,
  prefersReduced,
}: {
  product: typeof ALL_PRODUCTS[0];
  smooth: ReturnType<typeof useSpring>;
  prefersReduced: boolean | null;
}) {
  const scale   = useTransform(smooth, [0, 0.5, 1], prefersReduced ? [1, 1, 1]    : [1.0, 1.35, 1.55]);
  const rotateY = useTransform(smooth, [0, 0.6, 1], prefersReduced ? [0, 0, 0]    : [0, 14, 20]);
  const shadow  = useTransform(smooth, [0, 0.5], [8, 40]);
  const filter  = useTransform(shadow, (v) =>
    `drop-shadow(0 ${v}px ${v * 1.5}px rgba(0,26,87,0.18))`
  );

  return (
    <motion.div
      style={{ scale, rotateY, filter, transformStyle: "preserve-3d", zIndex: 30, flex: "0 0 auto" }}
      className="flex-shrink-0 w-28 sm:w-36 md:w-48 lg:w-56 relative"
    >
      <div className="relative w-full aspect-[3/5]">
        <Image src={product.image} alt={product.name} fill
          className="object-contain"
          priority
          sizes="(max-width:640px) 112px,(max-width:768px) 144px,224px"
        />
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  /* Scroll progress wired to the TALL outer section */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  /* Headline fade */
  const textOpacity = useTransform(smooth, [0, 0.28], [1, 0]);
  const textY       = useTransform(smooth, [0, 0.28], [0, -40]);

  /* Background fade */
  const bgOpacity   = useTransform(smooth, [0, 0.6], [1, 0.3]);
  const greenOpacity = useTransform(smooth, [0.1, 0.7], [0, 0.6]);

  const secondaries = ALL_PRODUCTS.filter((p) => !p.isHero);
  const heroProd    = ALL_PRODUCTS.find((p) => p.isHero)!;

  return (
    /* Tall scroll container — the sticky child pins to viewport */
    <section ref={containerRef} className="relative w-full" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Sky-blue radial background */}
        <motion.div style={{ opacity: bgOpacity }}
          className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(146,204,252,0.35) 0%, rgba(250,249,246,0) 75%)" }} />
          <div className="absolute inset-0 bg-[#FAF9F6]" style={{ zIndex: -1 }} />
        </motion.div>

        {/* Green radial that appears as you scroll */}
        <motion.div style={{ opacity: greenOpacity }}
          className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 50% 50% at 50% 55%, rgba(69,197,23,0.12) 0%, transparent 70%)" }} />
        </motion.div>

        {/* ── PRODUCT ROW ── */}
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ perspective: 1200 }}>
          <div className="flex items-end justify-center w-full max-w-5xl mx-auto px-4 gap-2 sm:gap-4 md:gap-6">

            {/* Left secondary: ghee */}
            <SecondaryProduct product={secondaries[0]} exitX={EXIT[0].x} exitY={EXIT[0].y} exitRotate={EXIT[0].rotate} smooth={smooth} prefersReduced={prefersReduced} />
            {/* Left secondary: lassi */}
            <SecondaryProduct product={secondaries[1]} exitX={EXIT[1].x} exitY={EXIT[1].y} exitRotate={EXIT[1].rotate} smooth={smooth} prefersReduced={prefersReduced} />

            {/* Centre HERO */}
            <HeroBottle product={heroProd} smooth={smooth} prefersReduced={prefersReduced} />

            {/* Right secondary: milk */}
            <SecondaryProduct product={secondaries[2]} exitX={EXIT[2].x} exitY={EXIT[2].y} exitRotate={EXIT[2].rotate} smooth={smooth} prefersReduced={prefersReduced} />
            {/* Right secondary: yogurt */}
            <SecondaryProduct product={secondaries[3]} exitX={EXIT[3].x} exitY={EXIT[3].y} exitRotate={EXIT[3].rotate} smooth={smooth} prefersReduced={prefersReduced} />

          </div>
        </div>

        {/* ── HEADLINE (fades on scroll) ── */}
        <motion.div style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-40 text-center w-full px-4 pointer-events-none">

          {/* Nature badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4 pointer-events-auto"
            style={{ background: "rgba(69,197,23,0.1)", color: "#37a012", border: "1px solid rgba(69,197,23,0.3)", letterSpacing: "0.1em" }}>
            🌿 100 % Natural · No Preservatives
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold font-heading tracking-tight leading-none mb-3"
            style={{ background: "linear-gradient(135deg,#001A57 0%,#003199 60%,#001A57 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Cow&nbsp;<span style={{ WebkitTextFillColor: "#45C517" }}>Fresh</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl font-semibold text-cf-navy/70 mb-1 max-w-xl mx-auto">
            Farm-Pure Dairy — Delivered Cold
          </p>
          <p className="text-xs sm:text-sm text-cf-charcoal/50 mb-8 max-w-md mx-auto">
            Almond Milk · Lassi · Milk · Yogurt · Desi Ghee
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pointer-events-auto">
            <a href="/products"
              className="inline-block font-bold py-3.5 px-10 rounded-full text-white text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
              Shop Now
            </a>
            <a href="/about"
              className="inline-block font-bold py-3.5 px-8 rounded-full text-sm border-2 bg-white/70 hover:bg-white transition-all hover:scale-105 backdrop-blur-sm"
              style={{ borderColor: "rgba(0,26,87,0.2)", color: "#001A57" }}>
              Our Story ↓
            </a>
          </div>
        </motion.div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px z-50"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,26,87,0.12), transparent)" }} />
      </div>
    </section>
  );
}