import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BackHandler, View, ViewStyle, useWindowDimensions } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";
import { useNavigationMode } from "@/hooks/useNavigationMode";
import { palettes, radius, systemColors, ThemeScope, useTheme } from "@/theme";
import type { ThemeScheme } from "@/stores/themeStore";
import { AppText } from "@/components/ui";

interface SheetModalProps {
  children: React.ReactNode;
  snapPoints?: string[];
  title?: string;
  /** Extra style for the content container */
  contentStyle?: ViewStyle;
  /** Callback when sheet is dismissed */
  onDismiss?: () => void;
  /** Set to false if children handles its own scrolling or uses a static view. Defaults to true */
  scrollable?: boolean;
  /** Form sheet'leri (Tip 2) için "extend": input odaklanınca en üst snap noktasına genişler. Varsayılan "interactive" */
  keyboardBehavior?: "interactive" | "extend" | "fillParent";
  /** Tema dışı sabit zeminli sheet'ler için (örn. hikaye ekranındaki koyu sheet). Varsayılan sayfa zemini */
  backgroundColor?: string;
  /** Tutamak rengi. Varsayılan mono.line */
  handleColor?: string;
  /** Başka bir sheet açıkken davranış. "push": alttaki sheet küçültülmeden yerinde kalır (örn. onay penceresi). Varsayılan Gorhom'un "switch"i */
  stackBehavior?: "push" | "switch" | "replace";
  /** İçerik sürüklenince pencere de kaysın mı. İçinde dikey çark/kaydırma olan pencerelerde false (pencere tutamaktan sürüklenir). Varsayılan true */
  contentPanning?: boolean;
  /** Yüzen pencere (Papara kalıbı): zemin ve tutamak yok; içerik kendi kartını çizer, kenarlardan ve alttan ayrık durur */
  floating?: boolean;
  /**
   * Temadan bağımsız şema: koyu medya ekranında (gönderi, hikaye) açılan pencereler "dark" verir; zemin, tutamak ve
   * içerik (`ThemeScope`) o şemayla çizilir (kullanıcı kararı, 12 Kasım 2026)
   */
  scheme?: ThemeScheme;
  /** Kaydırılan içeriğin üstünde sabit kalan alan (ör. başlık + arama kutusu); yalnızca `scrollable` ile */
  header?: React.ReactNode;
  /** Pencere açılıp kapanınca / snap noktası değişince (Gorhom `onChange`) */
  onChange?: (index: number) => void;
  /**
   * false: kullanıcı kapatamaz (sürükleme, dışarı dokunma ve geri tuşu kapatmaz); pencereyi yalnızca kod kapatır
   * (ör. Bağlantı yok, Oturum süresi doldu). Varsayılan true
   */
  dismissible?: boolean;
}


/**
 * Reusable bottom sheet modal following the project's Gorhom BottomSheetModal architecture.
 *
 * Usage:
 * ```tsx
 * const sheetRef = useRef<BottomSheetModal>(null);
 *
 * <SheetModal ref={sheetRef}>
 *   <AppText variant="body">Content here</AppText>
 * </SheetModal>
 *
 * // Open: sheetRef.current?.present()
 * // Close: sheetRef.current?.dismiss()
 * ```
 */
