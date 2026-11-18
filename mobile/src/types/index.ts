/**
 * Ortak tipler. Alan adları Ar-Ge belgesi Bölüm 6'daki tablolarla aynı tutulur;
 * sunucu geldiğinde (Faz 2) web ile paylaşılır.
 */

/** Sayfalı liste zarfı (Batman360 sunucusuyla aynı biçim) */
export interface Page<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}
