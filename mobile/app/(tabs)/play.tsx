import React from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, Badge, Button, ColorIconBox, GlassChip, HeroNumber, Surface } from "@/components/ui";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { TabHeading } from "@/components/common/TabHeading";
import { useLeaderboard } from "@/hooks/queries";
import { withMyPoints } from "@/lib/leaderboard";
import { LIVE_MATCH_ID } from "@/mocks/live";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSessionStore } from "@/stores/sessionStore";
import { formatNumber } from "@/utils/format";
import { gradients, radius, spacing } from "@/theme";
import { Trophy } from "lucide-react-native";

interface Game {
  key: string;
  icon: ColorIconName;
  title: string;
  text: string;
  href?: string;
}

/** Oyun listesi (Ar-Ge belgesi 8.1, 3. referans: "Oyna" butonlu tek liste). Faz 1 dışındaki oyunlar "Yakında" görünür. */
const GAMES: Game[] = [
  { key: "prediction", icon: "prediction", title: "Skor Tahmini", text: "Maçın skorunu ve ilk golü atanı bil, puanları topla.", href: "/play/prediction" },
  { key: "lineup", icon: "lineup", title: "İlk 11'ini Kur", text: "Dizilişini seç, oyuncuları sürükle, görselini paylaş.", href: "/play/lineup" },
  { key: "motm", icon: "motm", title: "Maçın Adamı", text: "Maçın 80. dakikasında oylama açılır." },
  { key: "trivia", icon: "trivia", title: "Bilgi Yarışması", text: "Her hafta 5 soruluk kulüp tarihi yarışması." },
];

/**
 * Oyna sekmesi (prototip ekran 4 ve 5'in girişi). Üstte PetrolPuan ve sezon sırası, altında oyun listesi.
 */
export default function PlayTab() {
  const tabBarHeight = useTabBarHeight();
  const fan = useSessionStore((s) => s.fan);
  const settled = usePredictionStore((s) => s.byMatch[LIVE_MATCH_ID]?.points);
  const { data: season } = useLeaderboard("season");
  const myRank = season ? withMyPoints(season, settled ?? 0, false).find((r) => r.is_me)?.rank : undefined;

  return (
    <Screen withBottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 12, paddingBottom: tabBarHeight + spacing.section }}>
        <TabHeading title="Oyna" />

        {/* Puan özeti: iri rakam kalıbı (gradyan ortası) */}
        <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ marginTop: 14, borderRadius: radius.hero, paddingVertical: 20, paddingHorizontal: 16, alignItems: "center", gap: 12 }}>
          <HeroNumber label="PetrolPuan" main={formatNumber(fan?.petrol_puan ?? 0)} tabular />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <GlassChip icon={Trophy} label={myRank ? `Sezon sıran: ${myRank}.` : "Sezon sıran"} onPress={() => router.push("/play/leaderboard")} chevron />
          </View>
        </LinearGradient>

        <View style={{ marginTop: spacing.section, gap: spacing.boxGap }}>
          {GAMES.map((game) => (
            <Surface key={game.key} onPress={game.href ? () => router.push(game.href as never) : undefined} padding={14}>
              <ColorIconBox name={game.icon} size={52} />
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="subhead">{game.title}</AppText>
                <AppText variant="caption" tone="muted">
                  {game.text}
                </AppText>
              </View>
              {game.href ? <Button title="Oyna" size="sm" onPress={() => router.push(game.href as never)} /> : <Badge label="Yakında" />}
            </Surface>
          ))}
        </View>

        <Surface onPress={() => router.push("/play/leaderboard")} chevron style={{ marginTop: spacing.section }} padding={14}>
          <ColorIconBox name="leaderboard" size={44} />
          <View style={{ flex: 1 }}>
            <AppText variant="small" weight="medium">
              Liderlik tabloları
            </AppText>
            <AppText variant="caption" tone="muted">
              Haftalık, aylık ve sezonluk sıralama; ödüller.
            </AppText>
          </View>
        </Surface>
      </ScrollView>
    </Screen>
  );
}
