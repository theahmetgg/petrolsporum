import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, CountUp, EmptyState, GlassChip, Heading, HeroNumber, IconButton, ListRowSkeleton, Reveal, ScreenHeader, SectionHeader, SignatureBlock, SignatureTopBar, Surface } from "@/components/ui";
import { PlayerRow } from "@/components/match/MatchParts";
import { LINE_LABELS } from "@/mocks/players";
import { useSquad } from "@/hooks/queries";
import { formatNumber } from "@/utils/format";
import type { Player } from "@/types";
import { spacing, useColors } from "@/theme";

/** Bir maçın süresi (dakika); "maç başına süre" çubuğunun tam dolu hâli */
const FULL_MATCH = 90;

const openPlayer = (player: Player) => router.replace(`/player/${player.id}`);

/** Üç sayılık özet kutusu: sayı sayarak gelir */
function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <Surface row={false} padding={12} style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <CountUp value={value}>{(n) => <Heading size="title">{formatNumber(n)}</Heading>}</CountUp>
      <AppText variant="caption" tone="muted" numberOfLines={1}>
        {label}
      </AppText>
    </Surface>
  );
}

/** Oranlı çubuk: solda etiket, sağda değer, altında dolgu (0-1 arası oran) */
function RatioBar({ label, text, ratio }: { label: string; text: string; ratio: number }) {
  const colors = useColors();
  const percent = Math.max(3, Math.min(100, Math.round(ratio * 100)));
  return (
    <View style={{ gap: 6 }} accessibilityLabel={`${label}: ${text}`}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <AppText variant="small">{label}</AppText>
        <AppText variant="small" weight="bold" style={{ fontVariant: ["tabular-nums"] }}>
          {text}
        </AppText>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.mono.fillStrong }}>
        <View style={{ width: `${percent}%`, height: 8, borderRadius: 4, backgroundColor: colors.brand.DEFAULT }} />
      </View>
    </View>
  );
}

/**
 * Oyuncu sayfası. Üstte imza gradyan blokta iri forma numarası, ad, mevki, yaş ve uyruk; altında bu sezonun
 * özeti (maç, ilk 11, dakika), sezon performansı çubukları ve aynı hattaki diğer oyuncular.
 *
 * VERİ: Kaynakta (kadro sayfası) yalnız maç, ilk 11 ve dakika var. Gol, asist ve kart verisi YOKTUR; uydurulmaz.
 * Sunucu bağlanınca (Faz 2) bu alanlar eklenir. Oyuncu fotoğrafı da yok (görsel hakları); forma numarası yer tutar.
 * Performans çubukları yalnız eldeki üç sayıdan türetilir: takım içi süre sırası, ilk 11 oranı, maç başına süre.
 */
export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { data: squad, isLoading } = useSquad();

  const player = squad?.find((p) => p.id === id);
  const view = useMemo(() => {
    if (!squad || !player) return null;
    const mostMinutes = Math.max(1, ...squad.map((p) => p.minutes));
    // Süre sırası: kendisinden çok süre alan oyuncu sayısı + 1
    const minutesRank = squad.filter((p) => p.minutes > player.minutes).length + 1;
    const sameLine = squad.filter((p) => p.line === player.line && p.id !== player.id).sort((a, b) => b.minutes - a.minutes);
    return { mostMinutes, minutesRank, sameLine, squadSize: squad.length };
  }, [squad, player]);

  if (isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Oyuncu" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={5} />
        </View>
      </Screen>
    );
  }

  if (!player || !view) {
    return (
      <Screen>
        <ScreenHeader title="Oyuncu" />
        <EmptyState title="Oyuncu bulunamadı" description="Bu oyuncu kadrodan ayrılmış olabilir." actionLabel="Kadroya dön" onAction={() => router.back()} />
      </Screen>
    );
  }

  const played = player.appearances > 0;
  const fromBench = player.appearances - player.starts;
  const perMatch = played ? Math.round(player.minutes / player.appearances) : 0;
  const chips = [player.age ? `${player.age} yaş` : null, player.nationality].filter((c): c is string => !!c);

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <SignatureBlock>
          <SignatureTopBar title="Oyuncu" meta={LINE_LABELS[player.line]} left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
          <View style={{ alignItems: "center", gap: 6, paddingHorizontal: spacing.screen, marginTop: 12 }}>
            <HeroNumber main={`${player.shirt_number}`} label={player.position} accessibilityLabel={`Forma numarası ${player.shirt_number}, ${player.position}`} />
            <Heading size="display" color={colors.ink.inverse} align="center" accessibilityRole="header">
              {player.full_name ?? player.name}
            </Heading>
            {chips.length ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 }}>
                {chips.map((chip) => (
                  <GlassChip key={chip} label={chip} />
                ))}
              </View>
            ) : null}
          </View>
        </SignatureBlock>

        <Reveal index={0} style={{ paddingHorizontal: spacing.screen, marginTop: 20 }}>
          <View style={{ flexDirection: "row", gap: spacing.boxGap }}>
            <StatBox value={player.appearances} label="Maç" />
            <StatBox value={player.starts} label="İlk 11" />
            <StatBox value={player.minutes} label="Dakika" />
          </View>
        </Reveal>

        <Reveal index={1} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Sezon performansı" subtitle="2026-27 · Trendyol 1. Lig" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            {played ? (
              <Surface row={false} padding={16} style={{ gap: 16 }}>
                <RatioBar label="Sahada kalma süresi" text={`${formatNumber(player.minutes)} dk · takımda ${view.minutesRank}.`} ratio={player.minutes / view.mostMinutes} />
                <RatioBar label="İlk 11'de başlama" text={`${player.starts} / ${player.appearances} maç`} ratio={player.starts / player.appearances} />
                <RatioBar label="Maç başına süre" text={`${perMatch} dk`} ratio={perMatch / FULL_MATCH} />
                {fromBench > 0 ? (
                  <AppText variant="caption" tone="muted">
                    {fromBench} maçta oyuna sonradan girdi.
                  </AppText>
                ) : null}
              </Surface>
            ) : (
              <Surface row={false} padding={16}>
                <AppText variant="small" weight="medium">
                  Bu sezon henüz forma giymedi
                </AppText>
                <AppText variant="caption" tone="muted">
                  İlk maçına çıktığında istatistikleri burada görünecek.
                </AppText>
              </Surface>
            )}
            <AppText variant="caption" tone="muted" style={{ marginTop: 10 }}>
              Sayılar 14. hafta sonu itibarıyladır. Gol ve asist bilgisi canlı veri bağlanınca eklenecek.
            </AppText>
          </View>
        </Reveal>

        {view.sameLine.length ? (
          <Reveal index={2} style={{ marginTop: spacing.section }}>
            <SectionHeader title={LINE_LABELS[player.line]} subtitle="Aynı hattaki oyuncular" />
            <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
              {view.sameLine.map((other) => (
                <PlayerRow key={other.id} player={other} onPress={openPlayer} />
              ))}
            </View>
          </Reveal>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
