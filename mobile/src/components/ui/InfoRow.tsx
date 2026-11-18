import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useColors } from "@/theme";
import { AppText } from "./AppText";

export interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Listenin son satırında alt çizgi çizilmez */
  last?: boolean;
}

/**
 * Detay ekranlarının bilgi satırı (tasarım sistemi §6.2): solda ince siyah çizgi ikon, dairesiz (kullanıcı kararı)
 * + gri etiket + değer; satırlar arası ince `mono.line` çizgi. Etkinlik (bitiş, adres), iş ilanı (çalışma türü, maaş,
 * deneyim, eğitim), kampanya (en az alışveriş).
 */
export function InfoRow({ icon: Icon, label, value, last }: InfoRowProps) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.mono.line }}>
      <View style={{ width: 24, alignItems: "center" }}>
        <Icon size={20} color={colors.ink.DEFAULT} strokeWidth={1.5} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="caption" tone="muted">
          {label}
        </AppText>
        <AppText variant="small" weight="medium">
          {value}
        </AppText>
      </View>
    </View>
  );
}
