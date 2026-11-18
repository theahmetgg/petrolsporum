import React from "react";
import { Text, TextProps } from "react-native";
import { AppFonts } from "@/lib/fonts";
import { palettes, typography, useThemeScheme, type Palette, type TypographyVariant } from "@/theme";

type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";
type TextTone = "default" | "secondary" | "muted" | "brand" | "inverse" | "success" | "danger";

/** Her varyantın varsayılan kalınlığı (tasarım sistemi §3.2: başlık ve rakamlar medium/semibold, bold yok) */
const DEFAULT_WEIGHT: Record<TypographyVariant, Weight> = {
  display: "semibold",
  title: "medium",
  headline: "medium",
  subhead: "medium",
  body: "regular",
  small: "medium",
  caption: "regular",
  metric: "medium",
  hero: "regular",
  badge: "medium",
};

const getToneColor = (colors: Palette): Record<TextTone, string> => ({
  default: colors.ink.DEFAULT,
  secondary: colors.ink.secondary,
  muted: colors.ink.muted,
  brand: colors.brand.strong,
  inverse: colors.ink.inverse,
  success: colors.success.DEFAULT,
  danger: colors.danger.DEFAULT,
});

/** Sık çizilen bileşen: ton renkleri her render'da değil, tema başına bir kez üretilir */
const TONE_COLORS = { light: getToneColor(palettes.light), dark: getToneColor(palettes.dark) };

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  weight?: Weight;
  tone?: TextTone;
  /** Tona ek olarak özel renk gerektiğinde (ör. gradient üstü yarı saydam beyaz) */
  color?: string;
  align?: "left" | "center" | "right";
}

/** `className` içinde renk sınıfı (text-ink-muted, text-white, dark:text-…) var mı? Boyut/hizalama sınıfları sayılmaz. */
const CLASS_COLOR = /(^|\s)(dark:)?text-(?!(metric|badge|caption|small|body|subhead|headline|title|display|left|center|right|justify)(\s|$))[a-z[#]/;

/**
 * Tasarım sistemindeki tek metin bileşeni.
 * Boyut/satır yüksekliği `@/theme` yazı ölçeğinden, font `AppFonts`'tan gelir.
 * Renk `tone` / `color` ile verilir; tema token'lı bir `className` rengi (ör. `text-ink-muted`) de kullanılabilir.
 */
export function AppText({
  variant = "body",
  weight,
  tone,
  color,
  align,
  style,
  className,
  ...rest
}: AppTextProps & { className?: string }) {
  const scheme = useThemeScheme();
  const [fontSize, lineHeight] = typography[variant];
  const classColor = !tone && !color && typeof className === "string" && CLASS_COLOR.test(className);
  return (
    <Text
      {...rest}
      className={className}
      style={[
        {
          fontFamily: AppFonts[weight ?? DEFAULT_WEIGHT[variant]],
          fontSize,
          lineHeight,
          ...(classColor ? null : { color: color ?? TONE_COLORS[scheme][tone ?? "default"] }),
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
