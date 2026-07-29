import { describe, it, expect } from "@jest/globals";
import { flatKnockoutMatches, buildRoundsInOrder, groupByTie } from "./utils";
import { LeagueFixtureRound, LeagueFixturesMatch } from "@matchinsights/core";

jest.mock("@matchinsights/core", () => {
  const actual = jest.requireActual("@matchinsights/core");
  return {
    ...actual,
    LEAGUE_CUP_ROUNDS: [
      "round_of_16",
      "quarter_finals",
      "semi_finals",
      "final",
    ],

    normalizeLeagueRound: (name: string) =>
      name.toLowerCase().replace(/\s+/g, "_").replace("-", "_"),
  };
});

const createMatch = (
  overrides: Partial<LeagueFixturesMatch> = {}
): LeagueFixturesMatch =>
  ({
    fixtureId: Math.random(),
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeamName: "Home",
    awayTeamName: "Away",
    date: "2024-01-01T12:00:00Z",
    isFinished: false,
    fixtureRound: "Quarter-finals",
    ...overrides,
  } as LeagueFixturesMatch);

const createRound = (
  name: string,
  matches: LeagueFixturesMatch[]
): LeagueFixtureRound =>
  ({
    name,
    days: [
      {
        matches,
      },
    ],
  } as LeagueFixtureRound);

describe("flatKnockoutMatches", () => {
  it("flattens matches across all days", () => {
    const round: LeagueFixtureRound = {
      name: "Quarter-finals",
      days: [
        { date: "", matches: [createMatch({ fixtureId: 1 })] },
        { date: "", matches: [createMatch({ fixtureId: 2 })] },
      ],
    };

    const result = flatKnockoutMatches(round);

    expect(result).toHaveLength(2);
    expect(result.map((m) => m.fixtureId)).toEqual([1, 2]);
  });

  it("returns empty array when no days exist", () => {
    const round = {
      name: "Final",
      days: [],
    } as LeagueFixtureRound;

    expect(flatKnockoutMatches(round)).toEqual([]);
  });
});

describe("buildRoundsInOrder", () => {
  it("filters out rounds not in LEAGUE_CUP_ROUNDS", () => {
    const rounds = [
      createRound("Group Stage", []),
      createRound("Quarter Finals", []),
    ];

    const result = buildRoundsInOrder(rounds);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Quarter Finals");
  });

  it("sorts rounds according to LEAGUE_CUP_ROUNDS order", () => {
    const rounds = [
      createRound("Final", []),
      createRound("Round of 16", []),
      createRound("Semi Finals", []),
    ];

    const result = buildRoundsInOrder(rounds);

    expect(result.map((r) => r.name)).toEqual([
      "Round of 16",
      "Semi Finals",
      "Final",
    ]);
  });

  it("returns empty array when no rounds match", () => {
    const rounds = [createRound("Group Stage", [])];

    expect(buildRoundsInOrder(rounds)).toEqual([]);
  });
});

describe("groupByTie", () => {
  it("groups home-away reversed matches into the same tie", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
      }),
      createMatch({
        fixtureId: 2,
        homeTeamId: 2,
        awayTeamId: 1,
      }),
    ];

    const result = groupByTie(matches);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  it("creates separate groups for different ties", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
      }),
      createMatch({
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
      }),
    ];

    const result = groupByTie(matches);

    expect(result).toHaveLength(2);
  });

  it("sorts matches inside a tie by date ascending", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        date: "2024-01-10T12:00:00Z",
      }),
      createMatch({
        fixtureId: 2,
        date: "2024-01-05T12:00:00Z",
        homeTeamId: 2,
        awayTeamId: 1,
      }),
    ];

    const result = groupByTie(matches);

    expect(result[0].map((m) => m.fixtureId)).toEqual([2, 1]);
  });

  it("returns empty array when no matches are provided", () => {
    expect(groupByTie([])).toEqual([]);
  });
});
