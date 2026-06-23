export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#001A57]">About Cow Fresh</h1>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
        <div className="space-y-4 text-[#1C1C1E]/70">
          <p>Cow Fresh is a direct-to-consumer dairy e-commerce store born from a passion for providing the freshest, most nutritious dairy products to households across Pakistan and South Asia.</p>
          <p>Our journey began with a simple mission: to deliver farm-fresh dairy products that you can trust. We source our milk, yogurt, ghee, and specialty items directly from verified farms.</p>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Our Commitment</h3>
          <ul className="space-y-2 text-[#1C1C1E]/70">
            <li className="flex items-start"><span className="text-[#45C517] mr-2">✓</span><span>100% natural and preservative-free products</span></li>
            <li className="flex items-start"><span className="text-[#45C517] mr-2">✓</span><span>Sustainable farming practices</span></li>
            <li className="flex items-start"><span className="text-[#45C517] mr-2">✓</span><span>Fast delivery to ensure freshness</span></li>
          </ul>
        </div>
      </div>
    </main>
  );
}