import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { AppText } from "@/components/ui";
import { useColors } from "@/theme";

export interface LiveBadgeProps {
  /** Verilirse "CANLI" yerine yazılır (ör. "67'") */
  label?: string;
  /** Kırmızı zemin üstünde: beyaz hap + kırmızı yazı */
  onBrand?: boolean;
}

/** Kırmızı "CANLI" rozeti: yanıp sönen nokta + yazı. "Hareketi azalt" açıksa nokta sabit durur. */
export function LiveBadge({ label = "CANLI", onBrand = false }: LiveBadgeProps) {
  const colors = useColors();
  const reduce = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduce) return;
    pulse.value = withRepeat(withTiming(0.25, { duration: 700, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => cancelAnimation(pulse);
    // Paylaşılan değer ömür boyu sabit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const bg = onBrand ? colors.ink.inverse : colors.brand.fill;
  const fg = onBrand ? colors.brand.fill : colors.ink.inverse;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, height: 24, paddingHorizontal: 10, borderRadius: 12, backgroundColor: bg, alignSelf: "flex-start" }}>
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }, dotStyle]} />
      <AppText variant="badge" weight="bold" color={fg} style={{ letterSpacing: 0.5 }}>
        {label}
      </AppText>
    </View>
  );
}
