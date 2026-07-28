import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { Header } from "@/app/components/Header";
import { MobileBottomNav } from "@/app/components/MobileBottomNav";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cow Fresh - Farm Fresh Dairy Products",
  description: "Direct-to-consumer dairy e-commerce store selling almond milk, lassi, milk packets, yogurt packets, and desi ghee.",
  icons: {
    icon: "/images/cowfresh_logo.png",
    shortcut: "/images/cowfresh_logo.png",
    apple: "/images/cowfresh_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-sans antialiased bg-ivory text-pine-deep`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <MobileBottomNav />
          <footer className="bg-[#12201A] text-[#FAF6EF] pt-16 pb-16 md:pb-8 border-t border-[#C9A876]/20">
            <div className="container mx-auto px-4 md:px-8">
              {/* Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#C9A876]/15">
                {/* Brand Column */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src="/images/cowfresh_logo.png"
                        alt="Cow Fresh Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-serif font-semibold text-2xl tracking-tight text-[#FAF6EF]">
                      Cow <span className="italic text-[#B5652E]">Fresh</span>
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#DCEEF2]/70 max-w-sm leading-relaxed">
                    Farm-pure dairy delivered cold to your door. No preservatives, no standardisers — just honest milk the way nature intended.
                  </p>
                  
                  {/* JetBrains Mono Trust Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["🌿 100% NATURAL", "❄️ COLD-CHAIN", "🧪 LAB TESTED", "♻️ ECO PACKED"].map((b) => (
                      <span
                        key={b}
                        className="font-mono text-[9px] font-bold px-3 py-1 rounded-full border border-[#C9A876]/30 bg-[#C9A876]/10 text-[#EFE3C9]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shop Links */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#B5652E]">
                    Catalog
                  </h4>
                  {[
                    ["Almond Milk", "/products/almond-milk"],
                    ["Lassi", "/products/lassi"],
                    ["Milk Packets", "/products/milk-packet"],
                    ["Yogurt", "/products/yogurt-packet"],
                    ["Desi Ghee", "/products/desi-ghee"],
                  ].map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="block text-xs font-sans text-[#DCEEF2]/80 hover:text-[#B5652E] transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>

                {/* Company Links */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#B5652E]">
                    Navigation
                  </h4>
                  {[
                    ["About Us", "/about"],
                    ["Contact", "/contact"],
                    ["My Account", "/account"],
                    ["Admin Portal", "/admin/dashboard"],
                  ].map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="block text-xs font-sans text-[#DCEEF2]/80 hover:text-[#B5652E] transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom Copyright Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 font-mono text-[10px] text-[#DCEEF2]/40">
                <p>&copy; 2026 Cow Fresh. All rights reserved.</p>
                <p>Morning Pour Sourcing · Pure Dairy Standard</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}