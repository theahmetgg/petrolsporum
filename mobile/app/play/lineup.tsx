import React, { useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { RotateCcw, Share2 } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Screen } from "@/components/layout/Screen";
import { AppText, FloatingActionBar, FLOATING_BAR_HEIGHT, Heading, IconButton, ListRowSkeleton, Pill, ScreenHeader, Surface, useFloatingBarBottom } from "@/components/ui";
import { SelectPickerSheet } from "@/components/common/SelectPickerSheet";
import { Pitch } from "@/components/match/Pitch";
import { FORMATIONS, FORMATION_KEYS } from "@/constants/formations";
import { useSquad } from "@/hooks/queries";
import { IMAGES } from "@/mocks/images";
import { LINE_LABELS } from "@/mocks/players";
import { useLineupStore } from "@/stores/lineupStore";
import { useSessionStore } from "@/stores/sessionStore";
import { showToast } from "@/stores/toastStore";
import { genitive } from "@/utils/text";
import { gradients, radius, spacing, useColors } from "@/theme";

/** Paylaşım görselinin genişliği (dp); 3 kat çözünürlükte kaydedilir (1080 px) */
const CARD_WIDTH = 360;
const NONE = "__none__";

/**
 * İlk 11'ini Kur (prototip ekran 5). Diziliş seçilir; oyuncuya dokununca o yer için oyuncu seçilir, oyuncu
 * sürüklenip başka bir oyuncunun üstüne bırakılınca ikisi yer değiştirir. Kaptan listeden seçilir.
 * "Paylaş" kırmızı zeminli, kulüp logolu bir görsel üretir ve telefonun paylaşım penceresini açar.
 */
