import type { PlayerLine } from "@/types";

/**
 * Saha dizilişleri. Koordinatlar sahanın yüzdesidir: x soldan sağa (0-100), y hücum edilen kaleden kendi
 * kalemize (0 üst, 100 alt). Yuva sırası sabittir: kaleci, defans (sağdan sola), orta saha, forvet.
 * Saha bileşeni (`Pitch`) hem maç detayındaki "Kadro" sekmesinde hem "İlk 11'ini Kur"da bunu kullanır.
 */
export interface FormationSlot {
  x: number;
  y: number;
  line: PlayerLine;
}

export type FormationKey = "4-3-3" | "4-2-3-1" | "4-4-2" | "3-5-2";

const GK: FormationSlot = { x: 50, y: 88, line: "GK" };
const BACK_FOUR: FormationSlot[] = [
  { x: 85, y: 70, line: "DEF" },
  { x: 62, y: 75, line: "DEF" },
  { x: 38, y: 75, line: "DEF" },
  { x: 15, y: 70, line: "DEF" },
];

export const FORMATIONS: Record<FormationKey, FormationSlot[]> = {
  "4-3-3": [
    GK,
    ...BACK_FOUR,
    { x: 73, y: 50, line: "MID" },
    { x: 50, y: 56, line: "MID" },
    { x: 27, y: 50, line: "MID" },
    { x: 81, y: 25, line: "FWD" },
    { x: 50, y: 17, line: "FWD" },
    { x: 19, y: 25, line: "FWD" },
  ],
  "4-2-3-1": [
    GK,
    ...BACK_FOUR,
    { x: 63, y: 57, line: "MID" },
    { x: 37, y: 57, line: "MID" },
    { x: 81, y: 36, line: "MID" },
    { x: 50, y: 38, line: "MID" },
    { x: 19, y: 36, line: "MID" },
    { x: 50, y: 16, line: "FWD" },
  ],
  "4-4-2": [
    GK,
    ...BACK_FOUR,
    { x: 85, y: 46, line: "MID" },
    { x: 62, y: 51, line: "MID" },
    { x: 38, y: 51, line: "MID" },
    { x: 15, y: 46, line: "MID" },
    { x: 63, y: 20, line: "FWD" },
    { x: 37, y: 20, line: "FWD" },
  ],
  "3-5-2": [
    GK,
    { x: 73, y: 74, line: "DEF" },
    { x: 50, y: 77, line: "DEF" },
    { x: 27, y: 74, line: "DEF" },
    { x: 88, y: 49, line: "MID" },
    { x: 68, y: 53, line: "MID" },
    { x: 50, y: 57, line: "MID" },
    { x: 32, y: 53, line: "MID" },
    { x: 12, y: 49, line: "MID" },
    { x: 63, y: 20, line: "FWD" },
    { x: 37, y: 20, line: "FWD" },
  ],
};

export const FORMATION_KEYS = Object.keys(FORMATIONS) as FormationKey[];
