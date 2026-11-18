import React from "react";
import { ActivityIndicator, PressableProps, View, ViewStyle, StyleProp } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useColors, type Palette } from "@/theme";
import { AppText } from "./AppText";
import { BUTTON_PRESS_SCALE, PressableBox } from "./PressableBox";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "destructive";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, { height: number; paddingX: number; icon: number; text: "small" | "body" }> = {
  sm: { height: 36, paddingX: 16, icon: 16, text: "small" },
  md: { height: 44, paddingX: 18, icon: 18, text: "body" },
  lg: { height: 50, paddingX: 22, icon: 18, text: "body" },
};

// Tasarım sistemi §4.3: ana eylem siyah hap (koyu temada açık hap), ikincil gri kutu rengi; gölge yok.
const getVariants = (colors: Palette): Record<Variant, { bg: string; pressedBg: string; fg: string; border?: string }> => ({
  primary: { bg: colors.mono.solid, pressedBg: colors.mono.solid, fg: colors.mono.onSolid },
  secondary: { bg: colors.mono.fillStrong, pressedBg: colors.mono.line, fg: colors.ink.DEFAULT },
  // Eski adı: ikincil ile aynı görünür
  outline: { bg: colors.mono.fillStrong, pressedBg: colors.mono.line, fg: colors.ink.DEFAULT },
  ghost: { bg: "transparent", pressedBg: colors.mono.fillStrong, fg: colors.ink.DEFAULT },
  danger: { bg: colors.danger.soft, pressedBg: colors.danger.border, fg: colors.danger.DEFAULT },
  // Geri alınamaz işlemler için dolu kırmızı (sil, engelle, çıkış onayı)
  destructive: { bg: colors.danger.DEFAULT, pressedBg: colors.danger.pressed, fg: colors.ink.inverse },
});

export interface ButtonProps extends Omit<PressableProps, "style" | "children"> {
  title: string;
  variant?: Variant;
  size?: Size;
  /** Yazının solundaki ikon */
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
  /** Eski prop; yeni dilde butonlarda gölge yok, yok sayılır. */
  shadow?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Standart buton bileşeni. Tüm CTA'lar bu bileşeni kullanır. */
export function Button({
  title,
  variant = "primary",
  size = "md",
  icon: Icon,
  rightIcon: RightIcon,
  loading = false,
  fullWidth = false,
  shadow: _shadow,
  disabled,
  borderRadius,
  style,
  ...rest
}: ButtonProps) {
  const s = SIZE[size];
  const v = getVariants(useColors())[variant];
  const isDisabled = disabled || loading;

  return (
    <PressableBox
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
      pressScale={BUTTON_PRESS_SCALE}
      style={(pressed) => [
        {
          height: s.height,
          paddingHorizontal: s.paddingX,
          borderRadius: borderRadius ?? 999,
          backgroundColor: pressed ? v.pressedBg : v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: disabled && !loading ? 0.4 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {Icon ? <Icon size={s.icon} color={v.fg} strokeWidth={1.5} /> : null}
          <AppText variant={s.text} weight="medium" color={v.fg} numberOfLines={1}>
            {title}
          </AppText>
          {RightIcon ? <RightIcon size={s.icon} color={v.fg} strokeWidth={1.5} /> : null}
        </View>
      )}
    </PressableBox>
  );
}
