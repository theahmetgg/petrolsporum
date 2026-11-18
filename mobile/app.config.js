// Batman Petrolspor — Faz 1 prototip (sunucusuz). Bildirim, konum, güncelleme ve mağaza ayarları Faz 2'de eklenir.
export default {
  expo: {
    name: "Batman Petrolspor",
    slug: "petrolspor-app",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "petrolspor",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      // Açılış ekranı iki temada da marka kırmızısı (src/theme/tokens.js brand.DEFAULT)
      backgroundColor: "#DE1606",
      dark: {
        image: "./assets/splash-icon.png",
        backgroundColor: "#DE1606",
      },
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.petrolspor.app",
    },
    backgroundColor: "#000000",
    android: {
      // Geçici paket adı; mağazaya çıkmadan önce kulüple kesinleştirilir
      package: "com.petrolspor.app",
      backgroundColor: "#000000",
      adaptiveIcon: {
        backgroundColor: "#DE1606",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      navigationBar: {
        backgroundColor: "transparent",
        barStyle: "light-content",
      },
    },
    androidNavigationBar: {
      visible: "always",
      barStyle: "light-content",
      backgroundColor: "#000000",
      enforceContrast: false,
    },
    plugins: [
      "./plugins/withEdgeToEdgeColors",
      "expo-router",
      "expo-secure-store",
      "expo-font",
      "expo-asset",
      // Tribün modu ses ölçeri: yalnız anlık ses seviyesi okunur; ses hiçbir yere gönderilmez
      ["expo-audio", { microphonePermission: "Tribün modundaki ses ölçer için mikrofonun ses seviyesini okuruz. Ses hiçbir yere gönderilmez." }],
      // Duvar kağıdını galeriye kaydetmek için (yalnız yazma izni)
      [
        "expo-media-library",
        {
          photosPermission: "Duvar kağıdını galerine kaydetmek için fotoğraflarına erişiriz.",
          savePhotosPermission: "Duvar kağıdını galerine kaydetmek için izin gerekir.",
          isAccessMediaLocationEnabled: false,
        },
      ],
    ],
  },
};
