import React, { memo } from "react";
import { View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { AppImage } from "@/components/common/AppImage";
import { radius, useColors } from "@/theme";
import { AppText } from "./AppText";
import { BOX_PRESS_SCALE, PressableBox } from "./PressableBox";

export interface ListRowProps {
  onPress: () => void;
  title: string;
  /** Gri tek satır (ör. "Firma · maaş", "Belediye · 2 gün önce"); bilgiler burada bir kez yazılır */
  meta?: string;
  image?: string | null;
  /** square: fotoğraf (köşeli), round: kişi fotoğrafı, logo: firma logosu (yuvarlak, beyaz zemin, çerçeveyi doldurur) */
  imageShape?: "square" | "round" | "logo";
  thumbSize?: number;
  /** Görsel yokken gri dairede/karede gösterilen çizgi ikon; verilmezse görselsiz satır yalnızca yazıdır */
  placeholderIcon?: LucideIcon;
  /** Satır kendi gri kutusunda (`Surface` görünümü: `mono.fill`, çerçevesiz, köşe 24) ve sağda soluk ok; liste öğeleri arası 10 */
  boxed?: boolean;
}

/**
 * Yeni tasarım dilinin satırı: solda görsel (isteğe bağlı), sağda başlık (en fazla 2 satır) ve gri tek satır.
 * Varsayılan: kenarlık, kutu ve ok yoktur; satırlar boşlukla ayrılır. `boxed`: haber kutusu gibi gri kutu + sağda ok
 * (kullanıcı isteği: iş ilanları ana sayfada ve listede kutuda).
 */
export const ListRow = memo(function ListRow({
  onPress,
  title,
  meta,
  image,
  imageShape = "square",
  thumbSize = 56,
  placeholderIcon: PlaceholderIcon,
  boxed = false,
}: ListRowProps) {
  const colors = useColors();
  const round = imageShape !== "square";
  const showThumb = Boolean(image || PlaceholderIcon);
  const isLogo = imageShape === "logo" && Boolean(image);

  return (
    <PressableBox
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={meta ? `${title}, ${meta}` : title}
      // Kutulu satır kutu gibi hafifçe küçülür; kutusuz satır yalnız soluklaşır (zeminsiz satırın küçülmesi kayma gibi görünür)
      pressScale={boxed ? BOX_PRESS_SCALE : undefined}
      style={(pressed) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: boxed ? 12 : 14,
        opacity: !boxed && pressed ? 0.85 : 1,
        ...(boxed ? { padding: 12, borderRadius: radius.box, backgroundColor: colors.mono.fill } : null),
      })}
    >
      {showThumb ? (
        <View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: round ? thumbSize / 2 : 16,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            // Gri kutunun içinde gri yer tutucu kaybolmasın: kutuda beyaz zemin
            backgroundColor: isLogo ? colors.surface.logo : colors.mono.fillStrong,
            // Beyaz logo zeminli dairede ince çizgi kalır (gri zeminde kaybolmasın)
            borderWidth: isLogo ? 1 : 0,
            borderColor: colors.mono.line,
          }}
        >
          {image ? (
            <AppImage
              thumb
              uri={image}
              recyclingKey={image}
              // Logo kare kaydedilir (kenarları beyaz dolgulu); yuvarlak çerçeveyi tam doldurur, ortada kare kalmaz
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
            />
          ) : PlaceholderIcon ? (
            <PlaceholderIcon size={Math.round(thumbSize * 0.38)} color={colors.ink.muted} strokeWidth={1.5} />
          ) : null}
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="small" weight="medium" numberOfLines={2}>
          {title}
        </AppText>
        {meta ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {meta}
          </AppText>
        ) : null}
      </View>
      {boxed ? <ChevronRight size={18} color={colors.ink.disabled} strokeWidth={1.5} /> : null}
    </PressableBox>
  );
});
