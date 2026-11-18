import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Screen } from "@/components/layout/Screen";
import { AppText, Heading, ScreenHeader, SectionHeader, Surface } from "@/components/ui";
import { CLUB, HISTORY, HISTORY_PHOTOS } from "@/mocks/club";
import { imageSource } from "@/mocks/images";
import { radius, spacing, useColors } from "@/theme";

/**
 * Tarihçe ve Efsaneler (Batman360'taki "Batman Hakkında" içerik sayfası kalıbı). Metinler ve fotoğraflar
 * kulübün sitesindendir (petrolspor.com "Hakkımızda", "Tarihçemiz").
 */
export default function HistoryScreen() {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const photoWidth = width - spacing.screen * 2 - 40;

  return (
    <Screen>
      <ScreenHeader title="Tarihçe" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: spacing.screen, gap: 6 }}>
          <Heading size="score" color={colors.brand.strong}>
            {String(CLUB.founded)}
          </Heading>
          <AppText variant="body" tone="secondary">
            {CLUB.name}, {CLUB.founded} yılında Batman'da kuruldu. Renkleri {CLUB.colors.toLocaleLowerCase("tr-TR")}. İç saha maçlarını {CLUB.stadium}'nda oynuyor.
          </AppText>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Efsane kadrolar" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={photoWidth + 10} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 10 }}>
            {HISTORY_PHOTOS.map((photo) => (
              <View key={photo.image} style={{ width: photoWidth, gap: 6 }}>
                <Image source={imageSource(photo.image)} style={{ width: photoWidth, height: Math.round(photoWidth * 0.67), borderRadius: radius.box }} contentFit="cover" transition={150} accessibilityLabel={`${photo.year} sezonu kadrosu`} />
                <AppText variant="caption" weight="medium" tone="muted">
                  {photo.year}
                </AppText>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Dönüm noktaları" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            {HISTORY.map((item) => (
              <Surface key={item.year} padding={14} style={{ alignItems: "flex-start" }}>
                <View style={{ width: 76 }}>
                  <Heading size="title" color={colors.brand.strong}>
                    {item.year}
                  </Heading>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="small" weight="medium">
                    {item.title}
                  </AppText>
                  <AppText variant="small" tone="secondary">
                    {item.text}
                  </AppText>
                </View>
              </Surface>
            ))}
          </View>
        </View>

        <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 20 }}>
          Kaynak: petrolspor.com
        </AppText>
      </ScrollView>
    </Screen>
  );
}
