import React, { memo } from "react";
import { View } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import type { RankedStanding } from "@/types";
import { AppText } from "@/components/ui";
import { TeamBadge } from "./TeamBadge";
import { getTeam, OWN_TEAM_ID } from "@/mocks/teams";
import { ZONES } from "@/mocks/standings";
import { radius, useColors } from "@/theme";

const NUM_W = 26;
const COLS = ["O", "G", "B", "M", "AV", "P"] as const;

/** Sayı hücresi: sabit genişlik, rakamlar alt alta hizalı */
function Num({ value, bold, muted }: { value: string | number; bold?: boolean; muted?: boolean }) {
  return (
    <AppText variant="caption" weight={bold ? "bold" : "regular"} tone={muted ? "muted" : "default"} align="center" style={{ width: NUM_W, fontVariant: ["tabular-nums"] }}>
      {value}
    </AppText>
  );
}

const Row = memo(function Row({ row }: { row: RankedStanding }) {
  const colors = useColors();
  const own = row.team_id === OWN_TEAM_ID;
  // Bölge çizgisi: ilk 2 doğrudan yükselir, 3-7 play-off, son 4 düşer
  const zone =
    row.rank <= ZONES.promotion ? colors.success.DEFAULT : row.rank <= ZONES.playoff ? colors.info.DEFAULT : row.rank >= ZONES.relegationFrom ? colors.danger.DEFAULT : "transparent";

  return (
    <View
      accessibilityLabel={`${row.rank}. ${getTeam(row.team_id).name}, ${row.points} puan`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        paddingRight: 8,
        borderRadius: radius.control,
        backgroundColor: own ? colors.brand.soft : "transparent",
      }}
    >
      <View style={{ width: 3, height: 22, borderRadius: 2, backgroundColor: zone }} />
      <View style={{ width: 30, alignItems: "center" }}>
        <AppText variant="caption" weight={own ? "bold" : "medium"} style={{ fontVariant: ["tabular-nums"] }}>
          {row.rank}
        </AppText>
      </View>
      <TeamBadge teamId={row.team_id} size={22} />
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4, marginLeft: 8 }}>
        <AppText variant="small" weight={own ? "bold" : "regular"} numberOfLines={1} style={{ flexShrink: 1 }}>
          {getTeam(row.team_id).short_name}
        </AppText>
        {row.rank_change > 0 ? <ChevronUp size={14} color={colors.success.DEFAULT} strokeWidth={2.5} /> : null}
        {row.rank_change < 0 ? <ChevronDown size={14} color={colors.danger.DEFAULT} strokeWidth={2.5} /> : null}
      </View>
      <Num value={row.played} muted />
      <Num value={row.won} muted />
      <Num value={row.drawn} muted />
      <Num value={row.lost} muted />
      <Num value={row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff} muted />
      <Num value={row.points} bold />
    </View>
  );
});

/** Açıklama satırı: renkli çizgi + anlamı */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 3, height: 12, borderRadius: 2, backgroundColor: color }} />
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

export interface StandingsTableProps {
  rows: RankedStanding[];
  /** Canlı maç işlendiyse üstte not gösterilir */
  live?: boolean;
}

/**
 * Puan durumu tablosu: sıra, takım, O-G-B-M-AV-P. Kendi takımımızın satırı vurgulu. Canlı maç sırasında
 * sırası değişen takımın yanında yukarı / aşağı ok çıkar (canlı puan durumu, Ar-Ge belgesi Bölüm 3, madde 7).
 */
export function StandingsTable({ rows, live = false }: StandingsTableProps) {
  const colors = useColors();
  return (
    <View>
      {live ? (
        <AppText variant="caption" tone="brand" style={{ marginBottom: 8 }}>
          Canlı: tablo şu anki skora göre hesaplanıyor.
        </AppText>
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", height: 28, paddingRight: 8 }}>
        <View style={{ width: 33 }}>
          <AppText variant="badge" tone="muted" align="center">
            #
          </AppText>
        </View>
        <AppText variant="badge" tone="muted" style={{ flex: 1 }}>
          TAKIM
        </AppText>
        {COLS.map((c) => (
          <AppText key={c} variant="badge" tone="muted" align="center" style={{ width: NUM_W }}>
            {c}
          </AppText>
        ))}
      </View>
      {rows.map((row) => (
        <Row key={row.team_id} row={row} />
      ))}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
        <Legend color={colors.success.DEFAULT} label="Süper Lig" />
        <Legend color={colors.info.DEFAULT} label="Play-off" />
        <Legend color={colors.danger.DEFAULT} label="Küme düşme" />
      </View>
    </View>
  );
}
