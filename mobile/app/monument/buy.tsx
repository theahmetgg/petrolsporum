import { hapticSuccess } from "@/lib/haptics";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, Radio, ScreenHeader, StepIndicator, Surface, TextField } from "@/components/ui";
import { BRICK_TYPES } from "@/mocks/fans";
import { useBrickStore } from "@/stores/brickStore";
import { confirm } from "@/stores/confirmStore";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import type { BrickType } from "@/types";
import { formatTL } from "@/utils/format";
import { spacing, useColors } from "@/theme";

const TYPE_ORDER: BrickType[] = ["red", "white", "gold", "platinum"];
const MAX_NAME = 28;
const MAX_MESSAGE = 40;

/**
 * Tuğla alma akışı (prototip ekran 7): 1) tuğla türü, 2) duvara yazılacak ad ve mesaj, 3) sertifika.
 * ÖDEME DEMODUR: "Satın al" bir onay penceresi açar, para alınmaz; tuğla yalnız bu telefonda oluşur.
 * Gerçek sürümde dijital ürün satışı mağazanın kendi ödeme sistemiyle yapılır (Ar-Ge belgesi 10.1).
 */
export default function BuyBrickScreen() {
  const colors = useColors();
  const fan = useSessionStore((s) => s.fan);
  const buy = useBrickStore((s) => s.buy);
  const [step, setStep] = useState(0);
  const [type, setType] = useState<BrickType>("white");
  const [name, setName] = useState(fan && !fan.is_guest ? fan.full_name : "");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim().length < 2 ? "Duvara yazılacak adı yaz." : null;
  const info = BRICK_TYPES[type];

  const purchase = async () => {
    setSubmitted(true);
    if (nameError) return;
    const ok = await confirm({
      title: "Demo satın alma",
      message: `${info.label} · ${formatTL(info.price)}. Bu bir demodur: ödeme alınmaz, tuğla yalnız bu telefonda oluşur.`,
      confirmText: "Tuğlayı yerleştir",
      tone: "primary",
    });
    if (!ok) return;
    const brick = buy(type, name, message);
    if (!brick) {
      showToast("Duvarda boş yer kalmadı.", "error");
      return;
    }
    hapticSuccess();
    router.replace(`/monument/certificate/${brick.id}`);
  };

  return (
    <Screen avoidKeyboard>
      <ScreenHeader title="Tuğla al" onBack={() => (step === 1 ? setStep(0) : router.back())} />
      <View style={{ paddingHorizontal: spacing.screen, paddingBottom: 16 }}>
        <StepIndicator steps={["Tuğla", "Ad", "Sertifika"]} current={step} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 32, gap: spacing.boxGap }} keyboardShouldPersistTaps="handled">
        {step === 0 ? (
          <>
            {TYPE_ORDER.map((t) => (
              <Surface key={t} onPress={() => setType(t)} padding={14} accessibilityLabel={`${BRICK_TYPES[t].label}, ${formatTL(BRICK_TYPES[t].price)}`}>
                <View style={{ width: 52, height: 26, borderRadius: 5, backgroundColor: colors.brick[t] }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="subhead">{BRICK_TYPES[t].label}</AppText>
                  <AppText variant="caption" tone="muted">
                    {BRICK_TYPES[t].note}
                  </AppText>
                  <AppText variant="small" weight="bold" style={{ marginTop: 2 }}>
                    {formatTL(BRICK_TYPES[t].price)}
                  </AppText>
                </View>
                <Radio checked={type === t} />
              </Surface>
            ))}
            <Button title="Devam" rightIcon={ArrowRight} size="lg" fullWidth onPress={() => setStep(1)} style={{ marginTop: 8 }} />
          </>
        ) : (
          <>
            <Surface>
              <View style={{ width: 44, height: 22, borderRadius: 4, backgroundColor: colors.brick[type] }} />
              <AppText variant="small" weight="medium" style={{ flex: 1 }}>
                {info.label}
              </AppText>
              <AppText variant="small" weight="bold">
                {formatTL(info.price)}
              </AppText>
            </Surface>
            <TextField label="Duvardaki ad *" placeholder="Ad Soyad ya da firma adı" value={name} onChangeText={setName} maxLength={MAX_NAME} showCounter autoCapitalize="words" error={submitted ? nameError : null} />
            <TextField label="Kısa mesaj" placeholder="Örn: Sonsuza dek Petrolspor" value={message} onChangeText={setMessage} maxLength={MAX_MESSAGE} showCounter helper="İsteğe bağlı. Tuğlana dokunanlar görür." />
            <Button title={`Satın al · ${formatTL(info.price)}`} size="lg" fullWidth onPress={purchase} style={{ marginTop: 8 }} />
            <AppText variant="caption" tone="muted" align="center">
              Demo sürüm: ödeme alınmaz.
            </AppText>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
