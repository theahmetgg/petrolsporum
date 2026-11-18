import { create } from "zustand";
import type { BrickType, MonumentBrick } from "@/types";
import { SOLD_BRICKS, WALL_COLS, WALL_ROWS } from "@/mocks/fans";
import { storage } from "../utils/storage";

const KEY = "petrolspor_my_bricks";

interface BrickState {
  myBricks: MonumentBrick[];
  hydrate: () => Promise<void>;
  /** Demo satın alma: ödeme alınmaz; duvarda boş bir yer seçilir, tuğla ve sertifika numarası oluşur */
  buy: (brick_type: BrickType, owner_name: string, message: string) => MonumentBrick | null;
  /** Demo: kendi tuğlalarını siler (sunumu baştan göstermek için) */
  clear: () => void;
}

const persist = (bricks: MonumentBrick[]) => storage.setItem(KEY, JSON.stringify(bricks)).catch(() => {});

/** Duvarda dolu yerler: örnek satılmış tuğlalar + kullanıcının aldıkları */
const takenKeys = (mine: MonumentBrick[]) => new Set([...SOLD_BRICKS, ...mine].map((b) => `${b.row}-${b.col}`));

/** Boş yer seçimi: alttan yukarı, ortadan kenarlara (duvar aşağıdan örülür, yeni tuğla göz hizasına yakın düşer) */
function findFreeSpot(mine: MonumentBrick[]): { row: number; col: number } | null {
  const taken = takenKeys(mine);
  const mid = (WALL_COLS - 1) / 2;
  const cols = Array.from({ length: WALL_COLS }, (_, c) => c).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
  for (let row = WALL_ROWS - 1; row >= 0; row--) {
    for (const col of cols) {
      if (!taken.has(`${row}-${col}`)) return { row, col };
    }
  }
  return null;
}

/**
 * Kullanıcının anıt duvarı tuğlaları (demo). Ödeme yoktur: "Satın al" butonu demo penceresi açar ve tuğlayı
 * yalnız bu telefonda oluşturur. Faz 3'te ödeme ve sunucu kaydı eklenir (mağaza kesintisi için Ar-Ge belgesi 10.1).
 */
export const useBrickStore = create<BrickState>((set, get) => ({
  myBricks: [],

  hydrate: async () => {
    try {
      const raw = await storage.getItem(KEY);
      if (raw) set({ myBricks: JSON.parse(raw) });
    } catch {
      // Bozuk kayıt: boş başlanır
    }
  },

  buy: (brick_type, owner_name, message) => {
    const mine = get().myBricks;
    const spot = findFreeSpot(mine);
    if (!spot) return null;
    const serial = SOLD_BRICKS.length + mine.length + 1001;
    const brick: MonumentBrick = {
      id: `my-brick-${Date.now()}`,
      brick_type,
      owner_name: owner_name.trim(),
      message: message.trim(),
      certificate_no: `BP-AD-${String(serial).padStart(5, "0")}`,
      ...spot,
      is_mine: true,
    };
    const myBricks = [...mine, brick];
    set({ myBricks });
    persist(myBricks);
    return brick;
  },

  clear: () => {
    set({ myBricks: [] });
    persist([]);
  },
}));
