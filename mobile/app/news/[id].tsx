import React from "react";
import { Linking, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ExternalLink } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, EmptyState, Heading, IconButton, ListRowSkeleton, ScreenHeader } from "@/components/ui";
import { useNewsItem } from "@/hooks/queries";
import { imageSource } from "@/mocks/images";
import { showToast } from "@/stores/toastStore";
import { formatLongDate } from "@/utils/format";
import { radius, spacing } from "@/theme";
import { useNavigationMode } from "@/hooks/useNavigationMode";

/**
 * Haber detayı: üstte fotoğraf (durum çubuğunun arkasından başlar), altında kategori · tarih, başlık ve özet.
 * Prototipte haberin tamamı uygulamada yok; "Haberin tamamı" kulübün sitesindeki haberi açar.
 */
export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { insetTop } = useNavigationMode();
  const { data: item, isLoading } = useNewsItem(id ?? "");

  const openSource = () => {
    if (!item) return;
    Linking.openURL(item.source_url).catch(() => showToast("Bağlantı açılamadı.", "error"));
  };

  if (isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Haber" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={3} />
        </View>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <ScreenHeader title="Haber" />
        <EmptyState title="Haber bulunamadı" description="Bu haber kaldırılmış olabilir." actionLabel="Haberlere dön" onAction={() => router.replace("/news")} />
      </Screen>
    );
  }

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          <Image
            source={imageSource(item.image)}
            style={{ width: "100%", aspectRatio: 1.25, borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block }}
            contentFit="cover"
            transition={150}
          />
          <View style={{ position: "absolute", top: insetTop + 8, left: spacing.screen }}>
            <IconButton icon={ChevronLeft} label="Geri" variant="overlay" size={40} onPress={() => router.back()} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.screen, paddingTop: 20, gap: 12 }}>
          <AppText variant="caption" weight="medium" tone="brand">
            {item.category} · {formatLongDate(item.published_at)}
          </AppText>
          <Heading size="display" accessibilityRole="header">
            {item.title}
          </Heading>
          <AppText variant="body" tone="secondary">
            {item.summary}
          </AppText>
          <Button title="Haberin tamamı" variant="secondary" rightIcon={ExternalLink} onPress={openSource} style={{ alignSelf: "flex-start", marginTop: 8 }} />
          <AppText variant="caption" tone="muted">
            Kaynak: petrolspor.com
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}
