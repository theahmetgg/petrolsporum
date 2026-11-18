import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, FloatingActionBar, FLOATING_BAR_HEIGHT, Heading, ListRowSkeleton, Pill, ScreenHeader, Surface, useFloatingBarBottom } from "@/components/ui";
import { ProductBadge, ProductPrice } from "@/components/store/ProductCard";
import { useProduct } from "@/hooks/queries";
import { storeImage, storeThumb } from "@/mocks/storeImages";
import { radius, spacing, useColors } from "@/theme";

/**
 * "Sipariş ver" butonunun işlevi. SİPARİŞ HENÜZ ALINMIYOR (`STORE_ORDERING_OPEN` false; kullanıcı kararı,
 * 19 Kasım 2026): buton vitrinde durur ama basınca bilerek hiçbir şey yapmaz. Sipariş açılınca sepet / ödeme
 * akışı buraya bağlanır.
 */
const placeOrder = () => {};

/**
 * Ürün sayfası: büyük fotoğraf, kategori, ad, fiyat, beden / yaş / ölçü seçimi ve ürün notu.
 * Alttaki ana eylem "Sipariş ver"dir; şimdilik işlevsizdir (yukarıdaki nota bakın).
 */
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const barBottom = useFloatingBarBottom();
  const { width } = useWindowDimensions();
  const { data: product, isLoading } = useProduct(id ?? "");
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

  const imageSize = width - spacing.screen * 2;

  return (
    <Screen>
      <ScreenHeader title="Mağaza" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: barBottom + FLOATING_BAR_HEIGHT + 32, gap: 16 }}>
        {/* Büyük fotoğraf: yüklenene kadar listedeki küçük kopya gösterilir (boş kare görünmez) */}
        <View style={{ width: imageSize, height: imageSize, borderRadius: radius.hero, overflow: "hidden", backgroundColor: colors.surface.logo }}>
          <Image source={storeImage(product.image)} placeholder={storeThumb(product.image)} placeholderContentFit="cover" style={{ width: imageSize, height: imageSize }} contentFit="cover" transition={150} accessibilityLabel={product.name} />
          <View style={{ position: "absolute", top: 14, left: 14 }}>
            <ProductBadge product={product} />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <AppText variant="caption" weight="medium" tone="brand">
            {product.category}
          </AppText>
          <Heading size="display" accessibilityRole="header">
            {product.name}
          </Heading>
          <ProductPrice product={product} large />
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
      </ScrollView>

      <FloatingActionBar label="Sipariş ver" icon={ShoppingBag} onPress={placeOrder} />
    </Screen>
  );
}
