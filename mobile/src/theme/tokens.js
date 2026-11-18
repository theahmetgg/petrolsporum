/**
 * Batman Petrolspor Tasarım Tokenları — Tek Doğruluk Kaynağı (SSOT)
 *
 * Bu dosya tailwind.config.js (NativeWind sınıfları) ve TypeScript bileşenleri (`@/theme`) tarafından okunur.
 * Renk, yazı ölçeği, köşe ve gölge değerleri yalnızca buradan değiştirilir; ekranlarda yeni hex kodu yazılmaz.
 *
 * Marka: kırmızı - beyaz - siyah. Kırmızı tonları Ar-Ge belgesi Bölüm 8.1'deki 2. ve 4. paletten alındı
 * (#DE1606 parlak, #A00603 orta, #620603 koyu, #0C0606 siyaha yakın).
 * İskelet Batman360'tan taşındı; orada turuncu olan her şey burada kırmızıdır.
 *
 * Tema: prototip koyu temada yapılır (karar, 18 Kasım 2026). Açık palet anahtarları eksiksiz tutulur,
 * ama açık tema sonraki fazda gözden geçirilecektir.
 */

const colors = {
  brand: {
    DEFAULT: "#DE1606", // ikon, aktif durum göstergesi, kenarlık, vurgu, "Canlı" rozeti (beyaz yazı kontrastı 4.9:1)
    fill: "#C41205", // üstünde beyaz yazı olan dolu zemin: dolu çip, hero
    fillPressed: "#A00603", // dolu zeminin basılı hâli (iki temada aynı)
    pressed: "#C41205", // vurgu öğelerinin basılı hâli
    strong: "#A00603", // açık zeminde kırmızı metin
    soft: "#FDF1F0", // yumuşak zemin: seçili çip, ikon kutusu
    border: "#F5C2BD", // yumuşak kırmızı kenarlık
  },
  ink: {
    DEFAULT: "#0F172A", // Başlıklar, birincil metin
    secondary: "#475569", // Gövde metni, açıklamalar
    muted: "#94A3B8", // Yardımcı bilgi, pasif ikon, zaman
    disabled: "#CBD5E1", // Yer tutucu, devre dışı
    inverse: "#FFFFFF", // Koyu/kırmızı zemin üstünde metin
  },
  surface: {
    DEFAULT: "#FFFFFF", // Kart, sheet, alt menü
    bg: "#FFFFFF", // Ekran arka planı
    muted: "#F3F3F3", // Arama kutusu, pasif çip, girdi zemini
    sunken: "#E2E8F0", // İskelet (skeleton), ayraç
    logo: "#FFFFFF", // Arma zemini: armalar beyaz zemine göre tasarlanır, iki modda da beyaz
  },
  line: {
    DEFAULT: "#EEF2F6", // Yumuşak kart kenarlığı
    strong: "#E2E8F0", // Girdi kenarlığı
  },
  // Nötr yüzeyler
  mono: {
    solid: "#0A0A0A", // Ana eylem butonu, seçili hap zemini
    onSolid: "#FFFFFF", // solid üstündeki yazı/ikon
    fill: "#F9F9F9", // Kutu zemini (liste kutusu, not) — çerçevesiz
    fillStrong: "#F3F3F3", // Buton, pasif hap, ikon dairesi, giriş kutusu — kutudan bir ton koyu, çerçevesiz
    line: "#ECECEC", // Yalnız ayırıcı çizgi ve kontrol kenarı (anahtar, onay kutusu, adım)
  },
  success: { DEFAULT: "#16A34A", soft: "#ECFDF3" },
  // Hata/silme kırmızısı marka kırmızısından ayrışsın diye pembeye çalar (marka: turuncuya çalan #DE1606)
  danger: { DEFAULT: "#E11D48", soft: "#FFF1F3", pressed: "#BE123C", border: "#FECDD6" },
  warning: { DEFAULT: "#D97706", soft: "#FFFBEB" },
  info: { DEFAULT: "#2563EB", soft: "#EFF6FF" },
  // Ana sayfa üst gradyanı: kırmızıdan sayfa zeminine karışan duraklar
  hero: { from: "#DE1606", via: "#E8432F", soft: "#F5A39A", fade: "#FDE8E6" },
  // Cam yüzey: kırmızı gradyan veya fotoğraf/kapak üstündeki yarı saydam beyaz butonlar
  glass: { DEFAULT: "rgba(255,255,255,0.22)", pressed: "rgba(255,255,255,0.34)", border: "rgba(255,255,255,0.38)", text: "rgba(255,255,255,0.82)", dim: "rgba(255,255,255,0.55)" },
  // Karartma: fotoğraf/kapak üstündeki koyu katman, sayaç ve rozetler; opaklık `scrim(0.45)` ile verilir (iki temada aynı)
  scrim: { DEFAULT: "#0C0606" },
  // Sistem: Android 3 tuşlu gezinme çubuğunun arkasındaki saf siyah şerit
  system: { bar: "#000000" },
  // Medya: tam ekran fotoğraf-video ekranları (duvar kağıdı önizleme, hikaye); temadan bağımsız, her zaman koyu
  media: {
    bg: "#000000", // Tam ekran medya zemini
    surface: "#18181B", // Medya ekranındaki sheet / panel
    raised: "#27272A", // Panel içi kutu, ayraç
    line: "#3F3F46", // İlerleme çubuğu zemini, ince çizgi
    text: "#FFFFFF", // Medya üstündeki metin ve ikon
    muted: "#A1A1AA", // İkincil metin
    subtle: "#71717A", // Üçüncül metin, tutamak
    like: "#F43F5E", // Medya üstündeki beğeni kalbi
  },
};

