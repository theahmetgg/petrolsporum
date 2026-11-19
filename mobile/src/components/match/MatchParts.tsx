import React, { memo } from "react";
import { Text, View } from "react-native";
import { ArrowLeftRight, Flag, Goal, MessageSquareText, Square, Timer } from "lucide-react-native";
import type { MatchEvent, MatchStat, Player } from "@/types";
import { AppText, Surface } from "@/components/ui";
import { HeadingFonts } from "@/lib/fonts";
import { LINE_LABELS } from "@/mocks/players";
import { radius, spacing, useColors } from "@/theme";

/* ───────────── Maç akışı ───────────── */

const EVENT_ICON = {
  KICKOFF: Timer,
  GOAL: Goal,
  YELLOW_CARD: Square,
  RED_CARD: Square,
  SUBSTITUTION: ArrowLeftRight,
  HALF_TIME: Flag,
  SECOND_HALF: Timer,
  FULL_TIME: Flag,
  COMMENT: MessageSquareText,
} as const;

const EVENT_TITLE: Record<MatchEvent["event_type"], string> = {
  KICKOFF: "Başlama vuruşu",
  GOAL: "Gol",
  YELLOW_CARD: "Sarı kart",
  RED_CARD: "Kırmızı kart",
  SUBSTITUTION: "Oyuncu değişikliği",
  HALF_TIME: "Devre arası",
  SECOND_HALF: "İkinci yarı",
  FULL_TIME: "Maç sonu",
  COMMENT: "Pozisyon",
};

/** Akıştaki tek olay: solda dakika, ortada ikon, sağda başlık (+ skor) ve spiker cümlesi. Gol olayı vurguludur. */
export const EventRow = memo(function EventRow({ event }: { event: MatchEvent }) {
  const colors = useColors();
  const Icon = EVENT_ICON[event.event_type];
  const isGoal = event.event_type === "GOAL";
  const iconColor =
    event.event_type === "YELLOW_CARD" ? colors.warning.DEFAULT : event.event_type === "RED_CARD" ? colors.danger.DEFAULT : isGoal ? colors.ink.inverse : colors.ink.DEFAULT;

  return (
    <View style={{ flexDirection: "row", gap: 12, padding: spacing.box, borderRadius: radius.box, backgroundColor: isGoal ? colors.brand.soft : colors.mono.fill }}>
      <View style={{ width: 34, alignItems: "center", paddingTop: 2 }}>
        <Text allowFontScaling={false} style={{ fontFamily: HeadingFonts.bold, fontSize: 20, color: colors.ink.DEFAULT }}>
          {event.minute}'
        </Text>
      </View>
      <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: isGoal ? colors.brand.fill : colors.mono.fillStrong }}>
        <Icon size={18} color={iconColor} fill={event.event_type === "YELLOW_CARD" || event.event_type === "RED_CARD" ? iconColor : "transparent"} strokeWidth={1.75} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="small" weight="bold">
          {EVENT_TITLE[event.event_type]}
          {isGoal ? ` · ${event.home_score} - ${event.away_score}` : ""}
          {event.player_name ? ` · ${event.player_name}` : ""}
        </AppText>
        <AppText variant="small" tone="secondary">
          {event.description}
        </AppText>
      </View>
    </View>
  );
});

/* ───────────── İstatistik ───────────── */

/** İstatistik satırı: iki yanda değerler, ortada ad, altında iki takımın payını gösteren çubuk. */
export const StatBar = memo(function StatBar({ stat }: { stat: MatchStat }) {
  const colors = useColors();
  const total = stat.home + stat.away;
  const homeShare = total ? stat.home / total : 0.5;
  const suffix = stat.percent ? "%" : "";
  return (
    <View style={{ gap: 6 }} accessibilityLabel={`${stat.label}: ${stat.home}${suffix} - ${stat.away}${suffix}`}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <AppText variant="small" weight="bold" style={{ width: 48, fontVariant: ["tabular-nums"] }}>
          {stat.home}
          {suffix}
        </AppText>
        <AppText variant="small" tone="secondary">
          {stat.label}
        </AppText>
        <AppText variant="small" weight="bold" align="right" style={{ width: 48, fontVariant: ["tabular-nums"] }}>
          {stat.away}
          {suffix}
        </AppText>
      </View>
      <View style={{ flexDirection: "row", height: 6, gap: 3 }}>
        <View style={{ flex: Math.max(homeShare, 0.02), borderRadius: 3, backgroundColor: colors.brand.DEFAULT }} />
        <View style={{ flex: Math.max(1 - homeShare, 0.02), borderRadius: 3, backgroundColor: colors.mono.fillStrong }} />
      </View>
    </View>
  );
});

/* ───────────── Kadro listesi ───────────── */

/** Oyuncu satırı: forma numarası dairesi, ad, mevki · yaş · ülke; sağda bu sezonki maç sayısı. */
/**
 * Kadro satırı. `onPress` verilirse satır basılabilir olur (oyuncu sayfası). İşleyici oyuncuyu parametre alır:
 * çağıran taraf modül düzeyinde tek bir sabit fonksiyon verebilir, `memo` bozulmaz.
 */
export const PlayerRow = memo(function PlayerRow({ player, trailing, onPress }: { player: Player; trailing?: React.ReactNode; onPress?: (player: Player) => void }) {
  const colors = useColors();
  const meta = [player.position, player.age ? `${player.age} yaş` : null, player.nationality].filter(Boolean).join(" · ");
  return (
    <Surface onPress={onPress ? () => onPress(player) : undefined} accessibilityLabel={onPress ? `${player.full_name ?? player.name}, ${player.position}, oyuncu sayfası` : undefined}>
      <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.mono.fillStrong }}>
        <Text allowFontScaling={false} style={{ fontFamily: HeadingFonts.bold, fontSize: 20, color: colors.ink.DEFAULT }}>
          {player.shirt_number}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="small" weight="medium" numberOfLines={1}>
          {player.full_name ?? player.name}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {meta}
        </AppText>
      </View>
      {trailing ?? (
        <View style={{ alignItems: "flex-end" }}>
          <AppText variant="small" weight="medium" style={{ fontVariant: ["tabular-nums"] }}>
            {player.appearances}
          </AppText>
          <AppText variant="badge" tone="muted">
            MAÇ
          </AppText>
        </View>
      )}
    </Surface>
  );
});

/** Kadroyu hatlara göre gruplar: Kaleciler, Defans, Orta saha, Forvet */
export function groupByLine(players: Player[]) {
  return (Object.keys(LINE_LABELS) as (keyof typeof LINE_LABELS)[])
    .map((line) => ({ line, title: LINE_LABELS[line], players: players.filter((p) => p.line === line).sort((a, b) => a.shirt_number - b.shirt_number) }))
    .filter((group) => group.players.length);
}
