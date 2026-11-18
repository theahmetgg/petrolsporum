import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { spacing, useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** "Tümü" / aksiyon bağlantısının tonu (varsayılan: default / siyah-beyaz) */
  actionTone?: "default" | "brand" | "muted";
  /** Ekran kenar boşluğu uygulansın mı (liste içinde false verin) */
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Bölüm başlığı: başlık + isteğe bağlı açıklama + "Tümü" bağlantısı. */
export function SectionHeader({
  title,
  subtitle,
  actionLabel = "Tümü",
  onAction,
  actionTone = "default",
  inset = true,
  style,
}: SectionHeaderProps) {
  const colors = useColors();
  const chevronColor =
    actionTone === "brand"
      ? colors.brand.strong
      : actionTone === "muted"
        ? colors.ink.muted
        : colors.ink.DEFAULT;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingHorizontal: inset ? spacing.screen : 0,
          marginBottom: spacing.gap,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <AppText variant="headline" weight="medium" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" tone="muted" style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {onAction ? (
        <PressableBox
          onPress={onAction}
          hitSlop={10}
          accessibilityRole="link"
          accessibilityLabel={`${title} — ${actionLabel}`}
          style={(pressed) => ({ flexDirection: "row", alignItems: "center", opacity: pressed ? 0.6 : 1 })}
        >
          <AppText variant="small" weight="medium" tone={actionTone}>
            {actionLabel}
          </AppText>
          <ChevronRight size={16} color={chevronColor} strokeWidth={1.5} />
        </PressableBox>
      ) : null}
    </View>
  );
}
