import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

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

import MatchesGrid from "./MatchesGrid";
import { ApiService, DayMatches as DayMatchesType } from "open-football-project-core";
import { Routes } from "../../../navigation/RootNavigator";

const mockApiService = {} as unknown as ApiService;

jest.mock("../../general/share-svg-button/ShareSvgButton", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    __esModule: true,
    default: ({ svgString, onPress }: { svgString: string; onPress?: () => void }) =>
      React.createElement(View, { testID: `share-svg-button-${svgString}` },
        React.createElement(Pressable, { testID: "share-button", onPress }),
      ),
  };
});

jest.mock("open-football-project-core", () => {
  const actual = jest.requireActual("open-football-project-core") as object;
  return {
    ...actual,
    dayMatchesToFixtureRound: jest.fn(() => ({ name: "Round 1", days: [] })),
    buildFixtureSvgString: jest.fn(() => "<svg>fixture</svg>"),
    getFixtureSvgH: jest.fn(() => 300),
  };
});

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
  NativeStackNavigationProp: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key.includes("league.")) {
        return options?.defaultValue || "Premier League";
      }
      return key;
    },
  }),
}));

jest.mock("../../../icons/Icons", () => ({
  ChevronRightIcon: ({ testID }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text testID={testID}>›</Text>;
  },
}));

jest.mock("../../general/logo/Logo", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ src, size }: any) => (
      <View
        testID={`league-logo-${src || "fallback"}`}
        style={{ width: size, height: size }}
      >
        <Text>{src || "fallback-logo"}</Text>
      </View>
    ),
  };
});

jest.mock("./day-matches/DayMatches", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ matches }: any) => (
      <View testID="day-matches-component">
        <Text>{matches?.length || 0} matches</Text>
      </View>
    ),
  };
});

const mockLeague: DayMatchesType = {
  leagueId: 1,
  leagueName: "Premier League",
  leagueLogo: "premier.png",
  matches: [
    {
      fixtureId: 101,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamName: "Arsenal",
      awayTeamName: "Chelsea",
      homeTeamLogo: "arsenal.png",
      awayTeamLogo: "chelsea.png",
      homeTeamScore: 2,
      awayTeamScore: 1,
      isFinished: true,
      statusShort: "FT",
      statusLong: "Match Finished",
      date: "2025-10-11T15:00:00Z",
      isLiveNow: false,
    },
    {
      fixtureId: 102,
      homeTeamId: 3,
      awayTeamId: 4,
      homeTeamName: "Man City",
      awayTeamName: "Liverpool",
      homeTeamLogo: "man-city.png",
      awayTeamLogo: "liverpool.png",
      homeTeamScore: 0,
      awayTeamScore: 0,
      isFinished: false,
      statusShort: "NS",
      statusLong: "Not Started",
      date: "2025-10-12T18:00:00Z",
      isLiveNow: false,
    },
  ],
};

const mockLeague2: DayMatchesType = {
  leagueId: 2,
  leagueName: "La Liga",
  leagueLogo: "laliga.png",
  matches: [
    {
      fixtureId: 201,
      homeTeamId: 5,
      awayTeamId: 6,
      homeTeamName: "Real Madrid",
      awayTeamName: "Barcelona",
      homeTeamLogo: "rm.png",
      awayTeamLogo: "barca.png",
      homeTeamScore: 1,
      awayTeamScore: 1,
      isFinished: true,
      statusShort: "FT",
      statusLong: "Match Finished",
      date: "2025-10-11T20:00:00Z",
      isLiveNow: false,
    },
  ],
};

describe("MatchesGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders league card with correct testID", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByTestId("league-card-1")).toBeTruthy();
  });

  it("renders league header with correct testID", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByTestId("league-header-1")).toBeTruthy();
  });

  it("renders league name with proper translation", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByText(/Premier/)).toBeTruthy();
  });

  it("renders league logo", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByTestId("league-logo-premier.png")).toBeTruthy();
  });

  it("renders DayMatches component with correct match count", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByTestId("day-matches-component")).toBeTruthy();
    expect(screen.getByText("2 matches")).toBeTruthy();
  });

  it("renders DayMatches with single match for second league", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague2} />);

    expect(screen.getByTestId("day-matches-component")).toBeTruthy();
    expect(screen.getByText("1 matches")).toBeTruthy();
  });

  it("handles league header press for navigation", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    const leagueHeader = screen.getByTestId("league-header-1");
    fireEvent.press(leagueHeader);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.LEAGUE, { leagueId: "1" });
  });

  it("navigates with correct leagueId for different leagues", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague2} />);

    const leagueHeader = screen.getByTestId("league-header-2");
    fireEvent.press(leagueHeader);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.LEAGUE, { leagueId: "2" });
  });

  it("renders league card for second league", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague2} />);

    expect(screen.getByTestId("league-card-2")).toBeTruthy();
    expect(screen.getByTestId("league-logo-laliga.png")).toBeTruthy();
  });

  it("renders chevron icon in league header", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

    expect(screen.getByTestId("league-chevron-1")).toBeTruthy();
  });

  it("renders chevron icon for each league", () => {
    render(<MatchesGrid apiService={mockApiService} league={mockLeague2} />);

    expect(screen.getByTestId("league-chevron-2")).toBeTruthy();
  });

  it("renders fallback logo when leagueLogo is null", () => {
    const leagueNoLogo: DayMatchesType = { ...mockLeague, leagueLogo: null };
    render(<MatchesGrid apiService={mockApiService} league={leagueNoLogo} />);

    expect(screen.getByTestId("league-logo-fallback")).toBeTruthy();
  });

  describe("Share", () => {
    it("does not call buildFixtureSvgString on initial mount", () => {
      const { buildFixtureSvgString } = require("open-football-project-core");
      render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

      expect(buildFixtureSvgString).not.toHaveBeenCalled();
    });

    it("calls buildFixtureSvgString with leagueName and leagueLogo when share is pressed", () => {
      const { buildFixtureSvgString } = require("open-football-project-core");
      render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

      fireEvent.press(screen.getByTestId("share-button"));

      expect(buildFixtureSvgString).toHaveBeenCalledWith(
        expect.anything(),
        "Premier Lg.",
        "premier.png",
      );
    });

    it("passes computed svgString to ShareSvgButton after pressing share", () => {
      render(<MatchesGrid apiService={mockApiService} league={mockLeague} />);

      fireEvent.press(screen.getByTestId("share-button"));

      expect(screen.getByTestId("share-svg-button-<svg>fixture</svg>")).toBeTruthy();
    });

    it("calls buildFixtureSvgString with undefined logo when leagueLogo is null", () => {
      const { buildFixtureSvgString } = require("open-football-project-core");
      const leagueNoLogo: DayMatchesType = { ...mockLeague, leagueLogo: null };
      render(<MatchesGrid apiService={mockApiService} league={leagueNoLogo} />);

      fireEvent.press(screen.getByTestId("share-button"));

      expect(buildFixtureSvgString).toHaveBeenCalledWith(
        expect.anything(),
        "Premier Lg.",
        undefined,
      );
    });
  });
});
