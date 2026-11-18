import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { LogOut, Moon, Sun, SunMoon } from "lucide-react-native";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import QRCode from "react-native-qrcode-svg";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, ColorIconBox, Heading, ListRowSkeleton, SectionHeader, Surface } from "@/components/ui";
import type { ColorIconName } from "@/constants/colorIcons.generated";
import { useTabBarHeight } from "@/components/common/CustomTabBar";
import { TabHeading } from "@/components/common/TabHeading";
import { ActionSheet } from "@/components/common/ActionSheet";
import { useLeaderboard, useTickets } from "@/hooks/queries";
import { withMyPoints } from "@/lib/leaderboard";
import { BRICK_TYPES } from "@/mocks/fans";
import { IMAGES } from "@/mocks/images";
import { LIVE_MATCH_ID } from "@/mocks/live";
import { useBrickStore } from "@/stores/brickStore";
import { confirm } from "@/stores/confirmStore";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSessionStore } from "@/stores/sessionStore";
import { formatDayMonth, formatLongDate, formatNumber } from "@/utils/format";
import { gradients, radius, spacing, useTheme, type ThemePreference } from "@/theme";

const THEME_LABELS: Record<ThemePreference, string> = { system: "Sistem", light: "Açık", dark: "Koyu" };

const THEME_OPTIONS: { key: ThemePreference; icon: typeof Sun; label: string; description: string }[] = [
  { key: "dark", icon: Moon, label: "Koyu", description: "Koyu zemin (varsayılan)" },
  { key: "light", icon: Sun, label: "Açık", description: "Beyaz zemin" },
  { key: "system", icon: SunMoon, label: "Sistem", description: "Telefonun ayarını izler" },
];

/** Özet kutusu: iri rakam + altında ad */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Surface row={false} padding={12} style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Heading size="title">{value}</Heading>
      <AppText variant="caption" tone="muted" numberOfLines={1}>
        {label}
      </AppText>
    </Surface>
  );
}

/** Menü satırı: gradyanlı ikon + başlık + açıklama + ok */
function MenuRow({ icon, title, text, onPress }: { icon: ColorIconName; title: string; text: string; onPress: () => void }) {
  return (
    <Surface onPress={onPress} chevron>
      <ColorIconBox name={icon} size={44} />
      <View style={{ flex: 1 }}>
        <AppText variant="small" weight="medium">
          {title}
        </AppText>
        <AppText variant="caption" tone="muted">
          {text}
        </AppText>
      </View>
    </Surface>
  );
}

/**
 * Profil sekmesi (prototip ekran 9): dijital taraftar kartı (QR), puan ve sıra özeti, hatıra bileti koleksiyonu,
 * anıt duvarı tuğlaları ve Başkan Kokpiti (demo) girişi. Kart ücretsiz üyeliğin ilk basamağıdır (Ar-Ge belgesi 9.4).
 */
