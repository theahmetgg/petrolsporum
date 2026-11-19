import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, ColorIconBox, IconButton, ListRowSkeleton, Reveal, SectionHeader, Surface } from "@/components/ui";
import { HeadlineSkeleton, HeroCardSkeleton, ProductRailSkeleton } from "@/components/common/Skeletons";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { MenuButton } from "@/components/common/TabHeading";
import { NextMatchCard } from "@/components/match/NextMatchCard";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { NewsRow } from "@/components/home/NewsRow";
import { ShortcutGrid, type Shortcut } from "@/components/home/ShortcutGrid";
import { FanPostCard } from "@/components/fan/FanPostCard";
import { ProductRail } from "@/components/store/ProductCard";
import { useFanPosts, useFeaturedProducts, useMatches, useNews } from "@/hooks/queries";
import { IMAGES } from "@/mocks/images";
import { useLiveStatus } from "@/stores/liveMatchStore";
import type { NewsItem, Product } from "@/types";
import { useSessionStore } from "@/stores/sessionStore";
import { spacing, useTheme } from "@/theme";

/** Manşet şeridindeki haber sayısı; kalan haberler aşağıdaki listede çıkar (aynı haber iki kez gösterilmez) */
const HEADLINE_COUNT = 3;
const LIST_COUNT = 3;
const WALL_PREVIEW_COUNT = 2;
/** Ana sayfadaki mağaza rafında ürün kartının eni */
const STORE_RAIL_CARD = 150;

// Sabit işleyiciler: her çizimde yeni fonksiyon üretilmez, `memo`'lu kartlar boşuna yeniden çizilmez
const openProduct = (product: Product) => router.push(`/store/${product.id}`);
const openNews = (item: NewsItem) => router.push(`/news/${item.id}`);

/**
 * Ana Sayfa (prototip ekran 2). Sıra Ar-Ge belgesi 8.1'deki 4. referanstan: selamlama, sıradaki maç,
 * manşet, kısayollar, anıt duvarı, taraftar duvarı, son haberler. Veriler servis katmanından gelir.
 */
