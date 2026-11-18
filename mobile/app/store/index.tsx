import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, Heading, IconButton, ListRowSkeleton, LoadingMore, Pill, PressableBox, SectionHeader, SignatureBlock, SignatureTopBar } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { ProductCard, ProductStage } from "@/components/store/ProductCard";
import { useDeals, useProduct, useProductPages, useStoreCategories } from "@/hooks/queries";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { HeadingFonts } from "@/lib/fonts";
import { flattenPages, pageTotal } from "@/lib/pagination";
import { FEATURED_PRODUCT_ID, PRODUCT_FILTERS, type ProductFilter } from "@/mocks/store";
import { storeImage, storeThumb } from "@/mocks/storeImages";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { gradients, radius, spacing, useTheme } from "@/theme";

const COLUMN_GAP = 12;
const ROW_GAP = 22;
/** Kategori kutusu ölçüleri */
const TILE_W = 138;
const TILE_H = 184;
/** Fırsatlar rafındaki kartın eni */
const DEAL_CARD = 150;
/** Liste bu kadar (dp) kaydırılınca kırmızı üst blok ekrandan çıkmış sayılır */
const HEADER_PASSED_AT = 300;
const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

const openProduct = (product: Product) => router.push(`/store/${product.id}`);

/**
 * Vitrin kartı: siyaha yakın sahnede yeni sezon forması (arka planı silinmiş fotoğraf). Arkada iri soluk "2026-27",
 * önde formanın büyük fotoğrafı, solda ürün adı ve fiyat. Kart iki temada da koyudur: kırmızı bloğun içinde
 * en güçlü karşıtlığı verir; üstündeki yazılar beyazdır.
 */
function HeroCard({ product, width }: { product: Product; width: number }) {
  const { colors } = useTheme();
  const height = Math.round(width * 0.98);
  const imageSize = Math.round(width * 0.9);
  return (
    <PressableBox
      onPress={() => openProduct(product)}
      pressScale={BOX_PRESS_SCALE}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}, incele`}
      style={() => ({ width, height, borderRadius: radius.hero, overflow: "hidden", backgroundColor: colors.scrim.DEFAULT })}
    >
      {/* Sahne: üstten alta siyahtan koyu bordoya */}
      <LinearGradient colors={[colors.media.bg, colors.scrim.DEFAULT, gradients.signature[3]]} locations={[0, 0.55, 1]} style={FILL} />
      {/* Arkadaki iri sezon yazısı */}
      <Text allowFontScaling={false} style={{ position: "absolute", top: -6, left: 14, fontFamily: HeadingFonts.bold, fontSize: 118, lineHeight: 124, letterSpacing: -2, color: colors.glass.DEFAULT, opacity: 0.45 }}>
        2026-27
      </Text>
      <Image source={storeImage(product.image)} placeholder={storeThumb(product.image)} style={{ position: "absolute", right: -imageSize * 0.1, bottom: -imageSize * 0.08, width: imageSize, height: imageSize }} contentFit="contain" transition={150} />
      <View style={{ flex: 1, padding: 18, justifyContent: "space-between" }}>
        <View style={{ alignSelf: "flex-start", height: 26, paddingHorizontal: 10, borderRadius: 13, justifyContent: "center", backgroundColor: colors.brand.fill }}>
          <AppText variant="badge" weight="bold" color={colors.ink.inverse} style={{ letterSpacing: 0.5 }}>
            YENİ SEZON
          </AppText>
        </View>
        <View style={{ gap: 8, alignItems: "flex-start" }}>
          <Heading size="display" color={colors.ink.inverse} style={{ maxWidth: width * 0.5 }}>
            {product.name.replace("2026-2027 ", "")}
          </Heading>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, height: 40, paddingLeft: 16, paddingRight: 12, borderRadius: 20, backgroundColor: colors.ink.inverse }}>
            <AppText variant="small" weight="bold" color={colors.scrim.DEFAULT} style={{ fontVariant: ["tabular-nums"] }}>
              {formatPrice(product.price)}
            </AppText>
            <ArrowRight size={16} color={colors.scrim.DEFAULT} strokeWidth={2.25} />
          </View>
        </View>
      </View>
    </PressableBox>
  );
}

/** Kategori kutusu: sahne zemininde kategorinin vitrin ürünü, altında ad ve ürün sayısı */
function CategoryTile({ title, count, image, onPress }: { title: string; count: number; image: string; onPress: () => void }) {
  return (
    <PressableBox
      onPress={onPress}
      pressScale={BOX_PRESS_SCALE}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count} ürün`}
      style={() => ({ width: TILE_W, height: TILE_H, borderRadius: radius.box, overflow: "hidden" })}
    >
      <ProductStage style={{ flex: 1, alignItems: "center" }}>
        <Image source={storeThumb(image)} style={{ width: TILE_W - 24, height: TILE_W - 24, marginTop: 4 }} contentFit="contain" transition={120} />
        <View style={{ position: "absolute", left: 12, right: 12, bottom: 10 }}>
          <Heading size="title" numberOfLines={1}>
            {title}
          </Heading>
          <AppText variant="caption" tone="muted">
            {count} ürün
          </AppText>
        </View>
      </ProductStage>
    </PressableBox>
  );
}

