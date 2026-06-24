import { getProductBySlug, getProducts } from "@/app/lib/db";
import { ProductDetailClient } from "@/app/components/ProductDetailClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Dynamically generate metadata for each product to boost SEO!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: "Product Not Found - Cow Fresh",
    };
  }

  return {
    title: `${product.name} - Cow Fresh`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Farm Fresh Dairy`,
      description: product.description,
      images: [{ url: product.images[0]?.image_url || "/images/placeholder.png" }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch product on the server
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Fetch all products to pass as related recommendations
  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.category !== "ghee")
  );

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs md:text-sm mb-8 bg-white px-5 py-3.5 rounded-2xl border border-cf-sky/15 shadow-sm inline-block">
        <ol className="list-none p-0 inline-flex items-center space-x-2">
          <li className="flex items-center">
            <Link href="/" className="text-cf-green hover:text-cf-navy font-semibold transition-colors">
              Home
            </Link>
            <span className="mx-2 text-cf-charcoal/30">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/products" className="text-cf-green hover:text-cf-navy font-semibold transition-colors">
              Products
            </Link>
            <span className="mx-2 text-cf-charcoal/30">/</span>
          </li>
          <li className="text-cf-navy font-bold">{product.name}</li>
        </ol>
      </nav>

      {/* Render interactive product detailed client layout */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </main>
  );
}