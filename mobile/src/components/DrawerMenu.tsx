import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Linking, ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, ExternalLink, LogOut, Moon, Sun, SunMoon, Trophy, Wallet, X } from "lucide-react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AppText, ColorIcon, GlassChip, Heading, IconButton, PressableBox, SegmentedControl } from "@/components/ui";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { useLeaderboard } from "@/hooks/queries";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { withMyPoints } from "@/lib/leaderboard";
import { CLUB } from "@/mocks/club";
import { IMAGES } from "@/mocks/images";
import { LIVE_MATCH_ID } from "@/mocks/live";
import { confirm } from "@/stores/confirmStore";
import { useDrawerStore } from "@/stores/drawerStore";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import { formatNumber } from "@/utils/format";
import { gradients, radius, scrim, systemColors, useTheme, type ThemePreference } from "@/theme";

/** Ekran genişliğine göre panel genişliği: telefonda %86, küçük ekranda en az 280, tablette en fazla 420 */
const getDrawerWidth = (screenWidth: number) => Math.round(Math.min(Math.max(screenWidth * 0.86, Math.min(280, screenWidth - 40)), screenWidth >= 600 ? 420 : 380));

/** Açılış / kapanış: kısa, sabit süreli geçiş (yay simülasyonundan ucuz ve öngörülebilir) */
const OPEN_TIMING = { duration: 260, easing: Easing.out(Easing.cubic) };
const CLOSE_TIMING = { duration: 200, easing: Easing.in(Easing.cubic) };
/** Satıra basınca sayfa geçişi, kapanış animasyonu bitmeden başlar */
const NAVIGATE_DELAY = 140;

interface DrawerItem {
  label: string;
  icon: ColorIconName;
  href?: Href;
  /** Uygulama dışında açılan bağlantı (sağda dış bağlantı işareti) */
  url?: string;
}

/** Menü bölümleri. Alt menüdeki beş sekmenin içindeki her şeye buradan tek dokunuşla gidilir. */
const SECTIONS: { title: string; items: DrawerItem[] }[] = [
  {
    title: "Maç",
    items: [
      { label: "Fikstür", icon: "fixtures", href: { pathname: "/(tabs)/matches", params: { view: "fixtures" } } },
      { label: "Puan Durumu", icon: "standings", href: { pathname: "/(tabs)/matches", params: { view: "standings" } } },
      { label: "Kadro", icon: "squad", href: { pathname: "/(tabs)/matches", params: { view: "squad" } } },
    ],
  },
  {
    title: "Oyna",
    items: [
      { label: "Skor Tahmini", icon: "prediction", href: "/play/prediction" },
      { label: "İlk 11'ini Kur", icon: "lineup", href: "/play/lineup" },
      { label: "Liderlik", icon: "leaderboard", href: "/play/leaderboard" },
    ],
  },
  {
    title: "Taraftar",
    items: [
      { label: "Anıt Duvarı", icon: "monument", href: "/monument" },
      { label: "Tribün Modu", icon: "tribune", href: "/tribune" },
      { label: "Taraftar Duvarı", icon: "fanwall", href: "/fan-wall" },
      { label: "Duvar Kağıtları", icon: "wallpaper", href: "/(tabs)/gallery" },
    ],
  },
  {
    title: "Kulüp",
    items: [
      { label: "Haberler", icon: "news", href: "/news" },
      { label: "Tarihçe", icon: "history", href: "/history" },
      { label: "Bildirimler", icon: "notification", href: "/notifications" },
      { label: "Mağaza", icon: "store", url: CLUB.store_url },
      { label: "Başkan Kokpiti", icon: "cockpit", href: "/cockpit" },
    ],
  },
];

/** Bölüm başlığı: küçük, soluk */
function SectionLabel({ title, compact }: { title: string; compact: boolean }) {
  return (
    <AppText variant="caption" weight="medium" tone="muted" style={{ marginLeft: 12, marginTop: compact ? 12 : 18, marginBottom: 2 }}>
      {title}
    </AppText>
  );
}

/** Menü satırı: Petrolspor gradyanlı ikon + etiket + soluk ok (dış bağlantıda ok yerine dış bağlantı işareti) */
const MenuRow = memo(function MenuRow({ item, compact, onPress }: { item: DrawerItem; compact: boolean; onPress: (item: DrawerItem) => void }) {
  const { colors } = useTheme();
  const Trailing = item.url ? ExternalLink : ChevronRight;
  return (
    <PressableBox
      onPress={() => onPress(item)}
      accessibilityRole={item.url ? "link" : "button"}
      accessibilityLabel={item.label}
      style={(pressed) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        minHeight: compact ? 44 : 50,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: pressed ? colors.mono.fill : "transparent",
      })}
    >
      <ColorIcon name={item.icon} size={24} />
      <AppText variant="body" weight="medium" numberOfLines={1} style={{ flex: 1 }}>
        {item.label}
      </AppText>
      <Trailing size={16} color={colors.ink.muted} strokeWidth={2} />
    </PressableBox>
  );
});

