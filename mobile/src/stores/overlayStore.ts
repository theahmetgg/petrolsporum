import type { ReactNode } from "react";
import { create } from "zustand";

/**
 * Tam ekran katmanların (`FullScreenOverlay`) içeriği. Kök düzendeki `OverlayHost` bunları ana pencerede,
 * gezinme yığınının (Stack) üstünde çizer. Eklenme sırası çizim sırasıdır: son açılan en üstte.
 */
interface OverlayEntry {
  key: string;
  node: ReactNode;
}

interface OverlayState {
  entries: OverlayEntry[];
  upsert: (key: string, node: ReactNode) => void;
  remove: (key: string) => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  entries: [],
  upsert: (key, node) =>
    set((state) => {
      const index = state.entries.findIndex((entry) => entry.key === key);
      if (index < 0) return { entries: [...state.entries, { key, node }] };
      const entries = state.entries.slice();
      entries[index] = { key, node };
      return { entries };
    }),
  remove: (key) =>
    set((state) =>
      state.entries.some((entry) => entry.key === key)
        ? { entries: state.entries.filter((entry) => entry.key !== key) }
        : state
    ),
}));
