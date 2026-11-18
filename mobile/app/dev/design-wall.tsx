import React from "react";
import { ScrollView, View } from "react-native";
import { Redirect } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, EmptyState, ScreenHeader, SectionHeader } from "@/components/ui";
import { spacing, useTheme } from "@/theme";

const GUTTER = spacing.screen;

/** Karşılaştırma etiketi: seçenek adı (gri hap); `active` seçenek dolu hap */
export function WallLabel({ text, active = false }: { text: string; active?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
        backgroundColor: active ? colors.mono.solid : colors.mono.fillStrong,
      }}
    >
      <AppText variant="caption" weight="semibold" color={active ? colors.mono.onSolid : colors.ink.DEFAULT}>
        {text}
      </AppText>
    </View>
  );
}

/** Deneme bloğu: başlık + açıklama + seçenekler */
export function WallBlock({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.section }}>
      <SectionHeader title={title} />
      <View style={{ paddingHorizontal: GUTTER, gap: 12 }}>
        {note ? (
          <AppText variant="small" tone="muted">
            {note}
          </AppText>
        ) : null}
        {children}
      </View>
    </View>
  );
}

/**
 * Tasarım duvarı (geliştirici ekranı): karar bekleyen tasarım seçenekleri burada yan yana gösterilir.
 * Her seçenek `WallLabel` ile etiketlenir; bloklar `WallBlock` ile, en yeni en üstte eklenir.
 * Karar verilince kazanan seçenek kodda sabitlenir, bloğu buradan silinir ve onaylı tasarım vitrine
 * (`dev/ui-kit.tsx`) taşınır.
 *
 * Verilen kararlar (18 Kasım 2026): alt menü → sabit çubuk (`CustomTabBar`); skor ve başlık yazı tipi → dar büyük
 * harf (`Heading`).
 *
 * Yalnızca geliştirme sürümünde açılır (petrolspor://dev/design-wall); canlıda ana sayfaya yönlenir.
 */
export default function DesignWallScreen() {
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <Screen withTopInset withBottomInset>
      <ScreenHeader title="Tasarım duvarı" subtitle="Karar bekleyen seçenekler" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ══════════ Denemeler (en yeni en üstte; her biri bir WallBlock) ══════════ */}

        <View style={{ paddingHorizontal: GUTTER, marginTop: spacing.section }}>
          <EmptyState compact title="Şu an karar bekleyen tasarım yok" description="Yeni bir seçenek çıktığında burada yan yana gösterilir." />
        </View>
      </ScrollView>
    </Screen>
  );
}
