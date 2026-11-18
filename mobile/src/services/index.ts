import type { CockpitStats, FanPost, LeaderboardRow, Match, MemoryTicket, MonumentBrick, NewsItem, Page, Player, Product, ProductCategory, StandingRow, Wallpaper } from "@/types";
import { MATCHES } from "@/mocks/matches";
import { STANDINGS } from "@/mocks/standings";
import { PLAYERS } from "@/mocks/players";
import { NEWS } from "@/mocks/news";
import { WALLPAPERS } from "@/mocks/wallpapers";
import { FAN_POSTS, LEADERBOARDS, MEMORY_TICKETS, SOLD_BRICKS } from "@/mocks/fans";
import { COCKPIT } from "@/mocks/cockpit";
import { CATEGORY_COVERS, PRODUCTS, STORE_PAGE_SIZE, matchesFilter, type ProductFilter } from "@/mocks/store";

/**
 * SERVİS KATMANI. Ekranlar veriyi yalnız buradan (ve `@/hooks/queries` içindeki sorgulardan) okur; `@/mocks`
 * klasörünü doğrudan içe aktarmaz. Prototipte her işlev sahte veriyi kısa bir gecikmeyle döndürür.
 * Sunucu geldiğinde (Faz 2) yalnız bu dosyanın içi değişir: her işlev aynı adla sunucuya istek atar;
 * ekranlar ve sorgular aynı kalır (Ar-Ge belgesi 11.1).
 */

/** Sahte ağ gecikmesi (ms): yükleme iskeletleri görünür olsun, ama demo akıcı kalsın */
const DELAY_MS = 180;
const reply = <T,>(data: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), DELAY_MS));

export const matchService = {
  list: (): Promise<Match[]> => reply(MATCHES),
  get: (id: string): Promise<Match | null> => reply(MATCHES.find((m) => m.id === id) ?? null),
  standings: (): Promise<StandingRow[]> => reply(STANDINGS),
  squad: (): Promise<Player[]> => reply(PLAYERS),
};

export const contentService = {
  news: (): Promise<NewsItem[]> => reply(NEWS),
  newsItem: (id: string): Promise<NewsItem | null> => reply(NEWS.find((n) => n.id === id) ?? null),
  wallpapers: (): Promise<Wallpaper[]> => reply(WALLPAPERS),
};

export type LeaderboardPeriod = "weekly" | "monthly" | "season";

export const fanService = {
  leaderboard: (period: LeaderboardPeriod): Promise<LeaderboardRow[]> => reply(LEADERBOARDS[period]),
  tickets: (): Promise<MemoryTicket[]> => reply(MEMORY_TICKETS),
  bricks: (): Promise<MonumentBrick[]> => reply(SOLD_BRICKS),
  posts: (): Promise<FanPost[]> => reply(FAN_POSTS),
  post: (id: string): Promise<FanPost | null> => reply(FAN_POSTS.find((p) => p.id === id) ?? null),
};

export const cockpitService = {
  stats: (): Promise<CockpitStats> => reply(COCKPIT),
};

export const storeService = {
  /**
   * Sayfalı ürün listesi (sunucudaki GET /products?category=&skip=&limit= karşılığı). Mobil kaydırdıkça sonraki
   * sayfayı ister; böylece 56 ürünün satırları ve fotoğrafları bir anda değil, gerektikçe yüklenir.
   */
  page: (filter: ProductFilter, skip: number, limit: number = STORE_PAGE_SIZE): Promise<Page<Product>> => {
    const list = PRODUCTS.filter((p) => matchesFilter(p, filter));
    const items = list.slice(skip, skip + limit);
    return reply({ items, total: list.length, skip, limit, has_more: skip + items.length < list.length });
  },
  product: (id: string): Promise<Product | null> => reply(PRODUCTS.find((p) => p.id === id) ?? null),
  /** Ana sayfa rafı: yeni sezon ürünleri */
  featured: (): Promise<Product[]> => reply(PRODUCTS.filter((p) => p.is_new)),
  /** Fırsatlar rafı: indirimli ürünler, indirim oranı yüksek olan önce */
  deals: (limit = 10): Promise<Product[]> =>
    reply(
      PRODUCTS.filter((p) => p.old_price != null)
        .sort((a, b) => (b.old_price! - b.price) / b.old_price! - (a.old_price! - a.price) / a.old_price!)
        .slice(0, limit)
    ),
  /** Ürün sayfası rafı: aynı kategoriden başka ürünler */
  related: (id: string, limit = 8): Promise<Product[]> => {
    const product = PRODUCTS.find((p) => p.id === id);
    return reply(product ? PRODUCTS.filter((p) => p.category === product.category && p.id !== id).slice(0, limit) : []);
  },
  /** Kategori kutuları: her kategorinin ürün sayısı ve vitrin görseli (ilk ürünü) */
  categories: (): Promise<{ category: ProductCategory; count: number; image: string }[]> =>
    reply(
      (["Forma", "Giyim", "Çocuk", "Aksesuar"] as ProductCategory[]).map((category) => {
        const list = PRODUCTS.filter((p) => p.category === category);
        return { category, count: list.length, image: CATEGORY_COVERS[category] ?? list[0].image };
      })
    ),
};
