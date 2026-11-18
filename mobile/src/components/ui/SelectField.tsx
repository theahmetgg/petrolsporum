import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { radius, useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface SelectFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string | null;
  disabled?: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  /** Değerin solunda logo / avatar (ör. seçili firma) */
  leading?: React.ReactNode;
  /** Değerin altında gri tek satır (ör. firmanın kategorisi) */
  description?: string;
  /** Oksuz ve basılmaz; değer normal görünür (tek seçenek ya da düzenlemede kilitli alan) */
  readOnly?: boolean;
}

/** Formlar için tek satırlı, dokunulduğunda alt çekmece (BottomSheet) açan standart seçim alanı. */
export function SelectField({
  label,
  value,
  placeholder = "Seçiniz",
  helper,
  error,
  disabled = false,
  onPress,
  containerStyle,
  leading,
  description,
  readOnly = false,
}: SelectFieldProps) {
  const colors = useColors();
  const borderColor = error ? colors.danger.DEFAULT : "transparent";
  const pressable = !disabled && !readOnly && !!onPress;
  const rich = !!leading || !!description;

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="small" weight="medium" style={{ marginBottom: 8 }}>
          {label}
        </AppText>
      ) : null}

      <PressableBox
        onPress={pressable ? onPress : undefined}
        disabled={!pressable}
        accessibilityRole={readOnly ? "text" : "button"}
        accessibilityLabel={`${label || placeholder}: ${value || "seçilmedi"}`}
        accessibilityState={{ disabled }}
        style={(pressed) => ({
          minHeight: rich ? 60 : 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: leading ? 12 : 14,
          borderRadius: radius.control,
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled || (pressed && pressable) ? colors.mono.line : colors.mono.fillStrong,
        })}
      >
        {leading}
        <View style={{ flex: 1 }}>
          {description && value ? (
            <>
              <AppText variant="small" weight="medium" numberOfLines={1}>
                {value}
              </AppText>
              <AppText variant="caption" tone="muted" numberOfLines={1}>
                {description}
              </AppText>
            </>
          ) : (
            <AppText variant="body" tone={value ? "default" : "muted"} numberOfLines={1}>
              {value || placeholder}
            </AppText>
          )}
        </View>

        {readOnly ? null : <ChevronDown size={18} color={disabled ? colors.ink.disabled : colors.ink.muted} />}
      </PressableBox>

      {error ? (
        <AppText variant="caption" tone="danger" style={{ marginTop: 4 }}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" tone="muted" style={{ marginTop: 4 }}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}
