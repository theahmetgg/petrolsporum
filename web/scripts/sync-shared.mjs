/**
 * Mobil uygulamadaki ortak kaynakları web'e taşır (Ar-Ge belgesi 13.3: web, mobildeki tema, tipler ve veriyle
 * aynı kaynaktan beslenir). Tek doğruluk kaynağı `mobile/` klasörüdür; buradaki kopyalar elle düzenlenmez.
 *
 *  1) Veri, tipler ve yardımcılar: `mobile/src/{types,mocks,utils,lib}` → `web/src/shared/…` (birebir kopya).
 *     Web bu dosyaları `@/…` takma adıyla içe aktarır (tsconfig: "@/*" → "./src/shared/*"); böylece dosyaların
 *     kendi içindeki `@/types` gibi yollar değişmeden çalışır.
 *  2) Tema: `mobile/src/theme/tokens.js` → `web/src/app/theme.generated.css` (Tailwind v4 `@theme` değişkenleri).
 *     Koyu ve açık palet birlikte üretilir; site varsayılan olarak koyu açılır, üst bardaki düğmeyle değişir.
 *
 * Kullanım:  npm run sync   (mobilde veri ya da renk değişince)
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const mobile = join(web, "..", "mobile");

/** Web'in kullandığı dosyalar. Görsel haritası (`mocks/images.ts`) ve taraftar/kokpit demoları mobil içindir, taşınmaz. */
const FILES = [
  "types/index.ts",
  "mocks/teams.ts",
  "mocks/standings.ts",
  "mocks/players.ts",
  "mocks/matches.ts",
  "mocks/news.ts",
  "mocks/club.ts",
  "utils/format.ts",
  "lib/standings.ts",
];

const HEADER = "// BU DOSYA KOPYADIR — elle düzenlemeyin. Kaynak: mobile/src/%s (npm run sync)\n";

for (const file of FILES) {
  const target = join(web, "src", "shared", file);
  mkdirSync(dirname(target), { recursive: true });
  const source = readFileSync(join(mobile, "src", file), "utf8");
  writeFileSync(target, HEADER.replace("%s", file) + source);
}

// Görseller: kulüp arması, logolar, haber ve tarihçe fotoğrafları
const { readdirSync } = await import("node:fs");
const clubDir = join(mobile, "assets", "club");
mkdirSync(join(web, "public", "club"), { recursive: true });
for (const name of readdirSync(clubDir)) copyFileSync(join(clubDir, name), join(web, "public", "club", name));

// Tema: iki palet de üretilir. Renkler CSS değişkenidir (--c-*); Tailwind sınıfları (bg-surface-bg, text-ink …)
// bu değişkenleri okur. Varsayılan koyu temadır; `data-theme="light"` açık paleti verir. Bir bölüme
// `data-theme="dark"` yazılırsa o bölüm her temada koyu çizilir (ör. fotoğraflı açılış).
const tokens = require(join(mobile, "src", "theme", "tokens.js"));
const GROUPS = ["brand", "ink", "surface", "line", "mono", "success", "danger", "warning", "info"];
const varName = (group, key) => `${group}${key === "DEFAULT" ? "" : `-${key}`}`;
const paletteVars = (palette) =>
  GROUPS.flatMap((group) => Object.entries(palette[group]).map(([key, value]) => `  --c-${varName(group, key)}: ${value};`)).join("\n");
const themeMap = GROUPS.flatMap((group) => Object.keys(tokens.colors[group]).map((key) => `  --color-${varName(group, key)}: var(--c-${varName(group, key)});`)).join("\n");
const gradient = (stops) => `linear-gradient(180deg, ${stops.join(", ")})`;

const css = `/* BU DOSYA OTOMATİK ÜRETİLİR — elle düzenlemeyin. Kaynak: mobile/src/theme/tokens.js (npm run sync) */
@theme inline {
${themeMap}
  --radius-control: ${tokens.radius.control}px;
  --radius-box: ${tokens.radius.box}px;
  --radius-hero: ${tokens.radius.hero}px;
  --radius-block: ${tokens.radius.block}px;
}

/* Koyu tema (varsayılan) */
:root,
[data-theme="dark"] {
${paletteVars(tokens.darkColors)}
  color-scheme: dark;
}

/* Açık tema */
[data-theme="light"] {
${paletteVars(tokens.colors)}
  color-scheme: light;
}

:root {
  --gradient-signature: ${gradient(tokens.gradients.signature)};
  --gradient-icon: ${gradient(tokens.gradients.icon)};
  --scrim: ${tokens.colors.scrim.DEFAULT};
}
`;
writeFileSync(join(web, "src", "app", "theme.generated.css"), css);
console.log(`${FILES.length} dosya + görseller + tema taşındı → web/src/shared, web/public/club, web/src/app/theme.generated.css`);
