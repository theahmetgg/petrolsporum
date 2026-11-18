import type { StandingRow } from "@/types";

/**
 * Trendyol 1. Lig puan durumu, 14. hafta sonu (kaynak: petrolspor.com "Lig Tablosu", 18 Kasım 2026).
 * Sıra: puan, sonra averaj. Kaynak atılan / yenen golü ayrı vermiyor; yalnız averaj var.
 */
export const STANDINGS: StandingRow[] = [
  { team_id: "bursaspor", played: 14, won: 10, drawn: 2, lost: 2, goal_diff: 18, points: 32 },
  { team_id: "kayserispor", played: 14, won: 9, drawn: 3, lost: 2, goal_diff: 22, points: 30 },
  { team_id: "igdir-fk", played: 14, won: 8, drawn: 4, lost: 2, goal_diff: 8, points: 28 },
  { team_id: "keciorengucu", played: 14, won: 7, drawn: 5, lost: 2, goal_diff: 10, points: 26 },
  { team_id: "batman-petrolspor", played: 14, won: 7, drawn: 3, lost: 4, goal_diff: 3, points: 24 },
  { team_id: "mardin-1969", played: 13, won: 6, drawn: 4, lost: 3, goal_diff: 5, points: 22 },
  { team_id: "bodrum-fk", played: 14, won: 5, drawn: 6, lost: 3, goal_diff: 5, points: 21 },
  { team_id: "antalyaspor", played: 14, won: 6, drawn: 2, lost: 6, goal_diff: -1, points: 20 },
  { team_id: "fatih-karagumruk", played: 14, won: 5, drawn: 4, lost: 5, goal_diff: 4, points: 19 },
  { team_id: "vanspor", played: 14, won: 5, drawn: 3, lost: 6, goal_diff: -6, points: 18 },
  { team_id: "muglaspor", played: 14, won: 4, drawn: 6, lost: 4, goal_diff: -7, points: 18 },
  { team_id: "umraniyespor", played: 13, won: 4, drawn: 5, lost: 4, goal_diff: 4, points: 17 },
  { team_id: "sariyer", played: 14, won: 4, drawn: 5, lost: 5, goal_diff: -4, points: 17 },
  { team_id: "esenler-erokspor", played: 14, won: 3, drawn: 6, lost: 5, goal_diff: 0, points: 15 },
  { team_id: "bandirmaspor", played: 14, won: 3, drawn: 5, lost: 6, goal_diff: 0, points: 14 },
  { team_id: "pendikspor", played: 14, won: 3, drawn: 5, lost: 6, goal_diff: -10, points: 14 },
  { team_id: "manisa-fk", played: 13, won: 3, drawn: 4, lost: 6, goal_diff: -2, points: 13 },
  { team_id: "sivasspor", played: 14, won: 2, drawn: 7, lost: 5, goal_diff: -6, points: 13 },
  { team_id: "istanbulspor", played: 14, won: 2, drawn: 2, lost: 10, goal_diff: -21, points: 8 },
  { team_id: "boluspor", played: 13, won: 1, drawn: 1, lost: 11, goal_diff: -22, points: 4 },
];

/** Tablo bölgeleri (1. Lig): ilk 2 doğrudan Süper Lig, 3-7 play-off, son 4 küme düşer */
export const ZONES = { promotion: 2, playoff: 7, relegationFrom: 17 } as const;