export default function ProfileTab() {
  const { colors, preference, setPreference } = useTheme();
  const themeSheet = useRef<BottomSheetModal>(null);
  const tabBarHeight = useTabBarHeight();
  const fan = useSessionStore((s) => s.fan);
  const signOut = useSessionStore((s) => s.signOut);
  const myBricks = useBrickStore((s) => s.myBricks);
  const settled = usePredictionStore((s) => s.byMatch[LIVE_MATCH_ID]?.points);
  const { data: tickets } = useTickets();
  const { data: season } = useLeaderboard("season");
  const myRank = season ? withMyPoints(season, settled ?? 0, false).find((r) => r.is_me)?.rank : undefined;

  if (!fan) return null;

  const logout = async () => {
    const ok = await confirm({ title: "Çıkış yap", message: "Tahminlerin ve tuğlaların bu telefonda kalır.", confirmText: "Çıkış yap", tone: "danger" });
    if (!ok) return;
    await signOut();
    router.replace("/(auth)/welcome");
  };

  return (
    <Screen withBottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: tabBarHeight + spacing.section }}>
        <View style={{ paddingHorizontal: spacing.screen, gap: 14 }}>
          <TabHeading title="Profil" />

          {/* Dijital taraftar kartı */}
          <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ borderRadius: radius.hero, padding: 18, gap: 18 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Image source={IMAGES.logoWhite} style={{ width: 120, height: 36 }} contentFit="contain" transition={0} />
              <AppText variant="badge" weight="bold" color={colors.ink.inverse} style={{ letterSpacing: 1 }}>
                TARAFTAR KARTI
              </AppText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 14 }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Heading size="title" color={colors.ink.inverse} numberOfLines={2}>
                  {fan.full_name}
                </Heading>
                <AppText variant="small" color={colors.glass.text} style={{ fontVariant: ["tabular-nums"], letterSpacing: 1 }}>
                  {fan.fan_card_no}
                </AppText>
                <AppText variant="caption" color={colors.glass.dim} style={{ marginTop: 6 }}>
                  {fan.is_guest ? "Misafir · üye olunca kartın kalıcı olur" : `Üyelik: ${formatLongDate(fan.member_since)}`}
                </AppText>
              </View>
              <View style={{ padding: 8, borderRadius: radius.thumb, backgroundColor: colors.surface.logo }} accessibilityLabel="Taraftar kartı karekodu">
                <QRCode value={`petrolspor://fan/${fan.fan_card_no}`} size={92} color={colors.scrim.DEFAULT} backgroundColor={colors.surface.logo} />
              </View>
            </View>
          </LinearGradient>

          <View style={{ flexDirection: "row", gap: spacing.boxGap }}>
            <Stat value={formatNumber(fan.petrol_puan)} label="PetrolPuan" />
            <Stat value={myRank ? `${myRank}.` : "—"} label="Sezon sırası" />
            <Stat value={tickets ? `${tickets.length}` : "—"} label="Hatıra bileti" />
          </View>

          {fan.is_guest ? <Button title="Üye ol, kartını kalıcı yap" variant="secondary" fullWidth onPress={logout} /> : null}
        </View>

        {/* Hatıra biletleri: yana kaydırılan koleksiyon */}
        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Hatıra Biletlerim" subtitle="Bu sezon gittiğin iç saha maçları" />
          {tickets ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 10 }}>
              {tickets.map((ticket) => (
                <View key={ticket.id} style={{ width: 208, borderRadius: radius.box, overflow: "hidden", backgroundColor: colors.mono.fill }} accessibilityLabel={`${ticket.title}, ${ticket.score}`}>
                  <LinearGradient colors={gradients.signature} locations={[0, 0.42, 0.82, 1]} style={{ paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Heading size="display" color={colors.ink.inverse}>
                      {ticket.score}
                    </Heading>
                    <Image source={IMAGES.crest} style={{ width: 40, height: 40 }} contentFit="contain" transition={0} />
                  </LinearGradient>
                  <View style={{ padding: 14, gap: 2 }}>
                    <AppText variant="small" weight="medium" numberOfLines={2}>
                      {ticket.title}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {formatDayMonth(ticket.date)} · {ticket.seat}
                    </AppText>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={{ paddingHorizontal: spacing.screen }}>
              <ListRowSkeleton count={1} />
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Anıt Duvarı" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            {myBricks.length ? (
              myBricks.map((brick) => (
                <Surface key={brick.id} onPress={() => router.push(`/monument/certificate/${brick.id}`)} chevron>
                  <View style={{ width: 44, height: 22, borderRadius: 4, backgroundColor: colors.brick[brick.brick_type] }} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="small" weight="medium">
                      {BRICK_TYPES[brick.brick_type].label}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {brick.owner_name} · {brick.certificate_no}
                    </AppText>
                  </View>
                </Surface>
              ))
            ) : (
              <MenuRow icon="monument" title="Henüz tuğlan yok" text="Adını duvara yazdır, sertifikanı al." onPress={() => router.push("/monument")} />
            )}
          </View>
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Daha fazla" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            <MenuRow icon="leaderboard" title="Sıralamam" text="Haftalık, aylık ve sezonluk liderlik." onPress={() => router.push("/play/leaderboard")} />
            <MenuRow icon="fanwall" title="Taraftar Duvarı" text="Taraftarların paylaşımları." onPress={() => router.push("/fan-wall")} />
            <MenuRow icon="cockpit" title="Başkan Kokpiti" text="Yönetim ekranı (demo)." onPress={() => router.push("/cockpit")} />
            <MenuRow icon="star" title="Görünüm" text={`${THEME_LABELS[preference]} tema seçili.`} onPress={() => themeSheet.current?.present()} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: spacing.section }}>
          <Button title="Çıkış yap" icon={LogOut} variant="ghost" fullWidth onPress={logout} />
        </View>
      </ScrollView>

      {/* Görünüm seçimi: seçili satırda onay işareti durur; seçim telefonda saklanır */}
      <ActionSheet
        ref={themeSheet}
        title="Görünüm"
        items={THEME_OPTIONS.map((option) => ({
          ...option,
          selected: preference === option.key,
          onPress: () => setPreference(option.key).catch(console.warn),
        }))}
      />
    </Screen>
  );
}
