"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Product, ProductCategory } from "@/types";
import { CATEGORY_COVERS, PRODUCT_FILTERS, STORE_PAGE_SIZE, matchesFilter, type ProductFilter } from "@/mocks/store";
import { discountPercent, formatPrice } from "@/utils/format";
import { STAGE, productImage } from "./storeShared";

/** Ürün rozeti: "YENİ" ya da indirim oranı */
export function ProductBadge({ product }: { product: Product }) {
  const sale = product.old_price != null;
  if (!sale && !product.is_new) return null;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold tracking-wide ${sale ? "bg-brand-fill text-white" : "bg-mono-solid text-mono-onSolid"}`}>
      {sale ? `%${discountPercent(product.old_price!, product.price)}` : "YENİ"}
    </span>
  );
}

/** Fiyat: ölçüye göre değişiyorsa aralık; yanında üstü çizili eski fiyat; indirimli fiyat kırmızı */
export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const text = product.price_max ? `${formatPrice(product.price)} – ${formatPrice(product.price_max)}` : formatPrice(product.price);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`tabular font-bold ${large ? "text-3xl" : "text-sm"} ${product.old_price != null ? "text-brand-strong" : ""}`}>{text}</span>
      {product.old_price != null ? <s className={`tabular text-ink-muted ${large ? "text-lg" : "text-xs"}`}>{formatPrice(product.old_price)}</s> : null}
    </p>
  );
}

/**
 * Ürün kartı: sahne zemininde şeffaf ürün fotoğrafı, sol üstte rozet, altında kategori, ad ve fiyat. Üstüne gelince
 * kart hafifçe yükselir, ürün büyür ve "İncele" çıkar. Fotoğraf ekrandaki boyuta göre küçültülür ve görünür olunca
 * yüklenir (next/image).
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/magaza/${product.id}`} className="group block">
      <div className={`relative aspect-square overflow-hidden rounded-box ${STAGE} transition-transform duration-300 group-hover:-translate-y-1`}>
        <Image
          src={productImage(product.image)}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-3 drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.07]"
        />
        <div className="absolute left-3 top-3">
          <ProductBadge product={product} />
        </div>
        <span className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-mono-solid px-4 py-2 text-xs font-semibold text-mono-onSolid opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          İncele
        </span>
      </div>
      <div className="mt-3 px-1">
        <p className="text-[11px] font-medium tracking-wide text-ink-muted">{product.category.toLocaleUpperCase("tr-TR")}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-10 text-sm font-medium">{product.name}</h3>
        <div className="mt-1">
          <ProductPrice product={product} />
        </div>
      </div>
    </Link>
  );
}

const CATEGORIES: ProductCategory[] = ["Forma", "Giyim", "Çocuk", "Aksesuar"];

/**
 * Mağazanın gövdesi: koleksiyon kutuları (kategoriye götürür) + kategori hapları + sayfa sayfa ürün ızgarası.
 * İlk açılışta 12 ürün çizilir; "Daha fazla göster" sonraki 12'yi ekler. Böylece 56 ürünün fotoğrafları bir anda
 * değil, gerektikçe istenir.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<ProductFilter>("Tümü");
  const [count, setCount] = useState(STORE_PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);
  const list = useMemo(() => products.filter((p) => matchesFilter(p, filter)), [products, filter]);
  const shown = list.slice(0, count);

  const choose = (next: ProductFilter, scroll = false) => {
    setFilter(next);
    setCount(STORE_PAGE_SIZE);
    if (scroll) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <h2 className="heading mb-5 text-3xl md:text-4xl">Koleksiyonlar</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATEGORIES.map((category) => {
          const total = products.filter((p) => p.category === category).length;
          return (
            <li key={category}>
              <button type="button" onClick={() => choose(category, true)} className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-box text-left ${STAGE}`}>
                <Image
                  src={productImage(CATEGORY_COVERS[category] ?? "p1")}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-contain px-4 pb-16 pt-4 drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-x-4 bottom-4">
                  <span className="heading block text-3xl">{category}</span>
                  <span className="text-xs text-ink-muted">{total} ürün</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div ref={gridRef} className="scroll-mt-28 pt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="heading text-3xl md:text-4xl">Tüm ürünler</h2>
          <p className="text-xs text-ink-muted" aria-live="polite">
            {list.length} ürün
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Kategori">
          {PRODUCT_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => choose(f)}
              aria-pressed={filter === f}
              className={`h-11 shrink-0 rounded-full px-5 text-sm font-medium ${filter === f ? "bg-mono-solid text-mono-onSolid" : "bg-mono-fillStrong text-ink hover:bg-surface-sunken"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i < 4} />
            </li>
          ))}
        </ul>

        {count < list.length ? (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setCount((c) => c + STORE_PAGE_SIZE)} className="rounded-full bg-mono-fillStrong px-7 py-3 text-sm font-semibold hover:bg-surface-sunken">
              Daha fazla göster ({list.length - count} ürün daha)
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Ürün sayfasındaki seçim ve sipariş alanı: beden / yaş / ölçü hapları ve "Sipariş ver" butonu.
 * SİPARİŞ HENÜZ ALINMIYOR (`STORE_ORDERING_OPEN` false; kullanıcı kararı, 19 Kasım 2026): buton vitrinde durur
 * ama basınca bilerek hiçbir şey yapmaz. Sipariş açılınca sepet / ödeme akışı buraya bağlanır.
 */
export function ProductOrder({ product }: { product: Product }) {
  const [option, setOption] = useState<string | null>(null);
  const placeOrder = () => {};

  return (
    <div className="space-y-6">
      {product.options.length ? (
        <div>
          <p className="text-sm font-medium">
            {product.option_label}
            {option ? `: ${option}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={product.option_label}>
            {product.options.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setOption((cur) => (cur === value ? null : value))}
                aria-pressed={option === value}
                className={`h-12 min-w-12 rounded-full px-4 text-sm font-medium ${option === value ? "bg-mono-solid text-mono-onSolid" : "bg-mono-fillStrong text-ink hover:bg-surface-sunken"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <button type="button" onClick={placeOrder} className="h-14 w-full rounded-full bg-mono-solid text-base font-semibold text-mono-onSolid hover:opacity-90 sm:w-auto sm:px-16">
        Sipariş ver
      </button>
    </div>
  );
}