/**
 * Koyu palet (prototipin teması) — açık paletle birebir aynı anahtarlar.
 * Zemin ve kutu grileri Batman360 koyu temasından aynen alındı (Ar-Ge belgesi 8.3): #121317 zemin, #272727 kutu, #323232 buton.
 */
const darkColors = {
  brand: {
    DEFAULT: "#DE1606",
    fill: "#C41205",
    fillPressed: "#A00603",
    pressed: "#C41205",
    strong: "#FF6B57", // Koyu zemin üstünde kırmızı metin (kontrast 6.4:1)
    soft: "#2A0C0A",
    border: "#5C0705",
  },
  ink: {
    DEFAULT: "#FFFFFF",
    secondary: "#BBBBBB",
    muted: "#888888",
    disabled: "#626368",
    inverse: "#FFFFFF", // Kırmızı zemin üstündeki metin iki modda da beyaz
  },
  surface: {
    DEFAULT: "#272727",
    bg: "#121317",
    muted: "#323232",
    sunken: "#3B3C42",
    logo: "#FFFFFF",
  },
  line: {
    DEFAULT: "#3B3C42",
    strong: "#4A4B52",
  },
  // Koyu temada ana eylem beyaz hap, kutular zeminden belirgin açık
  mono: {
    solid: "#FFFFFF",
    onSolid: "#121317",
    fill: "#272727",
    fillStrong: "#323232",
    line: "#3B3C42",
  },
  success: { DEFAULT: "#00BA7C", soft: "#0A2419" },
  danger: { DEFAULT: "#FF4D6D", soft: "#2B0E16", pressed: "#E11D48", border: "#4D1826" },
  warning: { DEFAULT: "#FFD400", soft: "#2A2306" },
  info: { DEFAULT: "#1D9BF0", soft: "#071D2E" },
  // Koyu temada kırmızı, koyu gri zemine siyaha yakın bir bordoyla karışır
  hero: { from: "#DE1606", via: "#A00603", soft: "#620603", fade: "#1C0B0B" },
  // Cam yüzey kapak/fotoğraf üstünde durduğu için iki modda da aynıdır
  glass: colors.glass,
  // Sistem çubuğu ve medya ekranları temadan bağımsızdır
  scrim: colors.scrim,
  system: colors.system,
  media: colors.media,
};

const palettes = { light: colors, dark: darkColors };

/**
 * NativeWind sınıflarına (bg-surface, text-ink …) bağlanan renk grupları.
 * Bu gruplar CSS değişkeni olarak tanımlanır; tema değişince className renkleri kendiliğinden değişir.
 * `glass` rgba olduğu ve sınıf olarak kullanılmadığı için dışarıda kalır.
 */
