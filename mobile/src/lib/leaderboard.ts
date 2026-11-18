import type { LeaderboardRow } from "@/types";

/**
 * Liderlik tablosunda kullanıcının puanını günceller ve sırayı yeniden hesaplar.
 * `replace` true ise puanın yerine yazılır (haftalık tablo: o haftanın maçı), değilse üstüne eklenir (aylık, sezonluk).
 * Eşit puanda kullanıcı altta kalır (aynı puanı önce toplayan üstte sayılır).
 */
export function withMyPoints(rows: LeaderboardRow[], points: number, replace: boolean): LeaderboardRow[] {
  return rows
    .map((row) => (row.is_me ? { ...row, points: replace ? points : row.points + points } : row))
    .map((row, index) => ({ row, index }))
    .sort((a, b) => b.row.points - a.row.points || Number(!!a.row.is_me) - Number(!!b.row.is_me) || a.index - b.index)
    .map(({ row }, i) => ({ ...row, rank: i + 1 }));
}
