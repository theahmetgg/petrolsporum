import type { Product, ProductCategory } from "@/types";
import { PRODUCT_DATA } from "./store.data";

/**
 * MAĞAZA (kaynak: petrolspor.com/magaza, 19 Kasım 2026). Kulübün mağazasındaki 56 ürünün tamamı: adlar, fiyatlar,
 * beden / yaş / ölçü seçenekleri ve fotoğraflar siteden alındı. Ürün listesi `store.data.ts` içindedir (üretilmiş dosya).
 * İndirimli ürünlerde `old_price` sitedeki üstü çizili fiyattır. Ölçüye göre fiyatı değişen ürünlerde (bayraklar)
 * `price` en düşük, `price_max` en yüksek fiyattır.
 */
export const PRODUCTS: Product[] = PRODUCT_DATA;

/**
 * Sipariş henüz alınmıyor (karar, 19 Kasım 2026): mağaza vitrin olarak yayındadır; sepet ve ödeme yoktur.
 * Ürün sayfasında "Sipariş ver" butonu durur ama basınca bilerek hiçbir şey yapmaz (kullanıcı kararı). Sipariş
 * açılınca bu değer true olur ve sepet / ödeme akışı butona bağlanır (ödeme altyapısı Ar-Ge belgesi Faz 3).
 */
export const STORE_ORDERING_OPEN = false;

export type ProductFilter = "Tümü" | ProductCategory | "İndirim";

/** Kategori hapları: sıra vitrin önceliğidir */
export const PRODUCT_FILTERS: ProductFilter[] = ["Tümü", "Forma", "Giyim", "Çocuk", "Aksesuar", "İndirim"];

export const matchesFilter = (product: Product, filter: ProductFilter) =>
  filter === "Tümü" ? true : filter === "İndirim" ? product.old_price != null : product.category === filter;

/** Vitrinde öne çıkan ürün: yeni sezon parçalı forması */
export const FEATURED_PRODUCT_ID = "p1";

/** Bir sayfada yüklenen ürün sayısı (mobilde kaydırdıkça, web'de "Daha fazla göster" ile sonraki sayfa gelir) */
export const STORE_PAGE_SIZE = 12;

/** Kategori kutularının vitrin görseli (ürün kimliği): kategoriyi en iyi anlatan ürün */
export const CATEGORY_COVERS: Partial<Record<ProductCategory, string>> = {
  Forma: "p3",
  Giyim: "p54",
  Çocuk: "p7",
  Aksesuar: "p33",
};
