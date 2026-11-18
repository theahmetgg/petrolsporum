import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  toast: { visible: boolean; message: string; type: ToastType };
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

/** Kısa bildirimin ekranda kalma süresi (ms) */
const TOAST_DURATION_MS = 3000;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Kısa bildirim (toast) durumu. Kök düzendeki `Toast` bileşeni bunu çizer.
 * Batman360'ta oturum deposunun içindeydi; burada ayrı tutulur.
 */
export const useToastStore = create<ToastState>((set) => ({
  toast: { visible: false, message: "", type: "info" },

  showToast: (message, type = "info") => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ toast: { visible: true, message, type } });
    hideTimer = setTimeout(() => set((s) => ({ toast: { ...s.toast, visible: false } })), TOAST_DURATION_MS);
  },

  hideToast: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set((s) => ({ toast: { ...s.toast, visible: false } }));
  },
}));

/** Hook dışından (store, util) kısa bildirim göstermek için */
export const showToast = (message: string, type?: ToastType) => useToastStore.getState().showToast(message, type);
