import React, { memo } from "react";
import { View } from "react-native";
import type { Match } from "@/types";
import { AppText, Heading, Surface } from "@/components/ui";
import { LiveBadge } from "@/components/common/LiveBadge";
import { TeamBadge } from "./TeamBadge";
import { getTeam, OWN_TEAM_ID } from "@/mocks/teams";
import { dayBadge, formatTime } from "@/utils/format";
import { useColors } from "@/theme";

/** Kendi takımımız açısından sonuç: galibiyet / beraberlik / mağlubiyet */
export const ownResult = (match: Match): "W" | "D" | "L" | null => {
  if (match.home_score == null || match.away_score == null) return null;
  const own = match.home_team_id === OWN_TEAM_ID ? match.home_score - match.away_score : match.away_score - match.home_score;
  return own > 0 ? "W" : own === 0 ? "D" : "L";
};

const RESULT_LABEL = { W: "G", D: "B", L: "M" } as const;

/** Takım satırı: küçük rozet + ad + (varsa) skor */
function TeamLine({ teamId, score, bold }: { teamId: string; score: number | null; bold: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <TeamBadge teamId={teamId} size={24} />
      <AppText variant="small" weight={bold ? "bold" : "regular"} numberOfLines={1} style={{ flex: 1 }}>
        {getTeam(teamId).name}
      </AppText>
      {score != null ? (
        <AppText variant="small" weight={bold ? "bold" : "regular"} style={{ fontVariant: ["tabular-nums"], minWidth: 14, textAlign: "right" }}>
          {score}
        </AppText>
      ) : null}
    </View>
  );
}

export interface MatchRowProps {
  match: Match;
  onPress: () => void;
  /** Canlı simülasyon bu maçtaysa anlık skor ve dakika */
  live?: { minute: number; home_score: number; away_score: number; finished: boolean } | null;
}

/**
 * Fikstür satırı: solda gün kutusu, ortada iki takım alt alta (skorla), sağda sonuç harfi (G / B / M) ya da saat.
 * Kazanan takım kalın yazılır. Canlı maçta sağda "CANLI" rozeti durur.
 */
export const MatchRow = memo(function MatchRow({ match, onPress, live }: MatchRowProps) {
  const colors = useColors();
  const badge = dayBadge(match.kickoff_at);
  const home = live ? live.home_score : match.home_score;
  const away = live ? live.away_score : match.away_score;
  const result = live ? null : ownResult(match);
  const resultColor = result === "W" ? colors.success.DEFAULT : result === "L" ? colors.danger.DEFAULT : colors.ink.muted;
  const homeLeads = home != null && away != null && home > away;
  const awayLeads = home != null && away != null && away > home;

  return (
    <Surface onPress={onPress} accessibilityLabel={`${getTeam(match.home_team_id).name} - ${getTeam(match.away_team_id).name}, ${badge.day} ${badge.month}`}>
      <View style={{ width: 44, alignItems: "center" }}>
        <Heading size="title">{badge.day}</Heading>
        <AppText variant="badge" tone="muted">
          {badge.month}
        </AppText>
      </View>
      <View style={{ width: 1, alignSelf: "stretch", backgroundColor: colors.mono.line }} />
      <View style={{ flex: 1, gap: 6 }}>
        <TeamLine teamId={match.home_team_id} score={home} bold={homeLeads || (home == null && match.home_team_id === OWN_TEAM_ID)} />
        <TeamLine teamId={match.away_team_id} score={away} bold={awayLeads || (away == null && match.away_team_id === OWN_TEAM_ID)} />
      </View>
      <View style={{ minWidth: 44, alignItems: "flex-end" }}>
        {live ? (
          <LiveBadge label={live.finished ? "BİTTİ" : `${live.minute}'`} />
        ) : result ? (
          <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.mono.fillStrong }}>
            <AppText variant="caption" weight="bold" color={resultColor}>
              {RESULT_LABEL[result]}
            </AppText>
          </View>
        ) : (
          <AppText variant="caption" weight="medium" tone="secondary">
            {match.time_tbd ? "Saat\naçıklanacak" : formatTime(match.kickoff_at)}
          </AppText>
        )}
      </View>
    </Surface>
  );
});
