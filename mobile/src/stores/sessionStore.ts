import { create } from "zustand";
import type { FanProfile } from "@/types";
import { makeFanProfile } from "@/mocks/fans";
import { storage } from "../utils/storage";

const SESSION_KEY = "petrolspor_session";

interface SessionState {
  fan: FanProfile | null;
  /** Açılışta kayıtlı oturum okunana kadar true */
  isLoading: boolean;
  init: () => Promise<void>;
  /** Sahte giriş / üyelik: girilen ad ve e-postayla örnek profil oluşturur */
  signIn: (full_name: string, email: string) => Promise<void>;
  /** Üye olmadan devam: misafir profili */
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  /** PetrolPuan ekler (tahmin puanı vb.) */
  addPuan: (points: number) => void;
}

const save = (fan: FanProfile | null) =>
  (fan ? storage.setItem(SESSION_KEY, JSON.stringify(fan)) : storage.removeItem(SESSION_KEY)).catch(() => {});

/**
 * SAHTE OTURUM (prototip). Şifre denetlenmez, sunucuya gidilmez; profil telefonda saklanır, uygulama kapanıp
 * açılınca giriş tekrar sorulmaz. Faz 2'de Batman360'taki oturum deposu (giriş, kayıt, token yenileme) buraya taşınır;
 * ekranlar yalnız `fan`, `signIn`, `signOut` kullandığı için değişmez.
 */
export const useSessionStore = create<SessionState>((set, get) => ({
  fan: null,
  isLoading: true,

  init: async () => {
    try {
      const raw = await storage.getItem(SESSION_KEY);
      set({ fan: raw ? (JSON.parse(raw) as FanProfile) : null, isLoading: false });
    } catch {
      set({ fan: null, isLoading: false });
    }
  },

  signIn: async (full_name, email) => {
    const fan = makeFanProfile(full_name.trim(), email.trim().toLowerCase());
    set({ fan });
    await save(fan);
  },

  signInGuest: async () => {
    const fan = makeFanProfile("Misafir Taraftar", "", true);
    set({ fan });
    await save(fan);
  },

  signOut: async () => {
    set({ fan: null });
    await save(null);
  },

  addPuan: (points) => {
    const fan = get().fan;
    if (!fan || !points) return;
    const next = { ...fan, petrol_puan: fan.petrol_puan + points };
    set({ fan: next });
    save(next);
  },
}));
