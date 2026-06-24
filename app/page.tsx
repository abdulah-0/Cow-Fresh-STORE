import { HeroSection } from "@/app/components/HeroSection";
import { getProducts } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600; // Revalidate page every hour

export default async function Home() {
  const products = await getProducts();
  
  // Get default price for each product
  const getProductStartingPrice = (product: any) => {
    const defaultVar = product.variants.find((v: any) => v.is_default) || product.variants[0];
    return defaultVar ? defaultVar.price : 0;
  };

  return (
    <main className="overflow-hidden bg-cf-off-white">
      {/* 3D-Style Scroll-Driven Hero Section */}
      <HeroSection />

      {/* Brand Values / Why Cow Fresh */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cf-green font-bold text-sm tracking-widest uppercase mb-2 block">Our Promise</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight mb-4">
            Pure Dairy, Straight From The Farm
          </h2>
          <p className="text-cf-charcoal/70 text-base md:text-lg">
            We bypass traditional distributors to deliver milk, lassi, yogurt, and ghee from green pastures directly to your doorstep within hours of production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-cf-sky/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cf-green/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🥛
            </div>
            <h3 className="font-bold font-heading text-xl text-cf-navy mb-3">100% Pure & Natural</h3>
            <p className="text-cf-charcoal/70 text-sm leading-relaxed">
              Absolutely no preservatives, chemical additives, or milk powders. Just raw, wholesomely processed dairy rich in vitamins and calcium.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-cf-sky/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cf-sky/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🚚
            </div>
            <h3 className="font-bold font-heading text-xl text-cf-navy mb-3">Direct Cold Chain Delivery</h3>
            <p className="text-cf-charcoal/70 text-sm leading-relaxed">
              Shipped in temperature-controlled transport directly from our partner farms to maintain freshness, taste, and active probiotics.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-cf-sky/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-cf-navy/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🍀
            </div>
            <h3 className="font-bold font-heading text-xl text-cf-navy mb-3">Ethically Sourced</h3>
            <p className="text-cf-charcoal/70 text-sm leading-relaxed">
              Sourced exclusively from farms practicing sustainable animal husbandry. Healthy, grass-fed cows produce richer, creamier milk.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="bg-white border-y border-cf-sky/20 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <span className="text-cf-green font-bold text-sm tracking-widest uppercase mb-2 block">Dynamic Catalog</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-cf-navy tracking-tight">
                Explore Our Fresh Range
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-cf-green hover:text-cf-navy font-bold transition-colors group text-sm md:text-base"
            >
              View All Products
              <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, 5).map((product) => {
              const image = product.images[0]?.image_url || "/images/placeholder.png";
              const price = getProductStartingPrice(product);
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
                  <div className="bg-cf-off-white rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 flex-1 flex flex-col border border-cf-sky/10">
                    <div className="relative aspect-square bg-gradient-to-b from-cf-sky/20 to-white p-4 md:p-6 flex items-center justify-center overflow-hidden">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                      {product.is_hero_product && (
                        <span className="absolute top-3 left-3 bg-cf-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Flagship
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4 md:p-5 flex flex-col flex-grow">
                      <span className="text-[10px] md:text-xs text-cf-charcoal/50 font-bold uppercase tracking-wider mb-1 block">
                        {product.category.replace("_", " ")}
                      </span>
                      <h3 className="font-bold text-sm md:text-base text-cf-navy mb-1 line-clamp-1 group-hover:text-cf-green transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-cf-charcoal/60 text-xs line-clamp-1 mb-3">
                        {product.short_tagline}
                      </p>
                      
                      <div className="mt-auto pt-3 border-t border-cf-sky/10 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] md:text-[10px] text-cf-charcoal/40 block">Starting from</span>
                          <span className="text-cf-green font-extrabold text-sm md:text-base">Rs {price}</span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-cf-navy text-white flex items-center justify-center group-hover:bg-cf-green transition-all shadow-sm group-hover:scale-105">
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

      {/* Full-bleed Navy + Sky-Blue Sourcing Story Section */}
      <section className="relative py-24 bg-gradient-to-br from-cf-navy via-cf-navy to-[#000d2d] text-white">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(146,204,252,0.15),transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Story Text */}
            <div className="space-y-6 max-w-xl">
              <span className="text-cf-sky font-bold text-xs tracking-widest uppercase block">Our Heritage</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight">
                Crafting Freshness, Sourced from Nature
              </h2>
              <p className="text-cf-sky/80 text-sm md:text-base leading-relaxed">
                Nestled in the pristine agricultural heartlands, our partner farms are home to healthy cows that graze on organic, nutrient-dense grass. This traditional farm ecosystem is the secret behind the unmatched rich texture of our milk and the golden granularity of our slow-cooked Desi Ghee.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-cf-sky/20">
                <div>
                  <h4 className="text-3xl font-extrabold text-cf-green">4 Hours</h4>
                  <p className="text-xs text-cf-sky/70 mt-1">Average time from farm milking to packaging</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-cf-sky">Zero</h4>
                  <p className="text-xs text-cf-sky/70 mt-1">Preservatives, hormones, or standardizers used</p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/about"
                  className="inline-block bg-cf-green hover:bg-cf-green/90 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-all text-sm md:text-base hover:scale-[1.02]"
                >
                  Read Our Full Sourcing Story
                </Link>
              </div>
            </div>

            {/* Farm Visual / Graphic Box */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cf-sky/25 to-cf-green/25 rounded-3xl blur-2xl opacity-30" />
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 bg-cf-sky/20 rounded-full flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Verified Farm Sourcing</h3>
                    <p className="text-xs text-cf-sky/60">Strict 10-point purity check</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-cf-green text-lg">✓</span>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Grass-Fed Feed Program</h4>
                      <p className="text-xs text-cf-sky/70">Cows feed on natural green alfalfa and clover, enhancing Omega-3 content.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cf-green text-lg">✓</span>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Cold Chain Delivery Guarantee</h4>
                      <p className="text-xs text-cf-sky/70">Temperature monitored continuously under 4°C to avoid bacterial growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cf-green text-lg">✓</span>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Traditional Brass Simmering</h4>
                      <p className="text-xs text-cf-sky/70">Our ghee is clarified slowly in small batches for authentic granules.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}