import type { Metadata } from "next";
import { PageHero } from "~/components/cards";
import { MatchRow, NextMatchCard, StandingsTable } from "~/components/match";
import { Container, SectionTitle } from "~/components/site";
import { rankStandings } from "@/lib/standings";
import { MATCHES } from "@/mocks/matches";
import { STANDINGS } from "@/mocks/standings";
import type { Match } from "@/types";
import { formatMonthYear } from "@/utils/format";

export const metadata: Metadata = { title: "Maçlar", description: "Batman Petrolspor 2026-27 fikstürü, sonuçlar ve Trendyol 1. Lig puan durumu." };

/** Maçları aya göre gruplar */
function byMonth(matches: Match[]) {
  const groups: { title: string; items: Match[] }[] = [];
  for (const match of matches) {
    const title = formatMonthYear(match.kickoff_at);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(match);
    else groups.push({ title, items: [match] });
  }
  return groups;
}

function MonthList({ matches }: { matches: Match[] }) {
  return (
    <div className="space-y-6">
      {byMonth(matches).map((group) => (
        <section key={group.title}>
          <h3 className="mb-3 text-xs font-medium text-ink-muted">{group.title}</h3>
          <ul className="space-y-2.5">
            {group.items.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Maçlar: sıradaki maç, yaklaşan ve oynanan maçlar, tam puan durumu. */
export default function MatchesPage() {
  const upcoming = MATCHES.filter((m) => m.status !== "finished");
  const played = MATCHES.filter((m) => m.status === "finished").reverse();
  const ranked = rankStandings(STANDINGS);

  return (
    <>
      <PageHero title="Maçlar" text="Trendyol 1. Lig 2026-27 sezonu: 38 haftalık fikstür, sonuçlar ve puan durumu." />
      <Container className="reveal mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="yaklasan">
            <h2 id="yaklasan" className="heading mb-5 text-3xl md:text-4xl">
              Yaklaşan maçlar
            </h2>
            <MonthList matches={upcoming} />
          </section>
          <section aria-labelledby="oynanan">
            <h2 id="oynanan" className="heading mb-5 text-3xl md:text-4xl">
              Oynanan maçlar
            </h2>
            <MonthList matches={played} />
          </section>
        </div>
        <aside className="min-w-0 space-y-10 lg:sticky lg:top-24 lg:self-start">
          {upcoming[0] ? (
            <div>
              <SectionTitle title="Sıradaki maç" />
              <NextMatchCard match={upcoming[0]} />
            </div>
          ) : null}
          <div id="puan-durumu" className="scroll-mt-24">
            <SectionTitle title="Puan durumu" />
            <StandingsTable rows={ranked} />
            <p className="mt-3 text-xs text-ink-muted">14. hafta sonu · Kaynak: petrolspor.com</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
