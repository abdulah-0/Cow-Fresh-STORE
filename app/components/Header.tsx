"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import Link from "next/link";
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
      <header
        className="sticky top-0 z-40"
        style={{
          background: "#001A57",
          boxShadow: "0 2px 24px rgba(0,10,40,0.35)",
        }}
      >
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300"
              style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
              <span className="text-white font-bold text-lg md:text-xl font-heading">C</span>
            </div>
            <span className="text-xl md:text-2xl font-bold font-heading tracking-tight text-white">
              Cow <span style={{ color: "#45C517" }}>Fresh</span>
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
                  className="font-semibold text-sm transition-colors relative py-1"
                  style={{ color: isActive ? "#45C517" : "rgba(255,255,255,0.82)" }}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#45C517" }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Admin link */}
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-full transition-all"
              style={{ color: pathname === "/admin/dashboard" ? "#45C517" : "rgba(255,255,255,0.75)" }}
              title="Admin Dashboard"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Account Profile link */}
            <Link
              href="/account"
              className="p-2 rounded-full transition-all"
              style={{ color: pathname === "/account" ? "#45C517" : "rgba(255,255,255,0.75)" }}
              title="Customer Account"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="p-2 rounded-full transition-all relative"
              style={{ color: "rgba(255,255,255,0.85)" }}
              aria-label="Open cart drawer"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white font-bold text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 shadow-sm"
                  style={{ background: "#45C517", borderColor: "#001A57" }}>
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full transition-all"
              style={{ color: "rgba(255,255,255,0.85)" }}
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ background: "#001e6a", borderTop: "1px solid rgba(146,204,252,0.15)" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: isActive ? "rgba(69,197,23,0.15)" : "transparent",
                    color: isActive ? "#45C517" : "rgba(255,255,255,0.8)",
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
