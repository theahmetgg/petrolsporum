import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { radius, type Tone, useColors, useTheme } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconTone?: Tone;
  /** Sağ tarafta chevron yerine gösterilecek içerik (rozet, switch, değer) */
  right?: React.ReactNode;
  onPress?: () => void;
  /** Alt ayraç çizgisi */
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** İkonlu liste satırı (ayarlar, menü, firma aksiyonları). Tasarım sistemi §7-D: ikon gri dairede tek renk; yalnız anlam tonu (danger vb.) renkli. */
export function ListItem({
  title,
  subtitle,
  icon: Icon,
  iconTone = "brand",
  right,
  onPress,
  divider = false,
  style,
}: ListItemProps) {
  const colors = useColors();
  const tone = useTheme().toneColors[iconTone];
  // Marka/nötr ton gri daire + koyu ikon olur; kırmızı ikon kutusu kullanılmaz
  const neutralIcon = iconTone === "brand" || iconTone === "neutral";
  return (
    <View
      style={[
        // Ayraç, basılı vurgudan bağımsız: içerikle hizalı ince çizgi
        { borderBottomWidth: divider ? 1 : 0, borderBottomColor: colors.mono.line, paddingVertical: 4 },
        style,
      ]}
    >
    <PressableBox
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={(pressed) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 10,
        // Basılı durum: kenarlara taşmayan, yuvarlak ve yumuşak vurgu
        marginHorizontal: -8,
        paddingHorizontal: 8,
        borderRadius: radius.control,
        backgroundColor: pressed ? colors.mono.fill : "transparent",
      })}
    >
      {Icon ? (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: neutralIcon ? colors.mono.fillStrong : tone.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={neutralIcon ? colors.ink.DEFAULT : tone.fg} strokeWidth={1.5} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <AppText variant="body" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={20} color={colors.ink.muted} /> : null)}
    </PressableBox>
    </View>
  );
}
