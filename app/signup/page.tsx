"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        const userProfile = {
          fullName,
          email,
          phone,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("cow_fresh_customer_user", JSON.stringify(userProfile));
      }
      setIsSubmitting(false);
      setSuccessMessage("Account created successfully! Redirecting to your account...");
      
      setTimeout(() => {
        router.push("/account");
      }, 1000);
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
          <h1 className="text-3xl font-serif font-bold text-[#12201A]">Create Account</h1>
          <p className="text-xs font-sans text-[#1F3B2C]/70">
            Join Cow Fresh for faster checkout, order tracking, and exclusive dairy offers.
          </p>
        </div>

        {successMessage ? (
          <div className="bg-[#FAF6EF] border border-[#C9A876]/40 text-[#12201A] p-4 rounded-2xl text-center text-xs font-sans font-semibold space-y-2">
            <span className="text-2xl block">🎉</span>
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
                placeholder="e.g. Abdullah Khan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
                placeholder="e.g. customer@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
                placeholder="e.g. 03310377703"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#12201A] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#C9A876]/40 rounded-xl text-sm text-[#12201A] focus:outline-none focus:ring-2 focus:ring-[#B5652E]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#12201A] hover:bg-[#B5652E] text-[#FAF6EF] font-sans font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#C9A876]/20 text-center space-y-2 text-xs font-sans text-[#1F3B2C]/70">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#B5652E] hover:underline">
              Sign In
            </Link>
          </p>
          <Link href="/" className="inline-block font-medium text-[#12201A] hover:underline">
            &larr; Return to Storefront
          </Link>
        </div>

      </div>
    </main>
  );
}
