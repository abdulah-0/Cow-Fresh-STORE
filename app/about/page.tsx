import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-cf-off-white">
      {/* Editorial Header Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-cf-navy via-cf-navy to-[#000d2d] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(146,204,252,0.12),transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl mx-auto">
          <span className="text-cf-green font-extrabold text-xs md:text-sm tracking-widest uppercase mb-3 block">
            Our Journey & Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6">
            The Cow Fresh Story
          </h1>
          <p className="text-cf-sky/85 text-base md:text-lg leading-relaxed font-light">
            We started with a single conviction: dairy in its rawest, most natural state is a nutritional marvel. By eliminating industrial processing and middlemen, we bring back the rich flavor and pure goodness of traditional dairy, delivered cold and fresh to modern households.
          </p>
        </div>
      </section>

      {/* Grid: Pillars of Purity */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Editorial Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-cf-green font-bold text-xs tracking-widest uppercase block">
              Pillars of Purity
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-cf-navy tracking-tight">
              Honest Milk, Happy Cows, Direct Logistics
            </h2>
            <p className="text-cf-charcoal/70 text-sm md:text-base leading-relaxed">
              At Cow Fresh, we believe dairy is a pledge of trust. In a market saturated with standardized milk powders, synthetic emulsifiers, and long-life UHT products, we stand for pure, unadulterated, raw pasteurization. Our cows are raised in hygienic environments, fed on natural grass, and treated with veterinary care.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-cf-green/10 text-cf-green rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-cf-navy text-base">Zero Additives or Standardizers</h4>
                  <p className="text-xs text-cf-charcoal/60 mt-0.5">
                    We never extract cream or standardize fat levels. Our milk contains the natural fat ratios as produced by the cow, yielding natural thick cream and rich flavors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-cf-sky/20 text-cf-navy rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-cf-navy text-base">Strict Temperature Control</h4>
                  <p className="text-xs text-cf-charcoal/60 mt-0.5">
                    From the milking buckets to dairy coolers and insulated delivery vans, our cold-chain system guarantees the milk remains under 4°C, preventing spoilage naturally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-cf-navy/10 text-cf-navy rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-cf-navy text-base">Sustained Farm Welfare</h4>
                  <p className="text-xs text-cf-charcoal/60 mt-0.5">
                    We source exclusively from family farms that treat cows as partners. No hormone injections (rBST-free) are permitted, protecting cow health and milk quality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: visual accent card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-cf-sky/20 to-white border border-cf-sky/20 rounded-3xl p-8 space-y-6 shadow-sm">
            <h3 className="text-2xl font-bold font-heading text-cf-navy">Our Standards</h3>
            
            <div className="space-y-4 text-sm text-cf-charcoal/80">
              <div className="flex justify-between border-b border-cf-sky/10 pb-2">
                <span className="font-medium">Raw Purity</span>
                <span className="font-bold text-cf-green">100% Guaranteed</span>
              </div>
              <div className="flex justify-between border-b border-cf-sky/10 pb-2">
                <span className="font-medium">Hormones & Steroids</span>
                <span className="font-bold text-cf-green">0% (rBST Free)</span>
              </div>
              <div className="flex justify-between border-b border-cf-sky/10 pb-2">
                <span className="font-medium">Milking Process</span>
                <span className="font-bold text-cf-green">Touch-Free Sanitary</span>
              </div>
              <div className="flex justify-between border-b border-cf-sky/10 pb-2">
                <span className="font-medium">Delivery Speed</span>
                <span className="font-bold text-cf-green">Under 12 Hours</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="font-medium">Packaging Hygiene</span>
                <span className="font-bold text-cf-green">FDA Food Grade</span>
              </div>
            </div>

            <div className="bg-cf-navy text-white p-5 rounded-2xl space-y-2 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-cf-sky block">Farmer Partnership</span>
              <p className="text-xs leading-relaxed text-cf-sky/95">
                By purchasing Cow Fresh, you directly support local dairy farmers. We pay our farm partners 20% above wholesale market rates, encouraging sustainable dairy practices.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white border-t border-cf-sky/15 py-20 text-center">
        <div className="container mx-auto px-4 max-w-xl space-y-6">
          <span className="text-5xl">🥛</span>
          <h2 className="text-3xl font-bold font-heading text-cf-navy">Experience Pure Dairy Today</h2>
          <p className="text-cf-charcoal/70 text-sm leading-relaxed">
            Order our delicious pasteurized milk, refreshing lassis, rich yogurt, and traditional Desi Ghee. All delivered directly from farm pastures to your dining table.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block bg-cf-green hover:bg-cf-green/90 text-white font-bold py-4 px-10 rounded-full shadow-md transition-all text-base hover:scale-[1.02] hover:shadow-lg"
            >
              Shop Our Dairy Catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}