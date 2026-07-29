import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { LeagueFixtureComponent } from "./LeagueFixtureComponent";
import { ApiService, LeagueFixture, mockLeagueFixture, useCharteableMatchNow } from "open-football-project-core";

const mockApiService = {} as unknown as ApiService;

jest.mock("../../general/share-svg-button/ShareSvgButton", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ svgString }: { svgString: string }) =>
      React.createElement(View, { testID: `share-svg-button-${svgString}` }),
  };
});

jest.mock("open-football-project-core", () => {
  const actual = jest.requireActual("open-football-project-core") as object;
  return {
    ...actual,
    buildFixtureSvgString: jest.fn(() => "<svg>fixture</svg>"),
    getFixtureSvgH: jest.fn(() => 300),
    useCharteableMatchNow: jest.fn(() => ({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    })),
    useTopGuysAvailable: jest.fn(() => ({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    })),
  };
});

jest.mock("../../general/logo/Logo", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ src }: { src: string }) =>
    React.createElement(View, {
      testID: "logo",
      style: { width: 16, height: 16 },
    });
});

jest.mock("../../general/no-data/NoData", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return ({ loading }: { loading?: boolean }) =>
    React.createElement(
      View,
      { testID: "no-data" },
      React.createElement(Text, null, loading ? "Loading..." : "No Data"),
    );
});

jest.mock("../../general/match-button/MatchButton", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return ({
    isLiveNow,
    fixtureId,
  }: {
    isLiveNow: boolean;
    fixtureId: number;
  }) =>
    React.createElement(
      View,
      { testID: `match-button-${fixtureId}` },
      React.createElement(Text, null, isLiveNow ? "LIVE" : "DETAILS"),
    );
});

jest.mock("../../general/chart-button/ChartButton", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) =>
      React.createElement(
        View,
        { testID: `chart-button-${fixtureId}` },
        React.createElement(Text, null, "Charts"),
      ),
  };
});

jest.mock("../../general/top-guys-button/TopGuysButton", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) =>
      React.createElement(
        View,
        { testID: `top-guys-button-${fixtureId}` },
        React.createElement(Text, null, "Players"),
      ),
  };
});

jest.mock("../../general/status-or-time/StatusOrTime", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return ({
    isFinished,
    statusShort,
  }: {
    isFinished: boolean;
    statusShort: string;
    utcDate: string;
  }) =>
    React.createElement(
      View,
      { testID: "status-or-time" },
      React.createElement(Text, null, isFinished ? statusShort : "Scheduled"),
    );
});

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
    i18n: { language: "en" },
  }),
}));

