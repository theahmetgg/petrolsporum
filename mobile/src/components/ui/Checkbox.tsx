import React from "react";
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { useColors } from "@/theme";
import { useToggleProgress } from "./motion";

/**
 * Onay kutusu ve radyo işaretleri (tasarım sistemi §4.4).
 * Yalnızca işareti çizer; dokunma alanı onu içeren satırdır (ör. seçim sheet'i satırı).
 * Seçiliyken `mono.solid`, değilken `mono.line` çerçeve. Kırmızı kullanılmaz.
 * Seçim değişince renk 160 ms'de geçer, işaret küçükten büyüyerek gelir (UI thread, Reanimated).
 */
export function Checkbox({ checked, size = 22 }: { checked: boolean; size?: number }) {
  const colors = useColors();
  const p = useToggleProgress(checked);
  const off = colors.mono.line;
  const on = colors.mono.solid;
  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ["transparent", on]),
    borderColor: interpolateColor(p.value, [0, 1], [off, on]),
  }));
  const tick = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ scale: interpolate(p.value, [0, 1], [0.4, 1]) }] }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" }, box]}
    >
      <Animated.View style={tick}>
        <Check size={Math.round(size * 0.6)} color={colors.mono.onSolid} strokeWidth={3} />
      </Animated.View>
    </Animated.View>
  );
}

export function Radio({ checked, size = 22 }: { checked: boolean; size?: number }) {
  const colors = useColors();
  const p = useToggleProgress(checked);
  const off = colors.mono.line;
  const on = colors.mono.solid;
  const ring = useAnimatedStyle(() => ({ borderColor: interpolateColor(p.value, [0, 1], [off, on]) }));
  const dot = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ scale: p.value }] }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, alignItems: "center", justifyContent: "center" }, ring]}
    >
      <Animated.View style={[{ width: size * 0.45, height: size * 0.45, borderRadius: size, backgroundColor: on }, dot]} />
    </Animated.View>
  );
}
