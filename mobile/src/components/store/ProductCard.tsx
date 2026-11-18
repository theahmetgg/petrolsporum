import React, { memo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import type { Product } from "@/types";
import { AppText, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { storeThumb } from "@/mocks/storeImages";
import { discountPercent, formatPrice } from "@/utils/format";
import { radius, useColors } from "@/theme";

/** Ürün rozeti: "YENİ" (nötr dolu) ya da indirim oranı (kırmızı dolu) */
export function ProductBadge({ product }: { product: Product }) {
  const colors = useColors();
  const sale = product.old_price != null;
  if (!sale && !product.is_new) return null;
  return (
    <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 11, justifyContent: "center", backgroundColor: sale ? colors.brand.fill : colors.scrim.DEFAULT }}>
      <AppText variant="badge" weight="bold" color={colors.ink.inverse} style={{ letterSpacing: 0.3 }}>
        {sale ? `%${discountPercent(product.old_price!, product.price)}` : "YENİ"}
      </AppText>
    </View>
  );
}

/** Fiyat satırı: fiyat (ölçüye göre değişiyorsa aralık), yanında üstü çizili eski fiyat */
export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const text = product.price_max ? `${formatPrice(product.price)} – ${formatPrice(product.price_max)}` : formatPrice(product.price);
  return (
    <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", columnGap: 8 }}>
      <AppText variant={large ? "title" : "small"} weight="bold" style={{ fontVariant: ["tabular-nums"] }}>
        {text}
      </AppText>
      {product.old_price != null ? (
        <AppText variant={large ? "body" : "caption"} tone="muted" style={{ textDecorationLine: "line-through", fontVariant: ["tabular-nums"] }}>
          {formatPrice(product.old_price)}
        </AppText>
      ) : null}
    </View>
  );
}

export interface ProductCardProps {
  product: Product;
  width: number;
  onPress: (product: Product) => void;
}

/**
 * Ürün kartı (mağaza ızgarası ve raflar): beyaz zeminde kare ürün fotoğrafı, sol üstte rozet, altında ad (en çok iki
 * satır) ve fiyat. Fotoğraf 400 px küçük kopyadır (liste hızlı açılsın); ürün sayfası büyük kopyayı kullanır.
 * `memo`: liste kaydırılırken ve sonraki sayfa eklenirken ekrandaki kartlar yeniden çizilmez.
 */
export const ProductCard = memo(function ProductCard({ product, width, onPress }: ProductCardProps) {
  const colors = useColors();
  return (
    <PressableBox
      onPress={() => onPress(product)}
      pressScale={BOX_PRESS_SCALE}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      style={() => ({ width, gap: 8 })}
    >
      {/* Ürün fotoğrafları beyaz zeminde çekilmiştir; kart zemini iki temada da beyazdır */}
      <View style={{ width, height: width, borderRadius: radius.box, overflow: "hidden", backgroundColor: colors.surface.logo }}>
        <Image source={storeThumb(product.image)} style={{ width, height: width }} contentFit="cover" transition={120} recyclingKey={product.id} />
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <ProductBadge product={product} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 4, gap: 2 }}>
        <AppText variant="small" numberOfLines={2} style={{ minHeight: 36 }}>
          {product.name}
        </AppText>
        <ProductPrice product={product} />
      </View>
    </PressableBox>
  );
});
