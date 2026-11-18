import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface RowActionProps {
  icon: LucideIcon;
  label: string;
  /** Sil gibi yıkıcı eylem: kırmızı */
  danger?: boolean;
  onPress: () => void;
}

/**
 * Kendi kayıtlarım kutularının alt satırındaki küçük metin eylemi (Yayından kaldır / Düzenle / Sil).
 * 2. El İlanlarım, Etkinliklerim, İş Arayan İlanım, Kent Sorunlarım aynı bileşeni kullanır.
 */
export function RowAction({ icon: Icon, label, danger, onPress }: RowActionProps) {
  const { colors } = useTheme();
  const color = danger ? colors.danger.DEFAULT : colors.ink.secondary;
  return (
    <PressableBox
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={(pressed) => ({ flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, opacity: pressed ? 0.6 : 1 })}
    >
      <Icon size={14} color={color} strokeWidth={1.5} />
      <AppText variant="caption" weight="medium" color={color}>
        {label}
      </AppText>
    </PressableBox>
  );
}

/** Eylemlerin dizildiği alt satır: üstte ince çizgi, aralarında 20 */
export function RowActions({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.mono.line }}>{children}</View>
  );
}
