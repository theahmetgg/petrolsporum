import Image from "next/image";
import type { Match, RankedStanding } from "@/types";
import { getTeam, OWN_TEAM_ID } from "@/mocks/teams";
import { ZONES } from "@/mocks/standings";
import { dayBadge, formatMatchDay, formatTime } from "@/utils/format";
import { Countdown } from "./Countdown";

/**
 * Takım rozeti. Kendi kulübümüzde gerçek arma; rakiplerde üç harfli kodla nötr daire
 * (rakip armaları lisanslıdır, izin alınmadan kullanılmaz).
 */
export function TeamBadge({ teamId, size = 40, onBrand = false }: { teamId: string; size?: number; onBrand?: boolean }) {
  const team = getTeam(teamId);
  if (team.is_own) return <Image src="/club/crest.png" alt={`${team.name} arması`} width={size} height={size} className="shrink-0" />;
  return (
    <span
      role="img"
      aria-label={team.name}
      className={`heading inline-flex shrink-0 items-center justify-center rounded-full ${onBrand ? "border border-white/40 bg-white/20 text-white" : "bg-mono-fillStrong text-ink"}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {team.code}
    </span>
  );
}

/** Kendi takımımız açısından sonuç */
export function ownResult(match: Match): "G" | "B" | "M" | null {
  if (match.home_score == null || match.away_score == null) return null;
  const own = match.home_team_id === OWN_TEAM_ID ? match.home_score - match.away_score : match.away_score - match.home_score;
  return own > 0 ? "G" : own === 0 ? "B" : "M";
}

const RESULT_COLOR = { G: "text-success", B: "text-ink-muted", M: "text-danger" } as const;

/** Sıradaki maç kartı: imza gradyan zeminde arma - saat - arma ve geri sayım */
export function NextMatchCard({ match }: { match: Match }) {
  return (
    <div className="bg-signature rounded-hero p-5 shadow-2xl md:p-6">
      <p className="text-xs font-medium text-white/80">
        {match.competition} · {match.week}. hafta
      </p>
      <div className="mt-4 flex items-center">
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamBadge teamId={match.home_team_id} size={72} onBrand />
          <span className="text-center text-sm font-medium text-white">{getTeam(match.home_team_id).short_name}</span>
        </div>
        <div className="min-w-28 text-center">
          <div className="heading text-4xl text-white md:text-5xl">{match.time_tbd ? "—:—" : formatTime(match.kickoff_at)}</div>
          <div className="mt-1 text-xs text-white/80">{formatMatchDay(match.kickoff_at)}</div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <TeamBadge teamId={match.away_team_id} size={72} onBrand />
          <span className="text-center text-sm font-medium text-white">{getTeam(match.away_team_id).short_name}</span>
        </div>
      </div>
      <div className="mt-5">
        <Countdown kickoffAt={match.kickoff_at} />
      </div>
      {match.venue ? <p className="mt-4 text-center text-xs text-white/80">{match.venue}</p> : null}
    </div>
  );
}

/** Fikstür satırı: gün kutusu, iki takım alt alta (skorla), sağda sonuç harfi ya da saat */
export function MatchRow({ match }: { match: Match }) {
  const badge = dayBadge(match.kickoff_at);
  const result = ownResult(match);
  const homeWon = match.home_score != null && match.away_score != null && match.home_score > match.away_score;
  const awayWon = match.home_score != null && match.away_score != null && match.away_score > match.home_score;
  const line = (teamId: string, score: number | null, bold: boolean) => (
    <div className="flex items-center gap-2">
      <TeamBadge teamId={teamId} size={24} />
      <span className={`flex-1 truncate text-sm ${bold ? "font-semibold" : ""}`}>{getTeam(teamId).name}</span>
      {score != null ? <span className={`tabular text-sm ${bold ? "font-semibold" : ""}`}>{score}</span> : null}
    </div>
  );
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-box bg-mono-fill p-4 sm:gap-4">
      <div className="w-11 text-center">
        <div className="heading text-2xl">{badge.day}</div>
        <div className="text-[11px] text-ink-muted">{badge.month}</div>
      </div>
      <div className="h-10 w-px bg-mono-line" />
      <div className="min-w-0 flex-1 space-y-1.5">
        {line(match.home_team_id, match.home_score, homeWon || (match.home_score == null && match.home_team_id === OWN_TEAM_ID))}
        {line(match.away_team_id, match.away_score, awayWon || (match.away_score == null && match.away_team_id === OWN_TEAM_ID))}
      </div>
      <div className="w-[4.5rem] shrink-0 text-right">
        {result ? (
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-mono-fillStrong text-xs font-bold ${RESULT_COLOR[result]}`} aria-label={result === "G" ? "Galibiyet" : result === "B" ? "Beraberlik" : "Mağlubiyet"}>
            {result}
          </span>
        ) : (
          <span className="text-[11px] font-medium leading-tight text-ink-secondary">{match.time_tbd ? "Saat açıklanacak" : formatTime(match.kickoff_at)}</span>
        )}
      </div>
    </li>
  );
}

