import { create } from "zustand";
import type { FanPostComment } from "@/types";

interface FanWallState {
  /** Beğenilen gönderi kimlikleri */
  liked: Record<string, true>;
  /** Bu oturumda yazılan yorumlar (gönderi kimliğine göre) */
  comments: Record<string, FanPostComment[]>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, author_name: string, text: string) => void;
}

/**
 * Taraftar duvarındaki beğeni ve yorumlar (demo). Bilerek kaydedilmez: yalnız ekranda çalışır, uygulama kapanınca
 * sıfırlanır (Ar-Ge belgesi 13.1, ekran 11). Gerçek sürümde sunucuya gider ve moderasyondan geçer.
 */
export const useFanWallStore = create<FanWallState>((set, get) => ({
  liked: {},
  comments: {},

  toggleLike: (postId) => {
    const liked = { ...get().liked };
    if (liked[postId]) delete liked[postId];
    else liked[postId] = true;
    set({ liked });
  },

  addComment: (postId, author_name, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: FanPostComment = { id: `local-${Date.now()}`, author_name, text: trimmed, created_at: new Date().toISOString() };
    set({ comments: { ...get().comments, [postId]: [...(get().comments[postId] ?? []), comment] } });
  },
}));
