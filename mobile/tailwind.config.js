/** @type {import('tailwindcss').Config} */
// Tasarım tokenları: src/theme/tokens.js (renk, yazı ölçeği, köşe — tek kaynak)
const tokens = require("./src/theme/tokens");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Tasarım sistemi (yeni ekranlar bunları kullanır) ──
        // brand, ink, surface, line, success, danger, warning, info → CSS değişkenleri.
        // Değerler kök ThemeProvider'daki vars() ile açık/koyu temaya göre verilir.
        ...tokens.tailwindThemeColors,
      },
      fontFamily: {
        // Poppins — Primary App Font (Optik UI Dengeli)
        sans: ["Poppins_400Regular"],
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_500Medium"],
        "poppins-bold": ["Poppins_600SemiBold"],
        "poppins-extrabold": ["Poppins_700Bold"],
        "poppins-black": ["Poppins_800ExtraBold"],
      },
      fontSize: Object.fromEntries(
        Object.entries(tokens.typography).map(([k, [size, lh]]) => [k, [`${size}px`, { lineHeight: `${lh}px` }]])
      ),
      borderRadius: {
        xl: "1.5rem",
        "2xl": "1.5rem",
        ...Object.fromEntries(Object.entries(tokens.radius).map(([k, v]) => [k, `${v}px`])),
      },
      spacing: {
        // DESIGN.md spacing tokens
        "space-8": "2.75rem",
        "space-10": "3.5rem",
        "space-12": "4.5rem",
      },
    },
  },
  plugins: [
    // Açık tema değişkenleri kök varsayılanı olarak da tanımlanır (ThemeProvider dışında kalan ağaçlar için yedek)
    ({ addBase }) => addBase({ ":root": tokens.toCssVariables(tokens.colors) }),
  ],
};
