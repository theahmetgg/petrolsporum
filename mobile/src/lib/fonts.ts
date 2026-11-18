/**
 * Merkezi Font Yönetim Dosyası
 *
 * Uygulamadaki tüm font referansları bu dosyadan yönetilir.
 * Font ailesini değiştirmek için SADECE bu dosyayı ve tailwind.config.js'i güncelleyin.
 *
 * Kullanım:
 *   import { AppFonts } from "@/lib/fonts";
 *   style={{ fontFamily: AppFonts.bold }}
 */

// Ağırlıklar tek tek alt yoldan alınır: paketin kökünden alınınca kullanılmayan 13 Poppins ve 16 Barlow dosyası da pakete giriyor
import { useFonts } from "@expo-google-fonts/poppins/useFonts";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { Poppins_800ExtraBold } from "@expo-google-fonts/poppins/800ExtraBold";
import { BarlowCondensed_700Bold } from "@expo-google-fonts/barlow-condensed/700Bold";

/**
 * Merkezi font dosyası haritası — yalnızca kullanılan ağırlıklar yüklenir.
 * Poppins: gövde, buton, etiket (`AppText`). Barlow Condensed (dar, büyük harf): skor ve başlıklar (`Heading`; karar, 18 Kasım 2026).
 */
export const fontDefinitions = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  BarlowCondensed_700Bold,
};

/**
 * Merkezi Font Yükleme Hook'u
 * Uygulamanın kök dizininde (_layout.tsx) tek satırla çağrılır:
 * const [fontsLoaded] = useAppFonts();
 */
export function useAppFonts() {
  return useFonts(fontDefinitions);
}

export const AppFonts = {
  /** Poppins 400 — Gövde metinleri, açıklamalar */
  regular: "Poppins_400Regular",

  /** Poppins 500 — Alt başlıklar, hafif vurgulu metinler */
  medium: "Poppins_500Medium",

  /** Poppins 500 — Form etiketleri, ikincil butonlar */
  semibold: "Poppins_500Medium",

  /** Poppins 600 (SemiBold) — Başlıklar, kartlar, birincil butonlar (Optik UI dengi) */
  bold: "Poppins_600SemiBold",

  /** Poppins 700 (Bold) — Büyük hero başlıklar, display vurguları */
  extrabold: "Poppins_700Bold",

  /** Poppins 800 (ExtraBold) — Logo ve marka metinleri */
  black: "Poppins_800ExtraBold",
} as const;

/** Dar başlık yazı tipi (yalnız `Heading` bileşeni kullanır) */
export const HeadingFonts = {
  bold: "BarlowCondensed_700Bold",
} as const;

export type FontWeight = keyof typeof AppFonts;
export type FontFamilyValue = (typeof AppFonts)[FontWeight];
