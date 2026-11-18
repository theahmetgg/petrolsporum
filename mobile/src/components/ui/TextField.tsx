import React, { forwardRef, useState } from "react";
import { TextInput, TextInputProps, View, StyleProp, ViewStyle } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { AppFonts } from "@/lib/fonts";
import { radius, typography, useColors } from "@/theme";
import { AppText } from "./AppText";
import { PressableBox } from "./PressableBox";

export interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  /** Alanın altında gri yardımcı metin */
  helper?: string;
  /** Verilirse alan kırmızı çerçeveli olur ve mesaj gösterilir */
  error?: string | null;
  /** Şifre alanı: göster/gizle düğmesi ekler */
  password?: boolean;
  /** Çok satırlı metin alanı (açıklama, yorum) */
  multiline?: boolean;
  /** maxLength verildiyse sağ altta "12/160" sayacı gösterilir */
  showCounter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  /** Alt çekmece (BottomSheet) içindeyse `BottomSheetTextInput` kullanılır; klavye takibi çekmeceyle eşlenir */
  inSheet?: boolean;
}

/** Etiketli, hata mesajlı ve sayaçlı standart metin alanı. */
export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      helper,
      error,
      password = false,
      multiline = false,
      showCounter = false,
      maxLength,
      value,
      editable = true,
      containerStyle,
      inSheet = false,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
  const colors = useColors();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(password);
    // Tasarım sistemi §4.5: koyu gri zemin, çerçevesiz; odakta siyah, hatada kırmızı çerçeve
    const borderColor = error ? colors.danger.DEFAULT : focused ? colors.mono.solid : "transparent";
    const [fontSize, lineHeight] = typography.body;
    const Input = (inSheet ? BottomSheetTextInput : TextInput) as typeof TextInput;

    return (
      <View style={containerStyle}>
        {label ? (
          <AppText variant="small" weight="medium" style={{ marginBottom: 8 }}>
            {label}
          </AppText>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: multiline ? "flex-start" : "center",
            minHeight: multiline ? 120 : 50,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 0,
            gap: 10,
            borderRadius: radius.control,
            borderWidth: 1,
            borderColor,
            backgroundColor: editable ? colors.mono.fillStrong : colors.mono.line,
          }}
        >
          <Input
            ref={ref}
            value={value}
            editable={editable}
            maxLength={maxLength}
            multiline={multiline}
            secureTextEntry={hidden}
            placeholderTextColor={colors.ink.muted}
            textAlignVertical={multiline ? "top" : "center"}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={{
              flex: 1,
              fontFamily: AppFonts.regular,
              fontSize,
              lineHeight: multiline ? lineHeight : undefined,
              color: colors.ink.DEFAULT,
              paddingVertical: multiline ? 0 : 12,
              minHeight: multiline ? 88 : undefined,
            }}
            {...rest}
          />
          {password ? (
            <PressableBox style={(pressed) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => setHidden((h) => !h)}
              hitSlop={10}
              accessibilityLabel={hidden ? "Şifreyi göster" : "Şifreyi gizle"}
            >
              {hidden ? <Eye size={18} color={colors.ink.muted} /> : <EyeOff size={18} color={colors.ink.muted} />}
            </PressableBox>
          ) : null}
        </View>
        {error || helper || (showCounter && maxLength) ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6, gap: 8 }}>
            <AppText variant="caption" tone={error ? "danger" : "muted"} style={{ flex: 1 }}>
              {error || helper || ""}
            </AppText>
            {showCounter && maxLength ? (
              <AppText variant="caption" tone="muted">
                {(value?.length || 0).toLocaleString("tr-TR")}/{maxLength}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }
);
TextField.displayName = "TextField";
