import React from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import type { LucideIcon } from "lucide-react-native";
import { shadows, useColors } from "@/theme";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { AppText } from "./AppText";
import { BUTTON_PRESS_SCALE, PressableBox } from "./PressableBox";

/** Yüzen barın kapladığı yükseklik: içerik bunun altına girmesin diye kaydırma alanına eklenir */
export const FLOATING_BAR_HEIGHT = 62;

/** Klavye açıkken bar ile klavyenin üst kenarı arasındaki boşluk */
const KEYBOARD_GAP = 12;

/**
 * Yüzen barın ekranın altından uzaklığı.
 * 3 tuş modu: siyah sistem şeridinin (ekranın kapsayıcısı onun üstünde biter) 12 üstü.
 * Jest modu: jest çizgisinin alanı (`insetBottom`, ~24) + 8; bar çizginin hemen üstünde, iPhone'daki gibi alçak durur.
 */
export function useFloatingBarBottom() {
  const { is3Button, insetBottom } = useNavigationMode();
  return is3Button ? 12 : Math.max(insetBottom + 8, 16);
}

export interface FloatingActionBarProps {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Gönderiliyor: buton aynı boyda kalır, içinde gösterge döner */
  loading?: boolean;
  disabled?: boolean;
  /**
   * `true`: klavye açılınca bar klavyenin 12 üstüne çıkar ve onunla birlikte iner (UI thread'de).
   * Formlarda kullanılmaz: kullanıcı kararıyla form butonu klavye açıkken klavyenin arkasında kalır
   * (form ekranı `Screen avoidKeyboard` vermez, kaydırma `KeyboardAwareScrollView bottomOffset={24}`).
   */
  avoidKeyboard?: boolean;
  /** Ana buton gri (ikincil) görünür; ör. "Destekledin" gibi yapılmış eylem */
  variant?: "primary" | "secondary";
  /** Yazının sağındaki ikon (ör. "Devam →") */
  trailingIcon?: LucideIcon;
  /**
   * Ana butonun solunda, aynı yüzen hap içinde duran yardımcı eylemler (ör. "Yol tarifi" ikon butonu,
   * çok adımlı formda "Geri"). Ekranın ana eylemi yine tektir; bunlar ikon ya da kısa ikincil butondur.
   */
  leading?: React.ReactNode;
}

/**
 * Ekranın tek ana eylemi (tasarım sistemi §4.3): kenarlardan ayrık beyaz hap + içinde `mono.solid` buton.
 * Detay ekranlarında ("Mesaj gönder") ve form ekranlarında ("Onaya gönder") kullanılır.
 * Ekranın kök `Screen` bileşeninin içinde, kaydırma alanının dışında çizilir; kaydırma alanının altına
 * `useFloatingBarBottom() + FLOATING_BAR_HEIGHT + 32` boşluk verilir.
 */
export function FloatingActionBar({
  label,
  icon: Icon,
  trailingIcon: TrailingIcon,
  onPress,
  accessibilityLabel,
  loading = false,
  disabled = false,
  avoidKeyboard = false,
  variant = "primary",
  leading,
}: FloatingActionBarProps) {
  const colors = useColors();
  const bottom = useFloatingBarBottom();
  const { is3Button, insetBottom } = useNavigationMode();
  // Klavye yüksekliği ekranın altından ölçülür; 3 tuş modunda bar siyah sistem şeridinin üstünde durduğu için o pay da düşülür
  const openedOffset = bottom - KEYBOARD_GAP + (is3Button ? insetBottom : 0);
  const isDisabled = disabled || loading;
  const secondary = variant === "secondary";
  const fg = secondary ? colors.ink.DEFAULT : colors.mono.onSolid;
  return (
    <KeyboardStickyView
      enabled={avoidKeyboard}
      // Klavye açıkken alt boşluk (güvenli alan) yerine klavyeye 12 kalsın
      offset={{ closed: 0, opened: openedOffset }}
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom,
        padding: 6,
        borderRadius: 999,
        backgroundColor: colors.surface.DEFAULT,
        ...shadows.raised,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {leading ? <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>{leading}</View> : null}
      <PressableBox
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        pressScale={BUTTON_PRESS_SCALE}
        style={() => ({
          flex: 1,
          height: 50,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: secondary ? colors.mono.fillStrong : colors.mono.solid,
          opacity: disabled && !loading ? 0.4 : 1,
        })}
      >
        {loading ? (
          <ActivityIndicator size="small" color={fg} />
        ) : (
          <>
            {Icon ? <Icon size={18} color={fg} strokeWidth={1.5} /> : null}
            <AppText variant="body" weight="medium" color={fg} numberOfLines={1}>
              {label}
            </AppText>
            {TrailingIcon ? <TrailingIcon size={18} color={fg} strokeWidth={1.5} /> : null}
          </>
        )}
      </PressableBox>
    </KeyboardStickyView>
  );
}
