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

import ArgSpecialTable from "./ArgSpecialTable";
import { ArgLeagueEntry } from "open-football-project-core";

const mockAnnual: ArgLeagueEntry[] = [
  {
    teamId: 1,
    teamLogo: "/logo1.png",
    teamName: "Team A",
    points: 30,
    played: 15,
    wins: 9,
    draws: 3,
    losses: 3,
    goalsFor: 25,
    goalsAgainst: 10,
  },
  {
    teamId: 2,
    teamLogo: "/logo2.png",
    teamName: "Team B",
    points: 28,
    played: 15,
    wins: 8,
    draws: 4,
    losses: 3,
    goalsFor: 20,
    goalsAgainst: 12,
  },
];

const mockPromedios: ArgLeagueEntry[] = [
  {
    teamId: 1,
    teamLogo: "/logo1.png",
    teamName: "Team A",
    promedio: 2.331,
    points: 0,
    played: 0,
  },
  {
    teamId: 2,
    teamLogo: "/logo2.png",
    teamName: "Team B",
    promedio: 1.834,
    points: 0,
    played: 0,
  },
];

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "leaguestanding.team": "Team",
        "leaguestanding.pts": "PTS",
        "leaguestanding.p": "P",
        "leaguestanding.w": "W",
        "leaguestanding.d": "D",
        "leaguestanding.l": "L",
        "leaguestanding.gf": "GF",
        "leaguestanding.ga": "GA",
        "leaguestanding.avg": "AVG",
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
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    brand: {
      aqualight: "#85f1e8ff",
      yellow: "#ffc61a",
      orange: "#FF6B00",
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
    base: 16,
  },
  fontWeight: {
    semibold: "600",
    bold: "700",
  },
  borderRadius: {
    md: 12,
    lg: 16,
  },
  borders: { hairline: 0.5, thin: 1, thick: 2 },
}));

describe("ArgSpecialTable", () => {
  it("renders NoData when teams is empty", () => {
    render(<ArgSpecialTable teams={[]} mode="annual" />);
    expect(screen.getByTestId("no-data")).toBeOnTheScreen();
  });

  it("renders annual table with correct columns", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);

    expect(screen.getByText("Team")).toBeOnTheScreen();
    expect(screen.getByText("PTS")).toBeOnTheScreen();
    expect(screen.getByText("P")).toBeOnTheScreen();
    expect(screen.getAllByText("W")[0]).toBeOnTheScreen();
    expect(screen.getAllByText("D")[0]).toBeOnTheScreen();
    expect(screen.getAllByText("L")[0]).toBeOnTheScreen();
    expect(screen.getByText("GF")).toBeOnTheScreen();
    expect(screen.getByText("GA")).toBeOnTheScreen();
  });

  it("renders promedios table with promedio column", () => {
    render(<ArgSpecialTable teams={mockPromedios} mode="promedios" />);

    expect(screen.getByText("Team")).toBeOnTheScreen();
    expect(screen.getByText("PTS")).toBeOnTheScreen();
    expect(screen.getByText("P")).toBeOnTheScreen();
    expect(screen.getByText("AVG")).toBeOnTheScreen();
  });

  it("renders all teams with correct names", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);

    expect(screen.getByText("Team A")).toBeOnTheScreen();
    expect(screen.getByText("Team B")).toBeOnTheScreen();
  });

  it("renders team logos", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);

    const logos = screen.getAllByTestId("team-logo");
    expect(logos.length).toBe(2);
  });

  it("renders annual statistics correctly", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);

    expect(screen.getByText("30")).toBeOnTheScreen(); // PTS for Team A
    expect(screen.getByText("28")).toBeOnTheScreen(); // PTS for Team B
    expect(screen.getByText("9")).toBeOnTheScreen();  // W for Team A
  
    expect(screen.getByText("25")).toBeOnTheScreen(); // GF for Team A
    expect(screen.getByText("20")).toBeOnTheScreen(); // GF for Team B
  });

  it("renders promedios statistics correctly", () => {
    render(<ArgSpecialTable teams={mockPromedios} mode="promedios" />);

    expect(screen.getByText("2.331")).toBeOnTheScreen();
    expect(screen.getByText("1.834")).toBeOnTheScreen();
  });

  it("does not render annual columns in promedios mode", () => {
    render(<ArgSpecialTable teams={mockPromedios} mode="promedios" />);

    const wHeaders = screen.queryAllByText("W");
    const dHeaders = screen.queryAllByText("D");
    const lHeaders = screen.queryAllByText("L");

    // Should only find W in translation keys, not as a column header in promedios mode
    expect(wHeaders.length).toBe(0);
    expect(dHeaders.length).toBe(0);
    expect(lHeaders.length).toBe(0);
  });

  it("renders table with correct testID for annual mode", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);
    expect(screen.getByTestId("arg-special-table-annual")).toBeOnTheScreen();
    expect(screen.getByTestId("arg-special-table-annual-list")).toBeOnTheScreen();
  });

  it("renders table with correct testID for promedios mode", () => {
    render(<ArgSpecialTable teams={mockPromedios} mode="promedios" />);
    expect(screen.getByTestId("arg-special-table-promedios")).toBeOnTheScreen();
    expect(screen.getByTestId("arg-special-table-promedios-list")).toBeOnTheScreen();
  });

  it("renders rank numbers for each team", () => {
    render(<ArgSpecialTable teams={mockAnnual} mode="annual" />);
    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("2")).toBeOnTheScreen();
  });
});
