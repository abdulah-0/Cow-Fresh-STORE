"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { itemCount, isCartOpen, openCart, closeCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = () => {
      if (typeof window !== "undefined") {
        const email = localStorage.getItem("cow_fresh_admin_email");
        setIsAdmin(email === "cowfreshdairy@gmail.com");
      }
    };
    checkAdmin();
    
    const interval = setInterval(checkAdmin, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#12201A] border-b border-[#C9A876]/20 shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Name (Fraunces Serif) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#B5652E] flex items-center justify-center text-[#FAF6EF] font-serif font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-serif font-semibold text-2xl tracking-tight text-[#FAF6EF]">
              Cow <span className="italic text-[#B5652E]">Fresh</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-sans font-medium text-xs uppercase tracking-wider transition-colors relative py-1 ${
                    isActive ? "text-[#B5652E] font-bold" : "text-[#FAF6EF]/80 hover:text-[#B5652E]"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#B5652E]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="p-2 text-[#FAF6EF]/80 hover:text-[#B5652E] transition-colors"
                title="Admin Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}

            <Link
              href="/account"
              className="p-2 text-[#FAF6EF]/80 hover:text-[#B5652E] transition-colors"
              title="Customer Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              onClick={openCart}
              className="p-2 text-[#FAF6EF]/80 hover:text-[#B5652E] transition-colors relative"
              aria-label="Open cart drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B5652E] text-[#FAF6EF] font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#12201A]">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-[#FAF6EF]/80 hover:text-[#B5652E] transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-2 bg-[#12201A] border-t border-[#C9A876]/20">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block py-2.5 px-4 rounded-xl font-sans font-semibold text-xs uppercase tracking-wider transition-all ${
                    isActive ? "bg-[#B5652E] text-[#FAF6EF]" : "text-[#FAF6EF]/80 hover:bg-[#1F3B2C]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
