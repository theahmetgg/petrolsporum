import { create } from "zustand";
import { Appearance } from "react-native";
import { storage } from "../utils/storage";

const THEME_PREFERENCE_KEY = "petrolspor_theme_preference";

export type ThemePreference = "system" | "light" | "dark";
export type ThemeScheme = "light" | "dark";

/**
 * Petrolspor koyu tema önceliklidir (karar, 18 Kasım 2026): tercih yapılmadıysa uygulama koyu açılır.
 * Açık tema da vardır (19 Kasım 2026): kullanıcı Profil > Görünüm ile Sistem / Açık / Koyu seçer; seçim telefonda saklanır.
 */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

/** Uygulama genelinde (native bileşenler, klavye, sistem diyalogları) görünümü tercihe sabitler. */
const applyNativeAppearance = (preference: ThemePreference) => {
  Appearance.setColorScheme(preference === "system" ? null : preference);
};

interface ThemeState {
  preference: ThemePreference;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setPreference: (preference: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: DEFAULT_THEME_PREFERENCE,
  isHydrated: false,

  hydrate: async () => {
    const stored = await storage.getItem(THEME_PREFERENCE_KEY);
    const preference = isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
    applyNativeAppearance(preference);
    set({ preference, isHydrated: true });
  },

  setPreference: async (preference) => {
    applyNativeAppearance(preference);
    set({ preference });
    await storage.setItem(THEME_PREFERENCE_KEY, preference);
  },
}));

/** Hook dışı (modül seviyesi) kullanım için etkin şema: sistem tercihi Appearance'tan okunur. */
export const getResolvedThemeScheme = (): ThemeScheme => {
  const { preference } = useThemeStore.getState();
  if (preference !== "system") return preference;
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
};
