import React, { memo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import type { Product } from "@/types";
import { AppText, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { storeThumb } from "@/mocks/storeImages";
import { discountPercent, formatPrice } from "@/utils/format";
import { radius, useColors, useThemeScheme } from "@/theme";

/**
 * Sahne ("vitrin spotu") değerleri, tema başına. Web'deki karşılığı `globals.css` içindeki `.stage` sınıfıdır;
 * iki taraf aynı değerleri kullanır, biri değişirse öbürü de değişmeli.
 *  - base: zemin (yukarıdan aşağı). Koyu temada sayfa zemininden de koyu: ürün ve kızıl ışık öne çıksın.
 *  - glow / glowPeak: ürünün arkasındaki kızıl ışığın rengi ve merkezdeki görünürlüğü.
 *  - sheen: üstten gelen soluk beyaz ışık (cam vitrin parlaması).
 *  - vignette: kenarlardaki kararma.
 *  - border: ince çerçeve çizgisi.
 */
const STAGE = {
  dark: { base: ["#1D1D21", "#09090B"], glow: "#D41507", glowPeak: 0.5, sheen: 0.08, vignette: 0.45, border: "rgba(255,255,255,0.09)" },
  light: { base: ["#FFFFFF", "#E7E7EB"], glow: "#DE1606", glowPeak: 0.1, sheen: 0, vignette: 0.05, border: "rgba(15,23,42,0.06)" },
} as const;

/**
 * Ürün zemini ("sahne"): ürün fotoğraflarının arka planı silinmiştir (şeffaf); ürün bu zeminin üstünde durur.
 * Görünüm bir vitrin spotudur (kullanıcı kararı, 19 Kasım 2026: kırmızı ışık olsun, lüks dursun): çok koyu zemin,
 * ürünün tam arkasında sıkı bir Petrolspor kızılı ışık, kenarlara doğru kararma, üstte soluk cam parlaması ve ince
 * çerçeve. Siyah tişört ve polo koyu temada ışığın önünde siluet olarak ayrılır. Açık temada zemin inci beyazıdır,
 * kızıl yalnız hafif bir ton olarak kalır (beyaz ürünler pembeye boyanmasın).
 * Kutu kare değilse katmanlar kutuyla birlikte esner.
 */
export function ProductStage({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const stage = STAGE[useThemeScheme()];
  return (
    <LinearGradient colors={[stage.base[0], stage.base[1]]} style={[{ borderWidth: 1, borderColor: stage.border }, style]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none" pointerEvents="none">
        <Defs>
          <RadialGradient id="stageGlow" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={stage.glow} stopOpacity={stage.glowPeak} />
            <Stop offset="0.45" stopColor={stage.glow} stopOpacity={stage.glowPeak * 0.5} />
            <Stop offset="1" stopColor={stage.glow} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="stageSheen" cx="50" cy="-8" r="70" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={stage.sheen} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="stageVignette" cx="50" cy="50" r="74" gradientUnits="userSpaceOnUse">
            <Stop offset="0.55" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={stage.vignette} />
          </RadialGradient>
        </Defs>
        <Rect width="100" height="100" fill="url(#stageGlow)" />
        <Rect width="100" height="100" fill="url(#stageSheen)" />
        <Rect width="100" height="100" fill="url(#stageVignette)" />
      </Svg>
      {children}
    </LinearGradient>
  );
}

/** Ürün rozeti: "YENİ" (nötr dolu) ya da indirim oranı (kırmızı dolu) */
export function ProductBadge({ product }: { product: Product }) {
  const colors = useColors();
  const sale = product.old_price != null;
  if (!sale && !product.is_new) return null;
  return (
    <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 11, justifyContent: "center", backgroundColor: sale ? colors.brand.fill : colors.mono.solid }}>
      <AppText variant="badge" weight="bold" color={sale ? colors.ink.inverse : colors.mono.onSolid} style={{ letterSpacing: 0.3 }}>
        {sale ? `%${discountPercent(product.old_price!, product.price)}` : "YENİ"}
      </AppText>
    </View>
  );
}

/** Fiyat satırı: fiyat (ölçüye göre değişiyorsa aralık), yanında üstü çizili eski fiyat; indirimli fiyat kırmızı yazılır */
export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const text = product.price_max ? `${formatPrice(product.price)} – ${formatPrice(product.price_max)}` : formatPrice(product.price);
  return (
    <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", columnGap: 8 }}>
      <AppText variant={large ? "title" : "small"} weight="bold" tone={product.old_price != null ? "brand" : "default"} style={{ fontVariant: ["tabular-nums"] }}>
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
 * Ürün kartı (mağaza ızgarası ve raflar): temaya uyan sahne zemininde arka planı silinmiş ürün fotoğrafı, sol üstte
 * rozet, altında kategori, ad (en çok iki satır) ve fiyat. Fotoğraf 400 px küçük kopyadır (liste hızlı açılsın);
 * ürün sayfası büyük kopyayı kullanır.
 * `memo`: liste kaydırılırken ve sonraki sayfa eklenirken ekrandaki kartlar yeniden çizilmez.
 */
export const ProductCard = memo(function ProductCard({ product, width, onPress }: ProductCardProps) {
  return (
    <PressableBox
      onPress={() => onPress(product)}
      pressScale={BOX_PRESS_SCALE}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      style={() => ({ width, gap: 8 })}
    >
      <ProductStage style={{ width, height: width, borderRadius: radius.box, overflow: "hidden" }}>
        <Image source={storeThumb(product.image)} style={{ width, height: width }} contentFit="contain" transition={120} recyclingKey={product.id} />
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <ProductBadge product={product} />
        </View>
      </ProductStage>
      <View style={{ paddingHorizontal: 4, gap: 2 }}>
        <AppText variant="badge" tone="muted" style={{ letterSpacing: 0.4 }}>
          {product.category.toLocaleUpperCase("tr-TR")}
        </AppText>
        <AppText variant="small" weight="medium" numberOfLines={2} style={{ minHeight: 36 }}>
          {product.name}
        </AppText>
        <ProductPrice product={product} />
      </View>
    </PressableBox>
  );
});
