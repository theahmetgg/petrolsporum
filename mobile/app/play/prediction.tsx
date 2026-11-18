import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Check, Lock, Minus, Plus } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Screen } from "@/components/layout/Screen";
import { AppText, Badge, Button, FloatingActionBar, FLOATING_BAR_HEIGHT, Heading, IconButton, ListRowSkeleton, ScreenHeader, SelectField, Surface, useFloatingBarBottom } from "@/components/ui";
import { SelectPickerSheet } from "@/components/common/SelectPickerSheet";
import { TeamBadge } from "@/components/match/TeamBadge";
import { useMatch, useSquad } from "@/hooks/queries";
import { LIVE_MATCH_ID } from "@/mocks/live";
import { getTeam } from "@/mocks/teams";
import { useLiveMatch } from "@/stores/liveMatchStore";
import { PREDICTION_POINTS, scorePrediction, usePredictionStore } from "@/stores/predictionStore";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import { formatMatchDay, formatTime } from "@/utils/format";
import { spacing, useColors } from "@/theme";

const MAX_GOALS = 9;
const SCORER_ORDER = ["FWD", "MID", "DEF", "GK"];

/** Skor seçici: takım rozeti, adı ve − sayı + */
function ScoreStepper({ teamId, value, onChange, disabled }: { teamId: string; value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 10 }}>
      <TeamBadge teamId={teamId} size={56} />
      <AppText variant="small" weight="medium" align="center" numberOfLines={1}>
        {getTeam(teamId).short_name}
      </AppText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <IconButton icon={Minus} label={`${getTeam(teamId).short_name} golünü azalt`} size={40} disabled={disabled || value <= 0} onPress={() => onChange(Math.max(0, value - 1))} />
        <Heading size="score" style={{ minWidth: 34, textAlign: "center", fontVariant: ["tabular-nums"], fontSize: 52, lineHeight: 54 }}>
          {String(value)}
        </Heading>
        <IconButton icon={Plus} label={`${getTeam(teamId).short_name} golünü artır`} size={40} disabled={disabled || value >= MAX_GOALS} onPress={() => onChange(Math.min(MAX_GOALS, value + 1))} />
      </View>
    </View>
  );
}

/** Puan satırı: koşul + puan; tutan koşulda onay işareti */
function PointRow({ label, points, hit }: { label: string; points: number; hit?: boolean }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: hit ? colors.success.DEFAULT : colors.mono.fillStrong }}>
        {hit ? <Check size={14} color={colors.ink.inverse} strokeWidth={3} /> : null}
      </View>
      <AppText variant="small" tone={hit === false ? "muted" : "default"} style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText variant="small" weight="bold" tone={hit === false ? "muted" : "default"} style={{ fontVariant: ["tabular-nums"] }}>
        +{points}
      </AppText>
    </View>
  );
}

/**
 * Skor Tahmini (prototip ekran 4). Tahmin maç başlayana kadar açıktır; düdük çalınca (simülasyon başlayınca) kilitlenir.
 * Maç bitince puan hesaplanır, PetrolPuan'a eklenir ve liderlik sırası güncellenir.
 * Katılım ücretsizdir; skor tahmininin bahis sayılmaması için bu şarttır (Ar-Ge belgesi 10.2).
 */
