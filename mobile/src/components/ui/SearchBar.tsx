import React, { useState } from "react";
import { TextInput, TextInputProps, View, StyleProp, ViewStyle } from "react-native";
import { Search, X } from "lucide-react-native";
import { AppFonts } from "@/lib/fonts";
import { typography, useColors } from "@/theme";
import { PressableBox } from "./PressableBox";

export interface SearchBarProps extends Omit<TextInputProps, "style" | "onChangeText" | "value"> {
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Hap biçimli arama kutusu: arama ikonu + temizle düğmesi. */
export function SearchBar({ value, onChangeText, placeholder = "Ara...", style, onFocus, onBlur, ...rest }: SearchBarProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        {
          height: 46,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 14,
          backgroundColor: colors.mono.fillStrong,
          borderWidth: 1,
          borderColor: focused ? colors.mono.solid : "transparent",
        },
        style,
      ]}
    >
      <Search size={18} color={focused ? colors.ink.DEFAULT : colors.ink.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink.muted}
        returnKeyType="search"
        autoCorrect={false}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{ flex: 1, fontFamily: AppFonts.regular, fontSize: typography.body[0], color: colors.ink.DEFAULT, paddingVertical: 0 }}
        {...rest}
      />
      {value.length > 0 ? (
        <PressableBox style={(pressed) => ({ opacity: pressed ? 0.7 : 1 })} onPress={() => onChangeText("")} hitSlop={10} accessibilityLabel="Aramayı temizle">
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.mono.line,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} color={colors.ink.secondary} />
          </View>
        </PressableBox>
      ) : null}
    </View>
  );
}
