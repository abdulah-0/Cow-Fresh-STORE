"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Shop",
      href: "/products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
        </svg>
      ),
    },
    {
      name: "Cart",
      action: openCart,
      isCart: true,
      icon: (
        <div className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Account",
      href: "/account",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-slate-300 py-2 px-4 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const isActive = tab.href ? pathname === tab.href : false;
        
        if (tab.isCart) {
          return (
            <button
              key={tab.name}
              onClick={tab.action}
              className="flex flex-col items-center gap-1 text-xs font-medium py-1 transition-colors text-slate-300 hover:text-emerald-400"
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          );
        }

        return (
          <Link
            key={tab.name}
            href={tab.href!}
            className={`flex flex-col items-center gap-1 text-xs font-medium py-1 transition-colors ${
              isActive ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
