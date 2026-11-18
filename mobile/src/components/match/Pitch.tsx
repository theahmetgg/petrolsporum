import React, { memo, useCallback, useMemo } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import type { Player } from "@/types";
import type { FormationSlot } from "@/constants/formations";
import { HeadingFonts, AppFonts } from "@/lib/fonts";
import { radius, spacing, useColors } from "@/theme";

/** Sahanın en / boy oranı (dikey saha) */
const PITCH_RATIO = 0.74;
/** Oyuncu dairesinin çapı ve altındaki ad alanıyla birlikte kapladığı kutu */
const DOT = 42;
const TOKEN_W = 76;
const TOKEN_H = DOT + 22;
/** Sürüklenen oyuncu bir yuvaya en çok bu kadar (dp) uzaktaysa oraya bırakılmış sayılır */
const DROP_RADIUS = 56;

export interface PitchProps {
  slots: FormationSlot[];
  /** Yuva sırasına göre oyuncular; boş yuva `null` */
  players: (Player | null)[];
  captainId?: string | null;
  /** Yuvaya dokunma (oyuncu seçme / değiştirme) */
  onSlotPress?: (slotIndex: number) => void;
  /** Verilirse oyuncular sürüklenebilir: bırakıldığı yuvayla yer değiştirir */
  onSwap?: (from: number, to: number) => void;
  /** Seçili yuva (ör. oyuncu seçme penceresi açıkken) */
  selectedSlot?: number | null;
  /** Sahanın genişliği (dp). Verilmezse ekran genişliği eksi iki yan ekran boşluğu */
  width?: number;
}

/** Saha çizgileri: dış çizgi, orta çizgi ve yuvarlak, iki ceza sahası, iki kale sahası */
const PitchLines = memo(function PitchLines({ width, height }: { width: number; height: number }) {
  const colors = useColors();
  const m = 10; // kenar boşluğu
  const w = width - m * 2;
  const h = height - m * 2;
  const stroke = colors.pitch.line;
  const boxW = w * 0.56;
  const boxH = h * 0.15;
  const goalW = w * 0.26;
  const goalH = h * 0.055;
  const stripes = 8;
  return (
    <Svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
      {Array.from({ length: stripes }, (_, i) =>
        i % 2 === 0 ? <Rect key={i} x={0} y={(height / stripes) * i} width={width} height={height / stripes} fill={colors.pitch.stripe} /> : null
      )}
      <Rect x={m} y={m} width={w} height={h} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Line x1={m} y1={height / 2} x2={width - m} y2={height / 2} stroke={stroke} strokeWidth={1.5} />
      <Circle cx={width / 2} cy={height / 2} r={w * 0.14} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Circle cx={width / 2} cy={height / 2} r={2.5} fill={stroke} />
      {/* Üst (rakip) ceza ve kale sahası */}
      <Rect x={(width - boxW) / 2} y={m} width={boxW} height={boxH} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Rect x={(width - goalW) / 2} y={m} width={goalW} height={goalH} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Path d={`M ${width / 2 - w * 0.1} ${m + boxH} A ${w * 0.1} ${w * 0.1} 0 0 0 ${width / 2 + w * 0.1} ${m + boxH}`} fill="none" stroke={stroke} strokeWidth={1.5} />
      {/* Alt (kendi) ceza ve kale sahası */}
      <Rect x={(width - boxW) / 2} y={height - m - boxH} width={boxW} height={boxH} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Rect x={(width - goalW) / 2} y={height - m - goalH} width={goalW} height={goalH} fill="none" stroke={stroke} strokeWidth={1.5} />
      <Path d={`M ${width / 2 - w * 0.1} ${height - m - boxH} A ${w * 0.1} ${w * 0.1} 0 0 1 ${width / 2 + w * 0.1} ${height - m - boxH}`} fill="none" stroke={stroke} strokeWidth={1.5} />
    </Svg>
  );
});

interface TokenProps {
  index: number;
  player: Player | null;
  isCaptain: boolean;
  selected: boolean;
  /** Yuvanın merkezi (dp) */
  cx: number;
  cy: number;
  onPress?: (index: number) => void;
  onDrop?: (index: number, x: number, y: number) => void;
}

/**
 * Sahadaki oyuncu: beyaz dairede forma numarası, altında kısa ad; kaptanda "K" rozeti. Boş yuva "+" gösterir.
 * Sürükleme UI iş parçacığında çalışır; bırakılınca konum JS'e bir kez bildirilir ve oyuncu yerine döner
 * (yer değişimi durumdan gelir).
 */
