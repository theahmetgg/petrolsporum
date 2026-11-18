import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Mic, Square, Waves } from "lucide-react-native";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, Heading, ScreenHeader, Surface } from "@/components/ui";
import { OilRig, FLAME_THRESHOLD } from "@/components/tribune/OilRig";
import { showToast } from "@/stores/toastStore";
import { spacing, useColors } from "@/theme";

type Mode = "idle" | "mic" | "demo";

/** Ölçüm aralığı (ms) */
const TICK_MS = 100;
/** Mikrofon seviyesi (dBFS) bu aralıktan 0-1'e çevrilir: sessiz oda ≈ -55, bağırış ≈ -8 */
const DB_FLOOR = -55;
const DB_CEIL = -8;
/** Ses düşünce kule hemen boşalmasın: her ölçümde bu oranla iner */
const RELEASE = 0.9;

const normalize = (db: number) => Math.max(0, Math.min(1, (db - DB_FLOOR) / (DB_CEIL - DB_FLOOR)));

/**
 * Tribün Modu: Tribünün Sesi (prototip ekran 8). Mikrofon açılınca ses yükseldikçe petrol kulesi dolar, zirvede alev
 * yanar. Gösterilen değer gerçek desibel DEĞİLDİR: telefon mikrofonu kalibre değildir ve yüksek seste doyar; bu yüzden
 * 0-100 arası göreli "tribün gücü" puanı kullanılır (Ar-Ge belgesi 10.5). Ses hiçbir yere gönderilmez.
 * "Mikrofonsuz dene" sessiz ortamda (sunum odası) ekranı göstermek için örnek ses dalgası üretir.
 */
export default function TribuneScreen() {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const [mode, setMode] = useState<Mode>("idle");
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const levelRef = useRef(0);
  const flameRef = useRef(false);

  const recorder = useAudioRecorder({ ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, TICK_MS);

  /** Yeni ölçümü işler: hızlı yükselir, yavaş iner; rekoru ve alev titreşimini yönetir */
  const push = useCallback((target: number) => {
    const next = Math.max(target, levelRef.current * RELEASE);
    levelRef.current = next;
    setLevel(next);
    setPeak((p) => Math.max(p, next));
    const flame = next >= FLAME_THRESHOLD;
    if (flame && !flameRef.current) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    flameRef.current = flame;
  }, []);

  // Mikrofon: kaydedicinin anlık ses seviyesi
  useEffect(() => {
    if (mode !== "mic" || !recorderState.isRecording) return;
    push(normalize(recorderState.metering ?? DB_FLOOR));
  }, [mode, recorderState.isRecording, recorderState.metering, recorderState.durationMillis, push]);

  // Demo: örnek tribün dalgası (yükselen tezahürat + rastgele oynama)
  useEffect(() => {
    if (mode !== "demo") return;
    const started = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - started) / 1000;
      const swell = 0.5 + 0.45 * Math.sin(t * 0.9 - 1.2);
      push(Math.max(0, Math.min(1, swell + (Math.random() - 0.5) * 0.18)));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [mode, push]);

  const stop = useCallback(async () => {
    setMode("idle");
    levelRef.current = 0;
    setLevel(0);
    flameRef.current = false;
    try {
      if (recorder.isRecording) await recorder.stop();
    } catch {
      // Kayıt zaten durmuş olabilir
    }
  }, [recorder]);

  // Ekrandan çıkınca kaydediciyi `useAudioRecorder` kendisi serbest bırakır (mikrofon kapanır). Burada ayrıca
  // `recorder`'a dokunulmaz: serbest bırakılmış nesneye erişmek hata fırlatır.

  const startMic = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        showToast("Ses ölçmek için mikrofon izni gerekli.", "info");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setPeak(0);
      setMode("mic");
    } catch {
      showToast("Mikrofon açılamadı. Mikrofonsuz deneyebilirsin.", "error");
    }
  };

  const startDemo = () => {
    setPeak(0);
    setMode("demo");
  };

  const score = Math.round(level * 100);
  const rigWidth = Math.min(width - spacing.screen * 2 - 60, 260);

  return (
    <Screen>
      <ScreenHeader
        title="Tribün Modu"
        onBack={() => {
          stop();
          router.back();
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: spacing.screen, paddingBottom: 20 }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
          <OilRig level={level} width={rigWidth} />
          <Heading size="score" color={level >= FLAME_THRESHOLD ? colors.brand.strong : colors.ink.DEFAULT} style={{ fontVariant: ["tabular-nums"] }}>
            {String(score)}
          </Heading>
          <AppText variant="small" tone="muted">
            Tribün gücü {mode === "demo" ? "· örnek ses" : ""}
          </AppText>
        </View>

        <Surface padding={14}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" tone="muted">
              Bu oturumun rekoru
            </AppText>
            <AppText variant="subhead" style={{ fontVariant: ["tabular-nums"] }}>
              {Math.round(peak * 100)} / 100
            </AppText>
          </View>
          <AppText variant="caption" tone="muted" style={{ flex: 1.4 }} align="right">
            {level >= FLAME_THRESHOLD ? "Zirve! Kule alev aldı." : "Zirve için 85'i geç."}
          </AppText>
        </Surface>

        <View style={{ marginTop: 12, gap: 10 }}>
          {mode === "idle" ? (
            <>
              <Button title="Mikrofonu aç" icon={Mic} size="lg" fullWidth onPress={startMic} />
              <Button title="Mikrofonsuz dene" icon={Waves} size="lg" variant="secondary" fullWidth onPress={startDemo} />
            </>
          ) : (
            <Button title="Durdur" icon={Square} size="lg" variant="secondary" fullWidth onPress={stop} />
          )}
          <AppText variant="caption" tone="muted" align="center">
            Puan gerçek desibel değildir; telefona göre değişen göreli bir ölçüdür. Ses hiçbir yere gönderilmez.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
