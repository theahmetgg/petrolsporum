import React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react-native";
import { useTheme } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface GlassChipProps {
  /** Verilmezse yalnız metin (ör. anket detayındaki bilgi hapları) */
  icon?: LucideIcon;
  label: string;
  /** Verilirse hap seçim açar: sağda aşağı ok, basınca cam koyulaşır */
  onPress?: () => void;
  /** Uyarı hali (ör. kerahat vakti): ikon sarı */
  tone?: "warning";
  /** Dokunulabilir hapta sağdaki aşağı ok (seçim açar); açma-kapama hapında `false` */
  chevron?: boolean;
  /** Açma-kapama hapının durumu (ekran okuyucu için; görünüm cam kalır, durum etiket ve ikonla anlatılır) */
  selected?: boolean;
  accessibilityLabel?: string;
}

/**
 * Gradyan blok üstündeki çerçevesiz cam hap (bakiye kalıbı, design-system.md §4): ince ikon + `small` metin, 36 yükseklik.
 * Halleri: bilgi (dokunulmaz), seçim (`onPress` → aşağı ok), açma-kapama (`onPress` + `chevron={false}` + `selected`),
 * uyarı (`tone="warning"`). Beyaz zeminde kullanılmaz.
 */
export function GlassChip({ icon: Icon, label, onPress, tone, chevron = true, selected, accessibilityLabel }: GlassChipProps) {
  const { colors } = useTheme();
  return (
    <PressableBox
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? (selected !== undefined ? "switch" : "button") : undefined}
      accessibilityState={selected !== undefined ? { checked: selected } : undefined}
      accessibilityLabel={accessibilityLabel ?? (onPress && chevron ? `${label}, değiştir` : label)}
      style={(pressed) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: pressed && onPress ? colors.glass.pressed : colors.glass.DEFAULT,
      })}
    >
      {Icon ? <Icon size={15} color={tone === "warning" ? colors.warning.soft : colors.ink.inverse} strokeWidth={1.5} /> : null}
      <AppText variant="small" tone="inverse">
        {label}
      </AppText>
      {onPress && chevron ? <ChevronDown size={14} color={colors.glass.text} strokeWidth={1.5} /> : null}
    </PressableBox>
  );
}
