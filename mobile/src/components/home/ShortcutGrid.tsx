import React from "react";
import { View, useWindowDimensions } from "react-native";
import { AppText, ColorIconBox, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { spacing } from "@/theme";

export interface Shortcut {
  key: string;
  label: string;
  icon: ColorIconName;
  onPress: () => void;
}

const COLUMNS = 4;

/** Kısayol ızgarası: 4 sütun, her kutuda gradyanlı ikon + altında kısa ad (en çok iki satır). */
export function ShortcutGrid({ items }: { items: Shortcut[] }) {
  const { width } = useWindowDimensions();
  const cell = Math.floor((width - spacing.screen * 2) / COLUMNS);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: spacing.screen }}>
      {items.map((item) => (
        <PressableBox
          key={item.key}
          onPress={item.onPress}
          pressScale={BOX_PRESS_SCALE}
          accessibilityRole="button"
          accessibilityLabel={item.label.replace("\n", " ")}
          style={() => ({ width: cell, alignItems: "center", gap: 8, paddingVertical: 8 })}
        >
          <ColorIconBox name={item.icon} size={56} />
          <AppText variant="caption" weight="medium" align="center" numberOfLines={2} maxFontSizeMultiplier={1.15} style={{ paddingHorizontal: 2 }}>
            {item.label}
          </AppText>
        </PressableBox>
      ))}
    </View>
  );
}
