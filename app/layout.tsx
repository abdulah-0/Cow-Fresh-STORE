import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { Header } from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Cow Fresh - Farm Fresh Dairy Products",
  description: "Direct-to-consumer dairy e-commerce store selling almond milk, lassi, milk packets, yogurt packets, and desi ghee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-cf-off-white`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer style={{ background: "linear-gradient(135deg,#001A57 0%,#000d33 100%)" }} className="text-white pt-14 pb-8">
            <div className="container mx-auto px-4">
              {/* Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
                {/* Brand */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg text-white"
                      style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
                      C
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">
                      Cow <span style={{ color: "#45C517" }}>Fresh</span>
                    </span>
                  </div>
                  <p className="text-sm text-blue-200/70 max-w-xs leading-relaxed">
                    Farm-pure dairy delivered cold to your door. No preservatives, no standardisers — just honest milk the way nature intended.
                  </p>
                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["🌿 100% Natural","❄️ Cold-Chain","🧪 Lab Tested","♻️ Eco Packed"].map((b) => (
                      <span key={b} className="text-[10px] font-bold px-3 py-1 rounded-full border border-white/15"
                        style={{ background: "rgba(69,197,23,0.12)", color: "#7ee05a" }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shop */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#92CCFC" }}>Shop</h4>
                  {[["Almond Milk","/products/almond-milk"],["Lassi","/products/lassi"],["Milk Packets","/products/milk-packet"],["Yogurt","/products/yogurt-packet"],["Desi Ghee","/products/desi-ghee"]].map(([label,href]) => (
                    <a key={href} href={href} className="block text-sm text-blue-100/70 hover:text-white transition-colors">{label}</a>
                  ))}
                </div>

                {/* Company */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#92CCFC" }}>Company</h4>
                  {[["About Us","/about"],["Contact","/contact"],["My Account","/account"],["Admin","/admin/dashboard"]].map(([label,href]) => (
                    <a key={href} href={href} className="block text-sm text-blue-100/70 hover:text-white transition-colors">{label}</a>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 text-xs text-blue-200/40">
                <p>&copy; 2026 Cow Fresh. All rights reserved.</p>
                <p>Made with ❤️ in Pakistan · Pure Dairy Since 2026</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}