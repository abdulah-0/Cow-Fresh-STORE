export default function AdminDashboard() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#001A57]">Admin Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-lg font-semibold mb-2">Total Products</h3><p className="text-3xl font-bold text-[#45C517]">5</p></div>
        <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-lg font-semibold mb-2">Total Orders</h3><p className="text-3xl font-bold text-[#001A57]">0</p></div>
        <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-lg font-semibold mb-2">Pending Orders</h3><p className="text-3xl font-bold text-[#92CCFC]">0</p></div>
        <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-lg font-semibold mb-2">Revenue</h3><p className="text-3xl font-bold text-[#1C1C1E]">Rs 0</p></div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <p className="text-[#1C1C1E]/70">No orders yet.</p>
      </div>
    </main>
  );
}