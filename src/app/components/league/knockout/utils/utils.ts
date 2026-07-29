import { LeagueFixtureRound, LeagueFixturesMatch } from "open-football-project-core";
import { LEAGUE_CUP_ROUNDS, normalizeLeagueRound } from "open-football-project-core";

export const flatKnockoutMatches = (round: LeagueFixtureRound) =>
  round.days.flatMap((day) => day.matches);

export const buildRoundsInOrder = (rounds: LeagueFixtureRound[]) =>
  rounds
    .map((round) => ({ round, key: normalizeLeagueRound(round.name) }))
    .filter((it) => LEAGUE_CUP_ROUNDS.includes(it.key))
    .sort(
      (a, b) =>
        LEAGUE_CUP_ROUNDS.indexOf(a.key) - LEAGUE_CUP_ROUNDS.indexOf(b.key)
    )
    .map((it) => it.round);

export const groupByTie = (matches: LeagueFixturesMatch[]) => {
  const groups: LeagueFixturesMatch[][] = [];

  matches.forEach((match) => {
    const group = groups.find((g) =>
      g.some(
        (m) =>
          (m.homeTeamId === match.homeTeamId &&
            m.awayTeamId === match.awayTeamId) ||
          (m.homeTeamId === match.awayTeamId &&
            m.awayTeamId === match.homeTeamId)
      )
    );

    if (group) {
      group.push(match);
    } else {
      groups.push([match]);
    }
  });

  return groups.map((g) =>
    g.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
};
