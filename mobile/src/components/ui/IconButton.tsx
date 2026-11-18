import React, { useEffect, useRef } from "react";
import { PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { FadeOut, ZoomIn, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import type { LucideIcon } from "lucide-react-native";
import { useTheme, type Palette, scrim } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";
import { pop } from "./motion";

type Variant = "surface" | "soft" | "ghost" | "plain" | "overlay" | "glass" | "frost" | "danger";

const getVariants = (colors: Palette, isDark: boolean): Record<Variant, { bg: string; pressedBg: string; fg: string; border?: string; shadow?: object }> => ({
  // Beyaz zeminde: kutudan bir ton koyu gri, çerçevesiz, gölgesiz (tasarım sistemi §4.3)
  surface: { bg: colors.mono.fillStrong, pressedBg: colors.mono.line, fg: colors.ink.DEFAULT },
  // Eski adı: yeni dilde kırmızı buton yok, `surface` ile aynı görünür
  soft: { bg: colors.mono.fillStrong, pressedBg: colors.mono.line, fg: colors.ink.DEFAULT },
  danger: { bg: colors.danger.soft, pressedBg: colors.danger.border, fg: colors.danger.DEFAULT },
  ghost: { bg: "transparent", pressedBg: colors.mono.fillStrong, fg: colors.ink.DEFAULT },
  // Dairesiz ikon (başlıktaki geri oku, Papara düzeni): basınca görsel geri bildirim yok — ne daire ne soluklaşma (kullanıcı isteği, 12 Kasım 2026)
  plain: { bg: "transparent", pressedBg: "transparent", fg: colors.ink.DEFAULT },
  // Fotoğraf/kapak görseli üstünde kullanılan yarı saydam koyu daire
  // Cam: kırmızı gradyan veya kapak fotoğrafı üstünde yarı saydam beyaz daire + beyaz ikon (ana sayfa üst barı)
  frost: { bg: colors.glass.DEFAULT, pressedBg: colors.glass.pressed, fg: colors.ink.inverse, border: colors.glass.border },
  overlay: { bg: scrim(0.45), pressedBg: scrim(0.6), fg: colors.ink.inverse, border: "rgba(255,255,255,0.25)" },
  // Buzlu cam görünümü: bulanıklaştırma yerine daha opak yarı saydam zemin (expo-blur zayıf Android'lerde ağırdı)
  // Koyu temada koyu tonda kalır (beyaz cam koyu zeminde parlar, açık ikon okunmaz)
  glass: isDark
    ? { bg: scrim(0.72), pressedBg: scrim(0.85), fg: colors.ink.DEFAULT, border: "rgba(255,255,255,0.12)" }
    : { bg: "rgba(255,255,255,0.78)", pressedBg: "rgba(255,255,255,0.9)", fg: colors.ink.DEFAULT, border: "rgba(255,255,255,0.7)" },
});

export interface IconButtonProps extends Omit<PressableProps, "style" | "children"> {
  icon: LucideIcon;
  /** Ekran okuyucu etiketi (zorunlu: ikon tek başına anlam taşımaz) */
  label: string;
  variant?: Variant;
  size?: number;
  /** İkon boyutu; verilmezse butonun %48'i. Buton boyutunu değiştirmeden ikonu büyütmek için */
  iconSize?: number;
  /** İkon çizgi kalınlığı (varsayılan 1,5; büyük başlıktaki geri oku 2,25) */
  strokeWidth?: number;
  /** Sağ üstte okunmamış sayısı (0 ise gösterilmez) */
  badgeCount?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Beyaz zeminli ekranların geri oku (Papara düzeni, kullanıcı kararı 12 Kasım 2026): dairesiz, kalın (30 / 2,25),
 * basınca görsel değişiklik yok; dokunma alanı 44, ok ekran kenar boşluğuyla hizalı. Gradyan / fotoğraf üstünde kullanılmaz.
 * Kullanım: `<IconButton icon={ChevronLeft} label="Geri" onPress={goBack} {...PLAIN_BACK} />`
 */
export const PLAIN_BACK = { variant: "plain", size: 44, iconSize: 30, strokeWidth: 2.25, style: { marginLeft: -9 } } as const;

/** İkon butonu (üst bar aksiyonları, geri, paylaş, bildirim, form aksiyonları). */
export function IconButton({
  icon: Icon,
  label,
  variant = "surface",
  size = 44,
  iconSize,
  strokeWidth = 1.5,
  badgeCount = 0,
  borderRadius,
  style,
  ...rest
}: IconButtonProps) {
  const { colors, isDark } = useTheme();
  const v = getVariants(colors, isDark)[variant];
  return (
    <PressableBox
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      {...rest}
      style={(pressed) => [
        {
          width: size,
          height: size,
          borderRadius: borderRadius ?? size / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? v.pressedBg : v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
        },
        v.shadow,
        style,
      ]}
    >
      <Icon size={iconSize ?? Math.round(size * 0.48)} color={v.fg} strokeWidth={strokeWidth} />
      {badgeCount > 0 ? <CountBadge count={badgeCount} frost={variant === "frost"} /> : null}
    </PressableBox>
  );
}

/**
 * Okunmamış / etkin filtre rozeti: ilk çıkışta büyüyerek belirir, sayı artınca kısa bir "pıt" yapar,
 * sıfırlanınca solarak kaybolur (UI thread, Reanimated).
 */
function CountBadge({ count, frost }: { count: number; frost: boolean }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) pop(scale);
    prev.current = count;
  }, [count, scale]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={ZoomIn.duration(180)} exiting={FadeOut.duration(120)} pointerEvents="none" style={{ position: "absolute", top: -2, right: -2 }}>
      <Animated.View
        style={[
          {
            minWidth: 18,
            height: 18,
            paddingHorizontal: 4,
            borderRadius: 9,
            // Cam butonda rozet beyaz zemin + kırmızı yazı (kırmızı zeminde kaybolmasın)
            backgroundColor: frost ? colors.surface.DEFAULT : colors.brand.DEFAULT,
            borderWidth: frost ? 0 : 2,
            borderColor: colors.surface.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          },
          popStyle,
        ]}
      >
        <AppText variant="badge" tone={frost ? "brand" : "inverse"} maxFontSizeMultiplier={1}>
          {count > 99 ? "99+" : String(count)}
        </AppText>
      </Animated.View>
    </Animated.View>
  );
}
