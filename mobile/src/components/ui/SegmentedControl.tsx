import React, { useEffect, useRef, useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { LucideIcon } from "lucide-react-native";
import { useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";
import { MOTION_EASE } from "./motion";

export interface SegmentOption<K extends string> {
  key: K;
  label: string;
  icon?: LucideIcon;
  /** Etiketin yanında küçük sayı (0 veya undefined ise gösterilmez) */
  count?: number;
}

export interface SegmentedControlProps<K extends string> {
  options: SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

const PAD = 3;

/**
 * İki-dört seçenekli sekme anahtarı (ör. İşverenler / İş Arayanlar, Paylaşımlar / Kaydedilenler).
 * Tasarım sistemi §4.4: gri kutu rengi kapsül, seçili dilim beyaz, gölgesiz.
 * Seçili beyaz iz, seçim değişince yeni dilime 220 ms'de kayar (UI thread); ilk ölçümde anında yerindedir.
 */
export function SegmentedControl<K extends string>({
  options,
  value,
  onChange,
  style,
  borderRadius = 999,
}: SegmentedControlProps<K>) {
  const colors = useColors();
  const innerRadius = Math.max(0, borderRadius - PAD);
  const [width, setWidth] = useState(0);
  const segW = width > 0 ? (width - PAD * 2) / options.length : 0;
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const x = useSharedValue(0);
  const lastSegW = useRef(0);

  useEffect(() => {
    if (lastSegW.current !== segW) {
      lastSegW.current = segW;
      x.value = index * segW;
      return;
    }
    x.value = withTiming(index * segW, { duration: 220, easing: MOTION_EASE });
  }, [index, segW, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[{ flexDirection: "row", backgroundColor: colors.mono.fillStrong, borderRadius, padding: PAD }, style]}
    >
      {segW > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: "absolute", top: PAD, left: PAD, bottom: PAD, width: segW, borderRadius: innerRadius, backgroundColor: colors.surface.DEFAULT },
            indicator,
          ]}
        />
      ) : null}
      {options.map((opt) => {
        const active = opt.key === value;
        const Icon = opt.icon;
        return (
          <PressableBox
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={() => ({
              flex: 1,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: innerRadius,
            })}
          >
            {Icon ? <Icon size={16} color={active ? colors.ink.DEFAULT : colors.ink.muted} strokeWidth={1.5} /> : null}
            <AppText variant="small" weight="medium" tone={active ? "default" : "muted"} numberOfLines={1}>
              {opt.label}
            </AppText>
            {opt.count ? (
              <AppText variant="caption" weight="medium" tone="muted">
                {opt.count > 99 ? "99+" : opt.count}
              </AppText>
            ) : null}
          </PressableBox>
        );
      })}
    </View>
  );
}
