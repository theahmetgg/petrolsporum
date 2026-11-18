import React from "react";
import { View } from "react-native";
import { Check } from "lucide-react-native";
import { useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface StepIndicatorProps {
  steps: string[];
  current: number;
  /** Verilirse adımlara dokunarak geçilebilir (ör. düzenleme modunda) */
  onStepPress?: (index: number) => void;
}

/** Çok adımlı formlar için üst ilerleme göstergesi: numaralı daireler + adım adı + çizgi (tasarım sistemi §4.4: tamamlanan/aktif siyah, kalan gri) */
export function StepIndicator({ steps, current, onStepPress }: StepIndicatorProps) {
  const colors = useColors();
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: current + 1 }} style={{ flexDirection: "row", alignItems: "flex-start" }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <PressableBox
              onPress={onStepPress ? () => onStepPress(i) : undefined}
              disabled={!onStepPress}
              accessibilityRole="button"
              accessibilityLabel={`Adım ${i + 1}: ${label}`}
              style={() => ({ alignItems: "center", gap: 6, width: 84 })}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: done || active ? 0 : 1,
                  borderColor: colors.mono.line,
                  backgroundColor: done || active ? colors.mono.solid : colors.mono.fill,
                }}
              >
                {done ? (
                  <Check size={15} color={colors.mono.onSolid} strokeWidth={3} />
                ) : (
                  <AppText variant="caption" weight="medium" color={active ? colors.mono.onSolid : colors.ink.muted}>
                    {i + 1}
                  </AppText>
                )}
              </View>
              <AppText variant="caption" weight="medium" tone={active ? "default" : "muted"} numberOfLines={2} style={{ textAlign: "center" }} maxFontSizeMultiplier={1.1}>
                {label}
              </AppText>
            </PressableBox>
            {i < steps.length - 1 ? (
              <View style={{ flex: 1, height: 2, marginTop: 13, borderRadius: 1, backgroundColor: i < current ? colors.mono.solid : colors.mono.line }} />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}
