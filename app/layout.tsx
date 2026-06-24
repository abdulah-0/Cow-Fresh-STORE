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
          <footer className="bg-[#001A57] text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2026 Cow Fresh. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}