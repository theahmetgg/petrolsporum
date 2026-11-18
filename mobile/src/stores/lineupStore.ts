import { create } from "zustand";
import { FORMATIONS, type FormationKey } from "@/constants/formations";
import { USUAL_XI } from "@/mocks/players";
import { storage } from "../utils/storage";

const KEY = "petrolspor_lineup";

/** Başlangıç dizilişi: sezonun en çok oynayan on biri */
const DEFAULT_SLOTS: (string | null)[] = USUAL_XI.numbers.map((n) => `p${n}`);
const DEFAULT_CAPTAIN = "p21";

interface LineupState {
  formation: FormationKey;
  /** Yuva sırasına göre oyuncu kimlikleri (11 yuva); boş yuva `null` */
  slots: (string | null)[];
  captainId: string | null;
  hydrate: () => Promise<void>;
  setFormation: (formation: FormationKey) => void;
  /** Oyuncuyu yuvaya koyar. Oyuncu başka yuvadaysa iki yuva yer değiştirir. */
  place: (slotIndex: number, playerId: string) => void;
  /** İki yuvanın oyuncularını değiştirir (sürükle-bırak) */
  swap: (from: number, to: number) => void;
  clearSlot: (slotIndex: number) => void;
  setCaptain: (playerId: string) => void;
  reset: () => void;
}

const persist = (s: Pick<LineupState, "formation" | "slots" | "captainId">) =>
  storage.setItem(KEY, JSON.stringify({ formation: s.formation, slots: s.slots, captainId: s.captainId })).catch(() => {});

/** "İlk 11'ini Kur" dizilişi. Prototipte telefonda saklanır. */
export const useLineupStore = create<LineupState>((set, get) => ({
  formation: USUAL_XI.formation,
  slots: DEFAULT_SLOTS,
  captainId: DEFAULT_CAPTAIN,

  hydrate: async () => {
    try {
      const raw = await storage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.formation in FORMATIONS && Array.isArray(saved.slots) && saved.slots.length === 11) {
        set({ formation: saved.formation, slots: saved.slots, captainId: saved.captainId ?? null });
      }
    } catch {
      // Bozuk kayıt: varsayılan diziliş kalır
    }
  },

  setFormation: (formation) => {
    set({ formation });
    persist(get());
  },

  place: (slotIndex, playerId) => {
    const slots = [...get().slots];
    const from = slots.indexOf(playerId);
    if (from === slotIndex) return;
    if (from >= 0) slots[from] = slots[slotIndex];
    slots[slotIndex] = playerId;
    // Kaptan sahadan çıktıysa kaptanlık boşalır
    const captainId = get().captainId && slots.includes(get().captainId) ? get().captainId : null;
    set({ slots, captainId });
    persist(get());
  },

  swap: (from, to) => {
    if (from === to) return;
    const slots = [...get().slots];
    [slots[from], slots[to]] = [slots[to], slots[from]];
    set({ slots });
    persist(get());
  },

  clearSlot: (slotIndex) => {
    const slots = [...get().slots];
    const removed = slots[slotIndex];
    slots[slotIndex] = null;
    set({ slots, captainId: removed && removed === get().captainId ? null : get().captainId });
    persist(get());
  },

  setCaptain: (playerId) => {
    set({ captainId: playerId });
    persist(get());
  },

  reset: () => {
    set({ formation: USUAL_XI.formation, slots: DEFAULT_SLOTS, captainId: DEFAULT_CAPTAIN });
    persist(get());
  },
}));
