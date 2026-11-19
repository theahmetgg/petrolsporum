import React from "react";
import { Linking, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, CloudSun, MapPin, Navigation } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, ColorIconBox, EmptyState, GlassChip, Heading, IconButton, ListRowSkeleton, Reveal, ScreenHeader, SectionHeader, SignatureBlock, SignatureTopBar, Surface, Toggle } from "@/components/ui";
import { TeamBadge } from "@/components/match/TeamBadge";
import { useMatch, useMatchDay } from "@/hooks/queries";
import { hapticLight } from "@/lib/haptics";
import { MATCH_DAY } from "@/mocks/matchday";
import { getTeam } from "@/mocks/teams";
import { useMatchAlertStore } from "@/stores/matchAlertStore";
import { showToast } from "@/stores/toastStore";
import { formatMatchDay, formatTime, relativeBefore, timeBefore } from "@/utils/format";
import type { Match, MatchDayStep } from "@/types";
import { spacing, useColors } from "@/theme";

/** Akış satırı: solda saat, ortada çizgi üstünde nokta, sağda adım ve notu. Son adım (başlama vuruşu) vurguludur. */
function StepRow({ step, match, last }: { step: MatchDayStep; match: Match; last: boolean }) {
  const colors = useColors();
  const kickoff = step.minutes_before === 0;
  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      <View style={{ width: 62, alignItems: "flex-end", paddingTop: 1 }}>
        <AppText variant="small" weight={kickoff ? "bold" : "medium"} tone={kickoff ? "brand" : "default"} style={{ fontVariant: ["tabular-nums"] }} numberOfLines={1}>
          {match.time_tbd ? relativeBefore(step.minutes_before) : timeBefore(match.kickoff_at, step.minutes_before)}
        </AppText>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, marginTop: 4, backgroundColor: kickoff ? colors.brand.DEFAULT : colors.mono.solid }} />
        {last ? null : <View style={{ width: 2, flex: 1, minHeight: 22, marginTop: 4, backgroundColor: colors.mono.line }} />}
      </View>
      <View style={{ flex: 1, paddingBottom: last ? 0 : 16 }}>
        <AppText variant="small" weight="medium">
          {step.label}
        </AppText>
        {step.note ? (
          <AppText variant="caption" tone="muted">
            {step.note}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Maç Günü rehberi (sıradaki iç saha maçı). Taraftarın maç günü ihtiyaç duyduğu her şey tek ekranda:
 * maçın saati ve yeri, gün içi akış (kapı açılışı → başlama vuruşu), stada yol tarifi, hava durumu,
 * "ilk 11 açıklanınca haber ver" tercihi, bilet ve yanında bulunması gerekenler.
 *
 * DEMO SINIRLARI (`mocks/matchday.ts`): akış saatleri örnektir (kulüp maç haftasında duyurur), hava durumu demo
 * veridir, bildirim tercihi kaydedilir ama bildirim gönderimi Faz 2'dedir. Yol tarifi telefonun harita uygulamasını açar.
 */
export default function MatchDayScreen() {
  const colors = useColors();
  const matchId = MATCH_DAY.match_id;
  const { data: match, isLoading } = useMatch(matchId);
  const { data: info } = useMatchDay(matchId);
  const lineupAlert = useMatchAlertStore((s) => !!s.lineupAlert[matchId]);
  const toggleLineupAlert = useMatchAlertStore((s) => s.toggleLineupAlert);

  if (isLoading || (match && info === undefined)) {
    return (
      <Screen>
        <ScreenHeader title="Maç Günü" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={5} />
        </View>
      </Screen>
    );
  }

  if (!match || !info) {
    return (
      <Screen>
        <ScreenHeader title="Maç Günü" />
        <EmptyState title="Yakında iç saha maçı yok" description="Sıradaki iç saha maçı belli olunca rehber burada açılır." actionLabel="Fikstüre git" onAction={() => router.replace({ pathname: "/(tabs)/matches", params: { view: "fixtures" } })} />
      </Screen>
    );
  }

  const openMaps = () =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.stadium.maps_query)}`).catch(() => showToast("Harita açılamadı.", "error"));

  const onToggleAlert = () => {
    hapticLight();
    const on = toggleLineupAlert(matchId);
    showToast(on ? "İlk 11 açıklanınca haber vereceğiz." : "Kadro bildirimi kapatıldı.", on ? "success" : "info");
  };

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <SignatureBlock>
          <SignatureTopBar title="Maç Günü" meta={`${match.competition} · ${match.week}. hafta`} left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
          <View style={{ alignItems: "center", gap: 10, paddingHorizontal: spacing.screen, marginTop: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <TeamBadge teamId={match.home_team_id} size={48} onBrand />
              <Heading size="score" color={colors.ink.inverse} style={{ fontVariant: ["tabular-nums"] }}>
                {match.time_tbd ? "—:—" : formatTime(match.kickoff_at)}
              </Heading>
              <TeamBadge teamId={match.away_team_id} size={48} onBrand />
            </View>
            <AppText variant="small" weight="medium" color={colors.ink.inverse} align="center">
              {getTeam(match.home_team_id).short_name} – {getTeam(match.away_team_id).short_name}
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              <GlassChip label={formatMatchDay(match.kickoff_at)} />
              <GlassChip icon={MapPin} label={info.stadium.name} />
            </View>
          </View>
        </SignatureBlock>

        <Reveal index={0} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Günün akışı" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface row={false} padding={16} style={{ gap: 0 }}>
              {info.steps.map((step, i) => (
                <StepRow key={step.key} step={step} match={match} last={i === info.steps.length - 1} />
              ))}
            </Surface>
            <AppText variant="caption" tone="muted" style={{ marginTop: 10 }}>
              Örnek akış. Kesin saatleri kulüp maç haftasında duyurur.
            </AppText>
          </View>
        </Reveal>

        <Reveal index={1} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Stada ulaşım" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface row={false} padding={16}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <ColorIconBox name="checkin" size={48} />
                <View style={{ flex: 1 }}>
                  <AppText variant="subhead">{info.stadium.name}</AppText>
                  <AppText variant="small" tone="muted">
                    {info.stadium.city} · Maç saatine yakın çevre yollar yoğunlaşır, erken çık.
                  </AppText>
                </View>
              </View>
              <Button title="Yol tarifi al" icon={Navigation} variant="secondary" fullWidth onPress={openMaps} />
            </Surface>
          </View>
        </Reveal>

        <Reveal index={2} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Hava durumu" subtitle="Maç saatinde" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface padding={16}>
              <CloudSun size={36} color={colors.ink.DEFAULT} strokeWidth={1.5} />
              <View style={{ flex: 1 }}>
                <AppText variant="subhead">{info.weather.condition}</AppText>
                <AppText variant="small" tone="muted">
                  Yağış %{info.weather.rain_chance} · Rüzgâr {info.weather.wind_kmh} km/sa
                </AppText>
              </View>
              <Heading size="display" style={{ fontVariant: ["tabular-nums"] }} accessibilityLabel={`${info.weather.temp_c} derece`}>
                {`${info.weather.temp_c}°`}
              </Heading>
            </Surface>
            <AppText variant="caption" tone="muted" style={{ marginTop: 10 }}>
              Demo veri. Yayında maç saatine göre hava servisinden gelir.
            </AppText>
          </View>
        </Reveal>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Bildirim ve bilet" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            <Surface>
              <ColorIconBox name="squad" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  İlk 11 açıklanınca haber ver
                </AppText>
                <AppText variant="caption" tone="muted">
                  Kadro, maçtan yaklaşık 1 saat önce açıklanır.
                </AppText>
              </View>
              <Toggle value={lineupAlert} onValueChange={onToggleAlert} accessibilityLabel="İlk 11 açıklanınca haber ver" />
            </Surface>
            <Surface onPress={() => router.push("/tickets")} chevron>
              <ColorIconBox name="ticket" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  Bilet ve kombine
                </AppText>
                <AppText variant="caption" tone="muted">
                  Biletini al, nasıl alınacağını gör.
                </AppText>
              </View>
            </Surface>
          </View>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Yanında olsun" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface row={false} padding={16} style={{ gap: 10 }}>
              {info.entry_tips.map((tip) => (
                <View key={tip} style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, marginTop: 7, backgroundColor: colors.brand.DEFAULT }} />
                  <AppText variant="small" style={{ flex: 1 }}>
                    {tip}
                  </AppText>
                </View>
              ))}
            </Surface>
          </View>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Maça hazırlan" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            <Surface onPress={() => router.push("/play/prediction")} chevron>
              <ColorIconBox name="prediction" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  Skor tahmini yap
                </AppText>
                <AppText variant="caption" tone="muted">
                  Düdük çalınca tahminler kilitlenir.
                </AppText>
              </View>
            </Surface>
            <Surface onPress={() => router.push("/play/lineup")} chevron>
              <ColorIconBox name="lineup" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  İlk 11'ini kur
                </AppText>
                <AppText variant="caption" tone="muted">
                  Kendi kadronu diz, paylaş.
                </AppText>
              </View>
            </Surface>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
