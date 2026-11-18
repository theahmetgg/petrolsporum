import React from "react";
import { useShallow } from "zustand/react/shallow";
import { View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useToastStore } from "../stores/toastStore";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react-native";
import { AppText, PressableBox } from "@/components/ui";
import { scrim, useTheme } from "@/theme";

/**
 * Kısa bildirim (tasarım sistemi §4.6): status bar altında yüzen koyu kapsül, beyaz kısa metin, solda küçük anlam ikonu.
 * İki temada da koyu kalır (kullanıcı kararı 16 Kasım 2026): açık temada siyah (`mono.solid`), koyu temada sayfadan
 * bir ton açık koyu gri (`mono.fillStrong`, #323232) ki zeminden ayrılsın; yazı her zaman beyaz, gölge siyah.
 */
export const Toast = () => {
  const { colors, isDark } = useTheme();
  const { toast, hideToast } = useToastStore(useShallow((s) => ({ toast: s.toast, hideToast: s.hideToast })));
  const { insetTop } = useNavigationMode();

  if (!toast.visible) {
    return null;
  }

  // Top positioning: perfectly below the status bar / dynamic island
  const topPosition = Math.max(insetTop, 16) + 8;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  const IconComponent = isSuccess
    ? CheckCircle2
    : isError
    ? AlertCircle
    : Info;

  const bg = isDark ? colors.mono.fillStrong : colors.mono.solid;
  const fg = isDark ? colors.ink.DEFAULT : colors.mono.onSolid;
  const iconColor = isSuccess ? colors.success.DEFAULT : isError ? colors.danger.DEFAULT : fg;

  return (
    <Animated.View
      entering={FadeInUp.duration(280)}
      exiting={FadeOutUp.duration(220)}
      className="absolute left-4 right-4 z-[99999]"
      style={{ top: topPosition }}
      pointerEvents="box-none"
    >
      <PressableBox
        onPress={hideToast}
        className="flex-row items-center px-4 py-3"
        style={() => ({
          borderRadius: 22,
          backgroundColor: bg,
          elevation: 25,
          shadowColor: scrim(1),
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
        })}
      >
        <IconComponent size={16} color={iconColor} strokeWidth={2.2} style={{ marginRight: 10 }} />

        {/* Toast Message */}
        <AppText variant="small" weight="medium" color={fg} numberOfLines={2} style={{ flex: 1 }}>
          {toast.message}
        </AppText>

        {/* Quick Close button */}
        <View style={{ marginLeft: 10, opacity: 0.6 }}>
          <X size={16} color={fg} strokeWidth={2} />
        </View>
      </PressableBox>
    </Animated.View>
  );
};


