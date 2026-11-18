import React, { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, Heading, PressableBox } from "@/components/ui";
import { IMAGES } from "@/mocks/images";
import { useSessionStore } from "@/stores/sessionStore";
import { scrim, spacing, ThemeScope, useColors } from "@/theme";
import { useNavigationMode } from "@/hooks/useNavigationMode";

const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

/**
 * Karşılama ekranı (prototip ekran 1; yapı Ar-Ge belgesi 8.1'deki 4. referanstan): tam ekran maç fotoğrafı,
 * üstünde aşağı doğru koyulaşan katman, arma, büyük başlık ve iki ana seçenek. Fotoğraf kulübün kendi maç
 * fotoğrafıdır (lisanslı yıldız oyuncu görseli kullanılmaz).
 */
export default function WelcomeScreen() {
  // Fotoğraflı açılış her temada koyudur: yazılar fotoğraf üstünde beyaz kalır (açık temada da)
  return (
    <ThemeScope scheme="dark">
      <WelcomeContent />
    </ThemeScope>
  );
}

function WelcomeContent() {
  const colors = useColors();
  const { insetTop } = useNavigationMode();
  const signInGuest = useSessionStore((s) => s.signInGuest);
  const [busy, setBusy] = useState(false);

  const continueAsGuest = async () => {
    if (busy) return;
    setBusy(true);
    await signInGuest();
    router.replace("/(tabs)");
  };

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <Image source={IMAGES["wp-photo-goal"]} style={FILL} contentFit="cover" transition={0} />
      {/* Üstte hafif, altta sayfa zeminine kadar koyulaşan katman: yazılar fotoğraf üstünde okunur kalır */}
      <LinearGradient colors={[scrim(0.35), scrim(0.1), scrim(0.75), colors.surface.bg]} locations={[0, 0.3, 0.62, 0.86]} style={FILL} />

      <View style={{ flex: 1, paddingHorizontal: spacing.screen, paddingTop: insetTop + 20, paddingBottom: 20 }}>
        <Image source={IMAGES.crest} style={{ width: 76, height: 76 }} contentFit="contain" transition={0} accessibilityLabel="Batman Petrolspor arması" />

        <View style={{ flex: 1 }} />

        <Heading size="label" color={colors.brand.strong}>
          Batman Petrolspor · 1960
        </Heading>
        <Heading size="display" style={{ marginTop: 8, fontSize: 44, lineHeight: 46 }} accessibilityRole="header">
          Petrolspor ruhu tribünde başlar
        </Heading>
        <AppText variant="body" tone="secondary" style={{ marginTop: 10 }}>
          Maçlar, skor tahmini, anıt duvarı ve taraftar kartın tek uygulamada.
        </AppText>

        <View style={{ marginTop: 28, gap: 10 }}>
          <Button title="Giriş yap" size="lg" fullWidth onPress={() => router.push("/(auth)/login")} />
          <Button title="Üye ol" size="lg" variant="secondary" fullWidth onPress={() => router.push("/(auth)/register")} />
        </View>

        <PressableBox
          onPress={continueAsGuest}
          accessibilityRole="button"
          style={() => ({ alignSelf: "center", minHeight: 44, justifyContent: "center", paddingHorizontal: 12, marginTop: 6 })}
        >
          <AppText variant="small" tone="secondary" style={{ textDecorationLine: "underline" }}>
            Üye olmadan devam et
          </AppText>
        </PressableBox>
      </View>
    </Screen>
  );
}
