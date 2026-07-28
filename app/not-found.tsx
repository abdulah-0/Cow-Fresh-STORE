import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-20 bg-[#FAF6EF] min-h-[70vh] flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-[#C9A876]/30 p-12 text-center max-w-md shadow-sm">
        <span className="text-6xl mb-4 block">🥛</span>
        <h1 className="text-5xl font-serif font-bold mb-2 text-[#12201A]">404</h1>
        <h2 className="text-2xl font-serif font-semibold mb-3 text-[#12201A]">Page Not Found</h2>
        <p className="text-xs font-sans text-[#1F3B2C]/70 mb-8">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="inline-block bg-[#12201A] hover:bg-[#B5652E] text-[#FAF6EF] font-sans font-semibold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md">
          Return to Home →
        </Link>
      </div>
    </main>
  );
}