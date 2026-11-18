import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Badge, Button, GlassChip, Heading, HeroNumber, IconButton, ListRowSkeleton, Pill, SectionHeader, SignatureBlock, SignatureTopBar, Surface, TextField } from "@/components/ui";
import { useCockpit } from "@/hooks/queries";
import { PUSH_TEMPLATES } from "@/mocks/cockpit";
import { confirm } from "@/stores/confirmStore";
import { showToast } from "@/stores/toastStore";
import { formatCompactTL, formatNumber, formatTL } from "@/utils/format";
import { spacing, useColors } from "@/theme";

const MAX_PUSH = 120;

/** Gelir / sayı kutusu */
function Tile({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <Surface row={false} padding={14} style={{ flex: 1, gap: 2 }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <Heading size="title">{value}</Heading>
      {note ? (
        <AppText variant="caption" tone="success">
          {note}
        </AppText>
      ) : null}
    </Surface>
  );
}

/** Yatay çubuk: ad, değer ve en büyüğe göre oranlı dolgu */
function BarRow({ label, value, max, text }: { label: string; value: number; max: number; text: string }) {
  const colors = useColors();
  return (
    <View style={{ gap: 6 }} accessibilityLabel={`${label}: ${text}`}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText variant="small">{label}</AppText>
        <AppText variant="small" weight="bold" style={{ fontVariant: ["tabular-nums"] }}>
          {text}
        </AppText>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.mono.fillStrong }}>
        <View style={{ width: `${Math.max(4, Math.round((value / max) * 100))}%`, height: 8, borderRadius: 4, backgroundColor: colors.brand.DEFAULT }} />
      </View>
    </View>
  );
}

/**
 * Başkan Kokpiti (prototip ekran 10, DEMO). Yönetimin telefonundan bakacağı özet: aktif taraftar, şehir dağılımı,
 * gelirler, en çok satan ürünler ve tek tuşla bildirim. Tüm rakamlar örnektir; gerçek veri Faz 2'de sunucudan gelir.
 * Gerçek sürümde bu ekranı yalnız yönetici hesabı görür.
 */
