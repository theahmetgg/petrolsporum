import React, { memo } from "react";
import { View } from "react-native";
import { SvgAst, parse } from "react-native-svg";
import { COLOR_ICONS, type ColorIconName } from "@/constants/colorIcons.generated";
import { gradients, useColors } from "@/theme";

type SvgAstNode = NonNullable<ReturnType<typeof parse>>;

/** "brand": kırmızı gradyan (koyu/açık sayfa zemini üstünde). "onBrand": beyaz gradyan (kırmızı gradyan blok üstünde). */
export type ColorIconVariant = "brand" | "onBrand";

const VARIANT_STOPS: Record<ColorIconVariant, readonly string[]> = {
  brand: gradients.icon,
  onBrand: gradients.iconOnBrand,
};

/**
 * Ayrıştırılmış ikon önbelleği: SVG metni uygulama açıkken ikon + görünüm başına yalnızca bir kez ayrıştırılır
 * (her yerleşimde yeniden ayrıştırmak kalabalık ızgaraları geç açar).
 */
const astCache = new Map<string, SvgAstNode | null>();

function getIconAst(name: string, variant: ColorIconVariant): SvgAstNode | null {
  const cacheKey = `${variant}:${name}`;
  if (astCache.has(cacheKey)) return astCache.get(cacheKey)!;
  const icon = (COLOR_ICONS as Record<string, { w: number; h: number; body: string }>)[name];
  let ast: SvgAstNode | null = null;
  if (icon) {
    const [top, bottom] = VARIANT_STOPS[variant];
    // Her SVG ayrı çizildiği için gradyan kimliği (G) çakışmaz
    const defs = `<defs><linearGradient id="G" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>`;
    try {
      ast = parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.w} ${icon.h}">${defs}${icon.body}</svg>`);
    } catch {
      ast = null;
    }
  }
  astCache.set(cacheKey, ast);
  return ast;
}

export interface ColorIconProps {
  /** `scripts/sync-color-icons.mjs` içindeki ad */
  name: ColorIconName;
  size: number;
  variant?: ColorIconVariant;
}

/**
 * Petrolspor ikon seti (karar, 18 Kasım 2026): dolu ikon + tek Petrolspor gradyanı; her ikon kendi renginde olmaz.
 * Ad listesi `scripts/sync-color-icons.mjs` içindedir (`npm run icons:sync`); gradyan renkleri `tokens.js` → `gradients.icon`.
 */
export const ColorIcon = memo(function ColorIcon({ name, size, variant = "brand" }: ColorIconProps) {
  const ast = getIconAst(name, variant);
  if (!ast) return <View style={{ width: size, height: size }} />;
  return <SvgAst ast={ast} override={{ width: size, height: size }} />;
});

export interface ColorIconBoxProps {
  name: ColorIconName;
  /** Kutu kenarı (dp); ikon kutunun %56'sı */
  size?: number;
  round?: boolean;
}

/** İkon kutusu: nötr gri zeminde (`mono.fillStrong`) gradyanlı ikon. Kısayol ızgarası ve satır başları için. */
export const ColorIconBox = memo(function ColorIconBox({ name, size = 48, round = false }: ColorIconBoxProps) {
  const colors = useColors();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : Math.round(size * 0.3),
        backgroundColor: colors.mono.fillStrong,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ColorIcon name={name} size={Math.round(size * 0.56)} />
    </View>
  );
});
