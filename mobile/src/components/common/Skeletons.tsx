import React from "react";
import { View } from "react-native";
import { SkeletonGroup, SkeletonLoader } from "./SkeletonLoader";
import { radius, spacing } from "@/theme";

/**
 * Ekrana özel yüklenme iskeletleri (karar, 19 Kasım 2026). İskelet, gelecek içeriğin biçimini taşır: ürün yüklenirken
 * ürün kartı, maç yüklenirken maç kartı görünür; içerik gelince yerleşim zıplamaz. Her yerde aynı "satır" iskeleti
 * kullanılmaz. Bir gruptaki bütün parçalar tek bir nabızla (tek paylaşılan değer, UI thread) yanıp söner.
 */

/** Tek ürün kartı: kare sahne + kategori, ad ve fiyat satırları */
function ProductCardBones({ width }: { width: number }) {
  return (
    <View style={{ width, gap: 8 }}>
      <SkeletonLoader width={width} height={width} borderRadius={radius.box} />
      <View style={{ paddingHorizontal: 4, gap: 6 }}>
        <SkeletonLoader width="35%" height={10} />
        <SkeletonLoader width="85%" height={14} />
        <SkeletonLoader width="45%" height={14} />
      </View>
    </View>
  );
}

/** Mağaza ızgarası: iki sütunlu ürün kartları */
export function ProductGridSkeleton({ cardWidth, rows = 2, columnGap = 12, rowGap = 22 }: { cardWidth: number; rows?: number; columnGap?: number; rowGap?: number }) {
  return (
    <SkeletonGroup>
      <View style={{ paddingHorizontal: spacing.screen, gap: rowGap }}>
        {Array.from({ length: rows }).map((_, row) => (
          <View key={row} style={{ flexDirection: "row", gap: columnGap }}>
            <ProductCardBones width={cardWidth} />
            <ProductCardBones width={cardWidth} />
          </View>
        ))}
      </View>
    </SkeletonGroup>
  );
}

/** Yatay ürün rafı (fırsatlar, ana sayfa mağaza rafı): yan yana üç kart */
export function ProductRailSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <SkeletonGroup>
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: spacing.screen, overflow: "hidden" }}>
        <ProductCardBones width={cardWidth} />
        <ProductCardBones width={cardWidth} />
        <ProductCardBones width={cardWidth} />
      </View>
    </SkeletonGroup>
  );
}

/** Yatay kutu şeridi (mağazadaki koleksiyon kutuları) */
export function TileRailSkeleton({ width, height }: { width: number; height: number }) {
  return (
    <SkeletonGroup>
      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: spacing.screen, overflow: "hidden" }}>
        {[0, 1, 2].map((i) => (
          <SkeletonLoader key={i} width={width} height={height} borderRadius={radius.box} />
        ))}
      </View>
    </SkeletonGroup>
  );
}

/** Büyük vitrin kartı (mağaza vitrini, sıradaki maç kartı): tek büyük blok */
export function HeroCardSkeleton({ height }: { height: number }) {
  return <SkeletonLoader height={height} borderRadius={radius.hero} />;
}

/** Ürün sayfası: kenardan kenara fotoğraf alanı, başlık ve fiyat satırları, seçenek hapları, bilgi kutusu */
export function ProductPageSkeleton({ width }: { width: number }) {
  return (
    <SkeletonGroup>
      <SkeletonLoader width={width} height={width + 60} borderRadius={0} style={{ borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block }} />
      <View style={{ paddingHorizontal: spacing.screen, paddingTop: 20, gap: 12 }}>
        <SkeletonLoader width="22%" height={12} />
        <SkeletonLoader width="88%" height={30} />
        <SkeletonLoader width="60%" height={30} />
        <SkeletonLoader width="32%" height={22} />
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} width={52} height={44} borderRadius={22} />
          ))}
        </View>
        <SkeletonLoader height={64} borderRadius={radius.box} style={{ marginTop: 8 }} />
      </View>
    </SkeletonGroup>
  );
}

/** Manşet şeridi (ana sayfa): geniş fotoğraflı haber kartı ve yanından görünen ikincisi */
export function HeadlineSkeleton({ height = 240 }: { height?: number }) {
  return (
    <SkeletonGroup>
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: spacing.screen, overflow: "hidden" }}>
        <SkeletonLoader width="88%" height={height} borderRadius={radius.hero} />
        <SkeletonLoader width="88%" height={height} borderRadius={radius.hero} />
      </View>
    </SkeletonGroup>
  );
}
