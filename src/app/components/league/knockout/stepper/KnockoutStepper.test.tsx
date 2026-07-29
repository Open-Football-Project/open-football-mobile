import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react-native";

jest.mock("../../../../navigation/RootNavigator", () => ({
  Routes: {
    LANDING: "landing",
    ALL_LEAGUES: "all-leagues",
    GAME: "game",
    GUESS_LEAGUE_TEAM: "guess-league-team",
    GUESS_TEAM_PLAYER: "guess-team-player",
    LEAGUE: "league",
    LEAGUE_SPECIAL_ARG: "league-special-arg",
    LEAGUE_SPECIAL_GROUPS: "league-special-groups",
    LEAGUE_SPECIAL_KNOCKOUT: "league-special-knockout",
    LIVE: "live",
    MATCH_DETAILS: "match-details",
    MATCHES: "matches",
    PLAYER_HISTORY: "player-history",
    TEAM_DETAILS: "team-details",
  },
}));

import KnockoutStepper from "./KnockoutStepper";
import { LeagueFixture } from "open-football-project-core";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock("open-football-project-core", () => {
  const actual = jest.requireActual("open-football-project-core") as any;
  return {
    ...actual,
    normalizeLeagueRound: (name: string) =>
      name.toLowerCase().replace(/\s/g, "-"),
  };
});

jest.mock("../utils/utils", () => ({
  buildRoundsInOrder: (rounds: any) => rounds,
  flatKnockoutMatches: (round: any) =>
    round.days?.flatMap((d: any) => d.matches) || [],
}));

jest.mock("../../../general/logo/Logo", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => <View testID="team-logo" />,
  };
});

jest.mock("../../../general/match-button/MatchButton", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: () => <View testID="match-button" />,
  };
});

jest.mock("../../../../theme", () => ({
  colors: {
    background: {
      card: "#1E1E1E",
      dark: "#121212",
    },
    brand: {
      yellow: "#ffc61a",
      red: "#ff4848",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
  },
  fontWeight: {
    bold: "700",
    semibold: "600",
    medium: "500",
  },
  borderRadius: {
    sm: 8,
    lg: 16,
    md: 12,
  },
  borders: {
    hairline: 0.5,
    thin: 1,
    thick: 2,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
  },
  breakpoints: { tablet: 768, desktop: 1024, tv: 1280 },
}));

jest.mock("../../../../icons/Icons", () => {
  const { Text } = require("react-native");
  return {
    LiveIcon: ({ testID }: any) => <Text testID={testID}>LIVE</Text>,
    TrophyIcon: ({ testID }: any) => <Text testID={testID}>🏆</Text>,
  };
});

describe("KnockoutStepper", () => {
  const fixture: LeagueFixture = {
    currentRoundIndex: 0,
    totalRounds: 2,
    rounds: [
      {
        name: "Quarter-finals",
        days: [
          {
            date: "2025-12-26",
            matches: [
              {
                homeTeamId: 1,
                awayTeamId: 2,
                fixtureRound: "Quarter-finals",
                statusLong: "Finished",
                statusShort: "FT",
                fixtureId: 123,
                homeTeamName: "Team A",
                awayTeamName: "Team B",
                homeTeamLogo: "/logo-a.png",
                awayTeamLogo: "/logo-b.png",
                homeTeamScore: 2,
                awayTeamScore: 1,
                isFinished: true,
                isLiveNow: false,
                date: "2025-12-26T15:00:00Z",
              },
            ],
          },
        ],
      },
      {
        name: "Semi-finals",
        days: [
          {
            date: "2025-12-27",
            matches: [
              {
                homeTeamId: 3,
                awayTeamId: 4,
                fixtureRound: "Semi-finals",
                statusLong: "Not Started",
                statusShort: "NS",
                fixtureId: 124,
                homeTeamName: "Team C",
                awayTeamName: "Team D",
                homeTeamLogo: "/logo-c.png",
                awayTeamLogo: "/logo-d.png",
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false,
                isLiveNow: false,
                date: "2025-12-27T15:00:00Z",
              },
            ],
          },
        ],
      },
    ],
  };

  
  it("renders StepsHeader for round selection", () => {
    render(<KnockoutStepper fixtures={fixture} />);
    const scrollView = screen.getByTestId("knockout-stepper-container");
    expect(scrollView).toBeOnTheScreen();
  });

  it("renders matches for initial active round", () => {
    render(<KnockoutStepper fixtures={fixture} />);
    const cards = screen.getAllByTestId("knockout-card");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("renders at least one card from active round", () => {
    render(<KnockoutStepper fixtures={fixture} />);
    expect(screen.getByText("Team C")).toBeOnTheScreen();
  });

  it("displays round title", () => {
    render(<KnockoutStepper fixtures={fixture} />);
    const titles = screen.getAllByText(/fixtures.semi-finals|Semi-finals/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it("has round title with correct testID", () => {
    render(<KnockoutStepper fixtures={fixture} />);
    expect(screen.getByTestId("round-title")).toBeOnTheScreen();
  });

  it("displays multiple cards in grid layout", () => {
    const fixtureWithMultipleMatches: LeagueFixture = {
      currentRoundIndex: 0,
      totalRounds: 1,
      rounds: [
        {
          name: "Quarter-finals",
          days: [
            {
              date: "2025-12-26",
              matches: [
                {
                  homeTeamId: 1,
                  awayTeamId: 2,
                  fixtureRound: "Quarter-finals",
                  statusLong: "Not Started",
                  statusShort: "NS",
                  fixtureId: 1,
                  homeTeamName: "Team A",
                  awayTeamName: "Team B",
                  homeTeamLogo: "",
                  awayTeamLogo: "",
                  homeTeamScore: 0,
                  awayTeamScore: 0,
                  isFinished: false,
                  isLiveNow: false,
                  date: "2025-12-26T15:00:00Z",
                },
                {
                  homeTeamId: 3,
                  awayTeamId: 4,
                  fixtureRound: "Quarter-finals",
                  statusLong: "Not Started",
                  statusShort: "NS",
                  fixtureId: 2,
                  homeTeamName: "Team C",
                  awayTeamName: "Team D",
                  homeTeamLogo: "",
                  awayTeamLogo: "",
                  homeTeamScore: 0,
                  awayTeamScore: 0,
                  isFinished: false,
                  isLiveNow: false,
                  date: "2025-12-26T17:00:00Z",
                },
              ],
            },
          ],
        },
      ],
    };

    render(<KnockoutStepper fixtures={fixtureWithMultipleMatches} />);
    const cards = screen.getAllByTestId("knockout-card");
    expect(cards.length).toBe(2);
  });
});
