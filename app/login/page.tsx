"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
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
      
      // Redirect to dashboard
      router.push("/admin/dashboard");
    }, 800);
  };

  return (
    <main className="container mx-auto px-4 py-16 flex items-center justify-center bg-cf-off-white min-h-[85vh]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-cf-sky/15 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: "linear-gradient(90deg, #45C517, #001A57)" }} />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#45C517,#37a012)" }}>
            <span className="text-white font-bold text-2xl font-heading">C</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-cf-navy">Staff Portal Sign In</h1>
          <p className="text-xs text-cf-charcoal/60 mt-1">
            Access to Cow Fresh administration tools
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-center">
              ⚠️ {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-cf-off-white border border-cf-sky/30 rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all"
              placeholder="cowfreshdairy@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cf-navy uppercase tracking-wider mb-1.5">
              Passcode
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-cf-off-white border border-cf-sky/30 rounded-xl text-sm text-cf-navy placeholder-cf-charcoal/30 focus:outline-none focus:ring-2 focus:ring-cf-green transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm hover:scale-[1.01] flex items-center justify-center gap-2"
            style={{ backgroundColor: "#45C517", color: "#FFFFFF" }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying Credentials...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-cf-sky/15 text-center space-y-3">
          <div className="bg-cf-sky/10 border border-cf-sky/25 p-3.5 rounded-2xl text-[10px] text-cf-navy leading-relaxed text-left">
            <strong>Dev Credentials:</strong> Use email <code className="bg-white px-1 py-0.5 rounded border text-xs font-bold select-all">cowfreshdairy@gmail.com</code> and passcode <code className="bg-white px-1 py-0.5 rounded border text-xs font-bold select-all">cowfreshadmin</code>.
          </div>
          <Link href="/" className="inline-block text-xs font-semibold text-cf-navy hover:text-cf-green hover:underline">
            &larr; Return to Public Store
          </Link>
        </div>
      </div>
    </main>
  );
}
