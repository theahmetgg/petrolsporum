import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBadge, ProductCard, ProductOrder, ProductPrice } from "~/components/store";
import { Container, SectionTitle } from "~/components/site";
import { PRODUCTS } from "@/mocks/store";

/** Ürün sayfaları derleme sırasında üretilir (veri sabit) */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/magaza/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  return product ? { title: product.name, description: `${product.name} · Batman Petrolspor resmi mağazası.` } : {};
}

/** Ürün sayfası: büyük fotoğraf, ad, fiyat, seçenekler ve "Sipariş ver"; altında aynı kategoriden ürünler. */
export default async function ProductPage({ params }: PageProps<"/magaza/[id]">) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Container className="mt-8">
      <Link href="/magaza" className="text-sm font-medium text-ink-secondary hover:text-ink">
        ← Mağaza
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-hero bg-white">
          <Image src={`/store/${product.image}.jpg`} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute left-4 top-4">
            <ProductBadge product={product} />
          </div>
        </div>

        <div className="md:py-4">
          <p className="text-xs font-medium text-brand-strong">{product.category}</p>
          <h1 className="heading mt-2 text-5xl md:text-6xl">{product.name}</h1>
          <div className="mt-4">
            <ProductPrice product={product} large />
          </div>
          <div className="mt-8">
            <ProductOrder product={product} />
          </div>
          {product.note ? (
            <div className="mt-8 rounded-box bg-mono-fill p-5">
              <p className="text-sm font-medium">Bilgi</p>
              <p className="mt-1 text-sm text-ink-secondary">{product.note}</p>
            </div>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="mt-20">
          <SectionTitle title="Benzer ürünler" href="/magaza" linkLabel="Tüm ürünler" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
