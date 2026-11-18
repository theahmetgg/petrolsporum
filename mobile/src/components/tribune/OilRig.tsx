import React, { memo } from "react";
import Svg, { ClipPath, Defs, G, Line, LinearGradient, Path, Polygon, Rect, Stop } from "react-native-svg";
import { gradients, useColors } from "@/theme";

/** Çizim alanı (viewBox) */
const VB_W = 200;
const VB_H = 300;
/** Kulenin gövdesi: altta geniş, üstte dar kafes kule */
const TOWER = "62,280 138,280 112,56 88,56";
const TOWER_TOP = 56;
const TOWER_BOTTOM = 280;
/** Alev bu doluluğun üstünde yanar */
export const FLAME_THRESHOLD = 0.85;

export interface OilRigProps {
  /** Doluluk: 0 (boş) - 1 (zirve) */
  level: number;
  width: number;
}

/**
 * Petrol kulesi (Tribün Modu ses ölçeri). Ses yükseldikçe kulenin içi alttan yukarı kırmızı petrolle dolar;
 * zirveye yaklaşınca tepede alev yanar. Kule Batman'ın petrol kimliğinin simgesidir (kulübün armasındaki pompa).
 */
export const OilRig = memo(function OilRig({ level, width }: OilRigProps) {
  const colors = useColors();
  const clamped = Math.max(0, Math.min(1, level));
  const fillTop = TOWER_BOTTOM - (TOWER_BOTTOM - TOWER_TOP) * clamped;
  const flame = clamped >= FLAME_THRESHOLD;
  const stroke = colors.ink.DEFAULT;
  const [oilTop, oilBottom] = gradients.icon;
  // Kafes çaprazları: kulenin iki kenarı arasında zikzak
  const rungs = [280, 236, 192, 148, 104, 56];
  const edge = (y: number) => {
    const t = (TOWER_BOTTOM - y) / (TOWER_BOTTOM - TOWER_TOP);
    return { left: 62 + (88 - 62) * t, right: 138 - (138 - 112) * t };
  };

  return (
    <Svg width={width} height={(width * VB_H) / VB_W} viewBox={`0 0 ${VB_W} ${VB_H}`} accessibilityLabel={`Petrol kulesi, yüzde ${Math.round(clamped * 100)} dolu`}>
      <Defs>
        <ClipPath id="tower">
          <Polygon points={TOWER} />
        </ClipPath>
        <LinearGradient id="oil" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={oilTop} />
          <Stop offset="1" stopColor={oilBottom} />
        </LinearGradient>
      </Defs>

      {/* Zemin */}
      <Rect x={28} y={280} width={144} height={8} rx={4} fill={colors.mono.fillStrong} />

      {/* Kule içi: boş zemin + petrol */}
      <Polygon points={TOWER} fill={colors.mono.fill} />
      <G clipPath="url(#tower)">
        <Rect x={0} y={fillTop} width={VB_W} height={TOWER_BOTTOM - fillTop} fill="url(#oil)" />
      </G>

      {/* Kafes: dış çizgi, yatay kuşaklar, çaprazlar */}
      <Polygon points={TOWER} fill="none" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      {rungs.map((y, i) => {
        const a = edge(y);
        const next = rungs[i + 1];
        const b = next != null ? edge(next) : null;
        return (
          <G key={y}>
            <Line x1={a.left} y1={y} x2={a.right} y2={y} stroke={stroke} strokeWidth={2} />
            {b ? <Line x1={a.left} y1={y} x2={b.right} y2={next} stroke={stroke} strokeWidth={1.5} opacity={0.7} /> : null}
            {b ? <Line x1={a.right} y1={y} x2={b.left} y2={next} stroke={stroke} strokeWidth={1.5} opacity={0.7} /> : null}
          </G>
        );
      })}

      {/* Tepe: taç bloğu */}
      <Rect x={84} y={44} width={32} height={12} rx={3} fill={stroke} />
      <Rect x={96} y={30} width={8} height={14} fill={stroke} />

      {/* Alev: zirveye yaklaşınca */}
      {flame ? (
        <G>
          <Path d="M100 30 C 86 18 92 6 100 -6 C 108 6 114 18 100 30 Z" fill={colors.brand.DEFAULT} transform="translate(0 4)" />
          <Path d="M100 28 C 94 22 96 15 100 9 C 104 15 106 22 100 28 Z" fill={colors.ink.inverse} transform="translate(0 4)" />
        </G>
      ) : null}
    </Svg>
  );
});
