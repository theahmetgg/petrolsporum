import { useMemo } from "react";
import { create } from "zustand";
import type { MatchEvent, MatchStat } from "@/types";
import { LIVE_FINAL_STATS, LIVE_MATCH_ID, LIVE_SCRIPT } from "@/mocks/live";
import { MATCHES } from "@/mocks/matches";
import type { LiveScore } from "@/lib/standings";

export type LiveStatus = "idle" | "live" | "finished";

/** Simülasyon hızı: maçın 1 dakikası bu kadar milisaniye sürer (90 dakika ≈ 1 dakika) */
const MS_PER_MATCH_MINUTE = 650;
const FULL_TIME = 90;

interface LiveMatchState {
  status: LiveStatus;
  minute: number;
  /** Simülasyonu baştan başlatır */
  start: () => void;
  /** Maçı oynanmamış hâline döndürür */
  reset: () => void;
}

let timer: ReturnType<typeof setInterval> | null = null;
const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

/**
 * CANLI MAÇ SİMÜLASYONU (demo). Sıradaki maçı (`LIVE_MATCH_ID`) hızlandırılmış oynatır: dakika ilerledikçe
 * `LIVE_SCRIPT` içindeki olaylar sırayla açılır. Skor, akış, istatistik ve canlı puan durumu bu depodan türetilir.
 * Faz 2'de dakika ve olaylar canlı bağlantıdan (`MATCH_EVENT_NEW`) gelir; `useLiveMatch` aynı alanları döndürmeye
 * devam eder, ekranlar değişmez.
 */
export const useLiveMatchStore = create<LiveMatchState>((set, get) => ({
  status: "idle",
  minute: 0,

  start: () => {
    stopTimer();
    set({ status: "live", minute: 0 });
    timer = setInterval(() => {
      const next = get().minute + 1;
      if (next >= FULL_TIME) {
        stopTimer();
        set({ status: "finished", minute: FULL_TIME });
      } else {
        set({ minute: next });
      }
    }, MS_PER_MATCH_MINUTE);
  },

  reset: () => {
    stopTimer();
    set({ status: "idle", minute: 0 });
  },
}));

const liveMatch = MATCHES.find((m) => m.id === LIVE_MATCH_ID)!;

export interface LiveMatchView {
  matchId: string;
  status: LiveStatus;
  minute: number;
  /** O dakikaya kadar yaşanan olaylar, en yenisi en üstte */
  events: MatchEvent[];
  home_score: number;
  away_score: number;
  /** Canlı puan durumu için; maç başlamadıysa `null` */
  liveScore: LiveScore | null;
  stats: MatchStat[];
  /** İlk golü atan oyuncunun adı (skor tahmini bonusu); gol yoksa `null` */
  firstScorerName: string | null;
  start: () => void;
  reset: () => void;
}

/** Canlı maçın o anki görünümü. Dakika değiştikçe bileşeni yeniden çizer. */
export function useLiveMatch(): LiveMatchView {
  const status = useLiveMatchStore((s) => s.status);
  const minute = useLiveMatchStore((s) => s.minute);
  const start = useLiveMatchStore((s) => s.start);
  const reset = useLiveMatchStore((s) => s.reset);

  return useMemo(() => {
    const shown = status === "idle" ? [] : LIVE_SCRIPT.filter((e) => e.minute <= minute);
    const last = shown[shown.length - 1];
    const home_score = last?.home_score ?? 0;
    const away_score = last?.away_score ?? 0;
    const progress = minute / FULL_TIME;
    return {
      matchId: LIVE_MATCH_ID,
      status,
      minute,
      events: [...shown].reverse(),
      home_score,
      away_score,
      liveScore:
        status === "idle" ? null : { home_team_id: liveMatch.home_team_id, away_team_id: liveMatch.away_team_id, home_score, away_score },
      stats: LIVE_FINAL_STATS.map((s) => (s.percent ? s : { ...s, home: Math.round(s.home * progress), away: Math.round(s.away * progress) })),
      firstScorerName: shown.find((e) => e.event_type === "GOAL" && e.player_name)?.player_name ?? null,
      start,
      reset,
    };
  }, [status, minute, start, reset]);
}