/** Son maçlar şeridi: rakip, skor ve sonuç harfi olan küçük kutular */
export function ResultChip({ match }: { match: Match }) {
  const result = ownResult(match)!;
  const home = match.home_team_id === OWN_TEAM_ID;
  const opponent = getTeam(home ? match.away_team_id : match.home_team_id);
  return (
    <li className="flex min-w-44 flex-1 items-center gap-3 rounded-box bg-mono-fill p-3">
      <TeamBadge teamId={opponent.id} size={36} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{opponent.short_name}</div>
        <div className="text-xs text-ink-muted">
          {home ? "İç saha" : "Deplasman"} · {dayBadge(match.kickoff_at).day} {dayBadge(match.kickoff_at).month}
        </div>
      </div>
      <div className="text-right">
        <div className="heading tabular text-xl">{home ? `${match.home_score}-${match.away_score}` : `${match.away_score}-${match.home_score}`}</div>
        <div className={`text-xs font-bold ${RESULT_COLOR[result]}`}>{result}</div>
      </div>
    </li>
  );
}

/** Puan durumu tablosu. `limit` verilirse yalnız ilk satırlar ve (dışarıda kalıyorsa) kendi takımımız gösterilir. */
export function StandingsTable({ rows, limit }: { rows: RankedStanding[]; limit?: number }) {
  const shown = limit ? rows.filter((r) => r.rank <= limit || r.team_id === OWN_TEAM_ID) : rows;
  const zone = (rank: number) => (rank <= ZONES.promotion ? "bg-success" : rank <= ZONES.playoff ? "bg-info" : rank >= ZONES.relegationFrom ? "bg-danger" : "bg-transparent");
  return (
    <div className="overflow-x-auto rounded-box bg-mono-fill p-2">
      <table className="w-full text-sm">
        <caption className="sr-only">Trendyol 1. Lig puan durumu</caption>
        <thead>
          <tr className="text-[11px] text-ink-muted">
            <th scope="col" className="w-10 py-2 text-center font-medium">
              #
            </th>
            <th scope="col" className="py-2 text-left font-medium">
              TAKIM
            </th>
            {["O", "G", "B", "M", "AV", "P"].map((c) => (
              <th key={c} scope="col" className={`w-9 py-2 text-center font-medium ${c === "G" || c === "B" || c === "M" ? "hidden sm:table-cell" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => {
            const own = row.team_id === OWN_TEAM_ID;
            return (
              <tr key={row.team_id} className={own ? "bg-brand-soft font-semibold" : ""}>
                <td className="rounded-l-xl py-2.5">
                  <span className="flex items-center gap-2">
                    <span className={`h-5 w-[3px] rounded ${zone(row.rank)}`} />
                    <span className="tabular w-5 text-center text-xs">{row.rank}</span>
                  </span>
                </td>
                <th scope="row" className="py-2.5 text-left font-[inherit]">
                  <span className="flex items-center gap-2">
                    <TeamBadge teamId={row.team_id} size={22} />
                    <span className="truncate">{getTeam(row.team_id).short_name}</span>
                  </span>
                </th>
                <td className="tabular text-center text-xs text-ink-secondary">{row.played}</td>
                <td className="tabular hidden text-center text-xs text-ink-secondary sm:table-cell">{row.won}</td>
                <td className="tabular hidden text-center text-xs text-ink-secondary sm:table-cell">{row.drawn}</td>
                <td className="tabular hidden text-center text-xs text-ink-secondary sm:table-cell">{row.lost}</td>
                <td className="tabular text-center text-xs text-ink-secondary">{row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}</td>
                <td className="tabular rounded-r-xl text-center text-sm font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!limit ? (
        <div className="flex flex-wrap gap-4 px-2 pb-1 pt-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-[3px] rounded bg-success" /> Süper Lig
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-[3px] rounded bg-info" /> Play-off
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-[3px] rounded bg-danger" /> Küme düşme
          </span>
        </div>
      ) : null}
    </div>
  );
}
