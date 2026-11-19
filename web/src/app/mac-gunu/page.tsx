import type { Metadata } from "next";
import Link from "next/link";
import { TeamBadge } from "~/components/match";
import { Container } from "~/components/site";
import { MATCH_DAY, TICKET_STEPS, TICKET_URL } from "@/mocks/matchday";
import { MATCHES } from "@/mocks/matches";
import { getTeam } from "@/mocks/teams";
import { formatMatchDay, formatTime, relativeBefore, timeBefore } from "@/utils/format";

export const metadata: Metadata = { title: "Maç Günü", description: "Batman Petrolspor iç saha maçı için maç günü rehberi: günün akışı, stada yol tarifi, hava durumu ve bilet." };

/**
 * Maç Günü rehberi (sıradaki iç saha maçı) ve bilet. Mobil uygulamadaki "Maç Günü" ve "Bilet ve Kombine"
 * ekranlarının tek sayfalık karşılığı; aynı veriyi kullanır (`mocks/matchday.ts`).
 *
 * DEMO SINIRLARI: akış saatleri örnektir (kulüp maç haftasında duyurur), hava durumu demo veridir. Sitede bilet
 * SATILMAZ; ziyaretçi resmi satış sitesine yönlendirilir. Yol tarifi harita sitesini yeni sekmede açar.
 */
export default function MatchDayPage() {
  const match = MATCHES.find((m) => m.id === MATCH_DAY.match_id);
  if (!match) {
    return (
      <Container className="mt-16">
        <h1 className="heading text-5xl">Maç Günü</h1>
        <p className="mt-4 text-ink-secondary">Sıradaki iç saha maçı belli olunca rehber burada açılır.</p>
        <Link href="/maclar" className="mt-6 inline-block rounded-full bg-mono-solid px-6 py-3 text-sm font-semibold text-mono-onSolid">
          Fikstüre git
        </Link>
      </Container>
    );
  }

  const { stadium, steps, weather, entry_tips } = MATCH_DAY;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stadium.maps_query)}`;

  return (
    <>
      <section className="bg-signature rounded-b-block">
        <Container className="pb-10 pt-12 md:pb-14 md:pt-16">
          <p className="text-sm font-medium text-white/85">
            {match.competition} · {match.week}. hafta
          </p>
          <h1 className="heading mt-2 text-5xl text-white md:text-7xl">Maç Günü</h1>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <TeamBadge teamId={match.home_team_id} size={56} onBrand />
            <p className="heading tabular text-6xl text-white md:text-8xl">{match.time_tbd ? "—:—" : formatTime(match.kickoff_at)}</p>
            <TeamBadge teamId={match.away_team_id} size={56} onBrand />
          </div>
          <p className="mt-3 text-base font-medium text-white">
            {getTeam(match.home_team_id).name} – {getTeam(match.away_team_id).name}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">{formatMatchDay(match.kickoff_at)}</li>
            <li className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">{stadium.name}</li>
          </ul>
        </Container>
      </section>

      <Container className="reveal mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="akis">
          <h2 id="akis" className="heading mb-5 text-3xl md:text-4xl">
            Günün akışı
          </h2>
          <ol className="rounded-box bg-mono-fill p-6">
            {steps.map((step, i) => {
              const kickoff = step.minutes_before === 0;
              const last = i === steps.length - 1;
              return (
                <li key={step.key} className="flex gap-4">
                  <span className={`tabular w-24 shrink-0 pt-0.5 text-right text-sm ${kickoff ? "font-bold text-brand-strong" : "font-medium"}`}>
                    {match.time_tbd ? relativeBefore(step.minutes_before) : timeBefore(match.kickoff_at, step.minutes_before)}
                  </span>
                  <span className="flex flex-col items-center" aria-hidden>
                    <span className={`mt-1.5 h-3 w-3 rounded-full ${kickoff ? "bg-brand" : "bg-mono-solid"}`} />
                    {last ? null : <span className="mt-1 w-0.5 flex-1 bg-mono-line" />}
                  </span>
                  <span className={last ? "" : "pb-5"}>
                    <span className="block text-sm font-medium">{step.label}</span>
                    {step.note ? <span className="block text-xs text-ink-muted">{step.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-ink-muted">Örnek akış. Kesin saatleri kulüp maç haftasında duyurur.</p>
        </section>

        <div className="space-y-10">
          <section aria-labelledby="ulasim">
            <h2 id="ulasim" className="heading mb-5 text-3xl md:text-4xl">
              Stada ulaşım
            </h2>
            <div className="rounded-box bg-mono-fill p-6">
              <p className="text-lg font-semibold">{stadium.name}</p>
              <p className="mt-1 text-sm text-ink-secondary">{stadium.city} · Maç saatine yakın çevre yollar yoğunlaşır, erken çık.</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-full bg-mono-solid px-6 py-3 text-sm font-semibold text-mono-onSolid hover:opacity-90">
                Yol tarifi al
              </a>
            </div>
          </section>

          <section aria-labelledby="hava">
            <h2 id="hava" className="heading mb-5 text-3xl md:text-4xl">
              Hava durumu
            </h2>
            <div className="flex items-center justify-between gap-4 rounded-box bg-mono-fill p-6">
              <div>
                <p className="text-lg font-semibold">{weather.condition}</p>
                <p className="mt-1 text-sm text-ink-secondary">
                  Yağış %{weather.rain_chance} · Rüzgâr {weather.wind_kmh} km/sa
                </p>
              </div>
              <p className="heading tabular text-6xl" aria-label={`${weather.temp_c} derece`}>
                {weather.temp_c}°
              </p>
            </div>
            <p className="mt-3 text-xs text-ink-muted">Demo veri. Yayında maç saatine göre hava servisinden gelir.</p>
          </section>
        </div>
      </Container>

      <Container className="reveal mt-16 grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <section id="bilet" aria-labelledby="bilet-baslik" className="scroll-mt-28">
          <h2 id="bilet-baslik" className="heading mb-5 text-3xl md:text-4xl">
            Bilet ve kombine
          </h2>
          <div className="rounded-box bg-mono-fill p-6">
            <p className="text-sm text-ink-secondary">
              Bu sitede bilet satılmaz; biletler resmi satış sitesinden alınır. Kombine, sezonun bütün iç saha lig maçlarına aynı koltuktan girmeni sağlar; satış dönemini ve fiyatları kulüp duyurur.
            </p>
            <ol className="mt-6 space-y-5">
              {TICKET_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mono-solid text-lg text-mono-onSolid">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-medium">{step.title}</span>
                    <span className="block text-xs text-ink-secondary">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={TICKET_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-full bg-mono-solid px-7 py-3.5 text-sm font-semibold text-mono-onSolid hover:opacity-90">
              Passo'da bilet al
            </a>
          </div>
          <p className="mt-3 text-xs text-ink-muted">Fiyatlar ve satış tarihleri Passo'da ve kulübün duyurularında yer alır.</p>
        </section>

        <section aria-labelledby="yaninda">
          <h2 id="yaninda" className="heading mb-5 text-3xl md:text-4xl">
            Yanında olsun
          </h2>
          <ul className="space-y-3 rounded-box bg-mono-fill p-6">
            {entry_tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-box bg-mono-fill p-6">
            <p className="text-sm font-medium">İlk 11 açıklanınca haber al</p>
            <p className="mt-1 text-sm text-ink-secondary">Kadro bildirimi, skor tahmini ve tribün modu taraftar uygulamasında.</p>
            <Link href="/uygulama" className="mt-4 inline-block rounded-full bg-mono-fillStrong px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-sunken">
              Uygulamayı gör
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
