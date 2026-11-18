import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import type { StatusBarStyle } from "expo-status-bar";
import { useThemeStore, type ThemePreference, type ThemeScheme } from "../stores/themeStore";
import { palettes, getToneColors, type Palette, type Tone } from "./palette";

export interface AppTheme {
  /** Kullanıcı tercihi: Sistem / Açık / Koyu */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  /** Etkin şema (tercih "system" ise cihazın modu) */
  scheme: ThemeScheme;
  isDark: boolean;
  /** Etkin palet — inline stillerde `colors.*` yerine kullanılır */
  colors: Palette;
  toneColors: Record<Tone, { fg: string; bg: string }>;
  /** Açık/koyu zemin üstündeki ekranlar için status bar ikon rengi */
  statusBarStyle: StatusBarStyle;
}

/** Etkin şema: tercih "system" ise cihazın görünümü izlenir. */
/**
 * Zorunlu şema (tema kapsamı, `ThemeScope`): verilirse alt ağaçta kullanıcı tercihi yerine bu şema kullanılır
 * (ör. koyu medya ekranındaki yorumlar penceresi her zaman koyu; kullanıcı kararı 12 Kasım 2026).
 */
export const ForcedSchemeContext = createContext<ThemeScheme | null>(null);

export function useThemeScheme(): ThemeScheme {
  const forced = useContext(ForcedSchemeContext);
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useColorScheme();
  if (forced) return forced;
  if (preference !== "system") return preference;
  return systemScheme === "dark" ? "dark" : "light";
}

/** Tema bilgisi + etkin palet. Tema değişince bileşeni yeniden çizer. */
export function useTheme(): AppTheme {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const scheme = useThemeScheme();

  return useMemo(() => {
    const palette = palettes[scheme];
    return {
      preference,
      setPreference,
      scheme,
      isDark: scheme === "dark",
      colors: palette,
      toneColors: getToneColors(palette),
      statusBarStyle: scheme === "dark" ? "light" : "dark",
    };
  }, [preference, setPreference, scheme]);
}

/** Yalnızca etkin palet: `const colors = useColors();` */
export function useColors(): Palette {
  return palettes[useThemeScheme()];
}
