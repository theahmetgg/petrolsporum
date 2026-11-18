import React from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { NewsItem } from "@/types";
import { AppText, Heading, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { imageSource } from "@/mocks/images";
import { formatLongDate } from "@/utils/format";
import { radius, scrim, spacing, useColors } from "@/theme";

const GAP = 10;
const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

export interface NewsCarouselProps {
  items: NewsItem[];
  onOpen: (item: NewsItem) => void;
}

/**
 * Manşet şeridi: yana kaydırılan büyük fotoğraflı haber kartları. Kart ekrandan biraz dardır; sıradaki kartın
 * kenarı görünür, kaydırılabildiği anlaşılır. Başlık fotoğrafın altındaki karartma üstünde durur.
 */
export function NewsCarousel({ items, onOpen }: NewsCarouselProps) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const cardWidth = width - spacing.screen * 2 - 24;
  const cardHeight = Math.round(cardWidth * 0.62);

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + GAP}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: GAP }}
      renderItem={({ item }) => (
        <PressableBox
          onPress={() => onOpen(item)}
          pressScale={BOX_PRESS_SCALE}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={() => ({ width: cardWidth, height: cardHeight, borderRadius: radius.hero, overflow: "hidden", backgroundColor: colors.mono.fill })}
        >
          <Image source={imageSource(item.image)} style={FILL} contentFit="cover" transition={150} />
          <LinearGradient colors={[scrim(0), scrim(0.2), scrim(0.92)]} locations={[0, 0.45, 1]} style={FILL} />
          <View style={{ flex: 1, justifyContent: "flex-end", padding: 16, gap: 4 }}>
            <AppText variant="caption" weight="medium" color={colors.glass.text}>
              {item.category} · {formatLongDate(item.published_at)}
            </AppText>
            <Heading size="title" color={colors.ink.inverse} numberOfLines={2}>
              {item.title}
            </Heading>
          </View>
        </PressableBox>
      )}
    />
  );
}
