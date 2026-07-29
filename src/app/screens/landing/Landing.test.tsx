import React from "react";
import { FlatList } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { useTodayMatches, ApiService } from "open-football-project-core";
import Landing from "./Landing";

jest.mock("open-football-project-core");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "home.mainhead": "All Football Leagues",
        "home.headtext": "Discover leagues from every country.",
        "home.livebtn": "Live Matches",
        "home.leaguesbtn": "Explore All Leagues",
        "home.chartsbtn": "Live Charts",
        "home.todaymatches": "Today's Matches",
        "home.bottomhead": "Stay in the game",
        "home.bottomtext": "Global football at your fingertips.",
        "home.matchesbtn": "Check Matches",
        "home.todayplayerscta": "Today's Players",
        "matches.nodatamsg": "No matches available",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  default: () => ({ width: 375, height: 812, scale: 1, fontScale: 1 }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock("../../navigation/RootNavigator", () => ({
  Routes: {
    LANDING: "Landing",
    LIVE: "Live",
    ALL_LEAGUES: "AllLeagues",
    CHARTS: "Charts",
    LEAGUE: "League",
    MATCHES: "Matches",
    MATCH_DETAILS: "MatchDetails",
    PLAYER_HISTORY: "PlayerHistory",
    TEAM_DETAILS: "TeamDetails",
    TODAY_PLAYERS: "TodayPlayers",
  },
}));

jest.mock("../../icons/Icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LiveIcon: () => <View testID="live-icon" />,
    FootballIcon: () => <View testID="football-icon" />,
    ChartIcon: () => <View testID="chart-icon" />,
    CalendarIcon: () => <View testID="calendar-icon" />,
    PlayerIcon: () => <View testID="player-icon" />,
  };
});

jest.mock("../../components/general/no-data/NoData", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ loading, message }: any) => (
      <View testID={loading ? "loading-indicator" : "no-data"}>
        <Text>{loading ? "Loading..." : message || "No data"}</Text>
      </View>
    ),
  };
});

jest.mock("../../components/match/matches-grid/MatchesGrid", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ league }: { league: any }) => (
      <View testID={`matches-grid-${league?.leagueId}`}>
        <Text>{`League: ${league?.leagueName}`}</Text>
      </View>
    ),
  };
});

const mockUseTodayMatches = useTodayMatches as jest.MockedFunction<
  typeof useTodayMatches
>;

const mockApiService = {} as ApiService;

