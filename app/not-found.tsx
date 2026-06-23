export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-6xl font-bold mb-4 text-[#45C517]">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-[#1C1C1E]/70 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/" className="bg-[#45C517] hover:bg-[#45C517]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Return to Home</a>
      </div>
    </main>
  );
}