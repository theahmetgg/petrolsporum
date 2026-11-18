/**
 * Yerel `Alert.alert` / `Alert.prompt` kullanımını ve `ConfirmModal`'ın doğrudan kullanımını yakalar.
 * Onaylar `confirm()` / `useConfirm()` (`@/stores/confirmStore`), bilgi ve hatalar `showToast` ile verilir.
 *
 * Kullanım:  npm run lint:alert   (ihlal varsa çıkış kodu 1)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["app", "src"];
const EXTENSIONS = [".ts", ".tsx"];
// ConfirmModal'ı yalnızca bu dosyalar kullanabilir
const CONFIRM_MODAL_OWNERS = new Set(["src/components/common/ConfirmModal.tsx", "src/components/common/ConfirmHost.tsx"]);

const RULES = [
  { pattern: /\bAlert\s*\.\s*(alert|prompt)\s*\(/, message: "Alert.alert/prompt yerine confirm() veya showToast kullanın" },
  { pattern: /import\s*\{[^}]*\bAlert\b[^}]*\}\s*from\s*["']react-native["']/, message: "react-native Alert import edilmez" },
  {
    pattern: /<ConfirmModal\b|from\s*["'][^"']*ConfirmModal["']/,
    message: "ConfirmModal doğrudan kullanılmaz; confirm() çağırın",
    skip: (file) => CONFIRM_MODAL_OWNERS.has(file),
  },
];

const listFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(path);
    return EXTENSIONS.some((ext) => entry.name.endsWith(ext)) ? [path] : [];
  });

const violations = [];
for (const dir of SCAN_DIRS) {
  for (const path of listFiles(join(root, dir))) {
    const file = relative(root, path).split("\\").join("/");
    const source = readFileSync(path, "utf8");
    for (const rule of RULES) {
      if (rule.skip?.(file)) continue;
      // Çok satırlı import'ları da yakalamak için tüm kaynakta aranır, satır numarası eşleşmeden bulunur
      const match = rule.pattern.exec(source);
      if (!match) continue;
      const line = source.slice(0, match.index).split("\n").length;
      violations.push(`${file}:${line}  ${rule.message}`);
    }
  }
}

if (violations.length > 0) {
  console.error(`Alert denetimi: ${violations.length} ihlal bulundu\n`);
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}
console.log("Alert denetimi: ihlal yok.");
