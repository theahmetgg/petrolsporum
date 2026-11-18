import React, { useCallback, useMemo, useState } from "react";
import { FlatList, ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, Heading, IconButton, ListRowSkeleton, LoadingMore, Pill, PressableBox, SignatureBlock, SignatureTopBar } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { ProductCard } from "@/components/store/ProductCard";
import { useFeaturedProducts, useProductPages } from "@/hooks/queries";
import { flattenPages, pageTotal } from "@/lib/pagination";
import { PRODUCT_FILTERS, type ProductFilter } from "@/mocks/store";
import { storeThumb } from "@/mocks/storeImages";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { radius, spacing, useTheme } from "@/theme";
import { useNavigationMode } from "@/hooks/useNavigationMode";

const COLUMN_GAP = 12;
const ROW_GAP = 20;
/** Yeni sezon rafındaki kartın eni */
const RAIL_CARD = 132;
/** Liste bu kadar (dp) kaydırılınca kırmızı üst blok ekrandan çıkmış sayılır */
const HEADER_PASSED_AT = 300;

const openProduct = (product: Product) => router.push(`/store/${product.id}`);

/**
 * Mağaza (vitrin). Üstte imza gradyan blokta yeni sezon formaları rafı; altında kategori hapları ve iki sütunlu
 * ürün ızgarası. Sipariş henüz alınmıyor: sepet ve ödeme yok; ürün sayfasındaki "Sipariş ver" şimdilik işlevsizdir.
 *
 * Performans: ürünler sayfa sayfa gelir (12'şer; kaydırdıkça sonraki sayfa), liste sanaldır (`FlatList`: yalnız
 * ekrandaki satırlar çizilir), kartlar `memo`'dur ve 400 px küçük fotoğraf kullanır.
 */
export default function StoreScreen() {
  const { colors, statusBarStyle } = useTheme();
  const { insetTop } = useNavigationMode();
  const { width } = useWindowDimensions();
  // Kırmızı blok kaydırılıp çıkınca durum çubuğunun arkasına sayfa zemini konur: saat ürün fotoğraflarının üstüne binmez
  const [pastHeader, setPastHeader] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>("Tümü");
  const pages = useProductPages(filter);
  const { data: featured } = useFeaturedProducts();

  const products = useMemo(() => flattenPages(pages.data), [pages.data]);
  const total = pageTotal(pages.data);
  const cardWidth = Math.floor((width - spacing.screen * 2 - COLUMN_GAP) / 2);

  const loadMore = useCallback(() => {
    if (pages.hasNextPage && !pages.isFetchingNextPage) pages.fetchNextPage();
  }, [pages]);

  const renderItem = useCallback(({ item }: { item: Product }) => <ProductCard product={item} width={cardWidth} onPress={openProduct} />, [cardWidth]);

  const header = (
    <View>
      <SignatureBlock>
        <SignatureTopBar title="Mağaza" left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
        <View style={{ paddingHorizontal: spacing.screen, marginTop: 14, gap: 10 }}>
          <Heading size="label" color={colors.glass.text}>
            2026-27 sezonu
          </Heading>
          <Heading size="display" color={colors.ink.inverse} style={{ fontSize: 40, lineHeight: 42 }}>
            Yeni sezon formaları
          </Heading>
        </View>
        {/* Yeni sezon rafı: beyaz kartlarda formalar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 10, paddingTop: 16 }}>
          {(featured ?? []).map((product) => (
            <PressableBox
              key={product.id}
              onPress={() => openProduct(product)}
              pressScale={BOX_PRESS_SCALE}
              accessibilityRole="button"
              accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
              style={() => ({ width: RAIL_CARD, gap: 6 })}
            >
              <View style={{ width: RAIL_CARD, height: RAIL_CARD, borderRadius: radius.box, overflow: "hidden", backgroundColor: colors.surface.logo }}>
                <Image source={storeThumb(product.image)} style={{ width: RAIL_CARD, height: RAIL_CARD }} contentFit="cover" transition={120} />
              </View>
              <AppText variant="caption" weight="medium" color={colors.ink.inverse} numberOfLines={1}>
                {product.name.replace("2026-2027 ", "")}
              </AppText>
              <AppText variant="caption" color={colors.glass.text} style={{ fontVariant: ["tabular-nums"] }}>
                {formatPrice(product.price)}
              </AppText>
            </PressableBox>
          ))}
        </ScrollView>
      </SignatureBlock>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 8, paddingTop: 18, paddingBottom: 6 }}>
        {PRODUCT_FILTERS.map((f) => (
          <Pill key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>
      <AppText variant="caption" tone="muted" style={{ paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 14 }}>
        {pages.isLoading ? "Ürünler yükleniyor" : `${total} ürün`}
      </AppText>
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
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: COLUMN_GAP, paddingHorizontal: spacing.screen }}
        contentContainerStyle={{ paddingBottom: 40, rowGap: ROW_GAP }}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ marginBottom: -ROW_GAP + 4 }}
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