export default function CockpitScreen() {
  const colors = useColors();
  const { data } = useCockpit();
  const [pushText, setPushText] = useState<string>(PUSH_TEMPLATES[0].text);
  const [template, setTemplate] = useState<string>(PUSH_TEMPLATES[0].id);

  const sendPush = async () => {
    if (!data || !pushText.trim()) return;
    const ok = await confirm({
      title: "Bildirim gönder",
      message: `"${pushText.trim()}"\n\n${formatNumber(data.active_fans)} taraftara gidecek.`,
      confirmText: "Gönder",
      tone: "primary",
    });
    if (ok) showToast(`Demo: bildirim ${formatNumber(data.active_fans)} taraftara gönderildi sayıldı.`, "success");
  };

  const maxCity = data ? Math.max(...data.city_distribution.map((c) => c.fans)) : 1;
  const maxWeek = data ? Math.max(...data.weekly_active.map((w) => w.value)) : 1;
  const maxProduct = data ? Math.max(...data.top_products.map((p) => p.revenue)) : 1;

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <SignatureBlock>
          <SignatureTopBar title="Başkan Kokpiti" meta="Demo veriler" left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
          <View style={{ alignItems: "center", gap: 12, paddingHorizontal: spacing.screen, marginTop: 16 }}>
            <HeroNumber label="Aktif taraftar" main={data ? formatNumber(data.active_fans) : "—"} tabular />
            {data ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                <GlassChip label={`Bu hafta +${formatNumber(data.new_fans_this_week)}`} />
                <GlassChip label={`${formatNumber(data.plus_members)} Plus üye`} />
              </View>
            ) : null}
          </View>
        </SignatureBlock>

        {!data ? (
          <View style={{ paddingHorizontal: spacing.screen, marginTop: 20 }}>
            <ListRowSkeleton count={5} />
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: spacing.screen, marginTop: 20, gap: spacing.boxGap }}>
              <View style={{ flexDirection: "row", gap: spacing.boxGap }}>
                <Tile label="Mağaza geliri" value={formatCompactTL(data.store_revenue)} note="Aracı komisyonu yok" />
                <Tile label="Anıt duvarı geliri" value={formatCompactTL(data.brick_revenue)} note={`${formatNumber(data.bricks_sold)} tuğla`} />
              </View>
            </View>

            <View style={{ marginTop: spacing.section }}>
              <SectionHeader title="Tek tuşla bildirim" subtitle="SMS yerine anlık, ücretsiz bildirim" />
              <View style={{ paddingHorizontal: spacing.screen, gap: 12 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {PUSH_TEMPLATES.map((t) => (
                    <Pill
                      key={t.id}
                      label={t.title}
                      selected={template === t.id}
                      onPress={() => {
                        setTemplate(t.id);
                        setPushText(t.text);
                      }}
                    />
                  ))}
                </ScrollView>
                <TextField value={pushText} onChangeText={setPushText} multiline maxLength={MAX_PUSH} showCounter placeholder="Bildirim metni" accessibilityLabel="Bildirim metni" />
                <Button title={`${formatNumber(data.active_fans)} taraftara gönder`} icon={Send} size="lg" fullWidth disabled={!pushText.trim()} onPress={sendPush} />
              </View>
            </View>

            <View style={{ marginTop: spacing.section }}>
              <SectionHeader title="Haftalık aktif taraftar" />
              <View style={{ paddingHorizontal: spacing.screen }}>
                <Surface row={false} padding={16}>
                  <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, height: 132 }}>
                    {data.weekly_active.map((week, i) => {
                      const last = i === data.weekly_active.length - 1;
                      return (
                        <View key={week.label} style={{ flex: 1, alignItems: "center", gap: 6 }} accessibilityLabel={`${week.label}: ${formatNumber(week.value)}`}>
                          <AppText variant="badge" tone={last ? "default" : "muted"} style={{ fontVariant: ["tabular-nums"] }}>
                            {(week.value / 1000).toFixed(1).replace(".", ",")}B
                          </AppText>
                          <View style={{ width: "100%", height: Math.round((week.value / maxWeek) * 84), borderRadius: 6, backgroundColor: last ? colors.brand.DEFAULT : colors.mono.fillStrong }} />
                          <AppText variant="badge" tone="muted">
                            {week.label}
                          </AppText>
                        </View>
                      );
                    })}
                  </View>
                </Surface>
              </View>
            </View>

            <View style={{ marginTop: spacing.section }}>
              <SectionHeader title="Şehir dağılımı" subtitle="Sponsor görüşmelerinde en güçlü veri" />
              <View style={{ paddingHorizontal: spacing.screen }}>
                <Surface row={false} padding={16}>
                  <View style={{ gap: 14 }}>
                    {data.city_distribution.map((city) => (
                      <BarRow key={city.city} label={city.city} value={city.fans} max={maxCity} text={formatNumber(city.fans)} />
                    ))}
                  </View>
                </Surface>
              </View>
            </View>

            <View style={{ marginTop: spacing.section }}>
              <SectionHeader title="En çok satan ürünler" />
              <View style={{ paddingHorizontal: spacing.screen }}>
                <Surface row={false} padding={16}>
                  <View style={{ gap: 14 }}>
                    {data.top_products.map((product) => (
                      <BarRow key={product.name} label={`${product.name} · ${product.sold} adet`} value={product.revenue} max={maxProduct} text={formatTL(product.revenue)} />
                    ))}
                  </View>
                </Surface>
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing.screen, marginTop: 20, alignItems: "center", gap: 8 }}>
              <Badge label="Demo veri" />
              <AppText variant="caption" tone="muted" align="center">
                Bu ekrandaki tüm rakamlar örnektir; hedefleri gösterir, gerçekleşen değildir.
              </AppText>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
