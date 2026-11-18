/**
 * Uygulamanın renkli ikonlarını üretir: MingCute Fill (Apache-2.0) ikonları. Batman360'taki ikon altyapısının
 * Petrolspor uyarlaması (karar, 18 Kasım 2026): her ikon kendi renginde DEĞİL; tüm ikonlar aynı Petrolspor
 * gradyanıyla boyanır. Gradyan renkleri burada yazılmaz; `ColorIcon` bileşeni çizerken `src/theme/tokens.js`
 * içindeki `gradients.icon` değerini kullanır (renk değişince bu betiği yeniden çalıştırmak gerekmez).
 *
 * Çıktı: `src/constants/colorIcons.generated.ts`
 *
 * Kullanım:  npm run icons:sync
 * Yeni ikon için aşağıdaki ICONS listesine `ad: "mingcute-ikon-kök-adı"` satırı ekleyip betiği çalıştırın.
 * İkon adları: https://icon-sets.iconify.design/mingcute/ — Üretilen dosya elle düzenlenmez.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Uygulamadaki ikon adı → MingCute ikon kök adı ("-fill" eklenir) */
const ICONS = {
  // Maç
  football: "football",
  fixtures: "calendar-2",
  standings: "chart-bar",
  squad: "group",
  live: "live",
  whistle: "whistle",
  // Oyna
  prediction: "target",
  leaderboard: "trophy",
  trivia: "brain",
  lineup: "t-shirt",
  motm: "medal",
  // Galeri ve kültür
  wallpaper: "pic",
  history: "history",
  anthem: "music-2",
  // Taraftar
  fancard: "idcard",
  qr: "qrcode",
  ticket: "ticket",
  monument: "bricks",
  certificate: "certificate",
  wallet: "wallet-4",
  gift: "gift",
  fanwall: "chat-3",
  // Tribün modu
  tribune: "voice",
  lightshow: "flashlight",
  oilrig: "oil",
  checkin: "location",
  // Kulüp
  news: "news",
  store: "shopping-bag-1",
  plus: "vip-1",
  bus: "bus-2",
  radio: "radio",
  cockpit: "dashboard",
  notification: "notification",
  // Genel kullanım ve boş durumlar
  fire: "fire",
  star: "star",
  person: "user-3",
  photo: "camera-2",
  lock: "lock",
  search: "search",
  info: "information",
};

/**
 * Alt menü ikonları (tek renk, gradyansız): her sekme için MingCute çizgi (pasif) + dolu (aktif) çifti.
 * Renk `currentColor`'dır; sekme çubuğu `color` ile boyar. Anahtarlar `app/(tabs)/` dosya adlarıdır.
 */
const TAB_ICONS = {
  index: "home-4",
  matches: "football",
  play: "target",
  gallery: "pic",
  profile: "user-3",
};

const mingcute = JSON.parse(readFileSync(require.resolve("@iconify-json/mingcute/icons.json"), "utf8"));
const missing = [];

const sizeOf = (icon) => [icon.width ?? mingcute.width ?? 24, icon.height ?? mingcute.height ?? 24];

const out = [];
for (const [key, name] of Object.entries(ICONS)) {
  const icon = mingcute.icons[`${name}-fill`];
  if (!icon) {
    missing.push(`${name}-fill`);
    continue;
  }
  const [w, h] = sizeOf(icon);
  // Dolgu rengi gradyana bağlanır; gradyan tanımını (`<defs>`) bileşen ekler
  const body = icon.body.replace(/currentColor/g, "url(#G)");
  out.push(`  ${JSON.stringify(key)}: { w: ${w}, h: ${h}, body: ${JSON.stringify(body)} },`);
}

const tabOut = [];
for (const [route, name] of Object.entries(TAB_ICONS)) {
  const svg = (variant) => {
    const icon = mingcute.icons[`${name}-${variant}`];
    if (!icon) {
      missing.push(`${name}-${variant}`);
      return "";
    }
    const [w, h] = sizeOf(icon);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${icon.body}</svg>`;
  };
  tabOut.push(`  ${JSON.stringify(route)}: { line: ${JSON.stringify(svg("line"))}, fill: ${JSON.stringify(svg("fill"))} },`);
}

if (missing.length) {
  console.error("Bulunamayan ikonlar:", missing.join(", "));
  process.exit(1);
}

const file = `/* eslint-disable */
// BU DOSYA OTOMATİK ÜRETİLİR — elle düzenlemeyin. Kaynak: scripts/sync-color-icons.mjs (npm run icons:sync)
// MingCute Fill (Apache-2.0), Iconify veri paketi üzerinden. Dolgu \`url(#G)\`: gradyanı ColorIcon bileşeni verir.
export const COLOR_ICONS = {
${out.join("\n")}
} as const;

export type ColorIconName = keyof typeof COLOR_ICONS;

/** Alt menü: rota adı → MingCute çizgi (pasif) / dolu (aktif) SVG, renk currentColor */
export const TAB_ICONS = {
${tabOut.join("\n")}
} as const;
`;
writeFileSync(join(root, "src/constants/colorIcons.generated.ts"), file);
console.log(`${out.length} ikon + ${tabOut.length} sekme ikonu yazıldı → src/constants/colorIcons.generated.ts`);
