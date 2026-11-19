import { hapticSelect } from "@/lib/haptics";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SvgXml } from "react-native-svg";
import { TAB_ICONS } from "@/constants/colorIcons.generated";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { systemColors, useTheme } from "@/theme";
import { PressableBox } from "@/components/ui";

/* ═══════════════════════════ ÖLÇÜLER ══════════════════════════════════════ */

const BAR_CONTENT_H = 52;
// Aktif sekmede ikonun arkasındaki hap/kapsül. Kaymaz: basılan sekmede anında belirir
const PILL_H = 40; // 52 yüksekliğinde üstte ve altta 6 boşluk kalır
const PILL_RADIUS = 20;
const PILL_INSET = 4; // Kapsül sekme genişliğini neredeyse doldurur, yanlarda 4 boşluk
// 28dp: belirgin ve okunaklı; çubuk yüksekliği (52) değişmeden hapın içinde kalır
const ICON_SIZE = 28;

/* ═══════════════════════════ İKON VE ETİKET ═══════════════════════════════ */

// MingCute çizgi/dolu çiftleri (`npm run icons:sync` üretir): pasif sekme çizgi, aktif sekme dolu
const ROUTE_ICONS = TAB_ICONS as Record<string, { line: string; fill: string }>;

/** Alt menü (karar, 18 Kasım 2026): Ana Sayfa · Maçlar · Oyna · Galeri · Profil. Etiket yalnız ekran okuyucu içindir. */
const ROUTE_LABELS: Record<string, string> = {
  index: "Ana Sayfa",
  matches: "Maçlar",
  play: "Oyna",
  gallery: "Galeri",
  profile: "Profil",
};

/**
 * Alt menü renkleri: ikonlar yazı renginde (koyu temada beyaz, açık temada siyah), aktif sekme dolu ikon + sekmeyi
 * dolduran gri kapsül (`surface.muted`); pasifler çizgi ikon, soluk değil. Kırmızı yalnızca bildirim noktasında.
 */
function useTabBarColors() {
  const { colors } = useTheme();
  return {
    icon: colors.ink.DEFAULT,
    pill: colors.surface.muted,
    dot: colors.brand.DEFAULT,
    background: colors.surface.bg,
  };
}

/* ═══════════════════════════ TabItem ══════════════════════════════════════ */

interface TabItemProps {
  focused: boolean;
  routeKey: string;
  routeName: string;
  /** Sağ üstte küçük kırmızı nokta (ör. canlı maç, okunmamış bildirim) */
  dot?: boolean;
  onPress: (routeKey: string) => void;
  onLongPress: (routeKey: string) => void;
}

/**
 * Tek sekme. memo + rota anahtarıyla çağrılan sabit işleyiciler sayesinde sekme değişince
 * yalnızca odağı değişen iki sekme yeniden çizilir.
 * Aktif sekme dolu ikon + kapsülle gösterilir; geçiş animasyonsuz ve anındadır.
 */
const TabItem = React.memo(function TabItem({ focused, routeKey, routeName, dot, onPress, onLongPress }: TabItemProps) {
  const { icon: ICON_COLOR, pill: PILL_COLOR, dot: DOT_COLOR, background: TAB_BAR_BG } = useTabBarColors();
  const icon = ROUTE_ICONS[routeName] ?? ROUTE_ICONS.index;
  const label = ROUTE_LABELS[routeName] || routeName;

  return (
    <PressableBox
      onPress={() => onPress(routeKey)}
      onLongPress={() => onLongPress(routeKey)}
      style={() => ({ flex: 1, height: BAR_CONTENT_H, paddingHorizontal: PILL_INSET, justifyContent: "center" })}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={dot ? `${label}, yeni var` : label}
    >
      <View style={{ height: PILL_H, alignItems: "center", justifyContent: "center" }}>
        {/* Kapsül ayrı katman: rengi sabit, yalnızca opaklığı değişir. Android'de arka plan rengi
            şeffaftan renge geçince köşe yuvarlaklığı çizilmeyip kare kalabiliyor. */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: PILL_H,
            borderRadius: PILL_RADIUS,
            overflow: "hidden",
            backgroundColor: PILL_COLOR,
            opacity: focused ? 1 : 0,
          }}
        />
        <View style={{ width: ICON_SIZE, height: ICON_SIZE }}>
          <SvgXml xml={focused ? icon.fill : icon.line} width={ICON_SIZE} height={ICON_SIZE} color={ICON_COLOR} />
          {dot ? (
            <View
              style={{
                position: "absolute",
                top: -2,
                right: -3,
                width: 9,
                height: 9,
                borderRadius: 4.5,
                backgroundColor: DOT_COLOR,
                borderWidth: 1.5,
                borderColor: focused ? PILL_COLOR : TAB_BAR_BG,
              }}
            />
          ) : null}
        </View>
      </View>
    </PressableBox>
  );
});

