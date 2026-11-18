import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { radius, useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";
import { LoadingMore } from "./LoadingMore";

export interface ListFooterProps {
  /** Sonraki sayfa yükleniyor */
  isFetchingNextPage?: boolean;
  /** Daha fazla sayfa var */
  hasNextPage?: boolean;
  /** Sonraki sayfa isteği başarısız oldu */
  isError?: boolean;
  onRetry?: () => void;
  /** Listede gösterilen öğe sayısı */
  itemCount: number;
  /** Sonraki sayfa yüklenirken gösterilecek öğe; verilmezse dönen gösterge (`LoadingMore`) */
  skeleton?: React.ReactNode;
  /** Ters (sohbet) listelerde veya özel durumlarda sona gelindiğinde yazılacak metin */
  endLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Sayfalı listelerin alt kısmı (O-2 standardı): sonraki sayfa yüklenirken yalnız dönen gösterge,
 * sayfa hatasında "Tekrar dene" şeridi. Kaydırdıkça yükleme; buton yok (kullanıcı kararı, 11 Kasım 2026).
 */
export function ListFooter({
  isFetchingNextPage,
  hasNextPage,
  isError,
  onRetry,
  itemCount,
  skeleton,
  endLabel,
  style,
}: ListFooterProps) {
  const colors = useColors();

  if (isError && onRetry) {
    return (
      <PressableBox
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Sonraki sayfayı tekrar yükle"
        style={() => [
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginVertical: 12,
            paddingVertical: 12,
            borderRadius: radius.control,
            borderWidth: 1,
            borderColor: colors.danger.border,
            backgroundColor: colors.danger.soft,
          },
          style,
        ]}
      >
        <RefreshCw size={16} color={colors.danger.DEFAULT} />
        <AppText variant="small" weight="semibold" tone="danger">
          Yüklenemedi, tekrar dene
        </AppText>
      </PressableBox>
    );
  }

  if (isFetchingNextPage) {
    return <View style={style}>{skeleton ?? <LoadingMore />}</View>;
  }

  if (!hasNextPage && itemCount > 0 && endLabel) {
    return (
      <AppText variant="caption" tone="muted" align="center" style={[{ paddingVertical: 16 }, style as any]}>
        {endLabel}
      </AppText>
    );
  }

  return null;
}
