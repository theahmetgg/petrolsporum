import React from "react";
import { TextInput, TextInputProps, View, StyleProp, ViewStyle } from "react-native";
import { Search, X } from "lucide-react-native";
import { AppFonts } from "@/lib/fonts";
import { typography, useColors } from "@/theme";
import { IconButton } from "./IconButton";

export interface GlassSearchProps extends Omit<TextInputProps, "style" | "onChangeText" | "value"> {
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * İmza gradyan bloğun içindeki cam arama kutusu (tasarım sistemi §4.1).
 * Beyaz zeminde `SearchBar` kullanılır; bu bileşen yalnızca gradyan üstündedir.
 */
export function GlassSearch({ value, onChangeText, placeholder = "Ara", style, ...rest }: GlassSearchProps) {
  const colors = useColors();
  return (
    <View
      style={[
        {
          height: 46,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingLeft: 16,
          paddingRight: 6,
          borderWidth: 1,
          borderColor: colors.glass.border,
          backgroundColor: colors.glass.DEFAULT,
        },
        style,
      ]}
    >
      <Search size={18} color={colors.ink.inverse} strokeWidth={1.5} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.glass.text}
        returnKeyType="search"
        autoCorrect={false}
        style={{ flex: 1, height: "100%", color: colors.ink.inverse, fontFamily: AppFonts.regular, fontSize: typography.body[0], paddingVertical: 0 }}
        {...rest}
      />
      {value ? <IconButton icon={X} label="Aramayı temizle" variant="frost" size={34} onPress={() => onChangeText("")} /> : null}
    </View>
  );
}