const SheetModal = forwardRef<BottomSheetModal, SheetModalProps>(
  ({ children, snapPoints: customSnapPoints, contentStyle, onDismiss, scrollable = true, keyboardBehavior = "interactive", backgroundColor, handleColor, stackBehavior, contentPanning = true, floating = false, scheme, header, onChange, dismissible = true }, ref) => {
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const { is3Button, insetBottom, safeBottomPadding } = useNavigationMode();
    const theme = useTheme();
    const colors = scheme ? palettes[scheme] : theme.colors;
    const isDark = scheme ? scheme === "dark" : theme.isDark;
    // Tasarım sistemi §5.1: sheet zemini sayfa zeminiyle aynı (açıkta beyaz, koyuda #121317)
    const pageBg = isDark ? colors.surface.bg : colors.surface.DEFAULT;
    const content = scheme ? (
      <ThemeScope scheme={scheme} fill={false}>
        {children}
      </ThemeScope>
    ) : (
      children
    );
    const isDynamic = !customSnapPoints;
    const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

    // Dışarıya verilen ref aynı BottomSheetModal; geri tuşunda pencereyi kapatmak için içeride de tutulur
    const sheetRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(ref, () => sheetRef.current as BottomSheetModal);

    // Android geri tuşu: açık pencere önce kendisi kapanır; arkadaki ekran geri gitmez.
    // BackHandler son ekleneni önce çağırır, bu yüzden iç içe pencerelerde en üstteki kapanır.
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      if (!isOpen) return;
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        // Kapatılamaz pencerede geri tuşu yutulur: ne pencere ne arkadaki ekran kapanır
        if (dismissible) sheetRef.current?.dismiss();
        return true;
      });
      return () => subscription.remove();
    }, [isOpen, dismissible]);

    const animationConfigs = useBottomSheetTimingConfigs({
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={dismissible ? "close" : "none"}
          opacity={0.45}
        />
      ),
      [dismissible]
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        stackBehavior={stackBehavior}
        onChange={(index) => {
          setIsOpen(index >= 0);
          onChange?.(index);
        }}
        snapPoints={snapPoints}
        enableDynamicSizing={isDynamic}
        maxDynamicContentSize={SCREEN_HEIGHT * 0.9}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        // Form sheet'lerinde (Tip 2) sheet sürüklenince klavye kapansın (keyboard-avoidance.md §4); input'suz sheet'lere etkisi yok
        enableBlurKeyboardOnGesture
        animationConfigs={animationConfigs}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={dismissible}
        enableHandlePanningGesture={dismissible}
        enableContentPanningGesture={dismissible && contentPanning}
        enableOverDrag={dismissible}
        onDismiss={() => {
          setIsOpen(false);
          onDismiss?.();
        }}
        handleComponent={floating ? null : undefined}
        backgroundStyle={{
          backgroundColor: floating ? "transparent" : backgroundColor ?? pageBg,
          borderTopLeftRadius: radius.sheet,
          borderTopRightRadius: radius.sheet,
        }}
        handleIndicatorStyle={{
          backgroundColor: handleColor ?? colors.mono.line,
          width: 36,
          height: 5,
          borderRadius: 3,
        }}
      >
        {scrollable && header ? (
          <View style={{ paddingHorizontal: floating ? 16 : 20, paddingTop: 4 }}>{scheme ? <ThemeScope scheme={scheme} fill={false}>{header}</ThemeScope> : header}</View>
        ) : null}
        {scrollable ? (
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={[
              {
                paddingHorizontal: floating ? 16 : 20,
                paddingTop: 4,
                paddingBottom: is3Button ? Math.max(insetBottom + 16, 24) : Math.max(safeBottomPadding, 16) + (floating ? 8 : 16),
              },
              contentStyle,
            ]}
          >
            {content}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView
            style={[
              {
                paddingHorizontal: floating ? 16 : 20,
                paddingTop: 4,
                paddingBottom: is3Button ? Math.max(insetBottom + 16, 24) : Math.max(safeBottomPadding, 16) + (floating ? 8 : 16),
              },
              contentStyle,
            ]}
          >
            {content}
          </BottomSheetView>
        )}
        {/* 3-buton modu: beyaz sistem butonları okunabilsin diye en altta sabit siyah bar (navigation-bar.md §2.4) */}
        {is3Button ? (
          <View
            pointerEvents="none"
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: insetBottom, backgroundColor: systemColors.bar }}
          />
        ) : null}
      </BottomSheetModal>
    );
  }
);

SheetModal.displayName = "SheetModal";

export default SheetModal;
