import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { AppText } from "./AppText";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Kullanılmıyor: boş durumlarda ikon gösterilmez. Mevcut çağrılar bozulmasın diye kabul edilir. */
  icon?: LucideIcon;
  /** Kullanılmıyor: boş durumlarda ikon gösterilmez. Mevcut çağrılar bozulmasın diye kabul edilir. */
  colorIcon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Kart/raf içinde dar alan: daha küçük başlık ve boşluk */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Boş liste / veri yok ekranı (tasarım sistemi §4.6): ikonsuz; başlık + açıklama + isteğe bağlı ikincil buton. */
export function EmptyState({ title, description, actionLabel, onAction, compact, style }: EmptyStateProps) {
  return (
    <View style={[{ alignItems: "center", paddingVertical: compact ? 20 : 40, paddingHorizontal: compact ? 20 : 32 }, style]}>
      <AppText variant={compact ? "body" : "subhead"} weight="medium" align="center">
        {title}
      </AppText>
      {description ? (
        <AppText variant="small" tone="secondary" align="center" style={{ marginTop: 6 }}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="secondary" size="md" style={{ marginTop: 20, alignSelf: "center" }} />
      ) : null}
    </View>
  );
}
