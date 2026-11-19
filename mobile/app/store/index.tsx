import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { FlatList, ScrollView, Text, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, Heading, IconButton, LoadingMore, Pill, PressableBox, SectionHeader, SignatureBlock, SignatureTopBar, FirstLoadFade } from "@/components/ui";
import { FIRST_LOAD_FADE_COUNT } from "@/components/ui/motion";
import { HeroCardSkeleton, ProductGridSkeleton, ProductRailSkeleton, TileRailSkeleton } from "@/components/common/Skeletons";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { ProductCard, ProductRail, ProductStage } from "@/components/store/ProductCard";
import { useDeals, useProduct, useProductPages, useStoreCategories } from "@/hooks/queries";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { HeadingFonts } from "@/lib/fonts";
import { flattenPages, pageTotal } from "@/lib/pagination";
import { FEATURED_PRODUCT_ID, PRODUCT_FILTERS, type ProductFilter } from "@/mocks/store";
import { storeImage, storeThumb } from "@/mocks/storeImages";
import type { Product, ProductCategory } from "@/types";
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
const goBack = () => router.back();
const keyExtractor = (item: Product) => item.id;
// Sabit stil nesneleri: her çizimde yenisi üretilirse liste "ayarım değişti" sanıp tüm satırları baştan çizer
const COLUMN_WRAPPER = { gap: COLUMN_GAP, paddingHorizontal: spacing.screen } as const;
const LIST_CONTENT = { paddingBottom: 40, rowGap: ROW_GAP } as const;
const LIST_HEADER = { marginBottom: -ROW_GAP } as const;

/**
 * Vitrin kartı: siyaha yakın sahnede yeni sezon forması (arka planı silinmiş fotoğraf). Arkada iri soluk "2026-27",
 * önde formanın büyük fotoğrafı, solda ürün adı ve fiyat. Kart iki temada da koyudur: kırmızı bloğun içinde
 * en güçlü karşıtlığı verir; üstündeki yazılar beyazdır.
 */
const HeroCard = memo(function HeroCard({ product, width }: { product: Product; width: number }) {
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
});

