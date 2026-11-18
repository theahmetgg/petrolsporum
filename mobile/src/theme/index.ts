import tokens from "./tokens";
import { colors, getToneColors } from "./palette";

export { colors, palettes, getToneColors, scrim } from "./palette";
export type { Palette, Tone } from "./palette";
export const typography = tokens.typography;
export const radius = tokens.radius;
export const spacing = tokens.spacing;
export const shadows = tokens.shadows;
type GradientStops = [string, string, ...string[]];
export const gradients = tokens.gradients as {
  storyRing: GradientStops;
  signature: GradientStops;
  icon: GradientStops;
  iconOnBrand: GradientStops;
};

/** Temadan bağımsız sabit renkler: 3 tuşlu sistem barı ve tam ekran medya (duvar kağıdı önizleme, hikaye) */
export const systemColors = tokens.colors.system;
export const mediaColors = tokens.colors.media;

export type TypographyVariant = keyof typeof tokens.typography;

/** Tonlara göre ön plan ve yumuşak zemin renkleri (rozet, ikon kutusu vb.) — açık palet, statik */
export const toneColors = getToneColors(colors);

export { useTheme, useColors, useThemeScheme } from "./useTheme";
export type { AppTheme } from "./useTheme";
export { ThemeProvider, ThemeScope } from "./ThemeProvider";
export type { ThemePreference, ThemeScheme } from "../stores/themeStore";
