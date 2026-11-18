import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBadge, ProductCard, ProductOrder, ProductPrice } from "~/components/store";
import { STAGE, productImage } from "~/components/storeShared";
import { Container, SectionTitle } from "~/components/site";
import { PRODUCTS } from "@/mocks/store";
import { discountPercent, formatPrice } from "@/utils/format";

/** Ürün sayfaları derleme sırasında üretilir (veri sabit) */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/magaza/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  return product ? { title: product.name, description: `${product.name} · Batman Petrolspor resmi mağazası.` } : {};
}

/**
 * Ürün sayfası: solda sahne zemininde büyük şeffaf ürün fotoğrafı, sağda kategori, ad, fiyat (indirimde kazançla),
 * seçenekler ve "Sipariş ver"; altında aynı kategoriden ürünler. Geniş ekranda bilgi sütunu kaydırırken yerinde kalır.
 */
export default async function ProductPage({ params }: PageProps<"/magaza/[id]">) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const onSale = product.old_price != null;

  return (
    <Container className="mt-8">
      <nav aria-label="Sayfa yolu" className="text-sm text-ink-secondary">
        <Link href="/magaza" className="font-medium hover:text-ink">
          Mağaza
        </Link>
        <span className="mx-2 text-ink-muted">/</span>
        <span>{product.category}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div className={`relative aspect-square overflow-hidden rounded-hero ${STAGE}`}>
          <Image src={productImage(product.image)} alt={product.name} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-6 drop-shadow-2xl md:p-10" />
          <div className="absolute left-5 top-5">
            <ProductBadge product={product} />
          </div>
        </div>

        <div className="md:sticky md:top-28 md:self-start md:py-4">
          <p className="text-xs font-medium tracking-wide text-brand-strong">{product.category.toLocaleUpperCase("tr-TR")}</p>
          <h1 className="heading mt-2 text-5xl md:text-7xl">{product.name}</h1>
          <div className="mt-5">
            <ProductPrice product={product} large />
            {onSale ? (
              <p className="mt-1 text-sm font-medium text-success">
                %{discountPercent(product.old_price!, product.price)} indirim · {formatPrice(product.old_price! - product.price)} kazanç
              </p>
            ) : null}
          </div>
          <div className="mt-8">
            <ProductOrder product={product} />
          </div>
          <dl className="mt-8 divide-y divide-mono-line rounded-box bg-mono-fill px-5 text-sm">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-ink-secondary">Mağaza</dt>
              <dd className="font-medium">Batman Petrolspor resmi mağazası</dd>
            </div>
            {product.note ? (
              <div className="py-4">
                <dt className="text-ink-secondary">Bilgi</dt>
                <dd className="mt-1">{product.note}</dd>
              </div>
            ) : null}
          </dl>
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
