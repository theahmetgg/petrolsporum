import { create } from "zustand";
import { storage } from "../utils/storage";

const KEY = "petrolspor_match_alerts";

interface MatchAlertState {
  /** Maç kimliği → "ilk 11 açıklanınca haber ver" açık mı */
  lineupAlert: Record<string, boolean>;
  hydrate: () => Promise<void>;
  /** Tercihi değiştirir ve yeni değeri döndürür */
  toggleLineupAlert: (match_id: string) => boolean;
}

/**
 * Maç bildirim tercihleri (maç günü ekranı). Tercih yalnız bu telefonda saklanır.
 * DEMO: bildirim altyapısı (Expo Push) Faz 2'de bağlanır; o zamana kadar tercih kaydedilir ama bildirim gönderilmez.
 * Sunucu geldiğinde bu tercih taraftarın bildirim ayarlarına yazılır.
 */
export const useMatchAlertStore = create<MatchAlertState>((set, get) => ({
  lineupAlert: {},

  hydrate: async () => {
    try {
      const raw = await storage.getItem(KEY);
      if (raw) set({ lineupAlert: JSON.parse(raw) });
    } catch {
      // Bozuk kayıt: varsayılan (kapalı) ile devam edilir
    }
  },

  toggleLineupAlert: (match_id) => {
    const next = !get().lineupAlert[match_id];
    const lineupAlert = { ...get().lineupAlert, [match_id]: next };
    set({ lineupAlert });
    storage.setItem(KEY, JSON.stringify(lineupAlert)).catch(() => {});
    return next;
  },
}));
