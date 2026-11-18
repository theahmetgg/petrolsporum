import tokens from "./tokens";

/**
 * Açık palet (statik). Modül seviyesinde okunduğu için tema değişince güncellenmez;
 * temaya duyarlı bileşenler `useColors()` / `useTheme()` kullanır.
 */
export const colors = tokens.colors;
export type Palette = typeof tokens.colors;
export const palettes: Record<"light" | "dark", Palette> = tokens.palettes;

export type Tone = "brand" | "success" | "danger" | "warning" | "info" | "neutral";

/** Bir paletten tonlara göre ön plan ve yumuşak zemin renkleri üretir (rozet, ikon kutusu vb.). */
export const getToneColors = (palette: Palette): Record<Tone, { fg: string; bg: string }> => ({
  brand: { fg: palette.brand.strong, bg: palette.brand.soft },
  success: { fg: palette.success.DEFAULT, bg: palette.success.soft },
  danger: { fg: palette.danger.DEFAULT, bg: palette.danger.soft },
  warning: { fg: palette.warning.DEFAULT, bg: palette.warning.soft },
  info: { fg: palette.info.DEFAULT, bg: palette.info.soft },
  neutral: { fg: palette.ink.secondary, bg: palette.mono.fillStrong },
});

/** Fotoğraf/kapak üstündeki karartma rengi, verilen opaklıkta: `scrim(0.45)` → "rgba(12,6,6,0.45)" */
export const scrim = (opacity: number): string => {
  const value = parseInt(tokens.colors.scrim.DEFAULT.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
};

/** CSS değişkenleri (NativeWind `vars()` girdisi): "--color-brand" → "222 22 6" */
export const cssVariables: Record<"light" | "dark", Record<string, string>> = {
  light: tokens.toCssVariables(tokens.colors),
  dark: tokens.toCssVariables(tokens.darkColors),
};
