import type { InfiniteData } from "@tanstack/react-query";
import type { Page } from "@/types";

/** Sayfa boyu (backend v2 varsayılanıyla aynı) */
export const PAGE_SIZE = 20;

/** Listenin sonuna bu oranda yaklaşınca sonraki sayfa istenir (FlashList `onEndReachedThreshold`) */
export const END_REACHED_THRESHOLD = 0.5;

/** `useInfiniteQuery` → `getNextPageParam`: sıradaki `skip` ya da bitti. */
export const nextSkip = <T,>(last: Page<T>): number | undefined =>
  last.has_more ? last.skip + last.items.length : undefined;

/** Sayfaları tek listeye açar. */
export const flattenPages = <T,>(data: InfiniteData<Page<T>> | undefined): T[] =>
  data?.pages.flatMap((p) => p.items) ?? [];

/** İlk sayfadaki toplam kayıt sayısı (ör. sekme rozetleri). */
export const pageTotal = (data: InfiniteData<Page<unknown>> | undefined): number => data?.pages[0]?.total ?? 0;

/** Düz listeyi tek sayfalık zarfa çevirir (sayfalaması olmayan uçlarla aynı arayüz için). */
export const asPage = <T,>(items: T[], skip = 0): Page<T> => ({
  items,
  total: skip + items.length,
  skip,
  limit: items.length,
  has_more: false,
});

/**
 * Önbellekteki liste üzerinde öğe dönüşümü (iyimser güncellemeler için).
 * Düz dizi, `Page` ve `InfiniteData<Page>` biçimlerinin üçünü de işler; `fn` null dönerse öğe çıkarılır.
 */
export function mapCachedItems<T>(old: unknown, fn: (item: T) => T | null): unknown {
  const mapList = (list: T[]) => list.map(fn).filter((x): x is T => x !== null);
  if (Array.isArray(old)) return mapList(old as T[]);
  if (!old || typeof old !== "object") return old;
  const anyOld = old as { pages?: Page<T>[]; items?: T[] };
  if (Array.isArray(anyOld.pages)) {
    return { ...anyOld, pages: anyOld.pages.map((p) => ({ ...p, items: mapList(p.items) })) };
  }
  if (Array.isArray(anyOld.items)) return { ...anyOld, items: mapList(anyOld.items) };
  return old;
}