/**
 * Alt menünün ekranda kapladığı toplam yükseklik (dp): içerik + alttaki boşluk.
 * 3 tuş modunda alttaki siyah sistem çubuğu (insetBottom) da dahildir. Sekme ekranları kaydırılan
 * içeriğin son öğesi alt menünün altında kalmasın diye alt boşluğu bununla hesaplar.
 */
export function useTabBarHeight() {
  const { is3Button, insetBottom, safeTabPadding } = useNavigationMode();
  return BAR_CONTENT_H + (is3Button ? insetBottom : safeTabPadding);
}

/* ═══════════════════════════ CustomTabBar ═════════════════════════════════ */

/**
 * Alt menü: sabit çubuk (karar, 18 Kasım 2026; tasarım duvarında yüzen hapla karşılaştırıldı, Batman360 düzeni seçildi).
 * Tam genişlik, sayfa zeminiyle aynı düz renk, yalnız ikon.
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { is3Button, insetBottom, safeTabPadding } = useNavigationMode();
  const { background: TAB_BAR_BG } = useTabBarColors();
  // Klavye açıkken çubuk gizlenir: UI thread'de, JS'de yeniden çizim olmadan
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();
  const keyboardHideStyle = useAnimatedStyle(() => ({
    opacity: keyboardProgress.value > 0 ? 0 : 1,
  }));

  /* ── görünen rotalar ────────────────────────────────────────────────────── */

  const visibleRoutes = useMemo(
    () =>
      (state?.routes || []).filter((route) => {
        const opts = descriptors?.[route.key]?.options;
        if ((opts as any)?.href === null) return false;
        return true;
      }),
    [state?.routes, descriptors]
  );

  const activeRoute = state?.routes?.[state?.index];
  const activeKey = activeRoute?.key ?? "";

  /* ── anında seçim ────────────────────────────────────────────────────────── */

  // Basılan sekme, yeni ekran çizilmeden önce dolu ikonla gösterilir; geçiş bir sonraki karede yapılır
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  useEffect(() => {
    setPendingKey(null);
  }, [activeKey]);
  const focusedKey = pendingKey ?? activeKey;

  /* ── işleyiciler ────────────────────────────────────────────────────────── */

  // En güncel rota listesi; işleyiciler sabit kalsın diye ref üzerinden okunur
  const routesRef = useRef(state?.routes || []);
  routesRef.current = state?.routes || [];
  const activeKeyRef = useRef(activeKey);
  activeKeyRef.current = activeKey;

  const handlePress = useCallback(
    (routeKey: string) => {
      const route = routesRef.current.find((r) => r.key === routeKey);
      if (!navigation || !route?.key) return;
      // Başka sekmeye geçişte hafif titreşim (aynı sekmeye yeniden basınca yok)
      if (routeKey !== activeKeyRef.current) hapticSelect();
      const go = () => {
        const e = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
        if (!e.defaultPrevented && route.name) navigation.navigate(route.name, route.params);
        else setPendingKey(null);
      };
      // Aynı sekme (yukarı kaydırma vb.): bekletmeden
      if (routeKey === activeKeyRef.current) {
        go();
        return;
      }
      setPendingKey(routeKey);
      requestAnimationFrame(go);
    },
    [navigation]
  );

  const handleLongPress = useCallback(
    (routeKey: string) => {
      const route = routesRef.current.find((r) => r.key === routeKey);
      if (!navigation || !route?.key) return;
      navigation.emit({ type: "tabLongPress", target: route.key });
    },
    [navigation]
  );

  /* ── çizim ──────────────────────────────────────────────────────────────── */

  // Yerleşim açısından kritik değerler satır içi stilde: uygulama öne gelirken NativeWind gecikmesi olmaz.
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: TAB_BAR_BG,
          paddingBottom: is3Button ? 0 : safeTabPadding,
          // Düz zemin: gölge ve üst kenarlık yok
        },
        // Klavye: animasyonsuz anında gizlenir (klavye zaten çubuğun üstünü örter, dokunuş ona ulaşmaz)
        keyboardHideStyle,
      ]}
    >
      <View style={{ flexDirection: "row", marginHorizontal: 8, height: BAR_CONTENT_H }}>
        {visibleRoutes.map((r) => (
          <TabItem key={r.key} routeKey={r.key} focused={r.key === focusedKey} routeName={r.name} onPress={handlePress} onLongPress={handleLongPress} />
        ))}
      </View>

      {/* 3 tuşlu gezinmede sistem tuşlarının arkasındaki saf siyah şerit */}
      {is3Button && <View style={{ height: insetBottom, backgroundColor: systemColors.bar, width: "100%" }} />}
    </Animated.View>
  );
}