/** Kategori kutusu: sahne zemininde kategorinin vitrin ürünü, altında ad ve ürün sayısı */
const CategoryTile = memo(function CategoryTile({ title, count, image, onSelect }: { title: ProductCategory; count: number; image: string; onSelect: (category: ProductCategory) => void }) {
  return (
    <PressableBox
      onPress={() => onSelect(title)}
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
});

/**
 * Mağaza (vitrin). Sıra: imza gradyan blokta vitrin kartı (yeni sezon forması) → kategori kutuları → fırsatlar rafı
 * → kategori hapları ve iki sütunlu ürün ızgarası. Sepet ve ödeme yoktur; ürün sayfasındaki "Sipariş ver"
 * şimdilik işlevsizdir.
 *
 * Performans: ızgara sayfa sayfa gelir (12'şer; kaydırdıkça sonraki sayfa), liste sanaldır (`FlatList`: yalnız
 * ekrandaki satırlar çizilir), kartlar `memo`'dur ve 400 px küçük fotoğraf kullanır; 900 px fotoğraf yalnız vitrin
 * kartında ve ürün sayfasında yüklenir. Liste başlığı (vitrin, koleksiyonlar, fırsatlar) ve listeye verilen
 * işleyiciler sabittir (`useMemo` / `useCallback`): kaydırırken ya da sonraki sayfa yüklenirken başlık ve
 * ekrandaki kartlar baştan çizilmez.
 */
export default function StoreScreen() {
  const { colors, statusBarStyle } = useTheme();
  const { insetTop } = useNavigationMode();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Product>>(null);
  const [filter, setFilter] = useState<ProductFilter>("Tümü");
  // Izgaranın (kategori haplarının) listenin başından uzaklığı: kategori kutusuna basınca oraya kaydırılır.
  // Çizimi etkilemediği için durum değil referans (değişince ekran yeniden çizilmez).
  const gridTop = useRef(0);
  const pastHeaderRef = useRef(false);
  // Kırmızı blok kaydırılıp çıkınca durum çubuğunun arkasına sayfa zemini konur: saat ürün fotoğraflarının üstüne binmez
  const [pastHeader, setPastHeader] = useState(false);

  const pages = useProductPages(filter);
  const { data: featured } = useProduct(FEATURED_PRODUCT_ID);
  const { data: categories } = useStoreCategories();
  const { data: deals } = useDeals();

  const products = useMemo(() => flattenPages(pages.data), [pages.data]);
  const total = pageTotal(pages.data);
  const cardWidth = Math.floor((width - spacing.screen * 2 - COLUMN_GAP) / 2);

  const { hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = pages;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /** Filtreyi seçer ve ızgaranın başına kaydırır (kategori kutuları ve "Tümü" bağlantıları) */
  const showFilter = useCallback(
    (next: ProductFilter) => {
      setFilter(next);
      listRef.current?.scrollToOffset({ offset: Math.max(0, gridTop.current - insetTop - 8), animated: true });
    },
    [insetTop]
  );
  const showDeals = useCallback(() => showFilter("İndirim"), [showFilter]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const passed = e.nativeEvent.contentOffset.y > HEADER_PASSED_AT;
    if (passed === pastHeaderRef.current) return;
    pastHeaderRef.current = passed;
    setPastHeader(passed);
  }, []);

  // İlk yüklemede (ve kategori değişince) ilk altı kart sırayla solarak gelir; sonrakiler animasyonsuz çizilir
  // İlk yüklemede (ve kategori değişince) ilk altı kart sırayla solarak gelir. Yalnız o altı kart animasyon
  // katmanıyla sarılır; kalan 50 kart ek katman olmadan düz çizilir (kaydırma ölçümü: takılan kare %11-14, animasyonsuz hâliyle aynı).
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const card = <ProductCard product={item} width={cardWidth} onPress={openProduct} />;
      return index < FIRST_LOAD_FADE_COUNT ? <FirstLoadFade index={index}>{card}</FirstLoadFade> : card;
    },
    [cardWidth]
  );

  const heroWidth = width - spacing.screen * 2;
  const header = useMemo(
    () => (
    <View>
      <SignatureBlock bottomSpace={spacing.screen}>
        <SignatureTopBar title="Mağaza" left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={goBack} />} />
        <View style={{ paddingHorizontal: spacing.screen, marginTop: 14 }}>
          {featured ? <HeroCard product={featured} width={heroWidth} /> : <HeroCardSkeleton height={Math.round(heroWidth * 0.98)} />}
        </View>
      </SignatureBlock>

      <View style={{ marginTop: spacing.section }}>
        <SectionHeader title="Koleksiyonlar" />
        {categories ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 10 }}>
            {categories.map((c) => (
              <CategoryTile key={c.category} title={c.category} count={c.count} image={c.image} onSelect={showFilter} />
            ))}
          </ScrollView>
        ) : (
          <TileRailSkeleton width={TILE_W} height={TILE_H} />
        )}
      </View>

      {!deals || deals.length ? (
        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Fırsatlar" subtitle="İndirimdeki ürünler" onAction={showDeals} />
          {deals ? <ProductRail products={deals} cardWidth={DEAL_CARD} onPress={openProduct} /> : <ProductRailSkeleton cardWidth={DEAL_CARD} />}
        </View>
      ) : null}

      <View style={{ marginTop: spacing.section }} onLayout={(e) => { gridTop.current = e.nativeEvent.layout.y; }}>
        <SectionHeader title="Tüm ürünler" subtitle={isLoading ? "Yükleniyor" : `${total} ürün`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 8, paddingBottom: 18 }}>
          {PRODUCT_FILTERS.map((f) => (
            <Pill key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>
      {isLoading ? <ProductGridSkeleton cardWidth={cardWidth} columnGap={COLUMN_GAP} rowGap={ROW_GAP} /> : null}
    </View>
    ),
    [featured, heroWidth, cardWidth, categories, deals, filter, total, isLoading, showFilter, showDeals]
  );
  const empty = useMemo(() => (isLoading ? null : <EmptyState title="Bu kategoride ürün yok" description="Başka bir kategori seç." />), [isLoading]);
  const footer = useMemo(() => (isFetchingNextPage ? <LoadingMore /> : null), [isFetchingNextPage]);

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <FlatList
        ref={listRef}
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={COLUMN_WRAPPER}
        contentContainerStyle={LIST_CONTENT}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={LIST_HEADER}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        onScroll={onScroll}
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
