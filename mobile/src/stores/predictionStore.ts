import { create } from "zustand";
import type { Prediction } from "@/types";
import { storage } from "../utils/storage";

const KEY = "petrolspor_predictions";

/** Puanlama (Ar-Ge belgesi Bölüm 3, madde 4): tam skor 100, maç sonucu 35, ilk golü atan +25, katılım +5 */
export const PREDICTION_POINTS = { exact: 100, outcome: 35, firstScorer: 25, participation: 5 } as const;

export interface PredictionBreakdown {
  exact: boolean;
  outcome: boolean;
  firstScorer: boolean;
  total: number;
}

/**
 * Tahminin puanını hesaplar. Tam skoru bilen sonucu da bilmiş olur; iki puan toplanmaz, yüksek olan (100) verilir.
 * İlk gol bonusu ve katılım puanı her durumda eklenir.
 */
export function scorePrediction(
  prediction: Pick<Prediction, "home_score" | "away_score" | "first_scorer_id">,
  result: { home_score: number; away_score: number; first_scorer_id: string | null }
): PredictionBreakdown {
  const exact = prediction.home_score === result.home_score && prediction.away_score === result.away_score;
  const outcome = Math.sign(prediction.home_score - prediction.away_score) === Math.sign(result.home_score - result.away_score);
  const firstScorer = !!prediction.first_scorer_id && prediction.first_scorer_id === result.first_scorer_id;
  const total =
    (exact ? PREDICTION_POINTS.exact : outcome ? PREDICTION_POINTS.outcome : 0) +
    (firstScorer ? PREDICTION_POINTS.firstScorer : 0) +
    PREDICTION_POINTS.participation;
  return { exact, outcome, firstScorer, total };
}

interface PredictionState {
  byMatch: Record<string, Prediction>;
  hydrate: () => Promise<void>;
  save: (prediction: Omit<Prediction, "created_at" | "points">) => void;
  /** Maç bitince puanı tahmine yazar; puan daha önce yazıldıysa dokunmaz ve `false` döner */
  settle: (match_id: string, points: number) => boolean;
  remove: (match_id: string) => void;
}

const persist = (byMatch: Record<string, Prediction>) => storage.setItem(KEY, JSON.stringify(byMatch)).catch(() => {});

/** Skor tahminleri (maç başına bir tahmin). Prototipte telefonda saklanır; Faz 2'de sunucuya gider. */
export const usePredictionStore = create<PredictionState>((set, get) => ({
  byMatch: {},

  hydrate: async () => {
    try {
      const raw = await storage.getItem(KEY);
      if (raw) set({ byMatch: JSON.parse(raw) });
    } catch {
      // Bozuk kayıt: boş başlanır
    }
  },

  save: (prediction) => {
    const byMatch = { ...get().byMatch, [prediction.match_id]: { ...prediction, created_at: new Date().toISOString() } };
    set({ byMatch });
    persist(byMatch);
  },

  settle: (match_id, points) => {
    const current = get().byMatch[match_id];
    if (!current || current.points !== undefined) return false;
    const byMatch = { ...get().byMatch, [match_id]: { ...current, points } };
    set({ byMatch });
    persist(byMatch);
    return true;
  },

  remove: (match_id) => {
    const byMatch = { ...get().byMatch };
    delete byMatch[match_id];
    set({ byMatch });
    persist(byMatch);
  },
}));