export default function HomeTab() {
  const tabBarHeight = useTabBarHeight();
  const { isDark } = useTheme();
  const fan = useSessionStore((s) => s.fan);
  // Yalnız maçın durumu: dakika ilerlerken ana sayfanın tamamı (650 ms'de bir) yeniden çizilmez
  const isLiveNow = useLiveStatus() === "live";
  const { data: matches } = useMatches();
  const { data: news } = useNews();
  const { data: posts } = useFanPosts();
  const { data: featured } = useFeaturedProducts();

  // Sıradaki maç: oynanmamış ilk maç
  const nextMatch = matches?.find((m) => m.status === "scheduled");
  const firstName = fan?.is_guest ? null : fan?.full_name.split(" ")[0];

  const shortcuts = useMemo<Shortcut[]>(
    () => [
      { key: "prediction", label: "Skor Tahmini", icon: "prediction", onPress: () => router.push("/play/prediction") },
      { key: "lineup", label: "İlk 11'ini Kur", icon: "lineup", onPress: () => router.push("/play/lineup") },
      { key: "wallpaper", label: "Duvar Kağıtları", icon: "wallpaper", onPress: () => router.push("/(tabs)/gallery") },
      { key: "monument", label: "Anıt Duvarı", icon: "monument", onPress: () => router.push("/monument") },
      { key: "tribune", label: "Tribün Modu", icon: "tribune", onPress: () => router.push("/tribune") },
      { key: "standings", label: "Puan Durumu", icon: "standings", onPress: () => router.push({ pathname: "/(tabs)/matches", params: { view: "standings" } }) },
      { key: "store", label: "Mağaza", icon: "store", onPress: () => router.push("/store") },
      { key: "leaderboard", label: "Liderlik", icon: "leaderboard", onPress: () => router.push("/play/leaderboard") },
    ],
    []
  );

  return (
    <Screen withBottomInset={false}>
      {/* Üst bar: solda menü düğmesi ve kulüp logosu, sağda bildirimler */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: spacing.screen, height: 56 }}>
        <MenuButton />
        {/* Yazı logosu temaya göre: koyu zeminde beyaz, açık zeminde siyah */}
        <Image source={isDark ? IMAGES.logoWhite : IMAGES.logoDark} style={{ width: 120, height: 36 }} contentFit="contain" transition={0} accessibilityLabel="Batman Petrolspor" />
        <View style={{ flex: 1 }} />
        <IconButton icon={Bell} label="Bildirimler" size={44} badgeCount={3} onPress={() => router.push("/notifications")} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight + spacing.section }}>
        <View style={{ paddingHorizontal: spacing.screen, paddingTop: 4, paddingBottom: 14 }}>
          <AppText variant="title" accessibilityRole="header">
            {firstName ? `Merhaba, ${firstName}` : "Merhaba"}
          </AppText>
          <AppText variant="small" tone="muted">
            {isLiveNow ? "Maç şu an oynanıyor." : "Sıradaki maça hazır mısın?"}
          </AppText>
        </View>

        {/* İlk açılışta üstteki dört bölüm sırayla, hafifçe aşağıdan solarak belirir; ekranın altındakiler animasyonsuzdur */}
        <Reveal index={0} style={{ paddingHorizontal: spacing.screen }}>
          {nextMatch ? <NextMatchCard match={nextMatch} onPress={() => router.push(`/match/${nextMatch.id}`)} /> : <HeroCardSkeleton height={300} />}
        </Reveal>

        {/* Maç günü rehberi ve bilet: maç başlamadan önce (canlı maçta yerini Tribün Modu alır) */}
        {nextMatch && !isLiveNow ? (
          <View style={{ flexDirection: "row", gap: spacing.boxGap, paddingHorizontal: spacing.screen, marginTop: spacing.boxGap }}>
            <Surface onPress={() => router.push("/matchday")} style={{ flex: 1 }}>
              <ColorIconBox name="checkin" size={40} />
              <AppText variant="small" weight="medium" style={{ flex: 1 }}>
                Maç günü rehberi
              </AppText>
            </Surface>
            <Surface onPress={() => router.push("/tickets")} style={{ flex: 1 }}>
              <ColorIconBox name="ticket" size={40} />
              <AppText variant="small" weight="medium" style={{ flex: 1 }}>
                Bilet al
              </AppText>
            </Surface>
          </View>
        ) : null}

        {/* Tribün Modu kartı: yalnız maç oynanırken (belgedeki "yalnız maç günü" kuralı; prototipte kısayollardan da açılır) */}
        {isLiveNow ? (
          <View style={{ paddingHorizontal: spacing.screen, marginTop: spacing.boxGap }}>
            <Surface onPress={() => router.push("/tribune")} chevron>
              <ColorIconBox name="tribune" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  Tribün Modu açık
                </AppText>
                <AppText variant="caption" tone="muted">
                  Sesini ölç, petrol kulesini zirveye çıkar.
                </AppText>
              </View>
            </Surface>
          </View>
        ) : null}

        <Reveal index={1} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Manşet" />
          {news ? <NewsCarousel items={news.slice(0, HEADLINE_COUNT)} onOpen={openNews} /> : <HeadlineSkeleton />}
        </Reveal>

        <Reveal index={2} style={{ marginTop: spacing.section }}>
          <ShortcutGrid items={shortcuts} />
        </Reveal>

        {/* Mağaza rafı: yeni sezon formaları */}
        <Reveal index={3} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Mağaza" subtitle="Yeni sezon formaları" onAction={() => router.push("/store")} />
          {featured ? <ProductRail products={featured} cardWidth={STORE_RAIL_CARD} onPress={openProduct} /> : <ProductRailSkeleton cardWidth={STORE_RAIL_CARD} />}
        </Reveal>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: spacing.section }}>
          <Surface row={false} padding={16}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <ColorIconBox name="monument" size={48} />
              <View style={{ flex: 1 }}>
                <AppText variant="subhead">Anıt Duvarı</AppText>
                <AppText variant="small" tone="muted">
                  Adını Batman Şehir Stadyumu'nun dijital duvarına yazdır, kulübüne destek ol.
                </AppText>
              </View>
            </View>
            <Button title="Duvarı gör" variant="secondary" fullWidth onPress={() => router.push("/monument")} />
          </Surface>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Taraftar Duvarı" onAction={() => router.push("/fan-wall")} />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            {posts ? (
              posts.slice(0, WALL_PREVIEW_COUNT).map((post) => <FanPostCard key={post.id} post={post} compact onOpenComments={() => router.push({ pathname: "/fan-wall", params: { open: post.id } })} />)
            ) : (
              <ListRowSkeleton count={2} />
            )}
          </View>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Son Haberler" onAction={() => router.push("/news")} />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            {news ? (
              news.slice(HEADLINE_COUNT, HEADLINE_COUNT + LIST_COUNT).map((item) => <NewsRow key={item.id} item={item} onPress={() => router.push(`/news/${item.id}`)} />)
            ) : (
              <ListRowSkeleton count={3} />
            )}
          </View>
        </View>

        {__DEV__ ? (
          <View style={{ paddingHorizontal: spacing.screen, marginTop: spacing.section, gap: 10 }}>
            <AppText variant="caption" tone="muted">
              Geliştirici
            </AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Tasarım duvarı" variant="ghost" size="sm" onPress={() => router.push("/dev/design-wall")} />
              <Button title="Bileşen vitrini" variant="ghost" size="sm" onPress={() => router.push("/dev/ui-kit")} />
            </View>
          </View>
        ) : null}

      </ScrollView>
    </Screen>
  );
}