describe("Landing Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodayMatches.mockReturnValue({
      loadingMatches: false,
      leagueMatches: [],
      isLeagueMatchesAvailable: false,
    });
  });

  it("should render the landing screen", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByTestId("landing-screen")).toBeTruthy();
  });

  it("should render hero section with title", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByText("All Football Leagues")).toBeTruthy();
  });

  it("should render hero section with subtitle", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByText("Discover leagues from every country.")).toBeTruthy();
  });

  it("should render CTA buttons for Live, Leagues, and Charts", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByText("Live Matches")).toBeTruthy();
    expect(screen.getByText("Explore All Leagues")).toBeTruthy();
    expect(screen.getByText("Live Charts")).toBeTruthy();
  });

  it("should render matches button in bottom CTA", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByText("Check Matches")).toBeTruthy();
  });

  describe("CTA Buttons with testIDs", () => {
    it("should render live button with testID", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("live-button")).toBeTruthy();
    });

    it("should render leagues button with testID", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("leagues-button")).toBeTruthy();
    });

    it("should render charts button with testID", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("charts-button")).toBeTruthy();
    });

    it("should render matches button with testID", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("matches-button")).toBeTruthy();
    });
  });

  describe("Icons", () => {
    it("should render live icon", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("live-icon")).toBeTruthy();
    });

    it("should render football icon", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("football-icon")).toBeTruthy();
    });

    it("should render chart icon", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("chart-icon")).toBeTruthy();
    });

    it("should render calendar icon", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("calendar-icon")).toBeTruthy();
    });
  });

  describe("TodayPlayersCTA", () => {
    it("should render the today's players CTA button", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("today-players-cta")).toBeTruthy();
    });

    it("should display the today's players translated label", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByText("Today's Players")).toBeTruthy();
    });

    it("should render the player icon", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("player-icon")).toBeTruthy();
    });
  });

  it("should render bottom section texts", () => {
    render(<Landing apiService={mockApiService} />);
    expect(screen.getByText("Stay in the game")).toBeTruthy();
    expect(screen.getByText("Global football at your fingertips.")).toBeTruthy();
  });

  describe("Today's Matches section", () => {
    it("should show the today's matches section title", () => {
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByText("Today's Matches")).toBeTruthy();
    });

    it("should show loading indicator when matches are loading", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: true,
        leagueMatches: [],
        isLeagueMatchesAvailable: false,
      });
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });

    it("should show no-data message when no matches available", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: false,
        leagueMatches: [],
        isLeagueMatchesAvailable: false,
      });
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("no-data")).toBeTruthy();
      expect(screen.getByText("No matches available")).toBeTruthy();
    });

    it("should render MatchesGrid for each league when matches available", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: false,
        isLeagueMatchesAvailable: true,
        leagueMatches: [
          {
            leagueId: 39,
            leagueName: "Premier League",
            leagueLogo: "logo.png",
            matches: [],
          },
          {
            leagueId: 128,
            leagueName: "Liga Profesional Argentina",
            leagueLogo: "logo2.png",
            matches: [],
          },
        ],
      });
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("matches-grid-39")).toBeTruthy();
      expect(screen.getByTestId("matches-grid-128")).toBeTruthy();
      expect(screen.getByText("League: Premier League")).toBeTruthy();
      expect(screen.getByText("League: Liga Profesional Argentina")).toBeTruthy();
    });

    it("should not render MatchesGrid when loading", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: true,
        isLeagueMatchesAvailable: true,
        leagueMatches: [
          {
            leagueId: 39,
            leagueName: "Premier League",
            leagueLogo: "logo.png",
            matches: [],
          },
        ],
      });
      render(<Landing apiService={mockApiService} />);
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
      expect(screen.queryByTestId("matches-grid-39")).toBeNull();
    });

    it("should call useTodayMatches with apiService and leagueWeights", () => {
      render(<Landing apiService={mockApiService} />);
      expect(mockUseTodayMatches).toHaveBeenCalledWith(
        mockApiService,
        expect.any(Map),
      );
    });

  });

  describe("FlatList virtualization", () => {
    it("should use FlatList as the scroll container", () => {
      const { UNSAFE_getByType } = render(
        <Landing apiService={mockApiService} />,
      );
      const flatList = UNSAFE_getByType(FlatList);
      expect(flatList).toBeTruthy();
      expect(flatList.props.testID).toBe("landing-screen");
    });

    it("should set initialNumToRender to 3", () => {
      const { UNSAFE_getByType } = render(
        <Landing apiService={mockApiService} />,
      );
      expect(UNSAFE_getByType(FlatList).props.initialNumToRender).toBe(3);
    });

    it("should set maxToRenderPerBatch to 5", () => {
      const { UNSAFE_getByType } = render(
        <Landing apiService={mockApiService} />,
      );
      expect(UNSAFE_getByType(FlatList).props.maxToRenderPerBatch).toBe(5);
    });

    it("should pass leagueMatches as data when available", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: false,
        isLeagueMatchesAvailable: true,
        leagueMatches: [
          { leagueId: 39, leagueName: "Premier League", leagueLogo: "logo.png", matches: [] },
        ],
      });
      const { UNSAFE_getByType } = render(
        <Landing apiService={mockApiService} />,
      );
      expect(UNSAFE_getByType(FlatList).props.data).toHaveLength(1);
      expect(UNSAFE_getByType(FlatList).props.data[0].leagueId).toBe(39);
    });

    it("should pass empty array as data when loading", () => {
      mockUseTodayMatches.mockReturnValue({
        loadingMatches: true,
        isLeagueMatchesAvailable: false,
        leagueMatches: [],
      });
      const { UNSAFE_getByType } = render(
        <Landing apiService={mockApiService} />,
      );
      expect(UNSAFE_getByType(FlatList).props.data).toHaveLength(0);
    });
  });
});