export default function PredictionScreen() {
  const colors = useColors();
  const barBottom = useFloatingBarBottom();
  const { data: match } = useMatch(LIVE_MATCH_ID);
  const { data: squad } = useSquad();
  const live = useLiveMatch();
  const saved = usePredictionStore((s) => s.byMatch[LIVE_MATCH_ID]);
  const save = usePredictionStore((s) => s.save);
  const settle = usePredictionStore((s) => s.settle);
  const addPuan = useSessionStore((s) => s.addPuan);
  const scorerSheet = useRef<BottomSheetModal>(null);

  const [home, setHome] = useState(saved?.home_score ?? 1);
  const [away, setAway] = useState(saved?.away_score ?? 0);
  const [scorerId, setScorerId] = useState<string | null>(saved?.first_scorer_id ?? null);

  const locked = live.status !== "idle";
  const finished = live.status === "finished";
  const dirty = !saved || saved.home_score !== home || saved.away_score !== away || saved.first_scorer_id !== scorerId;

  // İlk gol seçenekleri: kaleciler hariç kadro
  const scorerOptions = useMemo(
    () =>
      (squad ?? [])
        .filter((p) => p.line !== "GK")
        // Gol atma ihtimali yüksek olanlar üstte: forvet, orta saha, defans
        .sort((x, y) => SCORER_ORDER.indexOf(x.line) - SCORER_ORDER.indexOf(y.line) || x.shirt_number - y.shirt_number)
        .map((p) => ({ value: p.id, label: `${p.shirt_number} · ${p.full_name ?? p.name}`, description: p.position })),
    [squad]
  );
  const scorerName = squad?.find((p) => p.id === scorerId);

  // Maç sonucu: ilk golü atan oyuncu adından kimliğe çevrilir
  const breakdown = useMemo(() => {
    if (!finished || !saved) return null;
    const firstScorer = squad?.find((p) => p.name === live.firstScorerName);
    return scorePrediction(saved, { home_score: live.home_score, away_score: live.away_score, first_scorer_id: firstScorer?.id ?? null });
  }, [finished, saved, squad, live.firstScorerName, live.home_score, live.away_score]);

  // Maç bitince puan bir kez yazılır ve PetrolPuan'a eklenir
  useEffect(() => {
    if (!breakdown) return;
    if (settle(LIVE_MATCH_ID, breakdown.total)) {
      addPuan(breakdown.total);
      showToast(`Tahminin ${breakdown.total} puan kazandı!`, "success");
    }
  }, [breakdown, settle, addPuan]);

  const submit = () => {
    save({ match_id: LIVE_MATCH_ID, home_score: home, away_score: away, first_scorer_id: scorerId });
    showToast("Tahminin kaydedildi.", "success");
  };

  if (!match) {
    return (
      <Screen>
        <ScreenHeader title="Skor Tahmini" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={3} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Skor Tahmini" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: barBottom + FLOATING_BAR_HEIGHT + 32, gap: spacing.boxGap }}>
        <Surface row={false} padding={16}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <AppText variant="caption" tone="muted">
              {match.week}. hafta · {formatMatchDay(match.kickoff_at)} · {formatTime(match.kickoff_at)}
            </AppText>
            {locked ? <Badge label={finished ? "Maç bitti" : "Kilitli"} tone={finished ? "neutral" : "brand"} /> : <Badge label="Açık" tone="success" dot />}
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 8 }}>
            <ScoreStepper teamId={match.home_team_id} value={home} onChange={setHome} disabled={locked} />
            <ScoreStepper teamId={match.away_team_id} value={away} onChange={setAway} disabled={locked} />
          </View>
        </Surface>

        <SelectField
          label="Bonus: ilk golü kim atar?"
          placeholder="Oyuncu seç"
          value={scorerName ? `${scorerName.shirt_number} · ${scorerName.full_name ?? scorerName.name}` : undefined}
          onPress={() => scorerSheet.current?.present()}
          disabled={locked}
          helper="İstersen boş bırakabilirsin."
        />

        {locked && !finished ? (
          <Surface>
            <Lock size={20} color={colors.ink.secondary} strokeWidth={1.5} />
            <AppText variant="small" tone="secondary" style={{ flex: 1 }}>
              Maç başladı, tahminler kilitlendi. {saved ? "Tahminin maç bitince puanlanacak." : "Bu maç için tahmin yapmadın."}
            </AppText>
          </Surface>
        ) : null}

        {/* Sonuç: maç bitince */}
        {finished ? (
          <Surface row={false} padding={16}>
            <AppText variant="caption" tone="muted">
              Maç sonucu
            </AppText>
            <Heading size="title">{`${getTeam(match.home_team_id).short_name} ${live.home_score} - ${live.away_score} ${getTeam(match.away_team_id).short_name}`}</Heading>
            {saved && breakdown ? (
              <>
                <AppText variant="small" tone="secondary">
                  Senin tahminin: {saved.home_score} - {saved.away_score}
                  {live.firstScorerName ? ` · ilk gol: ${live.firstScorerName}` : ""}
                </AppText>
                <View style={{ gap: 10, marginTop: 4 }}>
                  <PointRow label="Tam skor" points={PREDICTION_POINTS.exact} hit={breakdown.exact} />
                  <PointRow label="Maç sonucu" points={PREDICTION_POINTS.outcome} hit={!breakdown.exact && breakdown.outcome} />
                  <PointRow label="İlk golü atan" points={PREDICTION_POINTS.firstScorer} hit={breakdown.firstScorer} />
                  <PointRow label="Katılım" points={PREDICTION_POINTS.participation} hit />
                </View>
                <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
                  <AppText variant="subhead">Kazandığın puan</AppText>
                  <Heading size="display" color={colors.brand.strong}>{`+${breakdown.total}`}</Heading>
                </View>
                <Button title="Sıralamayı gör" variant="secondary" fullWidth onPress={() => router.push("/play/leaderboard")} />
              </>
            ) : (
              <AppText variant="small" tone="secondary">
                Bu maç için tahmin yapmamıştın. Sıradaki maçta görüşürüz.
              </AppText>
            )}
          </Surface>
        ) : null}

        {/* Puanlama kuralı: maç bitene kadar görünür (bitince yerini sonuç alır) */}
        {!finished ? (
          <Surface row={false} padding={16}>
            <AppText variant="small" weight="medium">
              Nasıl puan kazanılır?
            </AppText>
            <View style={{ gap: 10 }}>
              <PointRow label="Tam skoru bilirsen" points={PREDICTION_POINTS.exact} />
              <PointRow label="Yalnız maç sonucunu bilirsen" points={PREDICTION_POINTS.outcome} />
              <PointRow label="İlk golü atanı bilirsen" points={PREDICTION_POINTS.firstScorer} />
              <PointRow label="Tahmin yapan herkese" points={PREDICTION_POINTS.participation} />
            </View>
            <AppText variant="caption" tone="muted">
              Katılım ücretsizdir.
            </AppText>
          </Surface>
        ) : null}

        {/* Demo kolaylığı: maçı oynatmak için maç merkezine kısayol */}
        <Surface onPress={() => router.push(`/match/${LIVE_MATCH_ID}`)} chevron>
          <View style={{ flex: 1 }}>
            <AppText variant="small" weight="medium">
              {locked ? "Maç merkezine git" : "Demo: maçı oynat"}
            </AppText>
            <AppText variant="caption" tone="muted">
              {locked ? "Canlı skor ve akış." : "Tahminini kaydet, sonra maç merkezinden simülasyonu başlat."}
            </AppText>
          </View>
        </Surface>
      </ScrollView>

      {!locked ? <FloatingActionBar label={saved ? (dirty ? "Tahmini güncelle" : "Tahmin kaydedildi") : "Tahmini kaydet"} icon={saved && !dirty ? Check : undefined} disabled={!dirty} onPress={submit} /> : null}

      <SelectPickerSheet
        ref={scorerSheet}
        title="İlk golü kim atar?"
        subtitle="Bilirsen +25 puan"
        options={scorerOptions}
        selected={scorerId ?? undefined}
        onSelect={(value) => setScorerId(value)}
      />
    </Screen>
  );
}
