import { useQuery } from "@tanstack/react-query";
import { cockpitService, contentService, fanService, matchService, storeService, type LeaderboardPeriod } from "@/services";

/**
 * Veri sorguları (TanStack Query). Ekranlar veriyi bu kancalarla okur; önbellek ve yükleme durumu burada yönetilir.
 * Sunucu geldiğinde sorgu anahtarları ve kancalar aynı kalır, yalnız `@/services` değişir.
 */

/** Sahte veri değişmez: yeniden istek atmaya gerek yok */
const STATIC = { staleTime: Infinity } as const;

export const useMatches = () => useQuery({ queryKey: ["matches"], queryFn: matchService.list, ...STATIC });
export const useMatch = (id: string) => useQuery({ queryKey: ["matches", id], queryFn: () => matchService.get(id), enabled: !!id, ...STATIC });
export const useStandings = () => useQuery({ queryKey: ["standings"], queryFn: matchService.standings, ...STATIC });
export const useSquad = () => useQuery({ queryKey: ["squad"], queryFn: matchService.squad, ...STATIC });

export const useNews = () => useQuery({ queryKey: ["news"], queryFn: contentService.news, ...STATIC });
export const useNewsItem = (id: string) => useQuery({ queryKey: ["news", id], queryFn: () => contentService.newsItem(id), enabled: !!id, ...STATIC });
export const useWallpapers = () => useQuery({ queryKey: ["wallpapers"], queryFn: contentService.wallpapers, ...STATIC });

export const useLeaderboard = (period: LeaderboardPeriod) =>
  useQuery({ queryKey: ["leaderboard", period], queryFn: () => fanService.leaderboard(period), ...STATIC });
export const useTickets = () => useQuery({ queryKey: ["tickets"], queryFn: fanService.tickets, ...STATIC });
export const useBricks = () => useQuery({ queryKey: ["bricks"], queryFn: fanService.bricks, ...STATIC });
export const useFanPosts = () => useQuery({ queryKey: ["fan-posts"], queryFn: fanService.posts, ...STATIC });

export const useCockpit = () => useQuery({ queryKey: ["cockpit"], queryFn: cockpitService.stats, ...STATIC });

export const useProducts = () => useQuery({ queryKey: ["products"], queryFn: storeService.products, ...STATIC });
export const useProduct = (id: string) => useQuery({ queryKey: ["products", id], queryFn: () => storeService.product(id), enabled: !!id, ...STATIC });
