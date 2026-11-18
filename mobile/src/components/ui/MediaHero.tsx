import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ImageIcon, type LucideIcon } from "lucide-react-native";
import { radius, scrim, useColors } from "@/theme";
import { resolveImageUrl } from "@/utils/image";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";
import { ImagePlaceholder } from "./States";

/** Detay fotoğraf bloğunun yüksekliği: ekran genişliğinin 1.05 katı, en fazla ekran yüksekliğinin %48'i */
export function useMediaHeroHeight() {
  const { width, height } = useWindowDimensions();
  return Math.round(Math.min(width * 1.05, height * 0.48));
}

export interface MediaHeroProps {
  /** Backend'den gelen fotoğraf adresleri (boş olanlar atlanır) */
  images: (string | null | undefined)[];
  /** Verilmezse `useMediaHeroHeight()` */
  height?: number;
  /** Fotoğrafa dokununca (tam ekran önizleme); çözümlenmiş adresi verir */
  onOpen?: (uri: string) => void;
  /** Fotoğraf yokken yer tutucudaki ikon (modülün çizgi ikonu) */
  placeholderIcon?: LucideIcon;
}

/**
 * Detay ekranının üstündeki fotoğraf bloğu (tasarım sistemi §4.7): status bar'ın arkasından başlar,
 * alt köşeleri 30 (gradyan blokla aynı şekil), birden fazla fotoğrafta yatay kaydırılır ve sağ altta sayaç çıkar.
 * Üstte hafif karartma: status bar ve üstte yüzen geri/paylaş butonları okunsun. Fotoğraf yoksa gri yer tutucu.
 */
export function MediaHero({ images, height, onOpen, placeholderIcon = ImageIcon }: MediaHeroProps) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const fallbackHeight = useMediaHeroHeight();
  const h = height ?? fallbackHeight;
  const uris = images.filter((u): u is string => !!u).map((u) => resolveImageUrl(u));
  const [index, setIndex] = useState(0);

  return (
    <View style={{ height: h, borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block, overflow: "hidden", backgroundColor: colors.mono.fill }}>
      {uris.length ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={uris.length > 1}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {uris.map((uri, i) => (
            <PressableBox
              key={`${uri}-${i}`}
              onPress={onOpen ? () => onOpen(uri) : undefined}
              disabled={!onOpen}
              accessibilityRole="imagebutton"
              accessibilityLabel={`Fotoğraf ${i + 1}`}
              style={() => ({ width, height: h })}
            >
              <Image source={{ uri }} style={{ width, height: h }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
            </PressableBox>
          ))}
        </ScrollView>
      ) : (
        <ImagePlaceholder icon={placeholderIcon} iconSize={44} />
      )}
      <LinearGradient pointerEvents="none" colors={[scrim(0.42), "transparent"]} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120 }} />
      {uris.length > 1 ? (
        <View
          pointerEvents="none"
          style={{ position: "absolute", bottom: 14, right: 14, paddingHorizontal: 10, height: 26, borderRadius: 13, justifyContent: "center", backgroundColor: scrim(0.55) }}
        >
          <AppText variant="caption" weight="medium" tone="inverse">
            {index + 1} / {uris.length}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
