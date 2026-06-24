"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
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
 * They animate outward toward screen edges + fade out.
 */
const EXIT = [
  { x: -420, y: -180, rotate: -28 },  // ghee → far left
  { x: -200, y: -120, rotate: -14 },  // lassi → mid-left
  { x: 200,  y: -120, rotate:  14 },  // milk → mid-right
  { x: 420,  y: -180, rotate:  28 },  // yogurt → far right
];

/* ─────────────────────────────────────────────
   SecondaryProduct Component
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
  // Fade + move out over first 45% of scroll progress
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
   Lenis smooth scroll initializer
───────────────────────────────────────────────── */
function useLenis() {
  useEffect(() => {
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
        // Fallback gracefully if Lenis fails to load
      }
    })();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);
}

/* ─────────────────────────────────────────────
   Main HeroSection Component
───────────────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Activate Lenis smooth scroll
  useLenis();

  // Scroll progress for secondary products and text fading in Hero (0 to 1 over hero height)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 65, damping: 20, restDelta: 0.001 });

  /* Headline fades out in first 22% of scroll */
  const textOpacity = useTransform(smooth, [0, 0.22], [1, 0]);
  const textY       = useTransform(smooth, [0, 0.22], [0, -50]);

  /* Background blends cream → navy radial as user scrolls */
  const bgGreenOpacity = useTransform(smooth, [0.15, 0.75], [0, 0.55]);
  const bgSkyOpacity   = useTransform(smooth, [0, 0.5],    [1, 0.3]);

  const secondaries = ALL_PRODUCTS.filter((p) => !p.isHero);
  const heroProd    = ALL_PRODUCTS.find((p) => p.isHero)!;

  // Coordinate tracking for landing bottle
  const [coords, setCoords] = useState<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    endX: number;
    endY: number;
    endWidth: number;
    endHeight: number;
  } | null>(null);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const scaleVal = useMotionValue(1);
  const rotY = useMotionValue(0);
  const opacityVal = useMotionValue(1);

  // Measure start and end elements
  useEffect(() => {
    const handleMeasure = () => {
      const bottleEl = bottleRef.current;
      const cardEl = document.getElementById("product-image-almond-milk");

      if (bottleEl && cardEl) {
        const bRect = bottleEl.getBoundingClientRect();
        const cRect = cardEl.getBoundingClientRect();

        // Get coordinates relative to the page document
        const startX = bRect.left + window.scrollX + bRect.width / 2;
        const startY = bRect.top + window.scrollY + bRect.height / 2;
        const endX = cRect.left + window.scrollX + cRect.width / 2;
        const endY = cRect.top + window.scrollY + cRect.height / 2;

        setCoords({
          startX,
          startY,
          startWidth: bRect.width,
          startHeight: bRect.height,
          endX,
          endY,
          endWidth: cRect.width,
          endHeight: cRect.height,
        });
      }
    };

    // Delay measurement to ensure styles and layouts have settled
    const timer = setTimeout(handleMeasure, 800);

    window.addEventListener("resize", handleMeasure);
    // Force re-measurement on first scroll to handle lazy headers or banner shifts
    window.addEventListener("scroll", handleMeasure, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleMeasure);
      window.removeEventListener("scroll", handleMeasure);
    };
  }, []);

  // Update flying bottle variables on scroll
  useEffect(() => {
    if (!coords) return;

    const handleScroll = () => {
      const y = window.scrollY;

      // Hero animation range (fixed sticky in hero)
      const y_hero_end = 250;
      
      // Calculate scroll position where the bottle lands on the card
      const y_land = coords.endY - window.innerHeight * 0.45;
      const activeLand = Math.max(y_land, y_hero_end + 150);

      // Starting viewport coordinates
      const vStartX = coords.startX - window.scrollX;
      const vStartY = coords.startY - window.scrollY;

      // Target viewport coordinates
      const vEndX = coords.endX - window.scrollX;
      const vEndY = coords.endY - y;

      const targetScale = coords.endWidth / coords.startWidth;

      if (prefersReduced) {
        // Accessibility fallback: fade out in place
        const p = Math.min(y / 200, 1);
        posX.set(vStartX - coords.startWidth / 2);
        posY.set(vStartY - coords.startHeight / 2);
        scaleVal.set(1.0 - 0.1 * p);
        rotY.set(0);
        opacityVal.set(1.0 - p);
        return;
      }

      if (y <= y_hero_end) {
        // Hero phase: floats centered, scales slightly, tilts
        const p = y_hero_end > 0 ? y / y_hero_end : 0;
        posX.set(vStartX - coords.startWidth / 2);
        posY.set(vStartY - coords.startHeight / 2);
        scaleVal.set(1.0 + 0.35 * p);
        rotY.set(22 * p);
        opacityVal.set(1.0);
      } else if (y < activeLand) {
        // Flight phase: flies down to meet the scrolling catalog card
        const totalDist = activeLand - y_hero_end;
        const t = (y - y_hero_end) / totalDist;

        // Smooth acceleration/deceleration
        const easeT = t * t * (3 - 2 * t);

        const currentX = vStartX + (vEndX - vStartX) * easeT;
        const currentY = vStartY + (vEndY - vStartY) * easeT;

        posX.set(currentX - coords.startWidth / 2);
        posY.set(currentY - coords.startHeight / 2);

        const startScale = 1.35;
        scaleVal.set(startScale + (targetScale - startScale) * easeT);
        rotY.set(22 * (1 - easeT));

        // Fade out in the final 12% of scroll distance to seamlessly merge with static card
        if (t > 0.88) {
          opacityVal.set((1 - t) / 0.12);
        } else {
          opacityVal.set(1.0);
        }
      } else {
        // Landed phase: invisible, static card image takes over
        posX.set(vEndX - coords.startWidth / 2);
        posY.set(vEndY - coords.startHeight / 2);
        scaleVal.set(targetScale);
        rotY.set(0);
        opacityVal.set(0.0);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [coords, prefersReduced, posX, posY, scaleVal, rotY, opacityVal]);

  const isMeasured = coords !== null;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[90vh] min-h-[600px] md:h-[95vh] md:min-h-[700px] overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0" style={{ background: "#FAF9F6", zIndex: 0 }} />

      {/* Sky-blue radial */}
      <motion.div
        style={{ opacity: bgSkyOpacity, zIndex: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 70% at 50% 38%, rgba(146, 204, 252, 0.42) 0%, rgba(250, 249, 246, 0) 72%)" }}
        />
      </motion.div>

      {/* Green radial */}
      <motion.div
        style={{ opacity: bgGreenOpacity, zIndex: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 50% 58%, rgba(69, 197, 23, 0.14) 0%, transparent 68%)" }}
        />
      </motion.div>

      {/* ── PRODUCT ROW (All 5 visible on load) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-end justify-center w-full max-w-5xl mx-auto px-4 gap-3 sm:gap-5 md:gap-8">
          
          {/* Left: ghee */}
          <SecondaryProduct product={secondaries[0]} exit={EXIT[0]} smooth={smooth} prefersReduced={prefersReduced} />
          {/* Left-centre: lassi */}
          <SecondaryProduct product={secondaries[1]} exit={EXIT[1]} smooth={smooth} prefersReduced={prefersReduced} />

          {/* Centre HERO Bottle Placeholder / Inline container */}
          <div
            ref={bottleRef}
            className={`flex-shrink-0 w-[20vw] min-w-[88px] max-w-[210px] transition-opacity duration-300 ${
              isMeasured ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{ zIndex: 30 }}
          >
            <div className="relative w-full aspect-[2/3]">
              <Image
                src={heroProd.image}
                alt={heroProd.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width:640px) 20vw, 210px"
              />
            </div>
          </div>

          {/* Right-centre: milk */}
          <SecondaryProduct product={secondaries[2]} exit={EXIT[2]} smooth={smooth} prefersReduced={prefersReduced} />
          {/* Right: yogurt */}
          <SecondaryProduct product={secondaries[3]} exit={EXIT[3]} smooth={smooth} prefersReduced={prefersReduced} />

        </div>
      </div>

      {/* ── HEADLINE + CTA ── */}
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

      {/* ── FLYING HERO BOTTLE (Fixed Overlay, active after coordinates measurement) ── */}
      {isMeasured && (
        <motion.div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            x: posX,
            y: posY,
            scale: scaleVal,
            rotateY: rotY,
            opacity: opacityVal,
            transformStyle: "preserve-3d",
            zIndex: 30,
            pointerEvents: "none",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
          className="flex-shrink-0 w-[20vw] min-w-[88px] max-w-[210px]"
        >
          <div className="relative w-full aspect-[2/3]">
            <Image
              src={heroProd.image}
              alt={heroProd.name}
              fill
              className="object-contain"
              priority
              sizes="(max-width:640px) 20vw, 210px"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}