import React, { useMemo, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Play, RotateCcw } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, EmptyState, Heading, IconButton, ListRowSkeleton, ScreenHeader, SegmentedControl, SignatureBlock, SignatureTopBar, Surface } from "@/components/ui";
import { LiveBadge } from "@/components/common/LiveBadge";
import { TeamBadge } from "@/components/match/TeamBadge";
import { Pitch } from "@/components/match/Pitch";
import { StandingsTable } from "@/components/match/StandingsTable";
import { EventRow, StatBar } from "@/components/match/MatchParts";
import { FORMATIONS } from "@/constants/formations";
import { useMatch, useSquad, useStandings } from "@/hooks/queries";
import { rankStandings } from "@/lib/standings";
import { USUAL_XI } from "@/mocks/players";
import { getTeam, OWN_TEAM_ID } from "@/mocks/teams";
import { useLiveMatch } from "@/stores/liveMatchStore";
import { showToast } from "@/stores/toastStore";
import { formatMatchDay, formatTime } from "@/utils/format";
import { spacing, useColors } from "@/theme";

type Tab = "flow" | "lineup" | "stats" | "table";

/** Resmi bilet satış sitesi (uygulama içinde bilet satılmaz; Ar-Ge belgesi 9.4) */
const TICKET_URL = "https://www.passo.com.tr";

/** Skor tablosundaki takım sütunu */
function TeamColumn({ teamId }: { teamId: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
      <TeamBadge teamId={teamId} size={68} onBrand />
      <AppText variant="small" weight="medium" color={colors.ink.inverse} align="center" numberOfLines={2}>
        {getTeam(teamId).short_name}
      </AppText>
    </View>
  );
}

/**
 * Maç merkezi (prototip ekran 3). Üstte imza gradyan blokta skor tablosu, altında dört sekme:
 * Akış · Kadro · İstatistik · Puan (Ar-Ge belgesi 8.1, 4. referans).
 * Sıradaki maçta "Canlı maç simülasyonu" çalışır (demo): gol gelince skor, akış, istatistik ve puan durumu birlikte değişir.
 */
