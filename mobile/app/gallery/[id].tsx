import React, { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";
import { Download, Eye, EyeOff, Lock, Share2, X } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, EmptyState, IconButton, ScreenHeader } from "@/components/ui";
import { useWallpapers } from "@/hooks/queries";
import { useNow } from "@/hooks/useNow";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { IMAGES, imageSource, type ImageKey } from "@/mocks/images";
import { showToast } from "@/stores/toastStore";
import { pad2 } from "@/utils/format";
import { scrim, spacing, useColors } from "@/theme";

const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/** Kilit ekranındaki örnek bildirim kutusu (cam yüzey) */
function LockNotification({ title, text, time }: { title: string; text: string; time: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 12, padding: 14, borderRadius: 22, backgroundColor: scrim(0.55), borderWidth: 1, borderColor: colors.glass.border }}>
      <Image source={IMAGES.crest} style={{ width: 36, height: 36 }} contentFit="contain" transition={0} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText variant="small" weight="bold" color={colors.ink.inverse}>
            {title}
          </AppText>
          <AppText variant="caption" color={colors.glass.text}>
            {time}
          </AppText>
        </View>
        <AppText variant="small" color={colors.glass.text}>
          {text}
        </AppText>
      </View>
    </View>
  );
}

/**
 * Duvar kağıdı önizleme + Kilit Ekranı Simülatörü (prototip ekran 6). Görsel tam ekran açılır; üstünde telefonun
 * GERÇEK saati ve tarihi, altında örnek bildirimler durur: duvar kağıdının kilit ekranında nasıl görüneceği görülür.
 * "İndir" görseli galeriye kaydeder (yalnız yazma izni), "Paylaş" paylaşım penceresini açar.
 */
export default function WallpaperPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { insetTop, safeBottomPadding } = useNavigationMode();
  const { data: wallpapers, isLoading } = useWallpapers();
  const item = wallpapers?.find((w) => w.id === id);
  const now = new Date(useNow(1000));
  const [lockView, setLockView] = useState(true);
  const [busy, setBusy] = useState<"save" | "share" | null>(null);

  /** Gömülü görselin telefondaki dosya yolu (paylaşmak ve kaydetmek için) */
  const localFile = async () => {
    const asset = Asset.fromModule(IMAGES[item!.image as ImageKey]);
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error("Görsel dosyası hazırlanamadı.");
    return asset.localUri;
  };

  const save = async () => {
    if (busy || !item) return;
    setBusy("save");
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        showToast("Kaydetmek için galeri izni gerekli.", "info");
        return;
      }
      await MediaLibrary.saveToLibraryAsync(await localFile());
      showToast("Duvar kağıdı galerine kaydedildi.", "success");
    } catch {
      showToast("Kaydedilemedi. Tekrar dene.", "error");
    } finally {
      setBusy(null);
    }
  };

  const share = async () => {
    if (busy || !item) return;
    setBusy("share");
    try {
      await Sharing.shareAsync(await localFile(), { mimeType: "image/jpeg", dialogTitle: item.title });
    } catch {
      showToast("Paylaşım açılamadı.", "error");
    } finally {
      setBusy(null);
    }
  };

  if (!isLoading && !item) {
    return (
      <Screen>
        <ScreenHeader title="Duvar kağıdı" />
        <EmptyState title="Duvar kağıdı bulunamadı" actionLabel="Galeriye dön" onAction={() => router.replace("/(tabs)/gallery")} />
      </Screen>
    );
  }

  return (
    <Screen withTopInset={false} withBottomInset={false} statusBarStyle="light" navigationBarStyle="light" backgroundColor={colors.media.bg}>
      {item ? <Image source={imageSource(item.image)} style={FILL} contentFit="cover" transition={150} /> : null}

      {lockView ? (
        <>
          <LinearGradient colors={[scrim(0.45), scrim(0), scrim(0), scrim(0.6)]} locations={[0, 0.3, 0.6, 1]} style={FILL} pointerEvents="none" />
          {/* Kilit ekranı: gerçek saat ve tarih */}
          <View style={{ position: "absolute", top: insetTop + 64, left: 0, right: 0, alignItems: "center" }} pointerEvents="none">
            <Lock size={18} color={colors.ink.inverse} strokeWidth={2} />
            <AppText variant="subhead" color={colors.ink.inverse} style={{ marginTop: 10 }}>
              {`${now.getDate()} ${MONTHS[now.getMonth()]} ${DAYS[now.getDay()]}`}
            </AppText>
            <AppText
              variant="hero"
              weight="medium"
              color={colors.ink.inverse}
              style={{ fontSize: 88, lineHeight: 96, letterSpacing: -2, fontVariant: ["tabular-nums"] }}
              accessibilityLabel={`Saat ${now.getHours()} ${now.getMinutes()}`}
            >
              {`${pad2(now.getHours())}:${pad2(now.getMinutes())}`}
            </AppText>
          </View>
          {/* Örnek bildirimler */}
          <View style={{ position: "absolute", left: spacing.screen, right: spacing.screen, bottom: safeBottomPadding + 96, gap: 10 }} pointerEvents="none">
            <LockNotification title="Batman Petrolspor" text="Gooool! Batman Petrolspor 1-0 önde!" time="şimdi" />
            <LockNotification title="Skor Tahmini" text="Muğlaspor maçı için tahminini yapmayı unutma." time="12 dk" />
          </View>
        </>
      ) : null}

      {/* Üst düğmeler */}
      <View style={{ position: "absolute", top: insetTop + 8, left: spacing.screen, right: spacing.screen, flexDirection: "row", justifyContent: "space-between" }}>
        <IconButton icon={X} label="Kapat" variant="overlay" size={40} onPress={() => router.back()} />
        <IconButton icon={lockView ? EyeOff : Eye} label={lockView ? "Kilit ekranını gizle" : "Kilit ekranında önizle"} variant="overlay" size={40} onPress={() => setLockView((v) => !v)} />
      </View>

      {/* Alt eylemler */}
      <View style={{ position: "absolute", left: spacing.screen, right: spacing.screen, bottom: safeBottomPadding + 12, flexDirection: "row", gap: 10 }}>
        <Button title="İndir" icon={Download} size="lg" loading={busy === "save"} onPress={save} style={{ flex: 1 }} />
        <Button title="Paylaş" icon={Share2} size="lg" variant="secondary" loading={busy === "share"} onPress={share} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}
