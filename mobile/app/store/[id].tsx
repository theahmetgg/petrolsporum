import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { BadgeCheck, ChevronLeft, ShoppingBag } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, FloatingActionBar, FLOATING_BAR_HEIGHT, Heading, IconButton, ListRowSkeleton, Pill, ScreenHeader, SectionHeader, Surface, useFloatingBarBottom } from "@/components/ui";
import { ProductBadge, ProductCard, ProductPrice, ProductStage } from "@/components/store/ProductCard";
import { useProduct, useRelatedProducts } from "@/hooks/queries";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { storeImage, storeThumb } from "@/mocks/storeImages";
import { discountPercent, formatPrice } from "@/utils/format";
import { radius, spacing, useColors } from "@/theme";

/** "Benzer ürünler" rafındaki kartın eni */
const RELATED_CARD = 150;

/**
 * "Sipariş ver" butonunun işlevi. SİPARİŞ HENÜZ ALINMIYOR (`STORE_ORDERING_OPEN` false; kullanıcı kararı,
 * 19 Kasım 2026): buton vitrinde durur ama basınca bilerek hiçbir şey yapmaz. Sipariş açılınca sepet / ödeme
 * akışı buraya bağlanır.
 */
const placeOrder = () => {};

/**
 * Ürün sayfası: kenardan kenara sahne (temaya uyan zemin, arka planı silinmiş ürün; alt köşeleri yuvarlak,
 * üstünde geri düğmesi; durum çubuğunun arkası da aynı zemin olduğu için renk farkı olmaz), kategori,
 * ad, fiyat (indirimde tasarruf tutarıyla), beden / yaş / ölçü seçimi, ürün notu ve benzer ürünler rafı.
 * Alttaki ana eylem "Sipariş ver"dir; şimdilik işlevsizdir (yukarıdaki nota bakın).
 */
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const barBottom = useFloatingBarBottom();
  const { insetTop } = useNavigationMode();
  const { width } = useWindowDimensions();
  const { data: product, isLoading } = useProduct(id ?? "");
  const { data: related } = useRelatedProducts(id ?? "");
  const [option, setOption] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Mağaza" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={4} />
        </View>
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen>
        <ScreenHeader title="Mağaza" />
        <EmptyState title="Ürün bulunamadı" description="Bu ürün mağazadan kaldırılmış olabilir." actionLabel="Mağazaya dön" onAction={() => router.replace("/store")} />
      </Screen>
    );
  }

  const onSale = product.old_price != null;

  return (
    <Screen withTopInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: barBottom + FLOATING_BAR_HEIGHT + 32 }}>
        {/* Kenardan kenara fotoğraf: yüklenene kadar listedeki küçük kopya gösterilir (boş alan görünmez) */}
        <ProductStage style={{ width, paddingTop: insetTop + 36, borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block, overflow: "hidden" }}>
          <Image source={storeImage(product.image)} placeholder={storeThumb(product.image)} placeholderContentFit="contain" style={{ width, height: width }} contentFit="contain" transition={150} accessibilityLabel={product.name} />
          <View style={{ position: "absolute", top: insetTop + 8, left: spacing.screen, right: spacing.screen, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <IconButton icon={ChevronLeft} label="Geri" variant="soft" size={40} onPress={() => router.back()} />
            <ProductBadge product={product} />
          </View>
        </ProductStage>

        <View style={{ paddingHorizontal: spacing.screen, paddingTop: 20, gap: 18 }}>
          <View style={{ gap: 6 }}>
            <AppText variant="caption" weight="medium" tone="brand">
              {product.category}
            </AppText>
            <Heading size="display" accessibilityRole="header">
              {product.name}
            </Heading>
            <ProductPrice product={product} large />
            {onSale ? (
              <AppText variant="small" weight="medium" tone="success">
                %{discountPercent(product.old_price!, product.price)} indirim · {formatPrice(product.old_price! - product.price)} kazanç
              </AppText>
            ) : null}
          </View>

          {product.options.length ? (
            <View style={{ gap: 10 }}>
              <AppText variant="small" weight="medium">
                {product.option_label}
                {option ? `: ${option}` : ""}
              </AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {product.options.map((value) => (
                  <Pill key={value} label={value} selected={option === value} onPress={() => setOption((cur) => (cur === value ? null : value))} />
                ))}
              </View>
            </View>
          ) : null}

          <Surface padding={14}>
            <BadgeCheck size={22} color={colors.brand.strong} strokeWidth={1.75} />
            <View style={{ flex: 1 }}>
              <AppText variant="small" weight="medium">
                Resmi mağaza ürünü
              </AppText>
              <AppText variant="caption" tone="muted">
                Batman Petrolspor'un kendi mağazasından.
              </AppText>
            </View>
          </Surface>

          {product.note ? (
            <Surface row={false} padding={14}>
              <AppText variant="small" weight="medium">
                Bilgi
              </AppText>
              <AppText variant="small" tone="secondary">
                {product.note}
              </AppText>
            </Surface>
          ) : null}
        </View>

        {related?.length ? (
          <View style={{ marginTop: spacing.section }}>
            <SectionHeader title="Benzer ürünler" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 12 }}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} width={RELATED_CARD} onPress={(p) => router.replace(`/store/${p.id}`)} />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <FloatingActionBar label="Sipariş ver" icon={ShoppingBag} onPress={placeOrder} />
    </Screen>
  );
}