export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [tab, setTab] = useState<Tab>("flow");
  const { data: match, isLoading } = useMatch(id ?? "");
  const { data: standings } = useStandings();
  const { data: squad } = useSquad();
  const live = useLiveMatch();

  const isLiveMatch = !!match && match.id === live.matchId;
  const liveOn = isLiveMatch && live.status !== "idle";
  const ranked = useMemo(() => (standings ? rankStandings(standings, liveOn ? live.liveScore : null) : []), [standings, liveOn, live.liveScore]);
  const lineupPlayers = useMemo(() => USUAL_XI.numbers.map((n) => squad?.find((p) => p.shirt_number === n) ?? null), [squad]);

  if (isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Maç Merkezi" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={4} />
        </View>
      </Screen>
    );
  }

  if (!match) {
    return (
      <Screen>
        <ScreenHeader title="Maç Merkezi" />
        <EmptyState title="Maç bulunamadı" description="Bu maç fikstürden kaldırılmış olabilir." actionLabel="Fikstüre dön" onAction={() => router.replace("/(tabs)/matches")} />
      </Screen>
    );
  }

  const finished = match.status === "finished";
  const homeScore = liveOn ? live.home_score : match.home_score;
  const awayScore = liveOn ? live.away_score : match.away_score;
  const isHome = match.home_team_id === OWN_TEAM_ID;

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} stickyHeaderIndices={[]}>
        <SignatureBlock>
          <SignatureTopBar
            title="Maç Merkezi"
            meta={`${match.competition} · ${match.week}. hafta`}
            left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />}
          />

          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.screen, marginTop: 20 }}>
            <TeamColumn teamId={match.home_team_id} />
            <View style={{ alignItems: "center", minWidth: 110, gap: 6 }}>
              {homeScore != null && awayScore != null ? (
                <Heading size="score" color={colors.ink.inverse} style={{ fontVariant: ["tabular-nums"] }} accessibilityLabel={`Skor ${homeScore} ${awayScore}`}>
                  {`${homeScore} - ${awayScore}`}
                </Heading>
              ) : (
                <Heading size="display" color={colors.ink.inverse}>
                  {match.time_tbd ? "—:—" : formatTime(match.kickoff_at)}
                </Heading>
              )}
              {liveOn ? (
                <LiveBadge onBrand label={live.status === "finished" ? "MAÇ BİTTİ" : `CANLI ${live.minute}'`} />
              ) : (
                <AppText variant="caption" color={colors.glass.text} align="center">
                  {finished ? "Maç bitti" : match.time_tbd ? "Saat açıklanacak" : "Başlama saati"}
                </AppText>
              )}
            </View>
            <TeamColumn teamId={match.away_team_id} />
          </View>

          <AppText variant="caption" color={colors.glass.text} align="center" style={{ marginTop: 16, paddingHorizontal: spacing.screen }}>
            {formatMatchDay(match.kickoff_at)}
            {match.venue ? ` · ${match.venue}` : ""}
          </AppText>
        </SignatureBlock>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: 16 }}>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { key: "flow", label: "Akış" },
              { key: "lineup", label: "Kadro" },
              { key: "stats", label: "İstatistik" },
              { key: "table", label: "Puan" },
            ]}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: 16, gap: spacing.boxGap }}>
          {/* ───────── Akış ───────── */}
          {tab === "flow" && isLiveMatch ? (
            <>
              <Surface row={false} padding={14}>
                <AppText variant="small" weight="medium">
                  Canlı maç simülasyonu (demo)
                </AppText>
                <AppText variant="caption" tone="muted">
                  Bu maç henüz oynanmadı. Simülasyon, maç günü ekranın nasıl çalışacağını gösterir: 90 dakika yaklaşık 1 dakikada oynar.
                </AppText>
                {live.status === "idle" ? (
                  <Button title="Simülasyonu başlat" icon={Play} fullWidth onPress={live.start} />
                ) : (
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Button title="Baştan oynat" icon={RotateCcw} variant="secondary" onPress={live.start} style={{ flex: 1 }} />
                    <Button title="Sıfırla" variant="ghost" onPress={live.reset} />
                  </View>
                )}
              </Surface>
              {live.events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {live.status === "idle" && isHome ? (
                <Surface onPress={() => Linking.openURL(TICKET_URL).catch(() => showToast("Bağlantı açılamadı.", "error"))} chevron>
                  <View style={{ flex: 1 }}>
                    <AppText variant="small" weight="medium">
                      Bilet
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      Biletler resmi satış sitesinden alınır. Uygulamada bilet satılmaz.
                    </AppText>
                  </View>
                </Surface>
              ) : null}
            </>
          ) : null}

          {tab === "flow" && !isLiveMatch ? (
            finished ? (
              <Surface row={false} padding={14}>
                <AppText variant="small" weight="medium">
                  Maç özeti
                </AppText>
                <AppText variant="body" tone="secondary">
                  {match.summary ?? "Bu maçın özeti arşivde yok."}
                </AppText>
                <AppText variant="caption" tone="muted">
                  Dakika dakika anlatım yalnız canlı takip edilen maçlarda tutulur.
                </AppText>
              </Surface>
            ) : (
              <Surface row={false}>
                <EmptyState compact title="Maç henüz oynanmadı" description="Maç başladığında dakika dakika anlatım burada akar." />
              </Surface>
            )
          ) : null}

          {/* ───────── Kadro ───────── */}
          {tab === "lineup" ? (
            <>
              <AppText variant="caption" tone="muted">
                {finished || liveOn ? "Batman Petrolspor" : "Muhtemel 11"} · {USUAL_XI.formation} · sezonun en çok oynayan on biri
              </AppText>
              <Pitch slots={FORMATIONS[USUAL_XI.formation]} players={lineupPlayers} />
              <AppText variant="caption" tone="muted">
                Rakip kadrosu ve maç kadroları maç günü açıklanır.
              </AppText>
            </>
          ) : null}

          {/* ───────── İstatistik ───────── */}
          {tab === "stats" ? (
            liveOn ? (
              <Surface row={false} padding={16}>
                <View style={{ gap: 16 }}>
                  {live.stats.map((stat) => (
                    <StatBar key={stat.label} stat={stat} />
                  ))}
                </View>
              </Surface>
            ) : (
              <Surface row={false}>
                <EmptyState
                  compact
                  title={finished ? "Bu maçın istatistiği arşivde yok" : "İstatistik maç başlayınca gelir"}
                  description={isLiveMatch ? "Akış sekmesinden simülasyonu başlat." : undefined}
                />
              </Surface>
            )
          ) : null}

          {/* ───────── Puan ───────── */}
          {tab === "table" ? standings ? <StandingsTable rows={ranked} live={liveOn} /> : <ListRowSkeleton count={8} /> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
