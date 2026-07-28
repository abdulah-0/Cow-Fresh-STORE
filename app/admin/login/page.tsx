"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("cow_fresh_admin_email");
      if (storedEmail === "cowfreshdairy@gmail.com") {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (emailInput.trim().toLowerCase() !== "cowfreshdairy@gmail.com") {
        setLoginError("Unauthorized email. Access is restricted to cowfreshdairy@gmail.com.");
        setIsSubmitting(false);
        return;
      }

      if (passwordInput !== "cowfreshadmin") {
        setLoginError("Invalid security passcode.");
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cow_fresh_admin_email", "cowfreshdairy@gmail.com");
      }
      
      router.push("/admin/dashboard");
    }, 800);
  };

  return (
    <main className="container mx-auto px-4 py-16 flex items-center justify-center bg-[#FAF6EF] min-h-[85vh]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#C9A876]/30 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-3">
          <div className="relative w-12 h-12 mx-auto">
            <Image
              src="/images/cowfresh_logo.png"
              alt="Cow Fresh Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#12201A]">Admin Staff Login</h1>
          <p className="text-xs font-sans text-[#1F3B2C]/70">
            Secure sign in for Cow Fresh administration control panel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-center font-sans">
              ⚠️ {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
              placeholder="cowfreshdairy@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1.5">
              Passcode
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#12201A] hover:bg-[#B5652E] text-[#FAF6EF] font-sans font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Verifying Admin Credentials..." : "Sign In to Admin Dashboard"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#C9A876]/20 text-center space-y-3">
          <div className="bg-[#FAF6EF] border border-[#C9A876]/30 p-3 rounded-2xl text-[10px] font-mono text-[#12201A] text-left">
            <strong>Admin Credentials:</strong> Email <code className="font-bold select-all">cowfreshdairy@gmail.com</code> & passcode <code className="font-bold select-all">cowfreshadmin</code>.
          </div>
          <Link href="/" className="inline-block text-xs font-sans font-medium text-[#12201A] hover:underline">
            &larr; Return to Storefront
          </Link>
        </div>

      </div>
    </main>
  );
}
