import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { BOX_PRESS_SCALE, PressableBox } from "./PressableBox";
import { radius, spacing, useColors } from "@/theme";

export interface CardProps extends ViewProps {
  /** Verilirse kart basılabilir olur */
  onPress?: () => void;
  /** İç boşluk (dp). Görsel kenardan kenara ise 0 verin. */
  padding?: number;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Eski kart; yeni kodda `Surface` kullanılır. Görünümü `Surface` ile aynıdır (tasarım sistemi §4.2):
 * gri kutu rengi zemin + ince çerçeve, köşe 20, gölgesiz. `elevated` yok sayılır.
 */
export function Card({
  onPress,
  padding = spacing.card,
  elevated: _elevated,
  style,
  children,
  accessibilityLabel,
  ...rest
}: CardProps) {
  const colors = useColors();
  const base: ViewStyle = {
    backgroundColor: colors.mono.fill,
    borderRadius: radius.box,
    padding,
    overflow: "hidden",
  };

  if (onPress) {
    return (
      <PressableBox
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        pressScale={BOX_PRESS_SCALE}
        style={() => [base, style]}
      >
        {children}
      </PressableBox>
    );
  }

  return (
    <View {...rest} style={[base, style]}>
      {children}
    </View>
  );
}
