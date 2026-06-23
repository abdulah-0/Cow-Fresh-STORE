export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#001A57]">Checkout (Cash on Delivery)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Phone Number</label><input type="tel" className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
              <div><label className="block text-sm font-medium mb-1">Address</label><textarea rows={3} className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">City</label><input type="text" className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
                <div><label className="block text-sm font-medium mb-1">Postal Code</label><input type="text" className="w-full px-3 py-2 border border-[#92CCFC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45C517]" /></div>
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="mb-6 p-4 bg-[#92CCFC]/20 rounded-lg">
              <h3 className="font-semibold mb-2">Cash on Delivery</h3>
              <p className="text-sm text-[#1C1C1E]/70">Pay with cash when your order is delivered.</p>
            </div>
            <button className="w-full bg-[#45C517] hover:bg-[#45C517]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Place Order</button>
          </div>
        </div>
      </div>
    </main>
  );
}