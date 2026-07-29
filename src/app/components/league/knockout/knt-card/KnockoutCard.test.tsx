import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

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

import KnockoutCard from "./KnockoutCard";
import { LeagueFixturesMatch } from "open-football-project-core";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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
    getFormattedDate: (date: string, format: string) => "26 Dec",
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
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  borderRadius: {
    sm: 8,
    lg: 16,
  },
  borders: {
    hairline: 0.5,
    thin: 1,
    thick: 2,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  },
  sizes: {
    matchButtonMinWidth: 72,
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

describe("KnockoutCard", () => {
  const baseMatch: LeagueFixturesMatch = {
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
  };

  it("renders the knockout card", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByTestId("knockout-card")).toBeOnTheScreen();
  });

  it("renders team names", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByText("Team A")).toBeOnTheScreen();
    expect(screen.getByText("Team B")).toBeOnTheScreen();
  });

  it("renders score for finished match", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByText("2 – 1")).toBeOnTheScreen();
  });

  it("renders placeholder score for upcoming match", () => {
    const upcomingMatch = { ...baseMatch, isFinished: false };
    render(<KnockoutCard match={upcomingMatch} />);
    expect(screen.getByText("–")).toBeOnTheScreen();
  });

  it("renders formatted date", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByText("26 Dec")).toBeOnTheScreen();
  });

  it("renders home team with correct testID", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByTestId("home-team-name")).toBeOnTheScreen();
  });

  it("renders away team with correct testID", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.getByTestId("away-team-name")).toBeOnTheScreen();
  });

  it("shows winner trophy icon when home team wins", () => {
    const homeWinMatch = { ...baseMatch, homeTeamScore: 3, awayTeamScore: 1 };
    render(<KnockoutCard match={homeWinMatch} />);
    expect(screen.getByTestId("home-winner-icon")).toBeOnTheScreen();
    expect(screen.queryByTestId("away-winner-icon")).not.toBeOnTheScreen();
  });

  it("shows winner trophy icon when away team wins", () => {
    const awayWinMatch = { ...baseMatch, homeTeamScore: 1, awayTeamScore: 2 };
    render(<KnockoutCard match={awayWinMatch} />);
    expect(screen.getByTestId("away-winner-icon")).toBeOnTheScreen();
    expect(screen.queryByTestId("home-winner-icon")).not.toBeOnTheScreen();
  });

  it("does not show trophy icon for draws", () => {
    const drawMatch = { ...baseMatch, homeTeamScore: 1, awayTeamScore: 1 };
    render(<KnockoutCard match={drawMatch} />);
    expect(screen.queryByTestId("home-winner-icon")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("away-winner-icon")).not.toBeOnTheScreen();
  });

  it("shows live icon when match is live", () => {
    const liveMatch = { ...baseMatch, isLiveNow: true, isFinished: false };
    render(<KnockoutCard match={liveMatch} />);
    expect(screen.getByTestId("card-live-icon")).toBeOnTheScreen();
  });

  it("does not show live icon when match is not live", () => {
    render(<KnockoutCard match={baseMatch} />);
    expect(screen.queryByTestId("card-live-icon")).not.toBeOnTheScreen();
  });

  it("does not show trophy icon for upcoming matches", () => {
    const upcomingMatch = { ...baseMatch, isFinished: false, homeTeamScore: 0, awayTeamScore: 0 };
    render(<KnockoutCard match={upcomingMatch} />);
    expect(screen.queryByTestId("home-winner-icon")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("away-winner-icon")).not.toBeOnTheScreen();
  });
});

