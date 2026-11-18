import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Store, X, type LucideIcon } from "lucide-react-native";
import { radius, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { Card } from "./Card";
import { IconButton } from "./IconButton";
import { SkeletonGroup, SkeletonLoader } from "../common/SkeletonLoader";

// ── Görsel yer tutucu ──────────────────────────────────────────────
/** Görsel yokken nötr gri zemin + soluk ikon (stok fotoğraf yerine; tasarım sistemi §4.7). */
export function ImagePlaceholder({ icon: Icon = Store, iconSize = 36, style }: { icon?: LucideIcon; iconSize?: number; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return (
    <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.mono.fillStrong }, style]}>
      <Icon size={iconSize} color={colors.ink.muted} strokeWidth={1.5} />
    </View>
  );
}

// ── Hata durumu ────────────────────────────────────────────────────
export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  /** Kullanılmıyor: hata durumunda ikon gösterilmez. Mevcut çağrılar bozulmasın diye kabul edilir. */
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
}

/** Ağ / sunucu hatası (tasarım sistemi §4.6): ikonsuz başlık + açıklama + "Tekrar dene". */
export function ErrorState({
  title = "Bir sorun oluştu",
  description = "Bağlantını kontrol edip tekrar dene.",
  onRetry,
  style,
}: ErrorStateProps) {
  return (
    <View style={[{ alignItems: "center", paddingVertical: 40, paddingHorizontal: 32 }, style]}>
      <AppText variant="subhead" weight="medium" align="center">
        {title}
      </AppText>
      <AppText variant="small" tone="secondary" align="center" style={{ marginTop: 6 }}>
        {description}
      </AppText>
      {onRetry ? <Button title="Tekrar dene" variant="secondary" onPress={onRetry} style={{ marginTop: 20, alignSelf: "center" }} /> : null}
    </View>
  );
}

// ── İstatistik kutusu ──────────────────────────────────────────────
/** Profil / işletme paneli sayıları (ör. 12 Gönderi). */
export function StatTile({ value, label, onPress, style }: { value: number | string; label: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const text = typeof value === "number" ? value.toLocaleString("tr-TR") : value;
  return (
    <Card onPress={onPress} elevated={false} padding={12} style={[{ flex: 1, alignItems: "center" }, style]} accessibilityLabel={`${text} ${label}`}>
      <AppText variant="headline">{text}</AppText>
      <AppText variant="caption" tone="muted" numberOfLines={1}>
        {label}
      </AppText>
    </Card>
  );
}

// ── Alt çekmece başlığı ────────────────────────────────────────────
/**
 * Tüm bottom sheet'lerde aynı başlık (tasarım sistemi §5.1): solda `headline` medium başlık + isteğe bağlı gri açıklama,
 * sağda gri daire içinde kapat (36). Alt çizgi yok; içerikle arası 16.
 */
export function SheetHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose?: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
      <View style={{ flex: 1, paddingTop: onClose ? 6 : 0 }}>
        <AppText variant="headline" weight="medium" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {onClose ? <IconButton icon={X} label="Kapat" variant="surface" size={36} iconSize={16} onPress={onClose} /> : null}
    </View>
  );
}

// ── Hazır iskeletler ───────────────────────────────────────────────
/** Liste satırı iskeleti (ikon + iki satır metin). */
export function ListRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SkeletonGroup>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12 }}>
          <SkeletonLoader width={44} height={44} borderRadius={radius.control} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonLoader width="60%" height={14} />
            <SkeletonLoader width="40%" height={12} />
          </View>
        </View>
      ))}
    </SkeletonGroup>
  );
}

/** Görselli kart iskeleti. */
export function CardSkeleton({ width = "100%", imageHeight = 140 }: { width?: number | string; imageHeight?: number }) {
  return (
    <SkeletonGroup>
      <Card padding={0} style={{ width: width as any }}>
        <SkeletonLoader height={imageHeight} borderRadius={0} />
        <View style={{ padding: 14, gap: 8 }}>
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="45%" height={12} />
        </View>
      </Card>
    </SkeletonGroup>
  );
}
