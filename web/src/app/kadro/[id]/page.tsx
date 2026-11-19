import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SectionTitle } from "~/components/site";
import { LINE_LABELS, PLAYERS } from "@/mocks/players";
import { formatNumber } from "@/utils/format";

/** Bir maçın süresi (dakika); "maç başına süre" çubuğunun tam dolu hâli */
const FULL_MATCH = 90;

/** Oyuncu sayfaları derleme sırasında üretilir (veri sabit) */
export function generateStaticParams() {
  return PLAYERS.map((player) => ({ id: player.id }));
}

export async function generateMetadata({ params }: PageProps<"/kadro/[id]">): Promise<Metadata> {
  const { id } = await params;
  const player = PLAYERS.find((p) => p.id === id);
  if (!player) return {};
  const name = player.full_name ?? player.name;
  return { title: name, description: `${name} · ${player.position} · Batman Petrolspor 2026-27 kadrosu.` };
}

/** Oranlı çubuk: solda etiket, sağda değer, altında dolgu (0-1 arası oran) */
function RatioBar({ label, text, ratio }: { label: string; text: string; ratio: number }) {
  const percent = Math.max(3, Math.min(100, Math.round(ratio * 100)));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span>{label}</span>
        <span className="tabular font-bold">{text}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-mono-fillStrong" role="img" aria-label={`${label}: ${text}`}>
        <div className="h-2 rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/**
 * Oyuncu sayfası: imza gradyan üstünde iri forma numarası, ad, mevki, yaş ve uyruk; altında bu sezonun özeti
 * (maç, ilk 11, dakika), sezon performansı çubukları ve aynı hattaki oyuncular.
 *
 * VERİ: Kaynakta yalnız maç, ilk 11 ve dakika var. Gol, asist ve kart verisi yoktur; uydurulmaz. Oyuncu fotoğrafı
 * da yoktur (görsel hakları). Mobil uygulamadaki oyuncu sayfasıyla aynı veri ve aynı hesaplar kullanılır.
 */
export default async function PlayerPage({ params }: PageProps<"/kadro/[id]">) {
  const { id } = await params;
  const player = PLAYERS.find((p) => p.id === id);
  if (!player) notFound();

  const name = player.full_name ?? player.name;
  const mostMinutes = Math.max(1, ...PLAYERS.map((p) => p.minutes));
  const minutesRank = PLAYERS.filter((p) => p.minutes > player.minutes).length + 1;
  const sameLine = PLAYERS.filter((p) => p.line === player.line && p.id !== player.id).sort((a, b) => b.minutes - a.minutes);
  const played = player.appearances > 0;
  const fromBench = player.appearances - player.starts;
  const perMatch = played ? Math.round(player.minutes / player.appearances) : 0;
  const chips = [LINE_LABELS[player.line], player.age ? `${player.age} yaş` : null, player.nationality].filter(Boolean);
  const stats = [
    { value: player.appearances, label: "Maç" },
    { value: player.starts, label: "İlk 11" },
    { value: player.minutes, label: "Dakika" },
  ];

  return (
    <>
      <section className="bg-signature relative isolate overflow-hidden rounded-b-block">
        {/* Arkadaki iri forma numarası: yalnız süs */}
        <p aria-hidden className="heading pointer-events-none absolute -right-4 -top-10 -z-10 select-none text-[52vw] leading-none text-white/10 md:text-[26rem]">
          {player.shirt_number}
        </p>
        <Container className="pb-10 pt-10 md:pb-14 md:pt-14">
          <nav aria-label="Sayfa yolu" className="text-sm text-white/80">
            <Link href="/kadro" className="font-medium hover:text-white">
              Kadro
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <span>{LINE_LABELS[player.line]}</span>
          </nav>
          <p className="heading mt-6 text-7xl text-white md:text-9xl">{player.shirt_number}</p>
          <h1 className="heading mt-2 text-5xl text-white md:text-7xl">{name}</h1>
          <p className="mt-2 text-base text-white/85">{player.position}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
                {chip}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="reveal mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="heading mb-5 text-3xl md:text-4xl">Bu sezon</h2>
          <dl className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-box bg-mono-fill p-5 text-center">
                <dd className="heading tabular text-4xl md:text-5xl">{formatNumber(stat.value)}</dd>
                <dt className="mt-1 text-xs text-ink-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="heading mb-5 text-3xl md:text-4xl">Sezon performansı</h2>
          {played ? (
            <div className="space-y-5 rounded-box bg-mono-fill p-6">
              <RatioBar label="Sahada kalma süresi" text={`${formatNumber(player.minutes)} dk · takımda ${minutesRank}.`} ratio={player.minutes / mostMinutes} />
              <RatioBar label="İlk 11'de başlama" text={`${player.starts} / ${player.appearances} maç`} ratio={player.starts / player.appearances} />
              <RatioBar label="Maç başına süre" text={`${perMatch} dk`} ratio={perMatch / FULL_MATCH} />
              {fromBench > 0 ? <p className="text-xs text-ink-muted">{fromBench} maçta oyuna sonradan girdi.</p> : null}
            </div>
          ) : (
            <div className="rounded-box bg-mono-fill p-6">
              <p className="font-medium">Bu sezon henüz forma giymedi</p>
              <p className="mt-1 text-sm text-ink-muted">İlk maçına çıktığında istatistikleri burada görünecek.</p>
            </div>
          )}
          <p className="mt-3 text-xs text-ink-muted">Sayılar 14. hafta sonu itibarıyladır. Gol ve asist bilgisi canlı veri bağlanınca eklenecek.</p>
        </div>
      </Container>

      {sameLine.length ? (
        <Container className="reveal mt-16">
          <SectionTitle title={LINE_LABELS[player.line]} href="/kadro" linkLabel="Tüm kadro" />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {sameLine.map((other) => (
              <li key={other.id}>
                <Link href={`/kadro/${other.id}`} className="relative block h-full overflow-hidden rounded-box bg-mono-fill p-5 transition-transform duration-300 hover:-translate-y-1">
                  <span aria-hidden className="heading pointer-events-none absolute -right-1 -top-3 text-8xl text-surface-muted">
                    {other.shirt_number}
                  </span>
                  <p className="heading relative text-4xl text-brand-strong">{other.shirt_number}</p>
                  <p className="relative mt-6 text-base font-semibold">{other.full_name ?? other.name}</p>
                  <p className="relative text-xs text-ink-secondary">{other.position}</p>
                  <p className="relative mt-3 text-xs text-ink-muted">
                    {other.appearances} maç · {other.minutes} dk
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
