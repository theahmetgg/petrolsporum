import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Avatar, ColorIconBox, Heading, ListRowSkeleton, ScreenHeader, SegmentedControl, Surface } from "@/components/ui";
import { useLeaderboard } from "@/hooks/queries";
import { withMyPoints } from "@/lib/leaderboard";
import { LIVE_MATCH_ID } from "@/mocks/live";
import type { LeaderboardPeriod } from "@/services";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { LeaderboardRow } from "@/types";
import { formatNumber } from "@/utils/format";
import { radius, spacing, useColors } from "@/theme";

/** Ödüller (Ar-Ge belgesi Bölüm 3, madde 4) */
const PRIZES: Record<LeaderboardPeriod, { title: string; text: string }> = {
  weekly: { title: "Haftanın birincisine", text: "Lisanslı Petrolspor atkısı ya da mağazada geçerli 250 TL hediye çeki." },
  monthly: { title: "Ayın birincisine", text: "Tüm futbolcuların imzaladığı orijinal maç forması." },
  season: { title: "Sezon şampiyonuna", text: "Gelecek sezon kombine bileti, tesis ziyareti ve futbolcularla yemek." },
};

/** İlk üç: ortada birinci (daha yüksek), solda ikinci, sağda üçüncü */
function Podium({ rows, myName }: { rows: LeaderboardRow[]; myName: string }) {
  const colors = useColors();
  const order = [rows[1], rows[0], rows[2]].filter(Boolean);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
      {order.map((row) => {
        const first = row.rank === 1;
        return (
          <View
            key={row.fan_id}
            accessibilityLabel={`${row.rank}. ${row.is_me ? myName : row.full_name}, ${row.points} puan`}
            style={{ flex: 1, alignItems: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 6, borderRadius: radius.box, backgroundColor: row.is_me ? colors.brand.soft : colors.mono.fill, minHeight: first ? 178 : 152, justifyContent: "flex-end" }}
          >
            <Avatar uri={null} name={row.is_me ? myName : row.full_name} size={first ? 56 : 46} />
            <AppText variant="caption" weight="medium" align="center" numberOfLines={1}>
              {row.is_me ? "Sen" : row.full_name}
            </AppText>
            <Heading size="title" color={first ? colors.brand.strong : colors.ink.DEFAULT}>
              {formatNumber(row.points)}
            </Heading>
            <View style={{ minWidth: 28, height: 22, paddingHorizontal: 8, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: first ? colors.brand.fill : colors.mono.fillStrong }}>
              <AppText variant="badge" weight="bold" color={first ? colors.ink.inverse : colors.ink.DEFAULT}>
                {row.rank}.
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Liderlik tabloları (prototip ekran 4): haftalık, aylık, sezonluk. Kullanıcının satırı vurguludur; maç bitip
 * tahmin puanlanınca haftalık puanı ve sırası güncellenir. Diğer taraftarlar örnektir (demo).
 */
export default function LeaderboardScreen() {
  const colors = useColors();
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const { data } = useLeaderboard(period);
  const fan = useSessionStore((s) => s.fan);
  const settled = usePredictionStore((s) => s.byMatch[LIVE_MATCH_ID]?.points);

  // Haftalık tablo bu haftanın maçıdır: puanım tahmin puanımdır (maç oynanmadıysa 0). Aylık ve sezonlukta üstüne eklenir.
  const rows = useMemo(() => (data ? withMyPoints(data, settled ?? 0, period === "weekly") : []), [data, settled, period]);
  const me = rows.find((r) => r.is_me);
  const myName = fan?.full_name ?? "Sen";
  const prize = PRIZES[period];

  return (
    <Screen>
      <ScreenHeader title="Liderlik" />
      <View style={{ paddingHorizontal: spacing.screen, paddingBottom: 12 }}>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={[
            { key: "weekly", label: "Haftalık" },
            { key: "monthly", label: "Aylık" },
            { key: "season", label: "Sezonluk" },
          ]}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 40, gap: spacing.boxGap }}>
        {!data ? (
          <ListRowSkeleton count={6} />
        ) : (
          <>
            <Podium rows={rows.slice(0, 3)} myName={myName} />

            {me ? (
              <Surface style={{ backgroundColor: colors.brand.soft }}>
                <View style={{ width: 40, alignItems: "center" }}>
                  <Heading size="title">{`${me.rank}.`}</Heading>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="small" weight="medium">
                    Senin sıran
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {period === "weekly" && settled === undefined ? "Bu haftanın maçı oynanınca puanın yazılır." : `${rows.length} taraftar arasında`}
                  </AppText>
                </View>
                <AppText variant="subhead" style={{ fontVariant: ["tabular-nums"] }}>
                  {formatNumber(me.points)}
                </AppText>
              </Surface>
            ) : null}

            <Surface>
              <ColorIconBox name="gift" size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  {prize.title}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {prize.text}
                </AppText>
              </View>
            </Surface>

            <View style={{ marginTop: 8, gap: 6 }}>
              {rows.slice(3).map((row) => (
                <View
                  key={row.fan_id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 52, paddingHorizontal: 12, borderRadius: radius.control, backgroundColor: row.is_me ? colors.brand.soft : "transparent" }}
                >
                  <AppText variant="small" weight="medium" tone="muted" style={{ width: 28, fontVariant: ["tabular-nums"] }}>
                    {row.rank}
                  </AppText>
                  <Avatar uri={null} name={row.is_me ? myName : row.full_name} size={36} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="small" weight={row.is_me ? "bold" : "regular"} numberOfLines={1}>
                      {row.is_me ? `${myName} (sen)` : row.full_name}
                    </AppText>
                    <AppText variant="caption" tone="muted" numberOfLines={1}>
                      {row.city}
                    </AppText>
                  </View>
                  <AppText variant="small" weight="bold" style={{ fontVariant: ["tabular-nums"] }}>
                    {formatNumber(row.points)}
                  </AppText>
                </View>
              ))}
            </View>

            <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 8 }}>
              Demo sürüm: diğer taraftarlar ve puanları örnektir.
            </AppText>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
