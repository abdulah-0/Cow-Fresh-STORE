"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";

/* ── Product definitions ── */
const ALL_PRODUCTS = [
  { id: "ghee",   name: "Desi Ghee",   image: "/images/products/ghee/desi_ghee.png",           isHero: false },
  { id: "lassi",  name: "Lassi",        image: "/images/products/lassi/lassi.png",              isHero: false },
  { id: "almond", name: "Almond Milk",  image: "/images/products/almond-milk/almond_doodh.png", isHero: true  },
  { id: "milk",   name: "Milk Packets", image: "/images/products/milk-packet/milk.png",         isHero: false },
  { id: "yogurt", name: "Yogurt",       image: "/images/products/yogurt-packet/yogurt.png",     isHero: false },
];

/*
 * PRD §7 exit targets for the 4 secondary products:
 * They animate outward toward screen edges + fade out (0→50% scroll).
 * On mobile: skip rotateY, scale only (PRD §7.4).
 * exitX/Y are in % of the element's own width for x and pixels for y.
 */
const EXIT = [
  { x: -420, y: -180, rotate: -28 },  // ghee → far left
  { x: -200, y: -120, rotate: -14 },  // lassi → mid-left
  { x: 200,  y: -120, rotate:  14 },  // milk → mid-right
  { x: 420,  y: -180, rotate:  28 },  // yogurt → far right
];

