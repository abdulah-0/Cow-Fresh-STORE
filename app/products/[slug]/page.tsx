import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const products = [
  { id: "1", name: "Almond Milk", slug: "almond-milk", category: "Milk (Bottle)", tagline: "100% Natural Almond Milk", description: "Premium almond milk made with carefully selected almonds, rich in protein and calcium.", image: "/images/products/almond-milk/almond_doodh.png", price: 199, compareAtPrice: 250, variants: [{ label: "500ml", price: 199, compareAtPrice: 250, isDefault: true }, { label: "1L", price: 350, compareAtPrice: 400 }], nutrition: { calories: "30", protein: "1g", carbs: "1g", fat: "2.5g", calcium: "450mg" } },
  { id: "2", name: "Lassi", slug: "lassi", category: "Lassi", tagline: "Refreshing Yogurt Drink", description: "Traditional yogurt-based drink, perfect for hot days.", image: "/images/products/lassi/lassi.png", price: 120, compareAtPrice: 150, variants: [{ label: "250ml cup", price: 120, compareAtPrice: 150, isDefault: true }, { label: "500ml bottle", price: 220, compareAtPrice: 250 }, { label: "1L jug", price: 380, compareAtPrice: 420 }], nutrition: { calories: "120", protein: "2g", carbs: "18g", fat: "3g", calcium: "200mg" } },
  { id: "3", name: "Milk (Packets)", slug: "milk-packet", category: "Milk (Packet)", tagline: "Farm Fresh Milk", description: "Fresh, pasteurized milk in convenient packets.", image: "/images/products/milk-packet/milk.png", price: 90, compareAtPrice: 100, variants: [{ label: "250ml", price: 90, compareAtPrice: 100, isDefault: true }, { label: "500ml", price: 170, compareAtPrice: 200 }, { label: "1L", price: 340, compareAtPrice: 380 }], nutrition: { calories: "42", protein: "3.4g", carbs: "5g", fat: "1g", calcium: "280mg" } },
  { id: "4", name: "Yogurt (Packets)", slug: "yogurt-packet", category: "Yogurt", tagline: "Probiotic Rich Yogurt", description: "Creamy, tangy yogurt packed with probiotics.", image: "/images/products/yogurt-packet/yogurt.png", price: 120, compareAtPrice: 140, variants: [{ label: "200g", price: 120, compareAtPrice: 140, isDefault: true }, { label: "500g", price: 280, compareAtPrice: 320 }, { label: "1kg", price: 540, compareAtPrice: 600 }], nutrition: { calories: "60", protein: "3.5g", carbs: "4g", fat: "2g", calcium: "200mg" } },
  { id: "5", name: "Desi Ghee", slug: "desi-ghee", category: "Ghee", tagline: "Premium Clarified Butter", description: "Traditional clarified butter, rich in healthy fats.", image: "/images/products/ghee/desi_ghee.png", price: 650, compareAtPrice: 750, variants: [{ label: "250g jar", price: 650, compareAtPrice: 750, isDefault: true }, { label: "500g jar", price: 1250, compareAtPrice: 1400 }, { label: "1kg jar", price: 2450, compareAtPrice: 2800 }], nutrition: { calories: "120", protein: "0.2g", carbs: "0g", fat: "13g", calcium: "15mg" } },
];

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center"><Link href="/" className="text-[#45C517] hover:underline">Home</Link><span className="mx-2 text-[#1C1C1E]/40">/</span></li>
          <li className="flex items-center"><Link href="/products" className="text-[#45C517] hover:underline">Products</Link><span className="mx-2 text-[#1C1C1E]/40">/</span></li>
          <li className="text-[#1C1C1E]">{product.name}</li>
        </ol>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-square bg-gradient-to-b from-[#92CCFC]/20 to-white rounded-3xl p-8">
          <Image src={product.image} alt={product.name} fill className="object-contain p-8" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#92CCFC]/30 text-[#001A57] mb-3">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#001A57]">{product.name}</h1>
          <p className="text-[#45C517] font-semibold text-sm mb-4">{product.tagline}</p>
          <div className="mb-6">
            <p className="text-3xl font-bold text-[#001A57]">Rs {defaultVariant.price}</p>
            {defaultVariant.compareAtPrice && <p className="text-gray-400 line-through text-lg">Rs {defaultVariant.compareAtPrice}</p>}
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#001A57]">Select Size</h2>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button key={v.label} className={`px-4 py-2 rounded-lg border-2 transition-colors ${v.isDefault ? "border-[#45C517] bg-[#45C517]/10 text-[#45C517] font-semibold" : "border-[#92CCFC]/30 text-[#1C1C1E] hover:border-[#45C517]"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-[#001A57]">Description</h2>
            <p className="text-[#1C1C1E]/70">{product.description}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-[#001A57]">Nutrition Info</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.nutrition).map(([key, value]) => (
                <div key={key} className="flex justify-between bg-[#92CCFC]/10 px-3 py-2 rounded-lg">
                  <span className="text-[#1C1C1E]/60 capitalize">{key}</span>
                  <span className="font-semibold text-[#001A57]">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full bg-[#45C517] hover:bg-[#45C517]/90 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg">Add to Cart</button>
        </div>
      </div>
    </main>
  );
}