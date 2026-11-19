import React from "react";
import { Linking, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, ColorIconBox, Heading, Reveal, ScreenHeader, SectionHeader, Surface } from "@/components/ui";
import { MatchRow } from "@/components/match/MatchRow";
import { useMatches } from "@/hooks/queries";
import { TICKET_STEPS, TICKET_URL } from "@/mocks/matchday";
import { OWN_TEAM_ID } from "@/mocks/teams";
import { showToast } from "@/stores/toastStore";
import { spacing, useColors } from "@/theme";

const openTickets = () => Linking.openURL(TICKET_URL).catch(() => showToast("Bağlantı açılamadı.", "error"));

/** Numaralı adım: solda daire içinde sıra, sağda başlık ve açıklama */
function Step({ index, title, text }: { index: number; title: string; text: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.mono.solid }}>
        <Heading size="title" color={colors.mono.onSolid}>
          {index}
        </Heading>
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="small" weight="medium">
          {title}
        </AppText>
        <AppText variant="caption" tone="secondary">
          {text}
        </AppText>
      </View>
    </View>
  );
}

/**
 * Bilet ve Kombine. UYGULAMADA BİLET SATILMAZ (Ar-Ge belgesi: ödeme entegrasyonu Faz 3); taraftar resmi satış
 * sitesine yönlendirilir. Ekranın işi yolu kısaltmak: sıradaki iç saha maçını gösterir, tek tuşla satış sitesini
 * açar ve biletin nasıl alındığını dört adımda anlatır. Fiyat yazılmaz (kaynak yok; satış sitesinde görünür).
 * Satış kanalı varsayımı ve adımlar için `mocks/matchday.ts` içindeki nota bakın.
 */
export default function TicketsScreen() {
  const { data: matches } = useMatches();
  // Sıradaki iç saha maçı: oynanmamış ve ev sahibi biziz
  const nextHome = matches?.find((m) => m.status === "scheduled" && m.home_team_id === OWN_TEAM_ID);

  return (
    <Screen>
      <ScreenHeader title="Bilet ve Kombine" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Reveal index={0} style={{ paddingHorizontal: spacing.screen }}>
          <Surface row={false} padding={16}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <ColorIconBox name="ticket" size={48} />
              <View style={{ flex: 1 }}>
                <AppText variant="subhead">Biletler resmi satış sitesinden alınır</AppText>
                <AppText variant="small" tone="muted">
                  Uygulamada bilet satılmaz. Seni Passo'ya yönlendiririz; koltuğunu orada seçersin.
                </AppText>
              </View>
            </View>
          </Surface>
        </Reveal>

        {nextHome ? (
          <Reveal index={1} style={{ marginTop: spacing.section }}>
            <SectionHeader title="Sıradaki iç saha maçı" />
            <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
              <MatchRow match={nextHome} onPress={() => router.push(`/match/${nextHome.id}`)} />
              <Button title="Maç bileti al" icon={ExternalLink} size="lg" fullWidth onPress={openTickets} />
            </View>
          </Reveal>
        ) : null}

        <Reveal index={2} style={{ marginTop: spacing.section }}>
          <SectionHeader title="Kombine" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface row={false} padding={16}>
              <AppText variant="small">
                Kombine, sezonun bütün iç saha lig maçlarına aynı koltuktan girmeni sağlar. Satış dönemini ve fiyatları kulüp duyurur; satın alma Passo üzerinden yapılır.
              </AppText>
              <Button title="Kombineyi Passo'da gör" icon={ExternalLink} variant="secondary" fullWidth onPress={openTickets} />
            </Surface>
          </View>
        </Reveal>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Bilet nasıl alınır?" />
          <View style={{ paddingHorizontal: spacing.screen }}>
            <Surface row={false} padding={16} style={{ gap: 16 }}>
              {TICKET_STEPS.map((step, i) => (
                <Step key={step.title} index={i + 1} title={step.title} text={step.text} />
              ))}
            </Surface>
            <AppText variant="caption" tone="muted" style={{ marginTop: 10 }}>
              Fiyatlar ve satış tarihleri Passo'da ve kulübün duyurularında yer alır.
            </AppText>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: spacing.section }}>
          <Surface onPress={() => router.push("/matchday")} chevron>
            <ColorIconBox name="checkin" size={44} />
            <View style={{ flex: 1 }}>
              <AppText variant="small" weight="medium">
                Maç günü rehberi
              </AppText>
              <AppText variant="caption" tone="muted">
                Kapı saatleri, yol tarifi ve hava durumu.
              </AppText>
            </View>
          </Surface>
        </View>
      </ScrollView>
    </Screen>
  );
}
