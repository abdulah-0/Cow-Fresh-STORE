"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <main className="container mx-auto px-4 py-20 text-center bg-cf-off-white min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <svg className="animate-spin h-10 w-10 text-cf-green" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-cf-navy font-bold text-sm">Navigating to Admin Control Center...</p>
      </div>
    </main>
  );
}
