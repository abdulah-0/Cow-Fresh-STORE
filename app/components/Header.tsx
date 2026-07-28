"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const { itemCount, isCartOpen, openCart, closeCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
        <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/cowfresh_logo.png"
                alt="Cow Fresh Logo"
                fill
                className="object-contain"
                priority
              />
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