/* ─────────────────────────────────────────────
   SecondaryProduct — each renders its own hooks
   PRD §7.2: translate3d + scale + opacity driven by scroll
───────────────────────────────────────────────── */
function SecondaryProduct({
  product,
  exit,
  smooth,
  prefersReduced,
}: {
  product: typeof ALL_PRODUCTS[0];
  exit: typeof EXIT[0];
  smooth: ReturnType<typeof useSpring>;
  prefersReduced: boolean | null;
}) {
  // Fade + move out over first 45% of scroll
  const x  = useTransform(smooth, [0, 0.45], prefersReduced ? [0, 0] : [0, exit.x]);
  const y  = useTransform(smooth, [0, 0.45], prefersReduced ? [0, 0] : [0, exit.y]);
  const sc = useTransform(smooth, [0, 0.45], [1, prefersReduced ? 1 : 0]);
  const op = useTransform(smooth, [0, 0.38], [1, 0]);
  const ro = useTransform(smooth, [0, 0.45], prefersReduced ? [0, 0] : [0, exit.rotate]);

  return (
    <motion.div
      style={{ x, y, scale: sc, opacity: op, rotate: ro, zIndex: 20, flex: "0 0 auto", transformStyle: "preserve-3d" }}
      className="flex-shrink-0 w-[15vw] min-w-[64px] max-w-[140px]"
    >
      {/* Transparent wrapper — no background, let the PNG float */}
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain drop-shadow-lg"
          priority
          sizes="(max-width:640px) 15vw, 140px"
        />
      </div>
      <p className="text-center text-[9px] sm:text-[11px] font-bold mt-1.5 tracking-wide"
        style={{ color: "rgba(0,26,87,0.55)" }}>
        {product.name}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   HeroBottle — PRD §7.2:
   "scales up slightly and/or rotates (15–25° Y-axis tilt)"
   stays centered as secondary products depart.
───────────────────────────────────────────────── */
function HeroBottle({
  product,
  smooth,
  prefersReduced,
}: {
  product: typeof ALL_PRODUCTS[0];
  smooth: ReturnType<typeof useSpring>;
  prefersReduced: boolean | null;
}) {
  // Scale: 1.0 → 1.45 as you scroll (PRD §7: "scales up slightly")
  const scale   = useTransform(smooth, [0, 0.7, 1], prefersReduced ? [1, 1, 1]   : [1.0, 1.42, 1.48]);
  // RotateY: 0 → 20° (PRD §7: "15–25° Y-axis tilt")
  const rotateY = useTransform(smooth, [0, 0.5, 1], prefersReduced ? [0, 0, 0]   : [0, 18, 22]);
  // Vertical float as it grows
  const y       = useTransform(smooth, [0, 0.7],     prefersReduced ? [0, 0]      : [0, -30]);
  // Drop shadow intensifies
  const shadow  = useTransform(smooth, [0, 0.6], [12, 56]);
  const filter  = useTransform(shadow, (v) =>
    `drop-shadow(0 ${v}px ${v * 1.5}px rgba(0,26,87,0.22))`
  );

  return (
    <motion.div
      style={{
        scale, rotateY, y, filter,
        transformStyle: "preserve-3d",
        zIndex: 30,
        flex: "0 0 auto",
        willChange: "transform",
      }}
      className="flex-shrink-0 w-[20vw] min-w-[88px] max-w-[210px]"
    >
      {/* No background — pure transparent PNG floats in 3D space */}
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
          priority
          sizes="(max-width:640px) 20vw, 210px"
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Lenis smooth scroll initialiser
───────────────────────────────────────────────── */
function useLenis() {
  useEffect(() => {
    // Dynamically load Lenis to avoid SSR issues
    let lenisInstance: any = null;
    let rafId: number;

    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        lenisInstance = new Lenis({ lerp: 0.08, smoothWheel: true });
        const raf = (time: number) => {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Lenis optional — falls back to native scroll gracefully
      }
    })();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);
}

/* ─────────────────────────────────────────────
   Main HeroSection
───────────────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Activate Lenis smooth scroll (PRD §7.3 recommends Framer Motion + Lenis)
  useLenis();

  /* Scroll progress tied to the TALL outer container */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Spring smoother — gives the "settle into place" feel (PRD §7.3)
  const smooth = useSpring(scrollYProgress, { stiffness: 65, damping: 20, restDelta: 0.001 });

  /* Headline fades out fast in first 25% of scroll */
  const textOpacity = useTransform(smooth, [0, 0.22], [1, 0]);
  const textY       = useTransform(smooth, [0, 0.22], [0, -50]);

  /* Background: cream → more navy-tinted as hero bottle dominates */
  const bgGreenOpacity = useTransform(smooth, [0.15, 0.75], [0, 0.55]);
  const bgSkyOpacity   = useTransform(smooth, [0, 0.5],    [1, 0.3]);

  const secondaries = ALL_PRODUCTS.filter((p) => !p.isHero);
  const heroProd    = ALL_PRODUCTS.find((p) => p.isHero)!;

  return (
    /*
     * PRD §7.4: hero scroll distance ≈ 1.2-1.5× vh mobile, 2-2.5× desktop
     * Using CSS clamp: 150vh mobile up to 230vh desktop
     */
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "clamp(150vh, 200vh, 230vh)" }}
    >
      {/* ── STICKY VIEWPORT ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: 1400 }}>

        {/* Background layers */}
        {/* Cream base — always present */}
        <div className="absolute inset-0" style={{ background: "#FAF9F6", zIndex: 0 }} />

        {/* Sky-blue radial (dairy freshness feel — PRD §4) */}
        <motion.div style={{ opacity: bgSkyOpacity, zIndex: 1 }}
          className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 90% 70% at 50% 38%, rgba(146,204,252,0.42) 0%, rgba(250,249,246,0) 72%)" }} />
        </motion.div>

        {/* Green radial builds in as hero bottle expands */}
        <motion.div style={{ opacity: bgGreenOpacity, zIndex: 2 }}
          className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 55% 55% at 50% 58%, rgba(69,197,23,0.14) 0%, transparent 68%)" }} />
        </motion.div>

        {/* ── PRODUCT ROW (PRD §7.1: all 5 visible on load) ── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <div className="flex items-end justify-center w-full max-w-5xl mx-auto px-4 gap-3 sm:gap-5 md:gap-8">

            {/* Left: ghee */}
            <SecondaryProduct product={secondaries[0]} exit={EXIT[0]} smooth={smooth} prefersReduced={prefersReduced} />
            {/* Left-centre: lassi */}
            <SecondaryProduct product={secondaries[1]} exit={EXIT[1]} smooth={smooth} prefersReduced={prefersReduced} />

            {/* HERO: almond milk — centred */}
            <HeroBottle product={heroProd} smooth={smooth} prefersReduced={prefersReduced} />

            {/* Right-centre: milk */}
            <SecondaryProduct product={secondaries[2]} exit={EXIT[2]} smooth={smooth} prefersReduced={prefersReduced} />
            {/* Right: yogurt */}
            <SecondaryProduct product={secondaries[3]} exit={EXIT[3]} smooth={smooth} prefersReduced={prefersReduced} />

          </div>
        </div>

        {/* ── HEADLINE + CTA (fades out on scroll — PRD §7.2) ── */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-8 md:bottom-14 left-1/2 -translate-x-1/2 z-40 text-center w-full px-4 pointer-events-none"
        >
          {/* Nature badge */}
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold mb-5 pointer-events-auto"
            style={{
              background: "rgba(69,197,23,0.1)",
              color: "#2e8a0e",
              border: "1px solid rgba(69,197,23,0.28)",
              letterSpacing: "0.08em",
            }}
          >
            🌿 100% Natural · No Preservatives
          </span>

          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold font-heading tracking-tight leading-none mb-3"
            style={{
              background: "linear-gradient(140deg, #001A57 0%, #0031a0 55%, #001A57 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cow&nbsp;<span style={{ WebkitTextFillColor: "#45C517" }}>Fresh</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl font-semibold mb-1 max-w-xl mx-auto"
            style={{ color: "rgba(0,26,87,0.7)" }}>
            Farm-Pure Dairy — Delivered Cold
          </p>
          <p className="text-xs sm:text-sm mb-8 max-w-md mx-auto"
            style={{ color: "rgba(28,28,30,0.45)" }}>
            Almond Milk · Lassi · Milk · Yogurt · Desi Ghee
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pointer-events-auto">
            <a
              href="/products"
              className="inline-block font-bold py-3.5 px-10 rounded-full text-white text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}
            >
              Shop Now
            </a>
            <a
              href="/about"
              className="inline-block font-bold py-3.5 px-8 rounded-full text-sm border-2 bg-white/70 hover:bg-white transition-all hover:scale-105 backdrop-blur-sm"
              style={{ borderColor: "rgba(0,26,87,0.2)", color: "#001A57" }}
            >
              Our Story ↓
            </a>
          </div>
        </motion.div>

        {/* Bottom fade divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 z-50 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(250,249,246,0.9))" }}
        />
      </div>
    </section>
  );
}