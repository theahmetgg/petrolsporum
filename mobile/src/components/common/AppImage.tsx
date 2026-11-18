import React, { useEffect, useMemo, useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Image as ExpoImage, ImageProps, ImageContentFit } from "expo-image";
import { Image as ImageIcon, type LucideIcon } from "lucide-react-native";
import { useColors } from "@/theme";
import { resolveImageUrl, thumbnailUrl } from "@/utils/image";

export interface AppImageProps extends Omit<ImageProps, "source" | "recyclingKey"> {
  /** Ham görsel adresi (API'den geldiği gibi); çözümleme bileşen içinde yapılır */
  uri?: string | null;
  /** Kart/liste görseli: önce 400 px küçük kopya denenir, yoksa orijinale geçilir (O-3) */
  thumb?: boolean;
  /** FlashList hücre geri dönüşümünde eski görselin bir an görünmemesi için öğe kimliği (PERF-M3) */
  recyclingKey?: string | number | null;
  contentFit?: ImageContentFit;
  /** Görsel yoksa / yüklenemezse gösterilecek ikon */
  fallbackIcon?: LucideIcon;
  fallbackIconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Uygulamanın standart görsel bileşeni (liste, kart, detay):
 * - `memory-disk` önbellek, 200 ms geçiş
 * - `thumb` ile küçük kopya → hata alırsa orijinal → o da yoksa yer tutucu
 * - `recyclingKey` ile FlashList'te hücre geri dönüşümü güvenli
 */
export function AppImage({
  uri,
  thumb = false,
  recyclingKey,
  style,
  contentFit = "cover",
  cachePolicy = "memory-disk",
  transition = 200,
  fallbackIcon: FallbackIcon = ImageIcon,
  fallbackIconSize = 24,
  containerStyle,
  onError,
  ...restProps
}: AppImageProps) {
  const colors = useColors();
  const original = useMemo(() => resolveImageUrl(uri), [uri]);
  const preferred = useMemo(() => (thumb ? thumbnailUrl(uri) : original), [thumb, uri, original]);
  const [src, setSrc] = useState(preferred);
  const [failed, setFailed] = useState(false);

  // Kaynak değişince (veya hücre başka öğeye geçince) baştan dene
  useEffect(() => {
    setSrc(preferred);
    setFailed(false);
  }, [preferred]);

  if (!src || failed) {
    return (
      <View
        style={[{ alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: colors.mono.fill }, style as any, containerStyle]}
      >
        <FallbackIcon size={fallbackIconSize} color={colors.ink.muted} strokeWidth={1.6} />
      </View>
    );
  }

  return (
    <ExpoImage
      source={{ uri: src }}
      style={style}
      contentFit={contentFit}
      cachePolicy={cachePolicy}
      transition={transition}
      recyclingKey={recyclingKey != null ? String(recyclingKey) : undefined}
      onError={(err) => {
        // Küçük kopya yoksa (eski görsel) orijinale geç
        if (src !== original && original) setSrc(original);
        else setFailed(true);
        onError?.(err);
      }}
      {...restProps}
    />
  );
}

export default AppImage;
