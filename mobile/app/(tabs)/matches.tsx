import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, ListRowSkeleton, Pill, SegmentedControl, Surface } from "@/components/ui";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { TabHeading } from "@/components/common/TabHeading";
import { MatchRow } from "@/components/match/MatchRow";
import { StandingsTable } from "@/components/match/StandingsTable";
import { PlayerRow, groupByLine } from "@/components/match/MatchParts";
import { useMatches, useSquad, useStandings } from "@/hooks/queries";
import { rankStandings } from "@/lib/standings";
import { HEAD_COACH } from "@/mocks/players";
import { useLiveMatch } from "@/stores/liveMatchStore";
import { formatMonthYear } from "@/utils/format";
import type { Match } from "@/types";
import { spacing } from "@/theme";

type View3 = "fixtures" | "standings" | "squad";
type FixtureFilter = "upcoming" | "played";

/** Maçları aya göre gruplar; sıra verilen dizideki sıradır */
function groupByMonth(matches: Match[]) {
  const groups: { title: string; items: Match[] }[] = [];
  for (const match of matches) {
    const title = formatMonthYear(match.kickoff_at);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(match);
    else groups.push({ title, items: [match] });
  }
  return groups;
}

/**
 * Maçlar sekmesi (prototip ekran 3): Fikstür · Puan Durumu · Kadro. Fikstürde yaklaşan maçlar yakından uzağa,
 * oynananlar yeniden eskiye sıralanır. Canlı simülasyon sürerken fikstürdeki maç satırı ve puan durumu canlı skoru gösterir.
 */
export default function MatchesTab() {
  const tabBarHeight = useTabBarHeight();
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<View3>("fixtures");
  const [filter, setFilter] = useState<FixtureFilter>("upcoming");
  const live = useLiveMatch();
  const { data: matches } = useMatches();
  const { data: standings } = useStandings();
  const { data: squad } = useSquad();

  // Başka ekrandan "Puan Durumu" / "Kadro" görünümüyle açılabilir (ana sayfa kısayolu)
  useEffect(() => {
    if (params.view === "standings" || params.view === "squad" || params.view === "fixtures") setView(params.view);
  }, [params.view]);

  const groups = useMemo(() => {
    if (!matches) return [];
    const list = filter === "upcoming" ? matches.filter((m) => m.status !== "finished") : matches.filter((m) => m.status === "finished").reverse();
    return groupByMonth(list);
  }, [matches, filter]);

  const ranked = useMemo(() => (standings ? rankStandings(standings, live.liveScore) : []), [standings, live.liveScore]);
  const squadGroups = useMemo(() => (squad ? groupByLine(squad) : []), [squad]);

  return (
    <Screen withBottomInset={false}>
      <View style={{ paddingHorizontal: spacing.screen, paddingTop: 12, gap: 14 }}>
        <TabHeading title="Maçlar" />
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { key: "fixtures", label: "Fikstür" },
            { key: "standings", label: "Puan Durumu" },
            { key: "squad", label: "Kadro" },
          ]}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 14, paddingBottom: tabBarHeight + spacing.section }}>
        {view === "fixtures" ? (
          <>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
              <Pill label="Yaklaşan" selected={filter === "upcoming"} onPress={() => setFilter("upcoming")} />
              <Pill label="Oynanan" selected={filter === "played"} onPress={() => setFilter("played")} />
            </View>
            {!matches ? <ListRowSkeleton count={5} /> : null}
            {groups.map((group) => (
              <View key={group.title} style={{ marginTop: 14, gap: spacing.boxGap }}>
                <AppText variant="caption" weight="medium" tone="muted">
                  {group.title}
                </AppText>
                {group.items.map((match) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                    onPress={() => router.push(`/match/${match.id}`)}
                    live={
                      match.id === live.matchId && live.status !== "idle"
                        ? { minute: live.minute, home_score: live.home_score, away_score: live.away_score, finished: live.status === "finished" }
                        : null
                    }
                  />
                ))}
              </View>
            ))}
          </>
        ) : null}

        {view === "standings" ? (
          standings ? (
            <>
              <AppText variant="caption" tone="muted" style={{ marginBottom: 10 }}>
                Trendyol 1. Lig · 2026-27 · 14. hafta sonu
              </AppText>
              <StandingsTable rows={ranked} live={!!live.liveScore} />
            </>
          ) : (
            <ListRowSkeleton count={8} />
          )
        ) : null}

        {view === "squad" ? (
          squad ? (
            <>
              <Surface>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" tone="muted">
                    Teknik direktör
                  </AppText>
                  <AppText variant="subhead">{HEAD_COACH.name}</AppText>
                </View>
                <AppText variant="caption" tone="muted">
                  {HEAD_COACH.since}'dan beri
                </AppText>
              </Surface>
              {squadGroups.map((group) => (
                <View key={group.line} style={{ marginTop: 20, gap: spacing.boxGap }}>
                  <AppText variant="caption" weight="medium" tone="muted">
                    {group.title} · {group.players.length}
                  </AppText>
                  {group.players.map((player) => (
                    <PlayerRow key={player.id} player={player} />
                  ))}
                </View>
              ))}
              <AppText variant="caption" tone="muted" style={{ marginTop: 16 }}>
                Maç sayıları 14. hafta sonu itibarıyladır.
              </AppText>
            </>
          ) : (
            <ListRowSkeleton count={8} />
          )
        ) : null}
      </ScrollView>
    </Screen>
  );
}
