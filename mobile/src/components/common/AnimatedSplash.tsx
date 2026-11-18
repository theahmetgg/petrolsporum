import React, { useEffect } from "react";
import type { ViewStyle } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { gradients, palettes } from "@/theme";

const SPLASH_ICON = require("../../../assets/splash-icon.png");

/** Telefonun açılış ekranıyla aynı zemin (app.config.js `splash.backgroundColor`) */
const NATIVE_BG = palettes.light.brand.DEFAULT;
/** Telefonun açılış ekranındaki ikonla aynı boy (plugins/withEdgeToEdgeColors.js: 288dp tuvalde 160dp); ilk kare birebir örtüşür */
const ICON = 160;
/** Toplam süre (ms); aşamalar bu sürenin oranlarıyla (0–1) tanımlı */
const TOTAL = 1500;
const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

export interface AnimatedSplashProps {
  /** Animasyon bitip katman kaybolunca çağrılır; çağıran katmanı kaldırır */
  onFinish?: () => void;
  /** İkon ekrana çizilince bir kez çağrılır; telefonun açılış ekranı ancak bundan sonra kapatılır (ikonsuz kırmızı kare görünmez) */
  onReady?: () => void;
  /** false iken telefonun açılış ekranıyla aynı ilk karede bekler (uygulama hazır olunca true) */
  play?: boolean;
  /** Önizleme çerçevesi için ölçek (vitrin); gerçek tam ekranda 1 */
  scale?: number;
  /** Süre çarpanı (vitrinde yavaş inceleme için 5); gerçek açılışta 1 */
  slow?: number;
}

/**
 * Animasyonlu açılış (kullanıcı onayı, 9 Kasım 2026): telefonun kendi açılış ekranıyla birebir aynı başlar (düz kırmızı +
 * "B" ikonu), zemin imza gradyanına geçer, ikon hafifçe büyürken arkasında ince cam halka açılıp söner, sonunda katman
 * hafifçe büyüyerek kaybolur (~1,5 sn). "Hareketi azalt" açıksa yalnız kısa solma.
 *
 * Performans: tek ilerleme değeri (`p`, 0→1) UI iş parçacığında ilerler; bütün hareketler ondan `interpolate` ile türetilir
 * (JS'e yalnız bitişte bir kez dönülür). Katman animasyon boyunca donanım dokusuna çizilir; bitince çağıran kaldırır.
 */
export function AnimatedSplash({ onFinish, onReady, play = true, scale = 1, slow = 1 }: AnimatedSplashProps) {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  const icon = ICON * scale;

  useEffect(() => {
    if (!play) return;
    const done = () => onFinish?.();
    p.value = withTiming(1, { duration: (reduce ? 300 : TOTAL) * slow, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(done)();
    });
    // Paylaşılan değer ve geri çağırma ömür boyu sabit; animasyon `play` true olunca bir kez oynar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  // Aşamalar (p): 0–0.33 gradyana geçiş · 0.15–0.8 ikon nefesi + halka · 0.8–1 çıkış
  const rootStyle = useAnimatedStyle(() => {
    const out = reduce ? p.value : interpolate(p.value, [0.8, 1], [0, 1], Extrapolation.CLAMP);
    return { opacity: 1 - out, transform: [{ scale: 1 + out * 0.06 }] };
  });
  const gradStyle = useAnimatedStyle(() => ({
    opacity: reduce ? 1 : interpolate(p.value, [0, 0.33], [0, 1], Extrapolation.CLAMP),
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduce ? 1 : interpolate(p.value, [0.15, 0.4, 0.8], [1, 1.1, 1.04], Extrapolation.CLAMP) }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: reduce ? 0 : interpolate(p.value, [0.2, 0.28, 0.75], [0, 0.45, 0], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(p.value, [0.2, 0.75], [0.8, 1.9], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      style={[FILL, { backgroundColor: NATIVE_BG, alignItems: "center", justifyContent: "center" }, rootStyle]}
    >
      {/* Kırmızı zeminde açık durum çubuğu ikonları; katman kalkınca uygulamanın kendi ayarı geri gelir */}
      {scale === 1 ? <StatusBar style="light" /> : null}
      <Animated.View style={[FILL, gradStyle]}>
        <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View
        style={[{ position: "absolute", width: icon, height: icon, borderRadius: icon / 2, borderWidth: 1.5, borderColor: palettes.light.glass.border }, ringStyle]}
      />
      <Animated.View style={iconStyle}>
        <Image source={SPLASH_ICON} style={{ width: icon, height: icon }} contentFit="contain" priority="high" transition={0} onDisplay={onReady} />
      </Animated.View>
    </Animated.View>
  );
}