/**
 * Mağaza (vitrin). Sıra: imza gradyan blokta vitrin kartı (yeni sezon forması) → kategori kutuları → fırsatlar rafı
 * → kategori hapları ve iki sütunlu ürün ızgarası. Sepet ve ödeme yoktur; ürün sayfasındaki "Sipariş ver"
 * şimdilik işlevsizdir.
 *
 * Performans: ızgara sayfa sayfa gelir (12'şer; kaydırdıkça sonraki sayfa), liste sanaldır (`FlatList`: yalnız
 * ekrandaki satırlar çizilir), kartlar `memo`'dur ve 400 px küçük fotoğraf kullanır; 900 px fotoğraf yalnız vitrin
 * kartında ve ürün sayfasında yüklenir.
 */
export default function StoreScreen() {
  const { colors, statusBarStyle } = useTheme();
  const { insetTop } = useNavigationMode();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Product>>(null);
  const [filter, setFilter] = useState<ProductFilter>("Tümü");
  // Izgaranın (kategori haplarının) listenin başından uzaklığı: kategori kutusuna basınca oraya kaydırılır
  const [gridTop, setGridTop] = useState(0);
  // Kırmızı blok kaydırılıp çıkınca durum çubuğunun arkasına sayfa zemini konur: saat ürün fotoğraflarının üstüne binmez
  const [pastHeader, setPastHeader] = useState(false);

  const pages = useProductPages(filter);
  const { data: featured } = useProduct(FEATURED_PRODUCT_ID);
  const { data: categories } = useStoreCategories();
  const { data: deals } = useDeals();

  const products = useMemo(() => flattenPages(pages.data), [pages.data]);
  const total = pageTotal(pages.data);
  const cardWidth = Math.floor((width - spacing.screen * 2 - COLUMN_GAP) / 2);

  const loadMore = useCallback(() => {
    if (pages.hasNextPage && !pages.isFetchingNextPage) pages.fetchNextPage();
  }, [pages]);

  /** Filtreyi seçer ve ızgaranın başına kaydırır (kategori kutuları ve "Tümü" bağlantıları) */
  const showFilter = useCallback(
    (next: ProductFilter) => {
      setFilter(next);
      listRef.current?.scrollToOffset({ offset: Math.max(0, gridTop - insetTop - 8), animated: true });
    },
    [gridTop, insetTop]
  );

  const renderItem = useCallback(({ item }: { item: Product }) => <ProductCard product={item} width={cardWidth} onPress={openProduct} />, [cardWidth]);

  const header = (
    <View>
      <SignatureBlock bottomSpace={spacing.screen}>
        <SignatureTopBar title="Mağaza" left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
        <View style={{ paddingHorizontal: spacing.screen, marginTop: 14 }}>
          {featured ? <HeroCard product={featured} width={width - spacing.screen * 2} /> : <View style={{ height: width - spacing.screen * 2 }} />}
        </View>
      </SignatureBlock>

      <View style={{ marginTop: spacing.section }}>
        <SectionHeader title="Koleksiyonlar" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 10 }}>
          {(categories ?? []).map((c) => (
            <CategoryTile key={c.category} title={c.category} count={c.count} image={c.image} onPress={() => showFilter(c.category)} />
          ))}
        </ScrollView>
      </View>

      {deals?.length ? (
        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Fırsatlar" subtitle="İndirimdeki ürünler" onAction={() => showFilter("İndirim")} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 12 }}>
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} width={DEAL_CARD} onPress={openProduct} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={{ marginTop: spacing.section }} onLayout={(e) => setGridTop(e.nativeEvent.layout.y)}>
        <SectionHeader title="Tüm ürünler" subtitle={pages.isLoading ? "Yükleniyor" : `${total} ürün`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 8, paddingBottom: 18 }}>
          {PRODUCT_FILTERS.map((f) => (
            <Pill key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>
      {pages.isLoading ? (
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={4} />
        </View>
      ) : null}
    </View>
  );

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <FlatList
        ref={listRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: COLUMN_GAP, paddingHorizontal: spacing.screen }}
        contentContainerStyle={{ paddingBottom: 40, rowGap: ROW_GAP }}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ marginBottom: -ROW_GAP }}
        ListEmptyComponent={pages.isLoading ? null : <EmptyState title="Bu kategoride ürün yok" description="Başka bir kategori seç." />}
        ListFooterComponent={pages.isFetchingNextPage ? <LoadingMore /> : null}
        onScroll={(e) => {
          const passed = e.nativeEvent.contentOffset.y > HEADER_PASSED_AT;
          if (passed !== pastHeader) setPastHeader(passed);
        }}
        scrollEventThrottle={64}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        // Sanal liste ayarları: ekranda ve hemen altında kalan satırlar bellekte tutulur
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
      {pastHeader ? (
        <>
          <StatusBar style={statusBarStyle} />
          <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, height: insetTop, backgroundColor: colors.surface.bg }} />
        </>
      ) : null}
    </Screen>
  );
}
