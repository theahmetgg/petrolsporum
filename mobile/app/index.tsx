import { Redirect } from "expo-router";

/**
 * Başlangıç ekranı. Şimdilik doğrudan sekmelere gider; karşılama ve sahte giriş (prototip ekran 1) eklenince
 * oturuma göre karşılamaya ya da sekmelere yönlendirecek.
 */
export default function StartScreen() {
  return <Redirect href="/(tabs)" />;
}
