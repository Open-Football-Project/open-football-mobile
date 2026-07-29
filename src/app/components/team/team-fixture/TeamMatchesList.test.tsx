import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import TeamMatchesList, { TeamMatch } from "./TeamMatchesList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApiService, useCharteableMatchNow } from "@matchinsights/core";

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

jest.mock("@matchinsights/core", () => {
  const actual = jest.requireActual("@matchinsights/core") as object;
  return {
    ...actual,
    buildFixtureSvgString: jest.fn(() => "<svg>fixture</svg>"),
    teamFixtureMatchesToFixtureRound: jest.fn(() => ({
      roundName: "prev",
      matches: [],
    })),
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

const Stack = createNativeStackNavigator();

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{ headerShown: false }}
        children={() => children as any}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const mockMatches: TeamMatch[] = [
  {
    fixtureId: 1,
    homeTeamName: "Barcelona",
    homeTeamLogo: "/barcelona.png",
    awayTeamName: "Real Madrid",
    awayTeamLogo: "/real-madrid.png",
    homeTeamScore: 2,
    awayTeamScore: 1,
    isFinished: true,
    isLiveNow: false,
    statusShort: "FT",
    date: "2024-01-15T20:00:00Z",
  },
  {
    fixtureId: 2,
    homeTeamName: "Barcelona",
    homeTeamLogo: "/barcelona.png",
    awayTeamName: "Atletico Madrid",
    awayTeamLogo: "/atletico.png",
    homeTeamScore: undefined,
    awayTeamScore: undefined,
    isFinished: false,
    isLiveNow: false,
    statusShort: "NS",
    date: "2024-02-20T18:00:00Z",
  },
  {
    fixtureId: 3,
    homeTeamName: "Valencia",
    homeTeamLogo: "/valencia.png",
    awayTeamName: "Barcelona",
    awayTeamLogo: "/barcelona.png",
    homeTeamScore: 1,
    awayTeamScore: 1,
    isFinished: false,
    isLiveNow: true,
    statusShort: "LIVE",
    date: "2024-01-20T20:00:00Z",
  },
];

describe("TeamMatchesList", () => {
  const renderComponent = (
    props: Partial<Parameters<typeof TeamMatchesList>[0]> = {},
  ) =>
    render(
      <NavigationWrapper>
        <TeamMatchesList
          matches={mockMatches}
          teamName="Barcelona"
          teamLogo="/barca.png"
          apiService={mockApiService}
          {...props}
        />
      </NavigationWrapper>,
    );

  it("renders the matches list correctly", () => {
    renderComponent();

    expect(screen.getByTestId("team-matches-list")).toBeTruthy();
    expect(screen.getByTestId("team-matches-list-flatlist")).toBeTruthy();
  });

  it("renders all match items", () => {
    renderComponent();

    mockMatches.forEach((match) => {
      expect(screen.getByTestId(`match-${match.fixtureId}`)).toBeTruthy();
    });
  });

  it("displays team names correctly", () => {
    renderComponent();

    expect(screen.getAllByText("Barcelona").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Real Madrid")).toBeTruthy();
    expect(screen.getByText("Atletico Madrid")).toBeTruthy();
    expect(screen.getByText("Valencia")).toBeTruthy();
  });

  it("displays finished match scores", () => {
    renderComponent();

    expect(screen.getByText("2 - 1")).toBeTruthy();
  });

  it("displays dash for unfinished matches", () => {
    renderComponent({ matches: [mockMatches[1]] });

    expect(screen.getByText("-")).toBeTruthy();
  });

  it("shows loading state when loading is true", () => {
    renderComponent({ loading: true });

    expect(screen.getByTestId("team-matches-list-loading")).toBeTruthy();
  });

  it("shows empty state when no matches", () => {
    renderComponent({ matches: [] });

    expect(screen.getByTestId("team-matches-list-empty")).toBeTruthy();
  });

  it("uses custom testID when provided", () => {
    renderComponent({ testID: "custom-list" });

    expect(screen.getByTestId("custom-list")).toBeTruthy();
    expect(screen.getByTestId("custom-list-flatlist")).toBeTruthy();
  });

  it("container does not use flex: 1 which collapses inside a ScrollView hierarchy", () => {
    renderComponent();
    const container = screen.getByTestId("team-matches-list");
    // flex: 1 inside ScrollView collapses to 0 height in React Native layout
    expect(container.props.style).not.toMatchObject({ flex: 1 });
  });

  it("renders with accessibility labels", () => {
    renderComponent();

    const matchItem = screen.getByTestId("match-1");
    expect(matchItem.props.accessibilityLabel).toBe("Barcelona vs Real Madrid");
  });

  it("renders the chart button for a fixture when charting is available", () => {
    (useCharteableMatchNow as jest.Mock).mockReturnValueOnce({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });

    renderComponent({ matches: [mockMatches[0]] });

    expect(screen.getByTestId("chart-link")).toBeTruthy();
  });

  it("does not render the chart button when charting is not available", () => {
    renderComponent({ matches: [mockMatches[0]] });

    expect(screen.queryByTestId("chart-link")).toBeNull();
  });
});

describe("TeamMatchesList share button", () => {
  it("uses ShareSvgButton with svgString", () => {
    render(
      <NavigationWrapper>
        <TeamMatchesList matches={mockMatches} teamName="Barcelona" label="Previous" apiService={mockApiService} />
      </NavigationWrapper>,
    );
    expect(screen.getByTestId("share-svg-button-<svg>fixture</svg>")).toBeTruthy();
  });

  it("calls buildFixtureSvgString with teamName and teamLogo", () => {
    const { buildFixtureSvgString } = require("@matchinsights/core");
    render(
      <NavigationWrapper>
        <TeamMatchesList matches={mockMatches} teamName="Barcelona" teamLogo="/barca.png" label="Previous" apiService={mockApiService} />
      </NavigationWrapper>,
    );
    expect(buildFixtureSvgString).toHaveBeenCalledWith(
      expect.anything(),
      "Barcelona",
      "/barca.png",
    );
  });
});
