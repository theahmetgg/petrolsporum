import React, { memo, useMemo } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import type { MonumentBrick } from "@/types";
import { WALL_COLS, WALL_ROWS } from "@/mocks/fans";
import { radius, spacing, useColors } from "@/theme";

const GAP = 3;
/** Duvar panelinin iç boşluğu */
const PANEL_PAD = 8;
/** Tuğlanın boyu / eni */
const BRICK_RATIO = 0.5;

export interface BrickWallProps {
  /** Duvardaki tüm dolu tuğlalar (örnek satılmışlar + kullanıcının aldıkları) */
  bricks: MonumentBrick[];
  selectedId?: string | null;
  onSelect?: (brick: MonumentBrick) => void;
  /** Verilmezse ekran genişliği eksi iki yan ekran boşluğu */
  width?: number;
}

/**
 * Anıt duvarı: şaşırtmalı örgülü tuğla duvar (tek sıralar yarım tuğla kaydırılır). Dolu tuğlalar türünün
 * rengindedir (kırmızı, beyaz, altın, platin); boş yerler koyu. Duvar temadan bağımsız koyu bir panelde durur. Kullanıcının kendi tuğlası beyaz çerçevelidir.
 * Dolu tuğlaya dokununca sahibi ve mesajı gösterilir (`onSelect`).
 */
export const BrickWall = memo(function BrickWall({ bricks, selectedId, onSelect, width: widthProp }: BrickWallProps) {
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.round(widthProp ?? windowWidth - spacing.screen * 2);
  const inner = width - PANEL_PAD * 2;
  const brickW = (inner - GAP * (WALL_COLS - 1)) / WALL_COLS;
  const brickH = Math.round(brickW * BRICK_RATIO);

  const byCell = useMemo(() => new Map(bricks.map((b) => [`${b.row}-${b.col}`, b])), [bricks]);
  const rows = useMemo(() => Array.from({ length: WALL_ROWS }, (_, r) => r), []);
  const cols = useMemo(() => Array.from({ length: WALL_COLS }, (_, c) => c), []);

  return (
    // Duvar iki temada da koyu panel üstündedir: beyaz ve boş tuğlalar açık temada da seçilir
    <View style={{ width, padding: PANEL_PAD, borderRadius: radius.thumb, backgroundColor: colors.media.surface }} accessibilityLabel={`Anıt duvarı, ${bricks.length} tuğla dolu`}>
      <View style={{ width: inner, borderRadius: 4, overflow: "hidden", gap: GAP }}>
      {rows.map((row) => (
        // Tek sıralar yarım tuğla sola kayar; taşan kısım dış kutunun kenarında kesilir
        <View key={row} style={{ flexDirection: "row", gap: GAP, marginLeft: row % 2 ? -(brickW + GAP) / 2 : 0 }}>
          {(row % 2 ? [...cols, WALL_COLS] : cols).map((col) => {
            // Kaydırılan sıradaki fazladan tuğla her zaman boştur (kenar dolgusu)
            const brick = col < WALL_COLS ? byCell.get(`${row}-${col}`) : undefined;
            const selected = !!brick && brick.id === selectedId;
            const style = {
              width: brickW,
              height: brickH,
              borderRadius: 3,
              backgroundColor: brick ? colors.brick[brick.brick_type] : colors.brick.empty,
              borderWidth: brick?.is_mine || selected ? 2 : 0,
              borderColor: selected ? colors.ink.inverse : colors.brick.mine,
              opacity: brick && selectedId && !selected ? 0.55 : 1,
            } as const;
            return brick && onSelect ? (
              <Pressable key={col} onPress={() => onSelect(brick)} hitSlop={2} accessibilityRole="button" accessibilityLabel={`${brick.owner_name} tuğlası`} style={style} />
            ) : (
              <View key={col} style={style} />
            );
          })}
        </View>
      ))}
      </View>
    </View>
  );
});