jest.mock("../../../theme", () => ({
  colors: {
    background: {
      card: "#1E1E1E",
      dark: "#121212",
      overlay: "rgba(0,0,0,0.7)",
    },
    brand: {
      green: "#6faa54",
      yellow: "#ffc61a",
      orange: "#FF8C00",
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
    xl: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
  },
  fontWeight: {
    bold: "700",
    semibold: "600",
    normal: "400",
  },
  borderRadius: {
    sm: 4,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borders: { hairline: 0.5, thin: 1, thick: 2 },
  sizes: {
    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    iconXLarge: 40,
    touchableHeight: 44,
    fullWidth: "100%",
    fullHeight: "100%",
  },
  opacity: {
    hover: 0.8,
    disabled: 0.4,
  },
  breakpoints: { tablet: 768, desktop: 1024, tv: 1280 },
}));

describe("LeagueFixtureComponent", () => {
  let fixture: LeagueFixture = mockLeagueFixture;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCharteableMatchNow as jest.Mock).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });
  });

  describe("Loading and Empty States", () => {
    it("renders loading state when loading is true", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={undefined}
          loading={true}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("no-data")).toBeOnTheScreen();
      expect(screen.getByText("Loading...")).toBeOnTheScreen();
    });

    it("renders no-data state when fixture is undefined and not loading", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={undefined}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("no-data")).toBeOnTheScreen();
      expect(screen.getByText("No Data")).toBeOnTheScreen();
    });

    it("renders no-data when fixture has no rounds", () => {
      const emptyFixture = { ...fixture, totalRounds: 0, rounds: [] };
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={emptyFixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("no-data")).toBeOnTheScreen();
    });
  });

  describe("Fixture Display", () => {
    it("renders fixture container with correct testID", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("league-fixture-container")).toBeOnTheScreen();
    });

    it("renders fixture with matches showing team names", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const firstMatch =
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0];
      expect(screen.getByText(firstMatch.homeTeamName)).toBeOnTheScreen();
      expect(screen.getByText(firstMatch.awayTeamName)).toBeOnTheScreen();
    });

    it("renders match cards with correct testIDs", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const firstMatch =
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0];
      expect(
        screen.getByTestId(`match-card-${firstMatch.fixtureId}`),
      ).toBeOnTheScreen();
    });

    it("displays score for finished matches", () => {
      const fixtureWithFinishedMatch = {
        ...fixture,
        currentRoundIndex: 0,
        rounds: [
          {
            name: "Round 1",
            days: [
              {
                date: "2025-03-01",
                matches: [
                  {
                    ...fixture.rounds[0].days[0].matches[0],
                    isFinished: true,
                    homeTeamScore: 2,
                    awayTeamScore: 1,
                  },
                ],
              },
            ],
          },
        ],
      };
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixtureWithFinishedMatch}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByText("2 - 1")).toBeOnTheScreen();
    });

    it("displays dash for unfinished matches", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const dashes = screen.getAllByText("-");
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe("Round Navigation", () => {
    it("renders navigation buttons", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("left-round")).toBeOnTheScreen();
      expect(screen.getByTestId("right-round")).toBeOnTheScreen();
    });

    it("displays current round name", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(
        screen.getByText(fixture.rounds[fixture.currentRoundIndex].name),
      ).toBeOnTheScreen();
    });

    it("navigates to next round when right button is pressed", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const rightButton = screen.getByTestId("right-round");

      fireEvent.press(rightButton);

      const nextRoundIndex =
        (fixture.currentRoundIndex + 1) % fixture.rounds.length;
      expect(
        screen.getByText(fixture.rounds[nextRoundIndex].name),
      ).toBeOnTheScreen();
    });

    it("navigates to previous round when left button is pressed", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const leftButton = screen.getByTestId("left-round");

      fireEvent.press(leftButton);

      const prevRoundIndex =
        fixture.currentRoundIndex === 0
          ? fixture.rounds.length - 1
          : fixture.currentRoundIndex - 1;
      expect(
        screen.getByText(fixture.rounds[prevRoundIndex].name),
      ).toBeOnTheScreen();
    });

    it("wraps to last round when pressing left on first round", () => {
      const fixtureAtFirstRound = { ...fixture, currentRoundIndex: 0 };
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixtureAtFirstRound}
          loading={false}
          leagueName="La Liga"
        />,
      );

      fireEvent.press(screen.getByTestId("left-round"));

      expect(
        screen.getByText(fixture.rounds[fixture.rounds.length - 1].name),
      ).toBeOnTheScreen();
    });

    it("wraps to first round when pressing right on last round", () => {
      const fixtureAtLastRound = {
        ...fixture,
        currentRoundIndex: fixture.rounds.length - 1,
      };
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixtureAtLastRound}
          loading={false}
          leagueName="La Liga"
        />,
      );

      fireEvent.press(screen.getByTestId("right-round"));

      expect(screen.getByText(fixture.rounds[0].name)).toBeOnTheScreen();
    });
  });

  describe("Round Dropdown", () => {
    it("renders dropdown button", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(screen.getByTestId("drop-rounds")).toBeOnTheScreen();
    });

    it("opens dropdown when button is pressed", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );

      fireEvent.press(screen.getByTestId("drop-rounds"));

      expect(screen.getByTestId("round-0")).toBeOnTheScreen();
      expect(screen.getByTestId("round-1")).toBeOnTheScreen();
    });

    it("selects round from dropdown", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );

      fireEvent.press(screen.getByTestId("drop-rounds"));
      fireEvent.press(screen.getByTestId("round-1"));

      expect(screen.getByText(fixture.rounds[1].name)).toBeOnTheScreen();
    });

    it("closes dropdown after selection", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );

      fireEvent.press(screen.getByTestId("drop-rounds"));
      fireEvent.press(screen.getByTestId("round-1"));

      expect(screen.queryByTestId("round-0")).not.toBeOnTheScreen();
    });
  });

  describe("Sub-components Integration", () => {
    it("renders StatusOrTime for each match", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const statusElements = screen.getAllByTestId("status-or-time");
      expect(statusElements.length).toBeGreaterThan(0);
    });

    it("renders Logo components for teams", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const logos = screen.getAllByTestId("logo");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("renders MatchButton for each match", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const firstMatch =
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0];
      expect(
        screen.getByTestId(`match-button-${firstMatch.fixtureId}`),
      ).toBeOnTheScreen();
    });

    it("renders the chart button for a fixture when charting is available", () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });

      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const firstMatch =
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0];
      expect(
        screen.getByTestId(`chart-button-${firstMatch.fixtureId}`),
      ).toBeOnTheScreen();
    });

    it("does not render the chart button when charting is not available", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const firstMatch =
        fixture.rounds[fixture.currentRoundIndex].days[0].matches[0];
      expect(
        screen.queryByTestId(`chart-button-${firstMatch.fixtureId}`),
      ).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("has accessible container", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const container = screen.getByTestId("league-fixture-container");
      expect(container.props.accessibilityLabel).toBe(
        "accessibility.league_fixtures",
      );
    });

    it("navigation buttons have accessibility roles", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const leftButton = screen.getByTestId("left-round");
      const rightButton = screen.getByTestId("right-round");

      expect(leftButton.props.accessibilityRole).toBe("button");
      expect(rightButton.props.accessibilityRole).toBe("button");
    });

    it("dropdown button has accessibility state", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      const dropdownButton = screen.getByTestId("drop-rounds");

      expect(dropdownButton.props.accessibilityRole).toBe("button");
      expect(dropdownButton.props.accessibilityState.expanded).toBe(false);
    });
  });

  describe("Share", () => {
    it("uses ShareSvgButton with svgString", () => {
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(
        screen.getByTestId("share-svg-button-<svg>fixture</svg>"),
      ).toBeOnTheScreen();
    });

    it("calls buildFixtureSvgString with leagueName and leagueLogo", () => {
      const { buildFixtureSvgString } = require("open-football-project-core");
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
          leagueLogo="/la-liga.png"
        />,
      );
      expect(buildFixtureSvgString).toHaveBeenCalledWith(
        expect.anything(),
        "La Liga",
        "/la-liga.png",
      );
    });

    it("calls buildFixtureSvgString with undefined logo when not provided", () => {
      const { buildFixtureSvgString } = require("open-football-project-core");
      render(
        <LeagueFixtureComponent
          apiService={mockApiService}
          fixture={fixture}
          loading={false}
          leagueName="La Liga"
        />,
      );
      expect(buildFixtureSvgString).toHaveBeenCalledWith(
        expect.anything(),
        "La Liga",
        undefined,
      );
    });
  });
});