const PlayerToken = memo(function PlayerToken({ index, player, isCaptain, selected, cx, cy, onPress, onDrop }: TokenProps) {
  const colors = useColors();
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const dragging = useSharedValue(0);

  const tap = Gesture.Tap()
    .enabled(!!onPress)
    .onEnd(() => {
      if (onPress) runOnJS(onPress)(index);
    });

  const pan = Gesture.Pan()
    .enabled(!!onDrop && !!player)
    .minDistance(6)
    .onStart(() => {
      dragging.value = 1;
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (onDrop) runOnJS(onDrop)(index, cx + e.translationX, cy + e.translationY);
      tx.value = withTiming(0, { duration: 140 });
      ty.value = withTiming(0, { duration: 140 });
      dragging.value = 0;
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: dragging.value ? 1.12 : 1 }],
    zIndex: dragging.value ? 10 : 1,
  }));

  return (
    <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
      <Animated.View
        accessible
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={player ? `${player.shirt_number} ${player.name}${isCaptain ? ", kaptan" : ""}` : "Boş yer, oyuncu seç"}
        style={[{ position: "absolute", left: cx - TOKEN_W / 2, top: cy - DOT / 2, width: TOKEN_W, height: TOKEN_H, alignItems: "center" }, style]}
      >
        <View
          style={{
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: player ? colors.ink.inverse : colors.glass.DEFAULT,
            borderWidth: selected ? 3 : player ? 0 : 1.5,
            borderColor: selected ? colors.brand.DEFAULT : colors.glass.border,
          }}
        >
          <Text allowFontScaling={false} style={{ fontFamily: HeadingFonts.bold, fontSize: 20, color: player ? colors.brand.fill : colors.ink.inverse }}>
            {player ? player.shirt_number : "+"}
          </Text>
          {isCaptain ? (
            <View style={{ position: "absolute", top: -4, right: -6, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand.fill }}>
              <Text allowFontScaling={false} style={{ fontFamily: AppFonts.bold, fontSize: 10, color: colors.ink.inverse }}>
                K
              </Text>
            </View>
          ) : null}
        </View>
        {player ? (
          <Text allowFontScaling={false} numberOfLines={1} style={{ marginTop: 3, fontFamily: AppFonts.medium, fontSize: 11, color: colors.ink.inverse, textAlign: "center" }}>
            {player.name}
          </Text>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
});

/**
 * Saha dizilişi. Tek bileşen (Ar-Ge belgesi 8.3): maç detayındaki "Kadro" sekmesinde salt gösterim,
 * "İlk 11'ini Kur"da dokunma (`onSlotPress`) ve sürükle-bırak (`onSwap`) ile kullanılır.
 * Saha üstte rakip kale, altta kendi kalemiz olacak biçimde dikey çizilir.
 */
export function Pitch({ slots, players, captainId, onSlotPress, onSwap, selectedSlot, width: widthProp }: PitchProps) {
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  // Boyut ekran genişliğinden hesaplanır (yerleşim ölçümü beklenmez): saha ilk karede oyuncularıyla çizilir
  const size = useMemo(() => {
    const width = Math.round(widthProp ?? windowWidth - spacing.screen * 2);
    return { width, height: Math.round(width / PITCH_RATIO) };
  }, [widthProp, windowWidth]);

  // Bırakılan noktaya en yakın yuvayı bulur; yeterince yakınsa iki yuva yer değiştirir
  const handleDrop = useCallback(
    (from: number, x: number, y: number) => {
      if (!onSwap) return;
      let best = -1;
      let bestDist = DROP_RADIUS;
      slots.forEach((slot, i) => {
        if (i === from) return;
        const dist = Math.hypot((slot.x / 100) * size.width - x, (slot.y / 100) * size.height - y);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      if (best >= 0) onSwap(from, best);
    },
    [onSwap, size.width, size.height, slots]
  );

  return (
    <View style={{ width: size.width, height: size.height, alignSelf: "center", borderRadius: radius.box, overflow: "hidden", backgroundColor: colors.pitch.DEFAULT }}>
      <PitchLines width={size.width} height={size.height} />
      {slots.map((slot, i) => (
        <PlayerToken
          key={i}
          index={i}
          player={players[i] ?? null}
          isCaptain={!!players[i] && players[i]!.id === captainId}
          selected={selectedSlot === i}
          cx={(slot.x / 100) * size.width}
          cy={(slot.y / 100) * size.height}
          onPress={onSlotPress}
          onDrop={onSwap ? handleDrop : undefined}
        />
      ))}
    </View>
  );
}
