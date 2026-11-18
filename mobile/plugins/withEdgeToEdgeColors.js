/**
 * withEdgeToEdgeColors.js
 *
 * Ensures navigation bar background matches the app theme:
 * - Sets activityBackground to the theme page background: #121317 in both (prototype is dark-only; app forces dark even when the phone is in light mode)
 * - Splash background is brand red #DE1606 in both themes
 * - Sets enforceNavigationBarContrast=false in styles.xml
 * - Splash theme: transparent navigation bar (no black bar under the splash in 3-button mode)
 * - Generates 100% transparent splash logo drawables (eliminating any square box artifact)
 * - Sets forceDarkAllowed=false to prevent OEM dark-mode tint distortion on splash screen
 */
const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Pencere zemini temanın sayfa zeminiyle aynı (src/theme/tokens.js surface.bg): açılış kaybolurken siyah parlama olmaz
const APP_BG_COLOR_LIGHT = "#121317";
const APP_BG_COLOR_DARK = "#121317";

function withColorsXml(config) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const colorsPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values/colors.xml"
      );
      if (!fs.existsSync(colorsPath)) return config;

      let contents = fs.readFileSync(colorsPath, "utf8");
      contents = contents.replace(
        /<color name="activityBackground">[^<]*<\/color>/,
        `<color name="activityBackground">${APP_BG_COLOR_LIGHT}</color>`
      );
      fs.writeFileSync(colorsPath, contents, "utf8");
      return config;
    },
  ]);
}

function withNightColorsXml(config) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const nightDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values-night"
      );
      if (!fs.existsSync(nightDir)) {
        fs.mkdirSync(nightDir, { recursive: true });
      }

      const nightPath = path.join(nightDir, "colors.xml");
      const content = `<resources>
  <color name="splashscreen_background">#DE1606</color>
  <color name="iconBackground">#000000</color>
  <color name="colorPrimary">#023c69</color>
  <color name="colorPrimaryDark">#09090b</color>
  <color name="activityBackground">${APP_BG_COLOR_DARK}</color>
</resources>`;
      fs.writeFileSync(nightPath, content, "utf8");
      return config;
    },
  ]);
}

function withStylesXml(config) {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const stylesPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values/styles.xml"
      );
      if (!fs.existsSync(stylesPath)) return config;

      let contents = fs.readFileSync(stylesPath, "utf8");
      // Set enforceNavigationBarContrast to false
      contents = contents.replace(
        /(<item name="android:enforceNavigationBarContrast"[^>]*>)(true)(<\/item>)/,
        "$1false$3"
      );

      // Force dark allowed false for splash screen and app theme
      if (!contents.includes('name="android:forceDarkAllowed"')) {
        contents = contents.replace(
          /(<style name="Theme\.App\.SplashScreen"[^>]*>)/,
          `$1\n    <item name="android:forceDarkAllowed">false</item>`
        );
        contents = contents.replace(
          /(<style name="AppTheme"[^>]*>)/,
          `$1\n    <item name="android:forceDarkAllowed">false</item>`
        );
      }

      // Telefonun açılış ekranı tam ekran: 3 tuş modunda sistem teması (DeviceDefault) gezinme çubuğunu siyah boyuyordu.
      // Çubuk saydam olunca kırmızı zemin tuşların arkasına kadar uzanır; siyah çubuğu açılış bitince uygulama çizer.
      const splashStyle = (contents.match(/<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/) || [""])[0];
      if (splashStyle && !splashStyle.includes("android:navigationBarColor")) {
        contents = contents.replace(
          /(<style name="Theme\.App\.SplashScreen"[^>]*>)/,
          `$1\n    <item name="android:navigationBarColor">@android:color/transparent</item>` +
            `\n    <item name="android:enforceNavigationBarContrast" tools:targetApi="29">false</item>`
        );
      }

      fs.writeFileSync(stylesPath, contents, "utf8");
      return config;
    },
  ]);
}

function withTransparentSplashLogo(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      try {
        const imageUtils = require("@expo/image-utils");
        const androidResPath = path.join(
          config.modRequest.platformProjectRoot,
          "app/src/main/res"
        );
        const splashIconPath = path.join(
          config.modRequest.projectRoot,
          "assets/splash-icon.png"
        );

        if (!fs.existsSync(splashIconPath)) return config;

        const DENSITIES = {
          mdpi: 1,
          hdpi: 1.5,
          xhdpi: 2,
          xxhdpi: 3,
          xxxhdpi: 4,
        };

        for (const [density, multiplier] of Object.entries(DENSITIES)) {
          const canvasSize = Math.round(288 * multiplier);
          const iconSize = Math.round(160 * multiplier);

          // Generate 100% transparent background canvas
          const background = await imageUtils.generateImageBackgroundAsync({
            width: canvasSize,
            height: canvasSize,
            backgroundColor: "transparent",
            resizeMode: "cover",
          });

          // Resize the white icon
          const { source: foreground } = await imageUtils.generateImageAsync(
            { projectRoot: config.modRequest.projectRoot, cacheType: "splash-transparent" },
            { src: splashIconPath, resizeMode: "contain", width: iconSize, height: iconSize }
          );

          // Composite transparent background with centered icon
          const composed = await imageUtils.compositeImagesAsync({
            background,
            foreground,
            x: Math.round((canvasSize - iconSize) / 2),
            y: Math.round((canvasSize - iconSize) / 2),
          });

          // Write to both light and night drawable directories
          const dirs = [
            path.join(androidResPath, `drawable-${density}`),
            path.join(androidResPath, `drawable-night-${density}`),
          ];

          for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            const targetFile = path.join(dir, "splashscreen_logo.png");
            fs.writeFileSync(targetFile, composed);
          }
        }
      } catch (err) {
        console.warn("[withTransparentSplashLogo] Warning during splash drawable generation:", err);
      }

      return config;
    },
  ]);
}

function withEdgeToEdgeColors(config) {
  let result = withColorsXml(config);
  result = withNightColorsXml(result);
  result = withStylesXml(result);
  result = withTransparentSplashLogo(result);
  return result;
}

module.exports = withEdgeToEdgeColors;

