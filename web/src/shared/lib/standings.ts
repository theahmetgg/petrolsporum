// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/lib/standings.ts (npm run sync)
import type { RankedStanding, StandingRow } from "@/types";

/** Canlı maçın o anki durumu: puan durumuna "maç şu an bitse" diye işlenir */
export interface LiveScore {
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
}

/** Sıralama: puan, sonra averaj; eşitlikte temel tablodaki sıra korunur */
const sortRows = (rows: StandingRow[]) =>
  rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => b.row.points - a.row.points || b.row.goal_diff - a.row.goal_diff || a.index - b.index)
    .map((x) => x.row);

/**
 * Puan durumunu sıralar. `live` verilirse canlı maçın skoru iki takımın satırına eklenir (oynadığı maç, galibiyet /
 * beraberlik / mağlubiyet, averaj, puan) ve sıra yeniden hesaplanır; `rank_change` canlı maç yüzünden kaç sıra
 * yükseldiğini (+) ya da düştüğünü (-) gösterir. Canlı puan durumu budur (Ar-Ge belgesi Bölüm 3, madde 7).
 */
export function rankStandings(base: StandingRow[], live?: LiveScore | null): RankedStanding[] {
  const baseOrder = sortRows(base);
  const baseRank = new Map(baseOrder.map((row, i) => [row.team_id, i + 1]));
  if (!live) return baseOrder.map((row, i) => ({ ...row, rank: i + 1, rank_change: 0 }));

  const diff = live.home_score - live.away_score;
  const apply = (row: StandingRow, own: number): StandingRow => ({
    ...row,
    played: row.played + 1,
    won: row.won + (own > 0 ? 1 : 0),
    drawn: row.drawn + (own === 0 ? 1 : 0),
    lost: row.lost + (own < 0 ? 1 : 0),
    goal_diff: row.goal_diff + own,
    points: row.points + (own > 0 ? 3 : own === 0 ? 1 : 0),
  });

  const updated = base.map((row) =>
    row.team_id === live.home_team_id ? apply(row, diff) : row.team_id === live.away_team_id ? apply(row, -diff) : row
  );

  return sortRows(updated).map((row, i) => ({
    ...row,
    rank: i + 1,
    rank_change: (baseRank.get(row.team_id) ?? i + 1) - (i + 1),
    live: row.team_id === live.home_team_id || row.team_id === live.away_team_id,
  }));
}
