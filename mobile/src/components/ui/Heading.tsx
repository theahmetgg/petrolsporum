import React from "react";
import { Text, type TextProps } from "react-native";
import { HeadingFonts } from "@/lib/fonts";
import { useColors } from "@/theme";

/** score: skor ve geri sayım rakamı · display: ekran / afiş başlığı · title: kart ve bölüm başlığı · label: küçük üst etiket */
export type HeadingSize = "score" | "display" | "title" | "label";

/** [yazı boyutu, satır yüksekliği, harf aralığı] (dp) */
const SIZES: Record<HeadingSize, [number, number, number]> = {
  score: [64, 64, 0.5],
  display: [34, 36, 0.5],
  title: [24, 26, 0.5],
  label: [15, 18, 1],
};

export interface HeadingProps extends TextProps {
  size?: HeadingSize;
  /** Varsayılan: birincil metin rengi */
  color?: string;
  align?: "left" | "center" | "right";
}

/**
 * Skor ve başlık metni: dar, büyük harfli yazı tipi (Barlow Condensed Bold).
 * Karar (18 Kasım 2026): tasarım duvarında "yalnız Poppins" seçeneğiyle karşılaştırıldı, dar büyük harf seçildi.
 * Düz metin Türkçe kurallarıyla büyük harfe çevrilir (i → İ, ı → I).
 * Gövde metni, açıklama ve buton yazısı için kullanılmaz; onlar `AppText`'tir (Poppins).
 */
export function Heading({ size = "display", color, align, style, children, ...rest }: HeadingProps) {
  const colors = useColors();
  const [fontSize, lineHeight, letterSpacing] = SIZES[size];
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: HeadingFonts.bold,
          fontSize,
          lineHeight,
          letterSpacing,
          color: color ?? colors.ink.DEFAULT,
          textAlign: align,
        },
        style,
      ]}
    >
      {typeof children === "string" ? children.toLocaleUpperCase("tr-TR") : children}
    </Text>
  );
}
