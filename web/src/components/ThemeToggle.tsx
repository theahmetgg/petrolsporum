"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Seçimin saklandığı anahtar. `layout.tsx` içindeki açılış betiği de aynı anahtarı okur. */
export const THEME_STORAGE_KEY = "petrolspor-theme";

/**
 * Sayfa çizilmeden önce çalışan betik (`<head>` içinde): saklı tema seçimini `<html data-theme>` olarak yazar.
 * Böylece açık temayı seçen ziyaretçi sayfa yüklenirken önce koyu zemini görmez.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * Tema düğmesi: koyu ↔ açık. Seçim tarayıcıda saklanır. Site varsayılan olarak koyu açılır
 * (Petrolspor koyu tema önceliklidir; mobil uygulamayla aynı karar).
 */
export function ThemeToggle() {
  // Sunucuda tema bilinmez; düğmenin simgesi sayfa açılınca belirlenir
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Saklama kapalıysa seçim yalnız bu sayfa için geçerli olur
    }
    setTheme(next);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Koyu temaya geç" : "Açık temaya geç"}
      title={isLight ? "Koyu tema" : "Açık tema"}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mono-fillStrong text-ink hover:bg-surface-sunken"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {isLight ? (
          // Ay: koyu temaya geçer
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          // Güneş: açık temaya geçer
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
