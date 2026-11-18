import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "~/components/store";
import { Container } from "~/components/site";
import { FEATURED_PRODUCT_ID, PRODUCTS } from "@/mocks/store";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = { title: "Mağaza", description: "Batman Petrolspor resmi mağazası: 2026-27 sezon formaları, taraftar ürünleri, çocuk ve aksesuar." };

/**
 * Mağaza: üstte yeni sezon forması vitrini (imza gradyan), altında kategori hapları ve ürün ızgarası.
 * Ürünler kulübün mağazasındaki 56 ürünün tamamıdır (mobil uygulamayla aynı veri).
 */
export default function StorePage() {
  const featured = PRODUCTS.find((p) => p.id === FEATURED_PRODUCT_ID)!;
  const newSeason = PRODUCTS.filter((p) => p.is_new);

  return (
    <>
      <section className="bg-signature rounded-b-block">
        <Container className="grid items-center gap-8 pb-10 pt-12 md:grid-cols-[1.1fr_1fr] md:pb-14 md:pt-16">
          <div>
            <p className="heading text-lg text-white/85">2026-27 sezonu</p>
            <h1 className="heading mt-2 text-6xl text-white md:text-8xl">Yeni sezon formaları</h1>
            <p className="mt-4 max-w-md text-base text-white/85">Sahadaki formalar, taraftar ürünleri ve aksesuarlar. Kırmızı beyazı üstünde taşı.</p>
            <Link href={`/magaza/${featured.id}`} className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-[var(--scrim)] hover:opacity-90">
              {featured.name} · {formatPrice(featured.price)}
            </Link>
          </div>
          {/* Yeni sezon formaları: beyaz kartlarda, yana kaydırılır */}
          <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {newSeason.map((product, i) => (
              <li key={product.id} className={`w-36 shrink-0 md:w-auto ${i >= 3 ? "md:hidden" : ""}`}>
                <Link href={`/magaza/${product.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-box bg-white">
                    <Image src={`/store/${product.image}.jpg`} alt="" fill priority={i < 3} sizes="(min-width: 768px) 16vw, 144px" className="object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-2 truncate text-xs font-medium text-white">{product.name.replace("2026-2027 ", "")}</p>
                  <p className="tabular text-xs text-white/80">{formatPrice(product.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="mt-10">
        <ProductGrid products={PRODUCTS} />
      </Container>
    </>
  );
}
