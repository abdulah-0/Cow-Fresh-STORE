import { getProducts } from "@/app/lib/db";
import { ProductsCatalog } from "@/app/components/ProductsCatalog";

export const revalidate = 3600; // Revalidate catalog page every hour

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mb-12">
        <span className="text-cf-green font-bold text-xs tracking-widest uppercase mb-2 block">Fresh Selections</span>
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-cf-navy tracking-tight mb-3">
          Our Farm-Fresh Shop
        </h1>
        <p className="text-cf-charcoal/70 text-base md:text-lg">
          Enjoy natural, direct-from-source dairy products. Free delivery on all orders to ensure our dairy reaches you cold and fresh.
        </p>
      </div>

      {/* Render interactive product grid with filtering and search */}
      <ProductsCatalog initialProducts={products} />
    </main>
  );
}