const themedColorGroups = ["brand", "ink", "surface", "line", "mono", "success", "danger", "warning", "info", "system", "media"];

/** "--color-brand", "--color-brand-soft" … */
const cssVarName = (group, key) => (key === "DEFAULT" ? `--color-${group}` : `--color-${group}-${key}`);

/** "#DE1606" → "222 22 6" (tailwind `rgb(var(--x) / <alpha-value>)` deseni için) */
const hexToRgbChannels = (hex) => {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
};

/** Bir paletten NativeWind `vars()` için değişken haritası üretir. */
const toCssVariables = (palette) =>
  Object.fromEntries(
    themedColorGroups.flatMap((group) =>
      Object.entries(palette[group]).map(([key, hex]) => [cssVarName(group, key), hexToRgbChannels(hex)])
    )
  );

/** tailwind.config.js renkleri: her token kendi CSS değişkenini okur. */
const tailwindThemeColors = Object.fromEntries(
  themedColorGroups.map((group) => [
    group,
    Object.fromEntries(
      Object.keys(colors[group]).map((key) => [key, `rgb(var(${cssVarName(group, key)}) / <alpha-value>)`])
    ),
  ])
);

/** Yazı ölçeği: [fontSize, lineHeight] (dp). En küçük okunabilir boyut 12'dir. */
const typography = {
  display: [24, 30],
  title: [20, 26],
  headline: [17, 22],
  subhead: [16, 22],
  body: [15, 22],
  small: [13, 18],
  caption: [12, 16],
  hero: [56, 64], // Gradyan bloğun ortasındaki tek iri rakam (geri sayım, skor)
  metric: [40, 46], // Büyük veri rakamı (puan, sıra)
  badge: [11, 14], // Yalnızca rozet ve sayaçlar (dar hap içi)
};

/** Köşe yuvarlaklıkları (dp) */
const radius = {
  tag: 8, // Küçük etiket ve rozetler
  thumb: 14, // Kutu içindeki küçük fotoğraf
  control: 14, // Buton, girdi, arama kutusu
  card: 24, // Standart kart / liste kutusu
  box: 24, // Liste kutusu (card ile aynı; yeni kodda bu ad)
  hero: 26, // Büyük vitrin kartı
  sheet: 28, // Alt çekmece
  block: 30, // İmza gradyan blok ve detay fotoğraf bloğunun alt köşeleri
  pill: 999, // Hap, ana buton, yuvarlak ikon butonu
};

/** Boşluk ölçeği (dp) — 4'ün katları */
const spacing = {
  screen: 20, // Ekran yatay kenar boşluğu
  section: 28, // Bölümler arası
  card: 16, // Kart iç boşluğu
  gap: 12, // Liste elemanları arası (eski)
  box: 12, // Liste kutusunun iç boşluğu
  boxGap: 10, // Liste kutuları arası
  blockBottom: 24, // İmza gradyan bloğun en alt öğesi ile alt kenarı arası (köşe kavisi kesmesin)
};

/** Gölgeler (React Native stil nesneleri) */
const shadows = {
  none: {},
  card: {
    shadowColor: "#0C0606",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowColor: "#0C0606",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  brand: {
    shadowColor: "#DE1606",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
};

/**
 * Gradyanlar (tema bağımsız).
 */
const gradients = {
  // Hikaye halkası: görülmemiş hikaye. Görülmüş hikayenin halkası gradyan değil, `line.strong` rengindedir.
  storyRing: ["#FF8A7A", "#F0503A", "#DE1606", "#A00603"],
  // İmza gradyan blok (ekranların üstü): parlak kırmızıdan siyaha yakın bordoya; iki temada aynı
  signature: ["#DE1606", "#A00603", "#620603", "#240807"],
  // İkon gradyanı (karar, 18 Kasım 2026): tüm renkli ikonlar aynı kırmızı gradyanı taşır; `scripts/sync-color-icons.mjs` okur
  icon: ["#FF5A45", "#B00A05"],
  // Koyu kırmızı zemin üstündeki ikon (ör. gradyan blok içi): beyazdan açık griye
  iconOnBrand: ["#FFFFFF", "#E7DCDA"],
};

module.exports = { colors, darkColors, palettes, toCssVariables, tailwindThemeColors, typography, radius, spacing, shadows, gradients };
