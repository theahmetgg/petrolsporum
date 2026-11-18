import React, { useMemo, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Download } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, ColorIconBox, ListRowSkeleton, Pill, PressableBox, SectionHeader, Surface } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { TabHeading } from "@/components/common/TabHeading";
import { useWallpapers } from "@/hooks/queries";
import { imageSource } from "@/mocks/images";
import { WALLPAPER_CATEGORIES } from "@/mocks/wallpapers";
import { formatNumber } from "@/utils/format";
import { radius, spacing, useColors } from "@/theme";

const COLUMN_GAP = 10;

/**
 * Galeri sekmesi (prototip ekran 6): duvar kağıtları iki sütunlu dikey ızgarada, üstte kategori hapları.
 * Görsele dokununca kilit ekranı önizlemesi açılır. Altta Tarihçe bağlantısı.
 */
export default function GalleryTab() {
  const colors = useColors();
  const tabBarHeight = useTabBarHeight();
  const { width } = useWindowDimensions();
  const { data: wallpapers } = useWallpapers();
  const [category, setCategory] = useState<(typeof WALLPAPER_CATEGORIES)[number]>("Tümü");

  const items = useMemo(() => (wallpapers ?? []).filter((w) => category === "Tümü" || w.category === category), [wallpapers, category]);
  const tileWidth = Math.floor((width - spacing.screen * 2 - COLUMN_GAP) / 2);
  const tileHeight = Math.round(tileWidth * (16 / 9));

  return (
    <Screen withBottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: tabBarHeight + spacing.section }}>
        <View style={{ paddingHorizontal: spacing.screen }}>
          <TabHeading title="Galeri" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 8, paddingVertical: 14 }}>
          {WALLPAPER_CATEGORIES.map((c) => (
            <Pill key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.screen }}>
          {!wallpapers ? (
            <ListRowSkeleton count={3} />
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: COLUMN_GAP }}>
              {items.map((item) => (
                <PressableBox
                  key={item.id}
                  onPress={() => router.push(`/gallery/${item.id}`)}
                  pressScale={BOX_PRESS_SCALE}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}, kilit ekranında önizle`}
                  style={() => ({ width: tileWidth, gap: 6 })}
                >
                  <Image source={imageSource(item.image)} style={{ width: tileWidth, height: tileHeight, borderRadius: radius.box, backgroundColor: colors.mono.fill }} contentFit="cover" transition={150} />
                  <View style={{ paddingHorizontal: 4 }}>
                    <AppText variant="small" numberOfLines={1}>
                      {item.title}
                    </AppText>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Download size={12} color={colors.ink.muted} strokeWidth={1.75} />
                      <AppText variant="caption" tone="muted">
                        {formatNumber(item.download_count)} · {item.category}
                      </AppText>
                    </View>
                  </View>
                </PressableBox>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Kültür" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface onPress={() => router.push("/history")} chevron padding={14}>
              <ColorIconBox name="history" size={48} />
              <View style={{ flex: 1 }}>
                <AppText variant="subhead">Tarihçe ve Efsaneler</AppText>
                <AppText variant="caption" tone="muted">
                  1960'tan bugüne Batman Petrolspor.
                </AppText>
              </View>
            </Surface>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
