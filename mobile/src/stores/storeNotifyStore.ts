import { create } from "zustand";
import { storage } from "../utils/storage";

const KEY = "petrolspor_store_notify";

interface StoreNotifyState {
  /** "Açılınca haber ver" seçilen ürün kimlikleri */
  ids: Record<string, true>;
  hydrate: () => Promise<void>;
  toggle: (productId: string) => boolean;
}

/**
 * Mağazada sipariş henüz alınmıyor; kullanıcı beğendiği üründe "Açılınca haber ver" seçebilir.
 * Seçimler prototipte telefonda saklanır. Sipariş açıldığında bu liste sunucuya taşınır ve bildirim gönderilir.
 */
export const useStoreNotifyStore = create<StoreNotifyState>((set, get) => ({
  ids: {},

  hydrate: async () => {
    try {
      const raw = await storage.getItem(KEY);
      if (raw) set({ ids: JSON.parse(raw) });
    } catch {
      // Bozuk kayıt: boş başlanır
    }
  },

  toggle: (productId) => {
    const ids = { ...get().ids };
    const next = !ids[productId];
    if (next) ids[productId] = true;
    else delete ids[productId];
    set({ ids });
    storage.setItem(KEY, JSON.stringify(ids)).catch(() => {});
    return next;
  },
}));
