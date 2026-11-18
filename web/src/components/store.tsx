"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { PRODUCT_FILTERS, STORE_PAGE_SIZE, matchesFilter, type ProductFilter } from "@/mocks/store";
import { discountPercent, formatPrice } from "@/utils/format";

/** Ürün rozeti: "YENİ" ya da indirim oranı */
export function ProductBadge({ product }: { product: Product }) {
  const sale = product.old_price != null;
  if (!sale && !product.is_new) return null;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold tracking-wide text-white ${sale ? "bg-brand-fill" : "bg-[var(--scrim)]"}`}>
      {sale ? `%${discountPercent(product.old_price!, product.price)}` : "YENİ"}
    </span>
  );
}

/** Fiyat: ölçüye göre değişiyorsa aralık; yanında üstü çizili eski fiyat */
export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const text = product.price_max ? `${formatPrice(product.price)} – ${formatPrice(product.price_max)}` : formatPrice(product.price);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`tabular font-bold ${large ? "text-2xl" : "text-sm"}`}>{text}</span>
      {product.old_price != null ? <s className={`tabular text-ink-muted ${large ? "text-base" : "text-xs"}`}>{formatPrice(product.old_price)}</s> : null}
    </p>
  );
}

/**
 * Ürün kartı: beyaz zeminde kare fotoğraf (ürün fotoğrafları beyaz zeminde çekilmiştir; kart iki temada da beyazdır),
 * sol üstte rozet, altında ad ve fiyat. Fotoğraf ekrandaki boyuta göre küçültülür ve görünür olunca yüklenir (next/image).
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/magaza/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-box bg-white">
        <Image
          src={`/store/${product.image}.jpg`}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          <ProductBadge product={product} />
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="line-clamp-2 min-h-10 text-sm">{product.name}</h3>
        <div className="mt-1">
          <ProductPrice product={product} />
        </div>
      </div>
    </Link>
  );
}

/**
 * Ürün ızgarası: kategori hapları + sayfa sayfa liste. İlk açılışta 12 ürün çizilir; "Daha fazla göster" sonraki
 * 12'yi ekler. Böylece 56 ürünün fotoğrafları bir anda değil, gerektikçe istenir.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<ProductFilter>("Tümü");
  const [count, setCount] = useState(STORE_PAGE_SIZE);
  const list = useMemo(() => products.filter((p) => matchesFilter(p, filter)), [products, filter]);
  const shown = list.slice(0, count);

  const choose = (next: ProductFilter) => {
    setFilter(next);
    setCount(STORE_PAGE_SIZE);
  };

  return (
    <div>
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
      <p className="mt-4 text-xs text-ink-muted" aria-live="polite">
        {list.length} ürün
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
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
                className={`h-11 min-w-11 rounded-full px-4 text-sm font-medium ${option === value ? "bg-mono-solid text-mono-onSolid" : "bg-mono-fillStrong text-ink hover:bg-surface-sunken"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <button type="button" onClick={placeOrder} className="h-14 w-full rounded-full bg-mono-solid text-base font-semibold text-mono-onSolid hover:opacity-90 sm:w-auto sm:px-14">
        Sipariş ver
      </button>
    </div>
  );
}
