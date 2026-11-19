import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, ProductGrid } from "~/components/store";
import { productImage } from "~/components/storeShared";
import { Container, SectionTitle } from "~/components/site";
import { FEATURED_PRODUCT_ID, PRODUCTS } from "@/mocks/store";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = { title: "Mağaza", description: "Batman Petrolspor resmi mağazası: 2026-27 sezon formaları, taraftar ürünleri, çocuk ve aksesuar." };

/**
 * Mağaza. Sıra: vitrin (imza gradyan üstünde yeni sezon forması, arkada iri "2026-27") → yeni sezon formaları
 * şeridi → fırsatlar → koleksiyonlar ve tüm ürünler. Ürünler kulübün mağazasındaki 56 ürünün tamamıdır
 * (mobil uygulamayla aynı veri); fotoğrafların arka planı silinmiştir.
 */
export default function StorePage() {
  const featured = PRODUCTS.find((p) => p.id === FEATURED_PRODUCT_ID)!;
  const newSeason = PRODUCTS.filter((p) => p.is_new && p.id !== featured.id);
  const deals = PRODUCTS.filter((p) => p.old_price != null)
    .sort((a, b) => (b.old_price! - b.price) / b.old_price! - (a.old_price! - a.price) / a.old_price!)
    .slice(0, 4);

  return (
    <>
      {/* Vitrin */}
      <section className="bg-signature relative isolate overflow-hidden rounded-b-block">
        {/* Arkadaki iri sezon yazısı: yalnız süs */}
        <p aria-hidden className="heading pointer-events-none absolute -right-6 top-2 -z-10 select-none text-[30vw] leading-none text-white/10 md:text-[20rem]">
          2026-27
        </p>
        <Container className="grid items-center gap-6 pb-12 pt-12 md:grid-cols-[1fr_1.05fr] md:pb-16 md:pt-16">
          <div>
            <p className="inline-flex h-7 items-center rounded-full bg-white px-3 text-[11px] font-bold tracking-wide text-[var(--scrim)]">YENİ SEZON</p>
            <h1 className="heading mt-4 text-6xl text-white md:text-8xl">Sahadaki forma şimdi senin</h1>
            <p className="mt-4 max-w-md text-base text-white/85">2026-27 sezonunun formaları, taraftar ürünleri ve aksesuarlar. Kırmızı beyazı üstünde taşı.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/magaza/${featured.id}`} className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--scrim)] hover:opacity-90">
                {featured.name.replace("2026-2027 ", "")} · {formatPrice(featured.price)}
              </Link>
              <a href="#urunler" className="text-sm font-semibold text-white underline underline-offset-4 hover:opacity-80">
                {PRODUCTS.length} ürünü gör
              </a>
            </div>
          </div>
          <Link href={`/magaza/${featured.id}`} className="float-soft group relative mx-auto block aspect-square w-full max-w-md" aria-label={`${featured.name}, incele`}>
            <Image src={productImage(featured.image)} alt="" fill loading="eager" fetchPriority="high" sizes="(min-width: 768px) 448px, 90vw" className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105" />
          </Link>
        </Container>

        {/* Yeni sezonun diğer formaları: cam kartlarda */}
        <Container className="pb-12">
          <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {newSeason.map((product) => (
              <li key={product.id} className="w-40 shrink-0 md:w-auto">
                <Link href={`/magaza/${product.id}`} className="group flex items-center gap-3 rounded-box border border-white/25 bg-white/10 p-3 backdrop-blur hover:bg-white/20">
                  <span className="relative block h-16 w-16 shrink-0">
                    <Image src={productImage(product.image)} alt="" fill sizes="64px" className="object-contain transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{product.name.replace("2026-2027 ", "")}</span>
                    <span className="tabular text-xs text-white/80">{formatPrice(product.price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="reveal mt-14">
        <SectionTitle title="Fırsatlar" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          {deals.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>

      <Container className="reveal mt-16">
        <div id="urunler" className="scroll-mt-28">
          <ProductGrid products={PRODUCTS} />
        </div>
      </Container>
    </>
  );
}
