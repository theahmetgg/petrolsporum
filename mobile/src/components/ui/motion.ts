import { useEffect } from "react";
import { Easing, FadeIn, FadeInDown, useSharedValue, withSequence, withTiming, type SharedValue } from "react-native-reanimated";

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
export const FIRST_LOAD_FADE_COUNT = 6;

/** İlk yüklemede `index`. satırın giriş animasyonu (220 ms solma, 50 ms arayla); sınırın dışında `undefined` */
export function firstLoadEntering(index: number) {
  return index < FIRST_LOAD_FADE_COUNT ? FadeIn.duration(220).delay(index * 50) : undefined;
}

/**
 * Ekran bölümünün girişi: 12 dp aşağıdan solarak gelir, bölümler 60 ms arayla sıralanır (en çok 6 bölüm; sonrası
 * beklemeden gelir). Yalnız saydamlık ve konum değişir.
 */
export function sectionEntering(index: number) {
  return FadeInDown.duration(280)
    .delay(Math.min(index, FIRST_LOAD_FADE_COUNT) * 60)
    .easing(MOTION_EASE)
    .withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] });
}

/** Büyük görselin girişi (ürün sayfası): %94'ten tam boya büyür ve solarak gelir (320 ms) */
export function softZoomIn() {
  "worklet";
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.94 }] },
    animations: {
      opacity: withTiming(1, { duration: 240, easing: MOTION_EASE }),
      transform: [{ scale: withTiming(1, { duration: 320, easing: MOTION_EASE }) }],
    },
  };
}
