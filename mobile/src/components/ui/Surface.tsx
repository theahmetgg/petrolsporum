import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { radius as radiusTokens, spacing, useColors } from "@/theme";
import { BOX_PRESS_SCALE, PressableBox } from "./PressableBox";

export interface SurfaceProps {
  children: React.ReactNode;
  /** Verilirse kutu basılabilir olur (basınca hafifçe küçülür, `BOX_PRESS_SCALE`) */
  onPress?: () => void;
  /** Basılı tutunca (ör. kutunun seçenek penceresi); yalnızca `onPress` ile birlikte */
  onLongPress?: () => void;
  /** Sağda soluk ok: kutunun bir yere götürdüğünü gösterir (liste kutuları) */
  chevron?: boolean;
  /** İçerik yan yana dizilir (görsel + metin + ok); varsayılan true */
  row?: boolean;
  padding?: number;
  radius?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tasarım sisteminin kutusu : `mono.fill` zemin, çerçevesiz (referans tasarım, 9 Kasım 2026), köşe 24, iç boşluk 12.
 * Liste kutusu (ilan, haber), satıcı/sahip satırı, kısa not, anket şeridi gibi her "kutu" bununla çizilir.
 */
export function Surface({
  children,
  onPress,
  onLongPress,
  chevron = false,
  row = true,
  padding = spacing.box,
  radius = radiusTokens.box,
  accessibilityLabel,
  style,
}: SurfaceProps) {
  const colors = useColors();
  const base: ViewStyle = {
    flexDirection: row ? "row" : "column",
    alignItems: row ? "center" : "stretch",
    gap: 12,
    padding,
    borderRadius: radius,
    backgroundColor: colors.mono.fill,
  };
  const arrow = chevron ? <ChevronRight size={18} color={colors.ink.muted} strokeWidth={1.5} /> : null;

  if (!onPress) {
    return (
      <View style={[base, style]} accessibilityLabel={accessibilityLabel}>
        {children}
        {arrow}
      </View>
    );
  }
  return (
    <PressableBox
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      pressScale={BOX_PRESS_SCALE}
      style={() => [base, style as ViewStyle]}
    >
      {children}
      {arrow}
    </PressableBox>
  );
}
