import React, { memo } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import type { Match } from "@/types";
import { AppText, Heading, PopOnChange, PressableBox } from "@/components/ui";
import { BOX_PRESS_SCALE } from "@/components/ui/PressableBox";
import { LiveBadge } from "@/components/common/LiveBadge";
import { TeamBadge } from "./TeamBadge";
import { getTeam } from "@/mocks/teams";
import { useNow } from "@/hooks/useNow";
import { useLiveMatch } from "@/stores/liveMatchStore";
import { countdownParts, formatMatchDay, formatTime, pad2 } from "@/utils/format";
import { gradients, radius, useColors } from "@/theme";

/** Geri sayım kutusu: iri rakam + altında birim. `memo`: her saniye yalnız değeri değişen kutu (saniye) çizilir. */
const CountBox = memo(function CountBox({ value, unit }: { value: string; unit: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 14, backgroundColor: colors.glass.DEFAULT }}>
      <Heading size="title" color={colors.ink.inverse} style={{ fontVariant: ["tabular-nums"] }}>
        {value}
      </Heading>
      <AppText variant="badge" color={colors.glass.text}>
        {unit}
      </AppText>
    </View>
  );
});

/**
 * Geri sayım. Saniyede bir güncellenen saat yalnız bu bileşende tutulur: kartın geri kalanı (gradyan, armalar,
 * yazılar) her saniye yeniden çizilmez.
 */
function Countdown({ kickoffAt }: { kickoffAt: string }) {
  const colors = useColors();
  const left = countdownParts(kickoffAt, useNow(1000));
  if (!left) {
    return (
      <AppText variant="small" weight="medium" color={colors.ink.inverse} align="center">
        Maç saati geldi. Maç merkezinden takip et.
      </AppText>
    );
  }
  return (
    <View style={{ flexDirection: "row", gap: 8 }} accessibilityLabel={`Maça ${left.days} gün ${left.hours} saat ${left.minutes} dakika kaldı`}>
      <CountBox value={pad2(left.days)} unit="GÜN" />
      <CountBox value={pad2(left.hours)} unit="SAAT" />
      <CountBox value={pad2(left.minutes)} unit="DAKİKA" />
      <CountBox value={pad2(left.seconds)} unit="SANİYE" />
    </View>
  );
}

/** Takım sütunu: rozet + altında kısa ad */
function TeamColumn({ teamId }: { teamId: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
      <TeamBadge teamId={teamId} size={64} onBrand />
      <AppText variant="small" weight="medium" color={colors.ink.inverse} align="center" numberOfLines={2}>
        {getTeam(teamId).short_name}
      </AppText>
    </View>
  );
}

export interface NextMatchCardProps {
  match: Match;
  onPress: () => void;
}

/**
 * Sıradaki maç kartı (ana sayfanın en üstü): imza gradyan zeminde iri armalı skor düzeni (arma - saat / skor - arma),
 * altında geri sayım. Canlı simülasyon başladıysa geri sayımın yerini canlı skor ve dakika alır.
 */
export function NextMatchCard({ match, onPress }: NextMatchCardProps) {
  const colors = useColors();
  const live = useLiveMatch();
  const isLive = live.matchId === match.id && live.status !== "idle";

  return (
    <PressableBox onPress={onPress} pressScale={BOX_PRESS_SCALE} accessibilityRole="button" accessibilityLabel="Maç merkezini aç" style={() => ({ borderRadius: radius.hero, overflow: "hidden" })}>
      <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ padding: 16, gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <AppText variant="caption" weight="medium" color={colors.glass.text}>
            {match.competition} · {match.week}. hafta
          </AppText>
          {isLive ? (
            <LiveBadge onBrand label={live.status === "finished" ? "MAÇ BİTTİ" : `CANLI ${live.minute}'`} />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <AppText variant="caption" weight="medium" color={colors.ink.inverse}>
                Maç merkezi
              </AppText>
              <ChevronRight size={14} color={colors.ink.inverse} strokeWidth={2} />
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TeamColumn teamId={match.home_team_id} />
          <View style={{ alignItems: "center", minWidth: 96 }}>
            {isLive ? (
              <PopOnChange trigger={`${live.home_score}-${live.away_score}`}>
                <Heading size="score" color={colors.ink.inverse} style={{ fontVariant: ["tabular-nums"] }}>
                  {`${live.home_score} - ${live.away_score}`}
                </Heading>
              </PopOnChange>
            ) : (
              <>
                <Heading size="display" color={colors.ink.inverse}>
                  {match.time_tbd ? "—:—" : formatTime(match.kickoff_at)}
                </Heading>
                <AppText variant="caption" color={colors.glass.text} align="center">
                  {formatMatchDay(match.kickoff_at)}
                </AppText>
              </>
            )}
          </View>
          <TeamColumn teamId={match.away_team_id} />
        </View>

        {!isLive ? <Countdown kickoffAt={match.kickoff_at} /> : null}

        {match.venue ? (
          <AppText variant="caption" color={colors.glass.text} align="center">
            {match.venue}
          </AppText>
        ) : null}
      </LinearGradient>
    </PressableBox>
  );
}
