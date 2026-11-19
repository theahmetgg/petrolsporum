import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "~/components/cards";
import { Container } from "~/components/site";
import { HEAD_COACH, LINE_LABELS, PLAYERS } from "@/mocks/players";
import type { PlayerLine } from "@/types";

export const metadata: Metadata = { title: "Kadro", description: "Batman Petrolspor 2026-27 A takım kadrosu." };

const LINES: PlayerLine[] = ["GK", "DEF", "MID", "FWD"];

/**
 * Kadro: hatlara göre oyuncu kartları. Oyuncu fotoğrafı yoktur (görsel hakları); iri forma numarası kullanılır.
 * Her kart oyuncunun sayfasına götürür (`/kadro/[id]`).
 */
export default function SquadPage() {
  return (
    <>
      <PageHero title="Kadro" text={`2026-27 sezonu A takımı · Teknik direktör: ${HEAD_COACH.name}`} />
      <Container className="reveal mt-10 space-y-12">
        {LINES.map((line) => {
          const players = PLAYERS.filter((p) => p.line === line).sort((a, b) => a.shirt_number - b.shirt_number);
          return (
            <section key={line} aria-labelledby={`hat-${line}`}>
              <h2 id={`hat-${line}`} className="heading mb-5 text-3xl md:text-4xl">
                {LINE_LABELS[line]}
              </h2>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {players.map((player) => (
                  <li key={player.id}>
                    <Link href={`/kadro/${player.id}`} className="group relative block h-full overflow-hidden rounded-box bg-mono-fill p-5 transition-transform duration-300 hover:-translate-y-1">
                    <span aria-hidden className="heading pointer-events-none absolute -right-1 -top-3 text-8xl text-surface-muted">
                      {player.shirt_number}
                    </span>
                    <p className="heading relative text-4xl text-brand-strong">{player.shirt_number}</p>
                    <p className="relative mt-6 text-base font-semibold">{player.full_name ?? player.name}</p>
                    <p className="relative text-xs text-ink-secondary">{player.position}</p>
                    <p className="relative mt-3 text-xs text-ink-muted">
                      {[player.age ? `${player.age} yaş` : null, player.nationality].filter(Boolean).join(" · ")}
                    </p>
                    <p className="relative mt-1 text-xs text-ink-muted">
                      {player.appearances} maç · {player.minutes} dk
                    </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <p className="text-xs text-ink-muted">Maç ve dakika sayıları 14. hafta sonu itibarıyladır.</p>
      </Container>
    </>
  );
}
