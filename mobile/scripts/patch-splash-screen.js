/**
 * expo-splash-screen yaması (Android).
 *
 * Sorun: `SplashScreenManager` tek nesne; "ekranı açık tut" bayrağı ilk `hideAsync` ile kapanır ve bir daha açılmaz.
 * Uygulama geri tuşuyla kapatılıp süreç yaşarken yeniden açılınca (yeni Activity) telefonun açılış ekranı ilk karede
 * kalkar: animasyonlu açılış (`AnimatedSplash`) hazır olana kadar bir an siyah pencere ve ikonsuz turuncu görünür.
 *
 * Yama: JS bu süreçte `preventAutoHideAsync` çağırmışsa her yeni Activity'de bayrak yeniden açılır; JS yeniden
 * `hideAsync` çağırınca kalkar. JS bir sebeple çağırmazsa ekran 3 sn sonra kendiliğinden kalkar (asılı kalmaz).
 * İlk (soğuk) açılış değişmez.
 */
const fs = require("fs");
const path = require("path");

const targetFile = path.resolve(
  __dirname,
  "../node_modules/expo-splash-screen/android/src/main/java/expo/modules/splashscreen/SplashScreenManager.kt"
);

if (!fs.existsSync(targetFile)) {
  process.exit(0);
}

const MARKER = "petrolspor-app yaması";
let content = fs.readFileSync(targetFile, "utf8");

if (content.includes(MARKER)) {
  process.exit(0);
}

const targetStr = `  fun registerOnActivity(activity: Activity) {
    splashScreen = activity.installSplashScreen()
`;

const replacementStr = `  fun registerOnActivity(activity: Activity) {
    splashScreen = activity.installSplashScreen()
    // ${MARKER}: süreç yaşarken açılan yeni Activity'de de JS hideAsync çağırana kadar açık kal (en fazla 3 sn)
    if (preventAutoHideCalled) {
      keepSplashScreenOnScreen = true
      activity.window.decorView.postDelayed({ hide() }, 3000L)
    }
`;

if (!content.includes(targetStr)) {
  console.warn("[patch-splash-screen] SplashScreenManager.kt beklenen biçimde değil; yama uygulanmadı.");
  process.exit(0);
}

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(targetFile, content, "utf8");
console.log("[patch-splash-screen] expo-splash-screen yaması uygulandı.");
