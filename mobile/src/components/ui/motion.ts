import { useEffect } from "react";
import { Easing, FadeIn, useSharedValue, withSequence, withTiming, type SharedValue } from "react-native-reanimated";

/**
 * Ortak hareket ayarları (kullanıcı kararı, 12 Kasım 2026). Hepsi Reanimated ile UI thread'de çalışır;
 * yay (spring) simülasyonu kullanılmaz (AGENTS.md §6.5).
 */
export const MOTION_EASE = Easing.out(Easing.quad);

/** Açık/kapalı durumunu 0–1 arası yumuşak bir değere çevirir (anahtar, onay kutusu, radyo, hap) */
export function useToggleProgress(on: boolean, duration = 160): SharedValue<number> {
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(on ? 1 : 0, { duration, easing: MOTION_EASE });
  }, [on, duration, p]);
  return p;
}

/** Kısa "pıt": değeri `peak` oranına çıkarıp geri indirir (rozet sayısı artışı, beğeni) */
export function pop(value: SharedValue<number>, peak = 1.3) {
  "worklet";
  value.value = withSequence(withTiming(peak, { duration: 110, easing: MOTION_EASE }), withTiming(1, { duration: 170, easing: MOTION_EASE }));
}

/** Geri almada hafif içe çekilme (beğeniyi kaldırma) */
export function shrinkBack(value: SharedValue<number>) {
  "worklet";
  value.value = withSequence(withTiming(0.85, { duration: 90, easing: MOTION_EASE }), withTiming(1, { duration: 140, easing: MOTION_EASE }));
}

/** Listelerin ilk yüklemesinde sırayla belirecek satır sayısı; sonrakiler animasyonsuz çizilir */
export const FIRST_LOAD_FADE_COUNT = 4;

/** İlk yüklemede `index`. satırın giriş animasyonu (220 ms solma, 50 ms arayla); sınırın dışında `undefined` */
export function firstLoadEntering(index: number) {
  return index < FIRST_LOAD_FADE_COUNT ? FadeIn.duration(220).delay(index * 50) : undefined;
}
