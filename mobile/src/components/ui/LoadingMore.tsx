import React from "react";
import { ActivityIndicator, View, StyleProp, ViewStyle } from "react-native";
import { useColors } from "@/theme";

export interface LoadingMoreProps {
  /** Ekran okuyucu etiketi (görünmez) */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Kaydırdıkça yüklenen listelerin altı: sonraki sayfa yüklenirken yalnız dönen gösterge.
 * Hap, yazı veya buton yok (kullanıcı kararı, 11 Kasım 2026).
 */
export function LoadingMore({ label = "Yükleniyor", style }: LoadingMoreProps) {
  const colors = useColors();
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} style={[{ alignItems: "center", paddingVertical: 20 }, style]}>
      <ActivityIndicator size="small" color={colors.ink.secondary} />
    </View>
  );
}
