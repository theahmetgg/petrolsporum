import Image from "next/image";
import Link from "next/link";
import { CLUB } from "@/mocks/club";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/maclar", label: "Maçlar" },
  { href: "/kadro", label: "Kadro" },
  { href: "/haberler", label: "Haberler" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/kulup", label: "Kulüp" },
  { href: "/uygulama", label: "Uygulama" },
] as const;

/** Sayfa genişliği: içerik en çok 1152 px, yanlarda ekran boşluğu */
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>;
}

/** Bölüm başlığı: dar büyük harfli başlık + isteğe bağlı "Tümü" bağlantısı */
export function SectionTitle({ title, href, linkLabel = "Tümü" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="heading text-3xl md:text-4xl">{title}</h2>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-ink-secondary hover:text-ink">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}

/**
 * Üst bar: solda yazı logosu, ortada menü, sağda mağaza. Dar ekranda menü logonun altında yana kaydırılan
 * bir şerit olur (açılır menü yok: tüm bölümler tek dokunuşta).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-mono-line bg-surface-bg/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Batman Petrolspor ana sayfa" className="flex shrink-0 items-center gap-3">
          <Image src="/club/crest.png" alt="" width={40} height={40} priority />
          <span className="hidden sm:block">
            <Image src="/club/logo-white.png" alt="Batman Petrolspor" width={120} height={36} priority className="logo-on-dark" />
            <Image src="/club/logo-dark.png" alt="Batman Petrolspor" width={120} height={36} priority className="logo-on-light" />
          </span>
        </Link>
        <nav aria-label="Ana menü" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-mono-fill hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link href="/magaza" className="rounded-full bg-mono-solid px-5 py-2.5 text-sm font-semibold text-mono-onSolid hover:opacity-90">
            Mağaza
          </Link>
        </div>
      </Container>
      <nav aria-label="Ana menü" className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 rounded-full bg-mono-fill px-4 py-2 text-sm font-medium text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-mono-line">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/club/logo-white.png" alt="Batman Petrolspor" width={160} height={48} className="logo-on-dark" />
          <Image src="/club/logo-dark.png" alt="" width={160} height={48} className="logo-on-light" />
          <p className="mt-4 max-w-sm text-sm text-ink-secondary">
            {CLUB.legal_name}, {CLUB.founded} yılında Batman&apos;da kurulmuş profesyonel bir futbol kulübüdür.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Site</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">İletişim</h2>
          <address className="mt-3 text-sm not-italic text-ink-secondary">
            {CLUB.address}
            <br />
            {CLUB.stadium}
          </address>
        </div>
      </Container>
      <Container className="border-t border-mono-line py-5 text-xs text-ink-muted">
        © 2026 {CLUB.legal_name} · Tasarım önerisi (demo). Veriler: petrolspor.com, 18 Kasım 2026.
      </Container>
    </footer>
  );
}
