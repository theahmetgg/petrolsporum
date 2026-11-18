import React, { memo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import type { NewsItem } from "@/types";
import { AppText, Surface } from "@/components/ui";
import { imageSource } from "@/mocks/images";
import { formatLongDate } from "@/utils/format";
import { radius } from "@/theme";

/** Haber satırı: solda küçük fotoğraf, sağda başlık (en çok iki satır) ve altında kategori · tarih. */
export const NewsRow = memo(function NewsRow({ item, onPress }: { item: NewsItem; onPress: () => void }) {
  return (
    <Surface onPress={onPress} accessibilityLabel={item.title}>
      <Image source={imageSource(item.image)} style={{ width: 84, height: 64, borderRadius: radius.thumb }} contentFit="cover" transition={150} />
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="small" numberOfLines={2}>
          {item.title}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {item.category} · {formatLongDate(item.published_at)}
        </AppText>
      </View>
    </Surface>
  );
});
