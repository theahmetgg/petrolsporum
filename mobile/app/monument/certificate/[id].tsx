import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Share2 } from "lucide-react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, EmptyState, Heading, ScreenHeader } from "@/components/ui";
import { CLUB } from "@/mocks/club";
import { BRICK_TYPES } from "@/mocks/fans";
import { IMAGES } from "@/mocks/images";
import { useBrickStore } from "@/stores/brickStore";
import { showToast } from "@/stores/toastStore";
import { formatLongDate } from "@/utils/format";
import { radius, spacing, useColors } from "@/theme";

const CARD_WIDTH = 340;

/**
 * Resmi Dijital Anıt Sertifikası (prototip ekran 7). Kullanıcının tuğlası için üretilen görsel: açık kağıt zemin,
 * arma, ad, tuğla türü, sertifika numarası ve tarih. "Paylaş" görseli resim olarak paylaşır.
 * İmza alanı boştur: gerçek sürümde kulüp başkanının imzası kulübün onayıyla eklenir.
 */
export default function CertificateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const brick = useBrickStore((s) => s.myBricks.find((b) => b.id === id));
  const shotRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  const share = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(shotRef, { format: "png", quality: 1, result: "tmpfile" });
      await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Anıt sertifikanı paylaş" });
    } catch {
      showToast("Görsel oluşturulamadı. Tekrar dene.", "error");
    } finally {
      setSharing(false);
    }
  };

  if (!brick) {
    return (
      <Screen>
        <ScreenHeader title="Sertifika" />
        <EmptyState title="Sertifika bulunamadı" description="Bu tuğla bu telefonda kayıtlı değil." actionLabel="Anıt duvarına git" onAction={() => router.replace("/monument")} />
      </Screen>
    );
  }

  // Sertifika kağıdı her iki temada açık renklidir: renkler tuğla paletinin beyazı ve koyu mürekkep
  const paper = colors.brick.white;
  const ink = colors.scrim.DEFAULT;
  const today = new Date().toISOString();

  return (
    <Screen>
      <ScreenHeader title="Sertifika" onBack={() => router.replace("/monument")} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 40, alignItems: "center", gap: 20 }}>
        <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }} style={{ width: CARD_WIDTH, borderRadius: radius.box, overflow: "hidden" }}>
          <View collapsable={false} style={{ backgroundColor: paper, padding: 10 }}>
            <View style={{ borderWidth: 2, borderColor: colors.brand.fill, borderRadius: radius.thumb, paddingVertical: 24, paddingHorizontal: 18, alignItems: "center", gap: 10 }}>
              <Image source={IMAGES.crest} style={{ width: 84, height: 84 }} contentFit="contain" transition={0} />
              <Heading size="label" color={colors.brand.fill} align="center">
                Resmi Dijital Anıt Sertifikası
              </Heading>
              <AppText variant="caption" color={ink} align="center" style={{ opacity: 0.7 }}>
                Bu sertifika, Batman Şehir Stadyumu dijital anıt duvarında adına bir tuğla yerleştirildiğini belgeler.
              </AppText>
              <Heading size="display" color={ink} align="center" style={{ marginTop: 6 }}>
                {brick.owner_name}
              </Heading>
              {brick.message ? (
                <AppText variant="small" color={ink} align="center" style={{ fontStyle: "italic", opacity: 0.8 }}>
                  "{brick.message}"
                </AppText>
              ) : null}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
                <View style={{ width: 36, height: 18, borderRadius: 3, backgroundColor: colors.brick[brick.brick_type], borderWidth: 1, borderColor: ink }} />
                <AppText variant="small" weight="bold" color={ink}>
                  {BRICK_TYPES[brick.brick_type].label}
                </AppText>
              </View>
              <View style={{ alignSelf: "stretch", flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
                <View>
                  <AppText variant="badge" color={ink} style={{ opacity: 0.6 }}>
                    SERTİFİKA NO
                  </AppText>
                  <AppText variant="small" weight="bold" color={ink}>
                    {brick.certificate_no}
                  </AppText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppText variant="badge" color={ink} style={{ opacity: 0.6 }}>
                    TARİH
                  </AppText>
                  <AppText variant="small" weight="bold" color={ink}>
                    {formatLongDate(today)}
                  </AppText>
                </View>
              </View>
              <View style={{ alignSelf: "stretch", alignItems: "center", marginTop: 18 }}>
                <View style={{ width: 160, height: 1, backgroundColor: ink, opacity: 0.5 }} />
                <AppText variant="caption" color={ink} style={{ marginTop: 4, opacity: 0.7 }}>
                  Kulüp Başkanı
                </AppText>
                <AppText variant="badge" color={ink} style={{ opacity: 0.6 }}>
                  {CLUB.legal_name} · {CLUB.founded}
                </AppText>
              </View>
            </View>
          </View>
        </ViewShot>

        <View style={{ alignSelf: "stretch", gap: 10 }}>
          <Button title="Sertifikayı paylaş" icon={Share2} size="lg" fullWidth loading={sharing} onPress={share} />
          <Button title="Duvarda gör" variant="secondary" size="lg" fullWidth onPress={() => router.replace({ pathname: "/monument", params: { focus: brick.id } })} />
        </View>
      </ScrollView>
    </Screen>
  );
}