/**
 * Yan menü (Batman360 kalıbı, Petrolspor tasarımı). Üstte imza gradyanlı taraftar bloğu (arma, ad, kart numarası,
 * PetrolPuan ve sezon sırası); ortada gradyan ikonlu bölümler; en altta sabit görünüm seçimi (Koyu / Açık / Sistem)
 * ve çıkış. Kök düzende tek kez çizilir, alt menü dahil her şeyin üstünde açılır; sekmeler `openDrawer()` ile açar.
 * Sola sürükleyince, dışına dokununca ya da geri tuşuyla kapanır.
 */
export default function DrawerMenu() {
  const visible = useDrawerStore((s) => s.visible);
  const onClose = useDrawerStore((s) => s.closeDrawer);
  const { colors, preference, setPreference } = useTheme();
  const router = useRouter();
  const { is3Button, insetTop, insetBottom, safeBottomPadding } = useNavigationMode();
  const fan = useSessionStore((s) => s.fan);
  const signOut = useSessionStore((s) => s.signOut);
  const settled = usePredictionStore((s) => s.byMatch[LIVE_MATCH_ID]?.points);
  const { data: season } = useLeaderboard("season");
  const myRank = season ? withMyPoints(season, settled ?? 0, false).find((r) => r.is_me)?.rank : undefined;

  // Döndürme / katlanabilir ekran değişiminde genişlik yeniden hesaplanır; kısa ekranda satırlar sıkılaşır
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const compact = screenHeight < 760;
  const drawerWidth = getDrawerWidth(screenWidth);
  const HIDDEN_X = -drawerWidth;
  const translateX = useSharedValue(HIDDEN_X);
  const startX = useSharedValue(0);

  // İlk açılışa kadar hiç çizilmez (açılışta yer tutmaz); bir kez açıldıktan sonra ağaçta kalır
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  useEffect(() => {
    translateX.value = visible ? withTiming(0, OPEN_TIMING) : withTiming(HIDDEN_X, CLOSE_TIMING);
    // Paylaşılan değer ömür boyu sabit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, HIDDEN_X, mounted]);

  /** Kapanış animasyonu bitince durumu kapatır */
  const handleClose = useCallback(() => {
    translateX.value = withTiming(HIDDEN_X, CLOSE_TIMING, (finished) => {
      if (finished) runOnJS(onClose)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, HIDDEN_X]);

  // Paneli sola sürükleyerek kapatma
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-8, 8])
        .onStart(() => {
          startX.value = translateX.value;
        })
        .onUpdate((event) => {
          translateX.value = Math.min(0, Math.max(HIDDEN_X, startX.value + event.translationX));
        })
        .onEnd((event) => {
          if (translateX.value < HIDDEN_X * 0.25 || event.velocityX < -400) {
            translateX.value = withTiming(HIDDEN_X, CLOSE_TIMING, (finished) => {
              if (finished) runOnJS(onClose)();
            });
          } else {
            translateX.value = withTiming(0, OPEN_TIMING);
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, HIDDEN_X]
  );

  const drawerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  // Arka perde ayrı animasyon tutmaz; panelin konumundan türetilir
  const backdropStyle = useAnimatedStyle(() => ({ opacity: 1 - translateX.value / HIDDEN_X }));

  // Android geri tuşu menüyü kapatır
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, handleClose]);

  const navigateTo = useCallback(
    (href: Href) => {
      handleClose();
      setTimeout(() => router.push(href), NAVIGATE_DELAY);
    },
    [handleClose, router]
  );

  const onItemPress = useCallback(
    (item: DrawerItem) => {
      if (item.url) {
        handleClose();
        Linking.openURL(item.url).catch(() => showToast("Bağlantı açılamadı.", "error"));
      } else if (item.href) {
        navigateTo(item.href);
      }
    },
    [handleClose, navigateTo]
  );

  const logout = async () => {
    const ok = await confirm({ title: "Çıkış yap", message: "Tahminlerin ve tuğlaların bu telefonda kalır.", confirmText: "Çıkış yap", tone: "danger" });
    if (!ok) return;
    onClose();
    await signOut();
    router.replace("/(auth)/welcome");
  };

  if (!fan || (!mounted && !visible)) return null;

  return (
    <>
      {/* Menü açıkken üst blok kırmızı olduğu için durum çubuğu ikonları açık renk; kapanınca ekranın ayarı geri gelir */}
      {visible ? <StatusBar style="light" /> : null}
      {/* Tam ekran katman: Stack'ten sonra çizildiği için alt menü dahil her şeyin üstünde. Gizliyken dokunuşları geçirir. */}
      <View
        pointerEvents={visible ? "auto" : "none"}
        importantForAccessibility={visible ? "auto" : "no-hide-descendants"}
        accessibilityElementsHidden={!visible}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: scrim(0.55) }, backdropStyle]}>
          <PressableBox style={() => ({ flex: 1 })} onPress={handleClose} accessibilityRole="button" accessibilityLabel="Menüyü kapat" />
        </Animated.View>

        {/* Panel: sol kenara ve ekranın tam boyuna yapışık; 3 tuş modunda siyah sistem çubuğunun üstünde biter */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              { position: "absolute", top: 0, bottom: is3Button ? insetBottom : 0, left: 0, width: drawerWidth, backgroundColor: colors.surface.bg, overflow: "hidden", elevation: 16 },
              drawerStyle,
            ]}
          >
            {/* Taraftar bloğu: imza gradyan, alt köşeler yuvarlak */}
            <LinearGradient
              colors={gradients.signature}
              locations={[0, 0.42, 0.82, 1]}
              style={{ paddingTop: insetTop + 12, paddingHorizontal: 16, paddingBottom: 18, borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block, gap: 14 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Image source={IMAGES.crest} style={{ width: 52, height: 52 }} contentFit="contain" transition={0} accessibilityLabel="Batman Petrolspor arması" />
                <IconButton icon={X} label="Menüyü kapat" variant="frost" size={40} onPress={handleClose} />
              </View>
              <PressableBox onPress={() => navigateTo("/(tabs)/profile")} accessibilityRole="button" accessibilityLabel="Profili aç" style={() => ({ gap: 2 })}>
                <Heading size="title" color={colors.ink.inverse} numberOfLines={1}>
                  {fan.full_name}
                </Heading>
                <AppText variant="small" color={colors.glass.text} style={{ fontVariant: ["tabular-nums"], letterSpacing: 1 }}>
                  {fan.fan_card_no}
                </AppText>
              </PressableBox>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <GlassChip icon={Wallet} label={`${formatNumber(fan.petrol_puan)} PetrolPuan`} />
                {myRank ? <GlassChip icon={Trophy} label={`Sezon ${myRank}.`} onPress={() => navigateTo("/play/leaderboard")} /> : null}
              </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
              {SECTIONS.map((section) => (
                <View key={section.title}>
                  <SectionLabel title={section.title} compact={compact} />
                  {section.items.map((item) => (
                    <MenuRow key={item.label} item={item} compact={compact} onPress={onItemPress} />
                  ))}
                </View>
              ))}
            </ScrollView>

            {/* Sabit alt bölüm: görünüm seçimi ve çıkış */}
            <View style={{ borderTopWidth: 1, borderTopColor: colors.mono.line, paddingTop: 12, paddingHorizontal: 12, paddingBottom: is3Button ? 12 : safeBottomPadding, gap: 10 }}>
              <SegmentedControl<ThemePreference>
                value={preference}
                onChange={(key) => setPreference(key).catch(console.warn)}
                options={[
                  { key: "dark", label: "Koyu", icon: Moon },
                  { key: "light", label: "Açık", icon: Sun },
                  { key: "system", label: "Sistem", icon: SunMoon },
                ]}
              />
              <PressableBox
                onPress={logout}
                accessibilityRole="button"
                accessibilityLabel="Çıkış yap"
                style={(pressed) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 44, borderRadius: 16, backgroundColor: pressed ? colors.mono.fill : "transparent" })}
              >
                <LogOut size={18} color={colors.ink.secondary} strokeWidth={1.75} />
                <AppText variant="small" weight="medium" tone="secondary">
                  Çıkış yap
                </AppText>
              </PressableBox>
            </View>
          </Animated.View>
        </GestureDetector>

        {/* 3 tuşlu gezinmede sistem tuşlarının arkasındaki saf siyah şerit */}
        {is3Button ? <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: insetBottom, backgroundColor: systemColors.bar }} /> : null}
      </View>
    </>
  );
}
