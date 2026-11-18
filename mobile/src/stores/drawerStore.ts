import { create } from "zustand";

/**
 * Yan menü durumu (Batman360 kalıbı). Menü kök düzende (`app/_layout.tsx`) tek kez çizilir; sekmeler `openDrawer()`
 * ile açar. Ayrı bir Android penceresi (`Modal`) kullanılmaz: o pencerede 3 tuşlu modda tuşların arkası siyah kalmıyor.
 */
interface DrawerState {
  visible: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  visible: false,
  openDrawer: () => set({ visible: true }),
  closeDrawer: () => set({ visible: false }),
}));
