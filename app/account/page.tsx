export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#001A57]">My Account</h1>
      <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Account features coming soon</h2>
        <p className="text-[#1C1C1E]/70 mb-6">Order history and saved addresses will be available here.</p>
        <a href="/" className="bg-[#45C517] hover:bg-[#45C517]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Return to Home</a>
      </div>
    </main>
  );
}