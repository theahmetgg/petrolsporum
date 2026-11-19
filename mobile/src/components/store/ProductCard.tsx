import React, { memo, useCallback } from "react";
import { FlatList, View, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import type { Product } from "@/types";
import { AppText, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { storeThumb } from "@/mocks/storeImages";
import { discountPercent, formatPrice } from "@/utils/format";
import { radius, spacing, useColors, useThemeScheme } from "@/theme";

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

/** 0-1 arası görünürlüğü iki haneli onaltılık ek yapar: `#RRGGBB` + ek = `#RRGGBBAA` */
const alphaHex = (opacity: number) => Math.round(opacity * 255).toString(16).padStart(2, "0");

/**
 * Sahnenin zemin tanımı (CSS gradyan katmanları, üstten alta): kenar kararması, üst parlama, kızıl ışık, zemin.
 * Web'deki `.stage` kuralıyla aynı katmanlardır. Renkler `#RRGGBBAA` yazılır: React Native'in doğrusal gradyan
 * ayrıştırıcısı virgülle böldüğü için `rgba(...)` kullanılamaz.
 * PERFORMANS: zemin tek bir görünümün kendi arka planı olarak çizilir. Önceki hâli (gradyan görünümü + üç daireli
 * SVG) her ürün kartına iki ek yerel görünüm ve pahalı bir çizim ekliyordu; mağaza listesinde kaydırmayı takıyordu.
 */
const stageBackground = (scheme: keyof typeof STAGE) => {
  const s = STAGE[scheme];
  const layers = [
    `radial-gradient(ellipse 74% 74% at 50% 50%, #00000000 55%, #000000${alphaHex(s.vignette)} 100%)`,
    s.sheen ? `radial-gradient(ellipse 70% 70% at 50% -8%, #FFFFFF${alphaHex(s.sheen)} 0%, #FFFFFF00 100%)` : null,
    `radial-gradient(ellipse 46% 46% at 50% 50%, ${s.glow}${alphaHex(s.glowPeak)} 0%, ${s.glow}${alphaHex(s.glowPeak * 0.5)} 45%, ${s.glow}00 100%)`,
    `linear-gradient(180deg, ${s.base[0]} 0%, ${s.base[1]} 100%)`,
  ];
  return layers.filter(Boolean).join(", ");
};
/** Tema başına bir kez hesaplanır; her kart aynı stil nesnesini paylaşır */
const STAGE_STYLE = {
  dark: { experimental_backgroundImage: stageBackground("dark"), borderWidth: 1, borderColor: STAGE.dark.border },
  light: { experimental_backgroundImage: stageBackground("light"), borderWidth: 1, borderColor: STAGE.light.border },
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
  return <View style={[STAGE_STYLE[useThemeScheme()], style]}>{children}</View>;
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

const RAIL_CONTENT = { paddingHorizontal: spacing.screen, gap: 12 } as const;
const railKey = (item: Product) => item.id;

/**
 * Yatay ürün rafı (fırsatlar, benzer ürünler, ana sayfadaki mağaza rafı). Sanal listedir: açılışta yalnız ekrana
 * sığan ilk üç kart çizilir, kalanlar kaydırdıkça gelir. Önceki hâli raftaki bütün kartları (10'a kadar) ekran
 * açılırken çiziyordu. `onPress` sabit bir fonksiyon olmalı (her çizimde yenisi verilirse kartlar baştan çizilir).
 */
export const ProductRail = memo(function ProductRail({ products, cardWidth, onPress }: { products: Product[]; cardWidth: number; onPress: (product: Product) => void }) {
  const renderItem = useCallback(({ item }: { item: Product }) => <ProductCard product={item} width={cardWidth} onPress={onPress} />, [cardWidth, onPress]);
  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={railKey}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={RAIL_CONTENT}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={3}
    />
  );
});
