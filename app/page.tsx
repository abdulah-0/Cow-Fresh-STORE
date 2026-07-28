import { HeroSection } from "@/app/components/HeroSection";
import { getProducts } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export default async function Home() {
  const products = await getProducts();

  const getStartingPrice = (p: any) => {
    const def = p.variants.find((v: any) => v.is_default) ?? p.variants[0];
    return def?.price ?? 0;
  };

  const pillars = [
    {
      icon: "🥛",
      title: "Pure & Natural",
      body: "Zero preservatives or unhealthy chemical additives. Just raw, wholesomely processed dairy rich in vitamins & calcium.",
      disclaimer: "*A small amount (3 grams per 290 ml) of skimmed milk powder is used in Badami Drink to enhance its texture and taste.",
      bg: "linear-gradient(135deg,rgba(69,197,23,0.12),rgba(69,197,23,0.04))",
      border: "rgba(69,197,23,0.25)",
      iconBg: "rgba(69,197,23,0.15)",
    },
    {
      icon: "🚚",
      title: "Optimum Milk Storage",
      body: "Our products are stored at temperatures under 4°C to mitigate bacterial growth and ensure ultimate richness in taste till the time of delivery.",
      bg: "linear-gradient(135deg,rgba(146,204,252,0.2),rgba(146,204,252,0.06))",
      border: "rgba(146,204,252,0.4)",
      iconBg: "rgba(146,204,252,0.25)",
    },
    {
      icon: "🍀",
      title: "Ethically Sourced",
      body: "Exclusively from farms practising sustainable animal husbandry. Healthy grass-fed cows produce richer, creamier milk.",
      bg: "linear-gradient(135deg,rgba(0,26,87,0.07),rgba(0,26,87,0.02))",
      border: "rgba(0,26,87,0.12)",
      iconBg: "rgba(0,26,87,0.08)",
    },
  ];

  return (
    <main className="overflow-hidden" style={{ background: "var(--cf-off-white)" }}>

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── WHY COW FRESH ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,238,242,0.4) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest mb-3 bg-[#12201A]/5 text-[#1F3B2C] border border-[#1F3B2C]/15">
              Our Promise
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4 text-[#12201A]">
              Pure Dairy,&nbsp;
              <span className="italic font-light text-[#B5652E]">Straight From The Farm</span>
            </h2>
            <p className="text-base md:text-lg font-sans text-[#1F3B2C]/70">
              We bypass distributors to deliver fresh milk, lassi, yogurt and ghee within hours of production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl p-8 border border-[#C9A876]/20 bg-[#FAF6EF] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-[#DCEEF2]/60">
                  {p.icon}
                </div>
                <h3 className="font-serif font-bold text-xl mb-3 text-[#12201A]">{p.title}</h3>
                <p className="text-sm font-sans leading-relaxed text-[#1F3B2C]/75">{p.body}</p>
                {p.disclaimer && (
                  <p className="text-[11px] font-sans leading-snug mt-3 italic text-[#1F3B2C]/50">
                    {p.disclaimer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY (PRD 2.0) ── */}
      <section className="py-16 bg-[#FAF6EF]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B5652E] block mb-2">
                COLD-PASTEURIZED SELECTION
              </span>
              <h2 className="font-serif font-semibold text-3xl md:text-5xl text-[#12201A] tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="font-sans font-semibold text-sm text-[#1F3B2C] hover:text-[#B5652E] transition-colors flex items-center gap-1"
            >
              <span>Explore all categories</span>
              <span className="font-mono">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                id: "almond-milk",
                name: "Almond Milk",
                tag: "Signature",
                href: "/products/almond-milk",
                icon: "🥜",
                isFlagship: true,
              },
              {
                id: "milk-packet",
                name: "Fresh Milk",
                tag: "Everyday",
                href: "/products/milk-packet",
                icon: "🥛",
                isFlagship: false,
              },
              {
                id: "yogurt-packet",
                name: "Cultured Dahi",
                tag: "Cultured",
                href: "/products/yogurt-packet",
                icon: "🏺",
                isFlagship: false,
              },
              {
                id: "lassi",
                name: "Sweet Lassi",
                tag: "Churned",
                href: "/products/lassi",
                icon: "🥤",
                isFlagship: false,
              },
              {
                id: "ghee",
                name: "Desi Ghee",
                tag: "Aged",
                href: "/products/desi-ghee",
                icon: "🧈",
                isFlagship: false,
              },
            ].map((cat) => (
              <Link key={cat.id} href={cat.href} className="group">
                <div
                  className={`rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl ${
                    cat.isFlagship
                      ? "bg-[#B5652E] text-[#FAF6EF] shadow-lg ring-2 ring-[#B5652E]/30"
                      : "bg-[#12201A] text-[#FAF6EF] hover:bg-[#1F3B2C]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                        cat.isFlagship
                          ? "bg-[#FAF6EF]/20 text-[#FAF6EF]"
                          : "bg-[#DCEEF2]/15 text-[#DCEEF2]"
                      }`}
                    >
                      {cat.tag}
                    </span>
                    <span className="text-2xl transition-transform group-hover:scale-110">
                      {cat.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-semibold text-lg sm:text-xl mb-1">
                      {cat.name}
                    </h3>
                    <span
                      className={`font-mono text-xs inline-flex items-center gap-1 ${
                        cat.isFlagship ? "text-[#EFE3C9]" : "text-[#DCEEF2]/70"
                      }`}
                    >
                      Browse range <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOURCING STORY ── */}
      <section className="relative py-24 overflow-hidden bg-[#12201A]">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 70% 40%, rgba(220,238,242,0.1) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <div className="space-y-6 text-[#FAF6EF]">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-[#FAF6EF]/10 text-[#EFE3C9] border border-[#C9A876]/20">
                Our Heritage
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-semibold tracking-tight leading-tight">
                Crafting Freshness,&nbsp;
                <span className="italic font-light text-[#B5652E]">Sourced from Nature</span>
              </h2>
              <p className="text-sm md:text-base font-sans leading-relaxed text-[#DCEEF2]/80">
                Our partner farms are home to healthy cows that graze on organic, nutrient-dense grass. This traditional ecosystem is the secret behind our milk&apos;s rich texture and the golden granularity of our slow-cooked Desi Ghee.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#C9A876]/20">
                <div>
                  <h4 className="text-3xl font-serif font-bold text-[#B5652E]">4 hrs</h4>
                  <p className="text-xs font-sans mt-1 text-[#DCEEF2]/60">Farm milking to cold-packed delivery</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif font-bold text-[#EFE3C9]">Zero</h4>
                  <p className="text-xs font-sans mt-1 text-[#DCEEF2]/60">Preservatives, hormones, or standardisers</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about"
                  className="inline-block font-sans font-semibold py-3.5 px-8 rounded-full text-[#FAF6EF] bg-[#12201A] border border-[#C9A876]/40 hover:bg-[#B5652E] hover:border-[#B5652E] text-sm shadow-lg transition-all duration-300 hover:scale-105">
                  Read Our Full Story →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl p-6 md:p-8 space-y-5 bg-[#FAF6EF]/5 border border-[#C9A876]/20 backdrop-blur-md">
                <div className="flex items-center gap-4 pb-4 border-b border-[#C9A876]/15">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[#DCEEF2]/10">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#FAF6EF]">Verified Farm Sourcing</h3>
                    <p className="text-xs font-sans text-[#DCEEF2]/60">Strict 10-point purity check</p>
                  </div>
                </div>

                {[
                  ["Grass-Fed Feed Program","Cows feed on natural alfalfa and clover, enhancing Omega-3 content."],
                  ["Cold Chain Guarantee","Temperature monitored under 4°C continuously."],
                  ["Traditional Brass Simmering","Ghee clarified slowly in small batches for authentic granules."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-lg mt-0.5 text-[#B5652E]">✓</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#FAF6EF]">{title}</h4>
                      <p className="text-xs font-sans mt-0.5 text-[#DCEEF2]/70">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MINI CTA STRIP ── */}
      <section className="py-16 bg-[#FAF6EF]">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-4xl font-serif font-semibold text-[#12201A]">
            Ready for farm-fresh dairy?
          </h2>
          <p className="text-sm font-sans text-[#1F3B2C]/60">
            Free cold-chain delivery on every order over PKR 1,500.
          </p>
          <Link href="/products"
            className="inline-block font-sans font-semibold py-3.5 px-10 rounded-full text-[#FAF6EF] bg-[#12201A] hover:bg-[#B5652E] text-sm shadow-md transition-all duration-300 hover:scale-105">
            Shop All Products →
          </Link>
        </div>
      </section>
    </main>
  );
}