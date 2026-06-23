import Image from "next/image";
import Link from "next/link";

const allProducts = [
  { id: "1", name: "Almond Milk", slug: "almond-milk", category: "Milk (Bottle)", tagline: "100% Natural Almond Milk", image: "/images/products/almond-milk/almond_doodh.png", price: 199, variants: ["500ml", "1L"] },
  { id: "2", name: "Lassi", slug: "lassi", category: "Lassi", tagline: "Refreshing Yogurt Drink", image: "/images/products/lassi/lassi.png", price: 120, variants: ["250ml cup", "500ml bottle", "1L jug"] },
  { id: "3", name: "Milk (Packets)", slug: "milk-packet", category: "Milk (Packet)", tagline: "Farm Fresh Milk", image: "/images/products/milk-packet/milk.png", price: 90, variants: ["250ml", "500ml", "1L"] },
  { id: "4", name: "Yogurt (Packets)", slug: "yogurt-packet", category: "Yogurt", tagline: "Probiotic Rich Yogurt", image: "/images/products/yogurt-packet/yogurt.png", price: 120, variants: ["200g", "500g", "1kg"] },
  { id: "5", name: "Desi Ghee", slug: "desi-ghee", category: "Ghee", tagline: "Premium Clarified Butter", image: "/images/products/ghee/desi_ghee.png", price: 650, variants: ["250g jar", "500g jar", "1kg jar"] },
];

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#001A57]">Our Products</h1>
      <p className="text-[#1C1C1E]/70 mb-10">Fresh dairy products delivered to your doorstep</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {allProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="relative aspect-square bg-gradient-to-b from-[#92CCFC]/20 to-white p-4">
                <Image src={product.image} alt={product.name} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base md:text-lg mb-1 text-[#001A57]">{product.name}</h3>
                <p className="text-[#45C517] font-bold text-sm md:text-base mb-2">From Rs {product.price}</p>
                <p className="text-xs text-[#1C1C1E]/60 line-clamp-1">{product.tagline}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.variants.map((v) => (
                    <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-[#92CCFC]/30 text-[#001A57]">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}