export default function LineupScreen() {
  const colors = useColors();
  const barBottom = useFloatingBarBottom();
  const { data: squad } = useSquad();
  const fan = useSessionStore((s) => s.fan);
  const { formation, slots, captainId, setFormation, place, swap, clearSlot, setCaptain, reset } = useLineupStore();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const playerSheet = useRef<BottomSheetModal>(null);
  const captainSheet = useRef<BottomSheetModal>(null);
  const shotRef = useRef<ViewShot>(null);

  const formationSlots = FORMATIONS[formation];
  const players = useMemo(() => slots.map((id) => squad?.find((p) => p.id === id) ?? null), [slots, squad]);
  const filled = players.filter(Boolean).length;
  const captain = players.find((p) => p?.id === captainId) ?? null;
  const firstName = fan && !fan.is_guest ? fan.full_name.split(" ")[0] : null;

  // Oyuncu seçenekleri: seçilen yerin hattındaki oyuncular üstte, sonra diğerleri; sahadakiler işaretli
  const playerOptions = useMemo(() => {
    if (!squad || activeSlot == null) return [];
    const line = formationSlots[activeSlot].line;
    const sorted = [...squad].sort((a, b) => Number(b.line === line) - Number(a.line === line) || a.shirt_number - b.shirt_number);
    const options = sorted.map((p) => ({
      value: p.id,
      label: `${p.shirt_number} · ${p.full_name ?? p.name}`,
      description: `${p.position}${slots.includes(p.id) && slots[activeSlot] !== p.id ? " · sahada (yer değiştirir)" : ""}`,
    }));
    return slots[activeSlot] ? [...options, { value: NONE, label: "Yeri boşalt", description: "Bu yerdeki oyuncuyu çıkar" }] : options;
  }, [squad, activeSlot, formationSlots, slots]);

  const captainOptions = useMemo(
    () => players.filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ value: p.id, label: `${p.shirt_number} · ${p.full_name ?? p.name}`, description: p.position })),
    [players]
  );

  const openSlot = (index: number) => {
    setActiveSlot(index);
    playerSheet.current?.present();
  };

  const share = async () => {
    if (sharing) return;
    if (filled < 11) {
      showToast("Önce 11 oyuncuyu da yerleştir.", "info");
      return;
    }
    setSharing(true);
    try {
      const uri = await captureRef(shotRef, { format: "png", quality: 1, result: "tmpfile" });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "İlk 11'ini paylaş" });
      } else {
        showToast("Bu cihazda paylaşım açılamıyor.", "error");
      }
    } catch {
      showToast("Görsel oluşturulamadı. Tekrar dene.", "error");
    } finally {
      setSharing(false);
    }
  };

  if (!squad) {
    return (
      <Screen>
        <ScreenHeader title="İlk 11'ini Kur" />
        <View style={{ paddingHorizontal: spacing.screen }}>
          <ListRowSkeleton count={4} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="İlk 11'ini Kur" right={<IconButton icon={RotateCcw} label="Dizilişi sıfırla" variant="ghost" size={40} onPress={reset} />} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: barBottom + FLOATING_BAR_HEIGHT + 32, gap: 14 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 8 }}>
          {FORMATION_KEYS.map((key) => (
            <Pill key={key} label={key} selected={formation === key} onPress={() => setFormation(key)} />
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
          <Pitch slots={formationSlots} players={players} captainId={captainId} onSlotPress={openSlot} onSwap={swap} selectedSlot={activeSlot} />
          <AppText variant="caption" tone="muted" align="center">
            Oyuncuya dokun: değiştir. Sürükle bırak: yer değiştir.
          </AppText>

          <Surface onPress={() => captainSheet.current?.present()} chevron>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" tone="muted">
                Kaptan
              </AppText>
              <AppText variant="subhead">{captain ? `${captain.shirt_number} · ${captain.full_name ?? captain.name}` : "Kaptan seç"}</AppText>
            </View>
          </Surface>
        </View>

        {/* Paylaşım görselinin önizlemesi: paylaşılan görsel budur */}
        <View style={{ paddingHorizontal: spacing.screen, gap: 8 }}>
          <AppText variant="caption" weight="medium" tone="muted">
            Paylaşım görseli
          </AppText>
          <View style={{ alignItems: "center" }}>
            <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }} style={{ width: CARD_WIDTH, borderRadius: radius.box, overflow: "hidden" }}>
              <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ padding: 16, gap: 12 }} collapsable={false}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Image source={IMAGES.crest} style={{ width: 44, height: 44 }} contentFit="contain" transition={0} />
                  <View style={{ alignItems: "flex-end" }}>
                    <Heading size="title" color={colors.ink.inverse}>
                      {firstName ? `${genitive(firstName)} 11'i` : "Benim 11'im"}
                    </Heading>
                    <AppText variant="caption" color={colors.glass.text}>
                      {formation} · Bence bu maç böyle çıkmalıyız!
                    </AppText>
                  </View>
                </View>
                <Pitch slots={formationSlots} players={players} captainId={captainId} width={CARD_WIDTH - 32} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Image source={IMAGES.logoWhite} style={{ width: 110, height: 33 }} contentFit="contain" transition={0} />
                  <AppText variant="caption" weight="medium" color={colors.ink.inverse}>
                    #Petrolspor
                  </AppText>
                </View>
              </LinearGradient>
            </ViewShot>
          </View>
        </View>
      </ScrollView>

      <FloatingActionBar label={filled < 11 ? `${filled} / 11 oyuncu` : "Paylaş"} icon={Share2} loading={sharing} disabled={filled < 11} onPress={share} />

      <SelectPickerSheet
        ref={playerSheet}
        title={activeSlot != null ? `${LINE_LABELS[formationSlots[activeSlot].line]} için oyuncu seç` : "Oyuncu seç"}
        options={playerOptions}
        selected={activeSlot != null ? slots[activeSlot] ?? undefined : undefined}
        onSelect={(value) => {
          if (activeSlot == null) return;
          if (value === NONE) clearSlot(activeSlot);
          else place(activeSlot, value);
        }}
        onDismiss={() => setActiveSlot(null)}
      />

      <SelectPickerSheet ref={captainSheet} title="Kaptanı seç" options={captainOptions} selected={captainId ?? undefined} onSelect={setCaptain} snapPoints={["60%", "85%"]} />
    </Screen>
  );
}
