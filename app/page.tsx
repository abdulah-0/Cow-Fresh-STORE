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
      title: "100% Pure & Natural",
      body: "Zero preservatives, chemical additives, or milk powders. Just raw, wholesomely processed dairy rich in vitamins and calcium.",
      bg: "linear-gradient(135deg,rgba(69,197,23,0.12),rgba(69,197,23,0.04))",
      border: "rgba(69,197,23,0.25)",
      iconBg: "rgba(69,197,23,0.15)",
    },
    {
      icon: "🚚",
      title: "Cold-Chain Delivery",
      body: "Temperature-controlled transport from farm to your door. Milk stays under 4 °C the entire journey.",
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
    <main className="overflow-hidden" style={{ background: "#FAF9F6" }}>

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── WHY COW FRESH ── */}
      <section className="py-20 relative">
        {/* Faint sky radial behind the section */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(146,204,252,0.18) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3"
              style={{ background: "rgba(69,197,23,0.12)", color: "#37a012", border: "1px solid rgba(69,197,23,0.25)" }}>
              Our Promise
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-4"
              style={{ color: "#001A57" }}>
              Pure Dairy,&nbsp;
              <span style={{ color: "#45C517" }}>Straight From The Farm</span>
            </h2>
            <p className="text-base md:text-lg" style={{ color: "#1C1C1E", opacity: 0.6 }}>
              We bypass distributors to deliver fresh milk, lassi, yogurt and ghee within hours of production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: p.bg, borderColor: p.border }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform hover:scale-110"
                  style={{ background: p.iconBg }}>
                  {p.icon}
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#001A57" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#1C1C1E", opacity: 0.65 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 border-t border-b" style={{ background: "#fff", borderColor: "rgba(146,204,252,0.2)" }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3"
                style={{ background: "rgba(146,204,252,0.18)", color: "#001A57", border: "1px solid rgba(146,204,252,0.35)" }}>
                Dynamic Catalog
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight" style={{ color: "#001A57" }}>
                Explore Our Fresh Range
              </h2>
            </div>
            <Link href="/products"
              className="group inline-flex items-center gap-2 font-bold text-sm transition-all hover:underline"
              style={{ color: "#45C517" }}>
              View All Products
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, 5).map((product) => {
              const img = product.images[0]?.image_url ?? "/images/placeholder.png";
              const price = getStartingPrice(product);
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
                  <div className="rounded-3xl overflow-hidden border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col h-full"
                    style={{ borderColor: "rgba(146,204,252,0.2)", background: "#FAF9F6" }}>

                    {/* Image area with sky gradient */}
                    <div 
                      id={product.slug === "almond-milk" ? "product-image-almond-milk" : undefined}
                      className="relative aspect-square flex items-center justify-center overflow-hidden p-4"
                      style={{ background: "linear-gradient(160deg,rgba(146,204,252,0.22) 0%,#fff 70%)" }}>
                      <Image src={img} alt={product.name} fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 50vw, 20vw" />
                      {product.is_hero_product && (
                        <span className="absolute top-2 left-2 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow"
                          style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
                          Flagship
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest mb-1"
                        style={{ color: "#92CCFC" }}>
                        {product.category.replace("_", " ")}
                      </span>
                      <h3 className="font-bold text-sm md:text-base mb-1 line-clamp-1 transition-colors group-hover:text-green-600"
                        style={{ color: "#001A57" }}>
                        {product.name}
                      </h3>
                      <p className="text-xs line-clamp-1 mb-3 flex-grow"
                        style={{ color: "#1C1C1E", opacity: 0.5 }}>
                        {product.short_tagline}
                      </p>
                      <div className="mt-auto pt-3 flex items-center justify-between"
                        style={{ borderTop: "1px solid rgba(146,204,252,0.2)" }}>
                        <div>
                          <span className="text-[9px] block" style={{ color: "#1C1C1E", opacity: 0.4 }}>From</span>
                          <span className="font-extrabold text-sm" style={{ color: "#45C517" }}>Rs {price}</span>
                        </div>
                        <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center transition-all group-hover:scale-105 shadow-sm"
                          style={{ background: "linear-gradient(135deg,#001A57,#003199)" }}>
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOURCING STORY  (navy + sky gradient) ── */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#001A57 0%,#000a2e 100%)" }}>

        {/* Sky accent radial */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 70% 40%, rgba(146,204,252,0.18) 0%, transparent 65%)" }} />
        {/* Green accent radial */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(69,197,23,0.12) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Text column */}
            <div className="space-y-6 text-white">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest"
                style={{ background: "rgba(146,204,252,0.15)", color: "#92CCFC", border: "1px solid rgba(146,204,252,0.25)" }}>
                Our Heritage
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                Crafting Freshness,&nbsp;
                <span style={{ color: "#45C517" }}>Sourced from Nature</span>
              </h2>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(146,204,252,0.8)" }}>
                Our partner farms are home to healthy cows that graze on organic, nutrient-dense grass. This traditional ecosystem is the secret behind our milk&apos;s rich texture and the golden granularity of our slow-cooked Desi Ghee.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4"
                style={{ borderTop: "1px solid rgba(146,204,252,0.15)" }}>
                <div>
                  <h4 className="text-3xl font-extrabold" style={{ color: "#45C517" }}>4 hrs</h4>
                  <p className="text-xs mt-1" style={{ color: "rgba(146,204,252,0.6)" }}>Farm milking to cold-packed delivery</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold" style={{ color: "#92CCFC" }}>Zero</h4>
                  <p className="text-xs mt-1" style={{ color: "rgba(146,204,252,0.6)" }}>Preservatives, hormones, or standardisers</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about"
                  className="inline-block font-bold py-3.5 px-8 rounded-full text-white text-sm shadow-lg transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
                  Read Our Full Story
                </Link>
              </div>
            </div>

            {/* Glass card column */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-20 rounded-3xl"
                style={{ background: "linear-gradient(135deg,#92CCFC,#45C517)" }} />
              <div className="relative rounded-3xl p-6 md:p-8 space-y-5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(146,204,252,0.18)", backdropFilter: "blur(12px)" }}>

                <div className="flex items-center gap-4 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ background: "rgba(146,204,252,0.2)" }}>
                    🌾
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Verified Farm Sourcing</h3>
                    <p className="text-xs" style={{ color: "rgba(146,204,252,0.6)" }}>Strict 10-point purity check</p>
                  </div>
                </div>

                {[
                  ["Grass-Fed Feed Program","Cows feed on natural alfalfa and clover, enhancing Omega-3 content."],
                  ["Cold Chain Guarantee","Temperature monitored under 4°C continuously."],
                  ["Traditional Brass Simmering","Ghee clarified slowly in small batches for authentic granules."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-lg mt-0.5" style={{ color: "#45C517" }}>✓</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{title}</h4>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(146,204,252,0.65)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MINI CTA STRIP ── */}
      <section className="py-14" style={{ background: "#FAF9F6" }}>
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading" style={{ color: "#001A57" }}>
            Ready for farm-fresh dairy?
          </h2>
          <p className="text-sm" style={{ color: "#1C1C1E", opacity: 0.55 }}>
            Free cold-chain delivery on every order. No minimum order required.
          </p>
          <Link href="/products"
            className="inline-block font-bold py-3.5 px-10 rounded-full text-white text-sm shadow-md transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
            Shop All Products →
          </Link>
        </div>
      </section>
    </main>
  );
}