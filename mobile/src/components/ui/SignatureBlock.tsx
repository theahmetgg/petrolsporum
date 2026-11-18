import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radius, spacing, useColors } from "@/theme";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { AppText } from "./AppText";

export interface SignatureBlockProps {
  children: React.ReactNode;
  /** Status bar'ın arkasından başlar (üst güvenli alan kadar boşluk eklenir); varsayılan true */
  underStatusBar?: boolean;
  /** En alttaki öğe ile alt kenar arası; köşe kavisi (30) kesmesin diye en az 24 */
  bottomSpace?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * İmza gradyan blok : parlak kırmızı → siyaha yakın bordo, alt köşeler 30, iki temada aynı.
 * Modül ana/liste ekranlarının, ana sayfanın ve yan menünün üst kısmı.
 */
export function SignatureBlock({ children, underStatusBar = true, bottomSpace = spacing.blockBottom, style }: SignatureBlockProps) {
  const { insetTop } = useNavigationMode();
  return (
    <LinearGradient
      colors={gradients.signature}
      locations={[0, 0.42, 0.82, 1]}
      style={[
        {
          paddingTop: underStatusBar ? insetTop + 4 : 0,
          paddingBottom: bottomSpace,
          borderBottomLeftRadius: radius.block,
          borderBottomRightRadius: radius.block,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

export interface SignatureTopBarProps {
  title: string;
  /** Başlığın altında küçük soluk bilgi (ör. firma adı, tarih); kayıt sayısı yazılmaz. Yoksa gösterilmez */
  meta?: string | null;
  /** Solda cam geri; verilmezse sol boş kalır */
  left?: React.ReactNode;
  /** Sağda en fazla bir eylem: geri ile aynı boyda (40) yuvarlak cam ikon düğme (`IconButton variant="frost"`); yazılı hap konmaz */
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Gradyan bloğun üst çubuğu (kullanıcı kararı): solda geri, aynı satırda tam ortada başlık (`display` 600 beyaz; beyaz zeminli `AppHeader` başlığıyla aynı kalınlık, 12 Kasım 2026)
 * ve altında isteğe bağlı soluk kısa bilgi, sağda isteğe bağlı tek eylem. Sol ve sağ eşit genişlikte tutulur;
 * başlık her zaman ekranın ortasında durur.
 */
export function SignatureTopBar({ title, meta, left, right, style }: SignatureTopBarProps) {
  const colors = useColors();
  return (
    <View style={[{ paddingHorizontal: spacing.screen, paddingTop: 6, paddingBottom: 4, flexDirection: "row", alignItems: "center", gap: 8 }, style]}>
      <View style={{ flex: 1, alignItems: "flex-start" }}>{left}</View>
      <View style={{ alignItems: "center", flexShrink: 1 }}>
        <AppText variant="display" weight="bold" tone="inverse" align="center" accessibilityRole="header" numberOfLines={1}>
          {title}
        </AppText>
        {meta ? (
          <AppText variant="small" color={colors.glass.text} align="center" numberOfLines={1}>
            {meta}
          </AppText>
        ) : null}
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
}
