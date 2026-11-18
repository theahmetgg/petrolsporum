import React from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { scrim, useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";
import { useToggleProgress } from "./motion";

export interface PillProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  /**
   * surface: beyaz zeminde (seçili `mono.solid`, pasif `mono.fillStrong`, çerçevesiz)
   * gradient: imza gradyan blok içinde (cam hap, seçili beyaz)
   */
  tone?: "surface" | "gradient";
  /** Etiketin yanında soluk sayı (ör. "İşverenler 3") */
  count?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
  /** Satırı paylaşarak genişler (ör. iki sekme hapı satırın tamamını kaplar), yazı ortada */
  fill?: boolean;
}

/**
 * Kategori / filtre / sekme hapı . İkon yoktur.
 * Seçili görünüm pasif hapın üstünde ayrı bir katmandır; seçim değişince 160 ms'de belirir / kaybolur (UI thread).
 */
export function Pill({ label, selected = false, onPress, tone = "surface", count, onLayout, fill = false }: PillProps) {
  const colors = useColors();
  const onGradient = tone === "gradient";
  const p = useToggleProgress(selected);
  const selectedLayer = useAnimatedStyle(() => ({ opacity: p.value }));

  const idle = {
    bg: onGradient ? colors.glass.DEFAULT : colors.mono.fillStrong,
    border: onGradient ? colors.glass.border : colors.mono.fillStrong,
    fg: onGradient ? colors.ink.inverse : colors.ink.DEFAULT,
  };
  const active = {
    bg: onGradient ? colors.ink.inverse : colors.mono.solid,
    border: onGradient ? colors.ink.inverse : colors.mono.solid,
    // Gradyan üstündeki beyaz hapta yazı iki temada da koyu
    fg: onGradient ? scrim(1) : colors.mono.onSolid,
  };

  const content = (fg: string) => (
    <>
      <AppText variant="small" weight="medium" color={fg}>
        {label}
      </AppText>
      {count != null && count > 0 ? (
        <AppText variant="caption" color={fg} style={{ opacity: 0.6 }}>
          {count > 99 ? "99+" : count}
        </AppText>
      ) : null}
    </>
  );

  return (
    <PressableBox
      onPress={onPress}
      onLayout={onLayout}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={count != null ? `${label}, ${count}` : label}
      style={(pressed) => ({
        height: onGradient ? 36 : 40,
        paddingHorizontal: onGradient ? 14 : 16,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: fill ? 1 : undefined,
        gap: 6,
        borderWidth: 1,
        borderColor: idle.border,
        backgroundColor: idle.bg,
        overflow: "hidden",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {content(idle.fg)}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: active.border,
            backgroundColor: active.bg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          },
          selectedLayer,
        ]}
      >
        {content(active.fg)}
      </Animated.View>
    </PressableBox>
  );
}
