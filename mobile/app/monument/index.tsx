import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { AppText, Button, FloatingActionBar, FLOATING_BAR_HEIGHT, GlassChip, HeroNumber, IconButton, ListRowSkeleton, SectionHeader, SignatureBlock, SignatureTopBar, Surface, useFloatingBarBottom } from "@/components/ui";
import { BrickWall } from "@/components/monument/BrickWall";
import { useBricks } from "@/hooks/queries";
import { BRICK_TYPES, WALL_COLS, WALL_ROWS } from "@/mocks/fans";
import { useBrickStore } from "@/stores/brickStore";
import type { BrickType, MonumentBrick } from "@/types";
import { formatNumber, formatTL } from "@/utils/format";
import { spacing, useColors } from "@/theme";

const TYPE_ORDER: BrickType[] = ["red", "white", "gold", "platinum"];

/**
 * Anıt Duvarı (prototip ekran 7). Taraftarların dijital tuğlalarından örülen duvar. Dolu tuğlaya dokununca sahibi
 * ve mesajı görünür; "Tuğlamı bul" kullanıcının kendi tuğlasını seçer. Duvardaki diğer tuğlalar örnektir (demo).
 */
export default function MonumentWallScreen() {
  const colors = useColors();
  const barBottom = useFloatingBarBottom();
  const params = useLocalSearchParams<{ focus?: string }>();
  const { data: sold } = useBricks();
  const myBricks = useBrickStore((s) => s.myBricks);
  const [selected, setSelected] = useState<MonumentBrick | null>(null);

  const bricks = useMemo(() => [...(sold ?? []), ...myBricks], [sold, myBricks]);
  const total = WALL_COLS * WALL_ROWS;
  const percent = Math.round((bricks.length / total) * 100);

  // Sertifikadan "Duvarda gör" ile gelindiyse o tuğla seçili açılır
  useEffect(() => {
    if (!params.focus) return;
    const brick = myBricks.find((b) => b.id === params.focus);
    if (brick) setSelected(brick);
  }, [params.focus, myBricks]);

  return (
    <Screen withTopInset={false} statusBarStyle="light">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: barBottom + FLOATING_BAR_HEIGHT + 32 }}>
        <SignatureBlock>
          <SignatureTopBar title="Anıt Duvarı" left={<IconButton icon={ChevronLeft} label="Geri" variant="frost" size={40} onPress={() => router.back()} />} />
          <View style={{ alignItems: "center", gap: 12, paddingHorizontal: spacing.screen, marginTop: 16 }}>
            <HeroNumber label="Duvardaki tuğla" main={formatNumber(bricks.length)} dim={` / ${total}`} tabular />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              <GlassChip label={`Duvarın %${percent}'i örüldü`} />
              {myBricks.length ? <GlassChip icon={Search} label="Tuğlamı bul" onPress={() => setSelected(myBricks[myBricks.length - 1])} /> : null}
            </View>
          </View>
        </SignatureBlock>

        <View style={{ paddingHorizontal: spacing.screen, marginTop: 20, gap: spacing.boxGap }}>
          {sold ? <BrickWall bricks={bricks} selectedId={selected?.id} onSelect={(b) => setSelected((cur) => (cur?.id === b.id ? null : b))} /> : <ListRowSkeleton count={4} />}

          {selected ? (
            <Surface padding={14}>
              <View style={{ width: 44, height: 22, borderRadius: 4, backgroundColor: colors.brick[selected.brick_type] }} />
              <View style={{ flex: 1 }}>
                <AppText variant="small" weight="medium">
                  {selected.owner_name}
                  {selected.is_mine ? " (senin tuğlan)" : ""}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {selected.message ? `"${selected.message}"` : BRICK_TYPES[selected.brick_type].label}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {BRICK_TYPES[selected.brick_type].label} · {selected.certificate_no}
                </AppText>
              </View>
              {selected.is_mine ? <Button title="Sertifika" size="sm" variant="secondary" onPress={() => router.push(`/monument/certificate/${selected.id}`)} /> : null}
            </Surface>
          ) : (
            <AppText variant="caption" tone="muted" align="center">
              Bir tuğlaya dokun: sahibini ve mesajını gör.
            </AppText>
          )}
        </View>

        <View style={{ marginTop: spacing.section }}>
          <SectionHeader title="Tuğla türleri" />
          <View style={{ paddingHorizontal: spacing.screen, gap: spacing.boxGap }}>
            {TYPE_ORDER.map((type) => (
              <Surface key={type}>
                <View style={{ width: 44, height: 22, borderRadius: 4, backgroundColor: colors.brick[type] }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="small" weight="medium">
                    {BRICK_TYPES[type].label}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {BRICK_TYPES[type].note}
                  </AppText>
                </View>
                <AppText variant="small" weight="bold">
                  {formatTL(BRICK_TYPES[type].price)}
                </AppText>
              </Surface>
            ))}
          </View>
        </View>

        <AppText variant="caption" tone="muted" align="center" style={{ marginTop: 16, paddingHorizontal: spacing.screen }}>
          Demo sürüm: duvardaki diğer tuğlalar örnektir, ödeme alınmaz.
        </AppText>
      </ScrollView>

      <FloatingActionBar label="Tuğla al" onPress={() => router.push("/monument/buy")} />
    </Screen>
  );
}
