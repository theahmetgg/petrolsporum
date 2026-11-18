import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { type Tone, useColors, useTheme } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: LucideIcon;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Eski filtre çipi; yeni kodda `Pill` kullanılır. Görünümü `Pill` (beyaz zemin) ile aynıdır: seçili siyah, pasif gri kutu rengi. */
export function Chip({ label, selected = false, icon: Icon, onPress, style }: ChipProps) {
  const colors = useColors();
  const fg = selected ? colors.mono.onSolid : colors.ink.DEFAULT;
  return (
    <PressableBox
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={(pressed) => [
        {
          height: 36,
          paddingHorizontal: 14,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: selected ? colors.mono.solid : colors.mono.fillStrong,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {Icon ? <Icon size={16} color={fg} strokeWidth={1.5} /> : null}
      <AppText variant="small" weight="medium" color={fg}>
        {label}
      </AppText>
    </PressableBox>
  );
}

export interface BadgeProps {
  label: string;
  tone?: Tone;
  /** Solunda küçük durum noktası (ör. "Açık", "Yayında") */
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Küçük durum rozeti (tasarım sistemi §4.6): anlam renginin açık zemini + anlam rengi yazı, tam yuvarlak. */
export function Badge({ label, tone = "neutral", dot = false, style }: BadgeProps) {
  const { toneColors, colors } = useTheme();
  const t = toneColors[tone];
  // Nötr rozetin zemini gri kutu rengiyle aynı: kutu içinde kaybolmasın diye ince çerçeve (pasif hap gibi)
  const neutral = tone === "neutral";
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: 5,
          paddingHorizontal: 10,
          borderRadius: 999,
          backgroundColor: t.bg,

          paddingVertical: neutral ? 3 : 4,
        },
        style,
      ]}
    >
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.fg }} /> : null}
      <AppText variant="caption" weight="medium" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}
