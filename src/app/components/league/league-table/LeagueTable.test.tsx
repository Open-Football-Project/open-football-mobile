import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

jest.mock("../../../navigation/RootNavigator", () => ({
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

import { LeagueTable } from "./LeagueTable";
import { LeagueTeamInfo } from "open-football-project-core";

const mockTeams: LeagueTeamInfo[] = [
  {
    rank: 1,
    teamId: 21,
    teamName: "Team One",
    logo: "/logo1.png",
    points: 30,
    played: 12,
    won: 9,
    draw: 3,
    lost: 0,
    goalsFor: 25,
    goalsAgainst: 10,
    form: "WWD",
  },
  {
    rank: 2,
    teamId: 22,
    teamName: "Team Two",
    logo: "/logo2.png",
    points: 28,
    played: 12,
    won: 8,
    draw: 4,
    lost: 0,
    goalsFor: 20,
    goalsAgainst: 8,
    form: "DLW",
  },
];

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, _options?: any) => {
      const translations: Record<string, string> = {
        "leaguestanding.team": "Team",
        "leaguestanding.pts": "PTS",
        "leaguestanding.p": "P",
        "leaguestanding.w": "W",
        "leaguestanding.d": "D",
        "leaguestanding.l": "L",
        "leaguestanding.gf": "GF",
        "leaguestanding.ga": "GA",
        "leaguestanding.form": "Form",
        "common.W": "W",
        "common.D": "D",
        "common.L": "L",
      };
      return translations[key] || key;
    },
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
  };
});

jest.mock("../../general/no-data/NoData", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return () =>
    React.createElement(View, { testID: "no-data" }, "No Data");
});

jest.mock("../../general/logo/Logo", () => {
  const React = require("react");
  const { View } = require("react-native");
  return () =>
    React.createElement(View, {
      testID: "team-logo",
      style: { width: 16, height: 16 },
    });
});

jest.mock("../../../theme", () => ({
  breakpoints: {
    tablet: 768,
    desktop: 1024,
    tv: 1280,
  },
  colors: {
    background: {
      card: "#1E1E1E",
      dark: "#121212",
    },
    brand: {
      green: "#6faa54",
      yellow: "#ffc61a",
      red: "#ff4848",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    overlay: {
      white10: "rgba(255,255,255,0.10)",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
  },
  fontWeight: {
    bold: "700",
  },
  borderRadius: {
    md: 12,
    lg: 16,
  },
  borders: { hairline: 0.5, thin: 1, thick: 2 },
  sizes: {
    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    iconXLarge: 40,
    touchableHeight: 44,
    fullWidth: '100%',
    fullHeight: '100%',
  },
}));

describe("LeagueTable", () => {
  it("renders NoData when teams array is empty", () => {
    render(<LeagueTable teams={[]} />);
    expect(screen.getByTestId("no-data")).toBeOnTheScreen();
  });

  it("renders table headers", () => {
    render(<LeagueTable teams={mockTeams} />);
    expect(screen.getByText("Team")).toBeOnTheScreen();
    expect(screen.getByText("PTS")).toBeOnTheScreen();
    expect(screen.getByText("P")).toBeOnTheScreen();
    expect(screen.getAllByText("W")[0]).toBeOnTheScreen();
    expect(screen.getAllByText("D")[0]).toBeOnTheScreen();
    expect(screen.getAllByText("L")[0]).toBeOnTheScreen();
    expect(screen.getByText("GF")).toBeOnTheScreen();
    expect(screen.getByText("GA")).toBeOnTheScreen();
  });

  it("renders all teams with correct data", () => {
    render(<LeagueTable teams={mockTeams} />);
    expect(screen.getByText("Team One")).toBeOnTheScreen();
    expect(screen.getByText("Team Two")).toBeOnTheScreen();
  });

  it("renders team ranks correctly", () => {
    render(<LeagueTable teams={mockTeams} />);
    const ranks = screen.getAllByText(/^[12]$/);
    expect(ranks.length).toBeGreaterThanOrEqual(2);
  });

  it("renders team statistics correctly", () => {
    render(<LeagueTable teams={mockTeams} />);
    expect(screen.getByText("30")).toBeOnTheScreen(); // PTS for Team One
    expect(screen.getByText("28")).toBeOnTheScreen(); // PTS for Team Two
    expect(screen.getByText("9")).toBeOnTheScreen();  // W for Team One
    expect(screen.getByText("3")).toBeOnTheScreen();  // D for Team One
    expect(screen.getByText("25")).toBeOnTheScreen(); // GF for Team One
    expect(screen.getByText("20")).toBeOnTheScreen(); // GF for Team Two
  });

  it("renders form badges for each team", () => {
    render(<LeagueTable teams={mockTeams} />);
    const formBadges = screen.getAllByTestId(/form-badge-/);
    expect(formBadges.length).toBe(6); // 3 results for Team One + 3 for Team Two
  });

  it("renders team logos", () => {
    render(<LeagueTable teams={mockTeams} />);
    const logos = screen.getAllByTestId("team-logo");
    expect(logos.length).toBe(2);
  });
});
