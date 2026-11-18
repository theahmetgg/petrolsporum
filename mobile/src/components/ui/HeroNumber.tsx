import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Mask, Rect, Stop, Text as SvgText } from "react-native-svg";
import { AppFonts } from "@/lib/fonts";
import { typography, useTheme } from "@/theme";
import { AppText } from "./AppText";

const [HERO_SIZE, HERO_LAYOUT] = typography.hero;
/** `hero` (56) yazısının kuyruklu harfler dahil tam yüksekliği (Poppins ≈ 1,4 em); kesilmesin diye çizim alanı bu boyda */
const HERO_LINE = 80;
/** Çizim alanında taban çizgisi (Poppins üst payı ≈ 1,05 em; satır içinde ortalı) */
const HERO_BASELINE = 60;
/** Buzlu cam (kullanıcı kararı, 10 Kasım 2026 — seçenek C): tek ton beyaz, yukarıdan aşağı tam opaktan bu orana solar */
const BOTTOM_OPACITY = 0.5;
const DIGITS = "0123456789";

export interface HeroNumberProps {
  /** Ana kısım: "10:10", "13", "51" */
  main: string;
  /** Devam eden kısım (aynı ton, aynı boy): ":54", "°", " otobüs" */
  dim?: string;
  /** Üstteki soluk etiket: "İmsak vaktine", "Şu an" */
  label?: string;
  /** Saat / geri sayım gibi hane sabit genişlikte kalsın (titreme olmasın) */
  tabular?: boolean;
  /** Ekranın başlığı olarak okunsun (giriş / kayıt ekranları) */
  header?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Bakiye kalıbının iri yazısı (design-system.md §3, kullanıcı kararı 9 Kasım 2026): gradyan bloğun ortasında `hero` (56)
 * regular buzlu cam yazı — tek ton beyaz, yukarıdan aşağı belirgin solar (kullanıcı kararı, 10 Kasım 2026). Üstünde
 * `subhead` medium soluk etiket. Sığmazsa tek satırda kalacak kadar küçülür. Ekran başına bir tane.
 *
 * Yazı SVG ile çizilir (beyaz dolgu + dikey saydamlık maskesi); yerleşim 64 yükseklik kaplar, kuyruklu harfler (ş, g, y)
 * kesilmez. Yazıyı SVG kendisi ortalar (`textAnchor="middle"`): değişen yazı (geri sayım) ilk karesinde doğru yerde
 * çizilir. Görünmez RN yazısıyla yapılan ölçüm yalnızca sığmayan yazıyı küçültmek için kullanılır; konumu belirlemez
 * (önceden konum da ölçümden geliyordu ve ölçüm bir kare geç geldiği için geri sayım her saniye sağa sola zıplıyordu).
 *
 * `tabular` (saat / geri sayım): Poppins'te eşit genişlikli rakam (`tnum`) yok; "1" dar, "0" geniş olduğundan yazının
 * genişliği her saniye değişip saat-dakika kısmı da kayıyordu. Bu yüzden her karakter ayrı çizilir: her rakam en geniş
 * rakam kadar sabit bir kutunun ortasında, diğer karakterler (":") kendi genişliğinde. Değişen rakam yerinde değişir,
 * diğerleri kımıldamaz. Karakter genişlikleri bir kez ölçülür; ölçüm gelene kadar yazı tek parça ortalı çizilir.
 */
export function HeroNumber({ main, dim, label, tabular = false, header = false, accessibilityLabel, style }: HeroNumberProps) {
  const { colors } = useTheme();
  const [boxWidth, setBoxWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [charWidths, setCharWidths] = useState<Record<string, number>>({});
  const text = `${main}${dim ?? ""}`;

  // Sabit genişlikli hane düzeni (yalnızca `tabular`): ölçülecek karakterler = rakamlar + yazıdaki diğer karakterler
  const measureChars = tabular ? Array.from(new Set([...DIGITS, ...text])) : [];
  const ready = tabular && measureChars.every((c) => charWidths[c] > 0);
  const digitCell = ready ? Math.max(...[...DIGITS].map((d) => charWidths[d])) : 0;
  const slots = ready ? [...text].map((c) => (DIGITS.includes(c) ? digitCell : charWidths[c])) : [];
  const slotTotal = slots.reduce((a, b) => a + b, 0);
  const naturalWidth = ready ? slotTotal : textWidth;

  // Sığmazsa küçült (yalnızca küçülür, büyümez)
  const scale = boxWidth && naturalWidth > boxWidth ? boxWidth / naturalWidth : 1;
  const drawHeight = HERO_LINE * scale;
  const gap = (HERO_LINE - HERO_LAYOUT) / 2;
  const baseline = HERO_BASELINE * scale;
  // Solma: harflerin üstünden (≈ büyük harf boyu) taban çizgisine
  const fadeTop = baseline - HERO_SIZE * 0.74 * scale;
  const fadeBottom = baseline + 2 * scale;

  return (
    <View
      style={[{ alignItems: "center", alignSelf: "stretch" }, style]}
      accessible
      accessibilityRole={header ? "header" : undefined}
      accessibilityLabel={accessibilityLabel ?? [label, text].filter(Boolean).join(" ")}
    >
      {label ? (
        <AppText variant="subhead" weight="medium" color={colors.glass.text}>
          {label}
        </AppText>
      ) : null}
      <View
        style={{ alignSelf: "stretch", height: drawHeight, marginVertical: -gap * scale }}
        onLayout={(e) => setBoxWidth(e.nativeEvent.layout.width)}
      >
        {/* Ölçüm: yazının doğal genişliği (görünmez; geniş alanda ölçülür ki kutu genişliğiyle kırpılmasın) */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: 0, top: 0, width: 2000, opacity: 0, alignItems: "flex-start" }}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <AppText
            variant="hero"
            numberOfLines={1}
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          >
            {text}
          </AppText>
          {measureChars.map((c) => (
            <AppText
              key={c}
              variant="hero"
              numberOfLines={1}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setCharWidths((prev) => (prev[c] === w ? prev : { ...prev, [c]: w }));
              }}
            >
              {c}
            </AppText>
          ))}
        </View>
        {boxWidth ? (
          <Svg width={boxWidth} height={drawHeight}>
            <Defs>
              <LinearGradient id="heroFade" gradientUnits="userSpaceOnUse" x1="0" y1={fadeTop} x2="0" y2={fadeBottom}>
                <Stop offset="0" stopColor={colors.ink.inverse} stopOpacity={1} />
                <Stop offset="1" stopColor={colors.ink.inverse} stopOpacity={BOTTOM_OPACITY} />
              </LinearGradient>
              <Mask id="heroMask" maskUnits="userSpaceOnUse" x="0" y="0" width={boxWidth} height={drawHeight}>
                <Rect x="0" y="0" width={boxWidth} height={drawHeight} fill="url(#heroFade)" />
              </Mask>
            </Defs>
            {ready ? (
              // Her karakter kendi kutusunun ortasında: rakam kutuları eşit, değişen hane diğerlerini kaydırmaz
              [...text].map((c, i) => {
                const before = slots.slice(0, i).reduce((a, b) => a + b, 0);
                const x = (boxWidth - slotTotal * scale) / 2 + (before + slots[i] / 2) * scale;
                return (
                  <SvgText
                    key={i}
                    x={x}
                    y={baseline}
                    textAnchor="middle"
                    fontFamily={AppFonts.regular}
                    fontSize={HERO_SIZE * scale}
                    fill={colors.ink.inverse}
                    mask="url(#heroMask)"
                  >
                    {c}
                  </SvgText>
                );
              })
            ) : (
              <SvgText
                x={boxWidth / 2}
                y={baseline}
                textAnchor="middle"
                fontFamily={AppFonts.regular}
                fontSize={HERO_SIZE * scale}
                fill={colors.ink.inverse}
                mask="url(#heroMask)"
              >
                {text}
              </SvgText>
            )}
          </Svg>
        ) : null}
      </View>
    </View>
  );
}
