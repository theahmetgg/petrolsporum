import React from "react";
import { Switch, SwitchProps } from "react-native";
import { useColors } from "@/theme";

export interface ToggleProps extends Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor"> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * Açma/kapama anahtarı (tasarım sistemi §4.4).
 * Sistem anahtarı kullanılır (iki platformda yerel his, ek maliyet yok); renkler token'dan:
 * açıkken iz `mono.solid`, kapalıyken `mono.line`. Kırmızı kullanılmaz.
 */
export function Toggle({ value, onValueChange, ...rest }: ToggleProps) {
  const colors = useColors();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.mono.line, true: colors.mono.solid }}
      thumbColor={value ? colors.mono.onSolid : colors.surface.DEFAULT}
      ios_backgroundColor={colors.mono.line}
      {...rest}
    />
  );
}
