import { create } from "zustand";
import type { LucideIcon } from "lucide-react-native";

/** danger: geri alınamaz işlemler (sil, çıkış, engelle). primary: nötr onaylar (takip isteği, durum değiştir). */
export type ConfirmTone = "danger" | "primary";

export interface ConfirmOptions {
  title: string;
  message: string;
  /** Buton yalnızca net eylem fiili taşır ("Sil", "Gönder"); varsayılan metin bilerek yok. */
  confirmText: string;
  cancelText?: string;
  tone?: ConfirmTone;
  icon?: LucideIcon;
  /** Koyu medya ekranından (gönderi, hikaye) açılır: onay penceresi temadan bağımsız koyu çizilir */
  onMedia?: boolean;
}

export interface ConfirmRequest extends ConfirmOptions {
  id: number;
}

interface ConfirmState {
  request: ConfirmRequest | null;
  /** Mount sırasına göre host'lar; istekleri en son mount olan (en üstteki) host gösterir. */
  hostIds: number[];
  open: (options: ConfirmOptions) => Promise<boolean>;
  settle: (id: number, confirmed: boolean) => void;
  registerHost: (hostId: number) => void;
  unregisterHost: (hostId: number) => void;
}

let nextRequestId = 1;
const resolvers = new Map<number, (confirmed: boolean) => void>();

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  request: null,
  hostIds: [],

  open: (options) => {
    // Açık bir onay varken yenisi gelirse eskisi "vazgeçildi" sayılır
    const current = get().request;
    if (current) get().settle(current.id, false);

    const id = nextRequestId++;
    return new Promise<boolean>((resolve) => {
      resolvers.set(id, resolve);
      set({ request: { ...options, id } });
    });
  },

  // Her istek yalnızca bir kez sonuçlanır; sonraki çağrılar yok sayılır
  settle: (id, confirmed) => {
    const resolve = resolvers.get(id);
    if (!resolve) return;
    resolvers.delete(id);
    if (get().request?.id === id) set({ request: null });
    resolve(confirmed);
  },

  registerHost: (hostId) => set((state) => ({ hostIds: [...state.hostIds, hostId] })),

  unregisterHost: (hostId) => {
    const wasActive = get().hostIds[get().hostIds.length - 1] === hostId;
    set((state) => ({ hostIds: state.hostIds.filter((id) => id !== hostId) }));
    // Gösteren host kaybolursa (örn. RN Modal geri tuşuyla kapandı) bekleyen istek iptal sayılır
    const pending = get().request;
    if (wasActive && pending) get().settle(pending.id, false);
  },
}));

/**
 * Promise tabanlı onay penceresi. Onayda `true`; vazgeç, dışarı dokunma, aşağı kaydırma
 * veya geri tuşunda `false` döner. Hook dışından (store, util) da çağrılabilir.
 *
 * ```ts
 * if (await confirm({ title: "Gönderiyi sil", message: "...", confirmText: "Sil", tone: "danger" })) { ... }
 * ```
 */
export const confirm = (options: ConfirmOptions) => useConfirmStore.getState().open(options);

/** Bileşenler için `confirm` fonksiyonunu döndürür. */
export const useConfirm = () => confirm;
