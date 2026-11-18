import type { CockpitStats, FanPost, LeaderboardRow, Match, MemoryTicket, MonumentBrick, NewsItem, Player, Product, StandingRow, Wallpaper } from "@/types";
import { MATCHES } from "@/mocks/matches";
import { STANDINGS } from "@/mocks/standings";
import { PLAYERS } from "@/mocks/players";
import { NEWS } from "@/mocks/news";
import { WALLPAPERS } from "@/mocks/wallpapers";
import { FAN_POSTS, LEADERBOARDS, MEMORY_TICKETS, SOLD_BRICKS } from "@/mocks/fans";
import { COCKPIT } from "@/mocks/cockpit";
import { PRODUCTS } from "@/mocks/store";

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
  products: (): Promise<Product[]> => reply(PRODUCTS),
  product: (id: string): Promise<Product | null> => reply(PRODUCTS.find((p) => p.id === id) ?? null),
};
