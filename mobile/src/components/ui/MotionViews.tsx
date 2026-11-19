import React, { useEffect, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue } from "react-native-reanimated";
import { pop, sectionEntering, softZoomIn } from "./motion";

/**
 * Hareket bileşenleri (karar, 19 Kasım 2026). Kurallar: yalnız saydamlık ve konum / ölçek değişir (yerleşim
 * yeniden hesaplanmaz), süreler 150-320 ms, hepsi UI thread'de (Reanimated) çalışır ve sistemdeki
 * "hareketi azalt" ayarına uyar. Sürekli dönen / parlayan süs yoktur.
 */

/**
 * Değer değişince içeriği kısa bir "zıplama" ile vurgular (gol olunca skor). İlk çizimde oynamaz.
 * `trigger` değiştiğinde çalışır; içerik her zamanki gibi çizilir.
 */
export function PopOnChange({ trigger, peak = 1.18, children, style }: { trigger: string | number; peak?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!reduceMotion) pop(scale, peak);
  }, [trigger, peak, reduceMotion, scale]);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[animated, style]}>{children}</Animated.View>;
}

/**
 * Sayıyı hedefe doğru sayarak getirir (PetrolPuan, kokpit rakamları): ekran açılınca 0'dan, değer değişince eski
 * değerden. Yaklaşık 700 ms sürer ve sona doğru yavaşlar. Yalnız bu küçük bileşen yeniden çizilir; ekranın geri
 * kalanı çizilmez. "Hareketi azalt" açıksa sayı doğrudan yazılır.
 */
export function useCountUp(target: number, duration = 700): number {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);
  const current = useRef(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion || current.current === target) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const startedAt = Date.now();
    let frame = 0;
    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduceMotion]);

  return value;
}

/** `useCountUp`'ın bileşen hâli: `<CountUp value={1475}>{(n) => <Heading>{formatNumber(n)}</Heading>}</CountUp>` */
export function CountUp({ value, duration, children }: { value: number; duration?: number; children: (current: number) => React.ReactNode }) {
  return <>{children(useCountUp(value, duration))}</>;
}

/**
 * Ekran bölümü: ilk açılışta bölümler yukarıdan aşağı sırayla, hafifçe aşağıdan solarak belirir (60 ms arayla).
 * Yalnız ilk çizimde oynar; sekmeye geri dönünce tekrar oynamaz.
 */
export function Reveal({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View entering={sectionEntering(index)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Büyük fotoğrafın girişi (ürün sayfası): hafifçe büyüyerek ve solarak yerine oturur */
export function ZoomInView({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View entering={softZoomIn} style={style}>
      {children}
    </Animated.View>
  );
}
