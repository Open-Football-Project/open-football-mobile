import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";

jest.mock("../../../../icons/Icons", () => ({
  TrophyIcon: () => null,
  CalendarIcon: () => null,
  LocationPinIcon: () => null,
}));

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

import { DetailsMainInfo } from "./DetailsMainInfo";
import { Routes } from "../../../../navigation/RootNavigator";
import {
  ApiService,
  buildMatchInfoSvgString,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "@matchinsights/core";

const mockApiService = {} as unknown as ApiService;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (opts?.defaultValue) {
        return opts.defaultValue;
      }

      return key;
    },
    i18n: { language: "en" },
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("./team-details-info/TeamDetailsInfo", () => {
  return function MockTeamDetailsInfo({ team }: any) {
    const React = require("react");
    const { View, Text } = require("react-native");
    return React.createElement(
      View,
      { testID: `team-details-container-${team.id}` },
      React.createElement(Text, null, team.name),
    );
  };
});

jest.mock("../../../general/match-button/MatchButton", () => {
  return function MockMatchButton() {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: "match-live-button" });
  };
});

jest.mock("@matchinsights/core", () => ({
  ...jest.requireActual("@matchinsights/core"),
  getFormattedDate: () => "2024-01-15",
  getFormattedTime: () => "14:30",
  leagueTranslationKey: () => "premier",
  matchLongStatusToKey: () => "finished",
  cleanLeagueName: (name: string) => name,
  buildMatchInfoSvgString: jest.fn((data) => `<svg>${data.homeTeamName}</svg>`),
  useCharteableMatchNow: jest.fn(() => ({
    isCharteableMatchNow: false,
    loadingCharteableMatchNow: false,
  })),
  useTopGuysAvailable: jest.fn(() => ({
    isTopGuysAvailable: false,
    loadingTopGuysAvailable: false,
  })),
}));

jest.mock("../../../general/chart-button/ChartButton", () => {
  return function MockChartButton({ fixtureId }: { fixtureId: number }) {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: `chart-button-${fixtureId}` });
  };
});

jest.mock("../../../general/top-guys-button/TopGuysButton", () => {
  return function MockTopGuysButton({ fixtureId }: { fixtureId: number }) {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: `top-guys-button-${fixtureId}` });
  };
});

jest.mock("../../../general/share-svg-button/ShareSvgButton", () => {
  return function MockShareSvgButton(props: any) {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, {
      testID: "share-svg-button",
      "data-svg-string": props.svgString,
    });
  };
});

describe("DetailsMainInfo", () => {
  const mockNavigate = jest.fn();

  const baseProps = {
    homeTeam: {
      id: 1,
      name: "Home FC",
      logo: "https://example.com/home-logo.png",
    },
    awayTeam: {
      id: 2,
      name: "Away FC",
      logo: "https://example.com/away-logo.png",
    },
    date: "2024-01-15",
    league: {
      id: 1,
      name: "Premier League",
      season: 2023,
      logo: "https://example.com/league-logo.png",
    },
    venue: {
      id: 1,
      name: "Stadium Name",
      city: "City Name",
    },
    goals: {
      home: 2,
      away: 1,
    },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: 2, away: 1 },
    },
    statusLong: "Match Finished",
    isLiveNow: false,
    fixtureId: 123,
    apiService: mockApiService,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
    (useCharteableMatchNow as jest.Mock).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });
    (useTopGuysAvailable as jest.Mock).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });
  });

  it("renders container", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const container = screen.getByTestId("details-main-info");
    expect(container).toBeTruthy();
  });

  it("renders home and away team containers", () => {
    render(<DetailsMainInfo {...baseProps} />);
    expect(screen.getByTestId(`team-details-container-1`)).toBeTruthy();
    expect(screen.getByTestId(`team-details-container-2`)).toBeTruthy();
  });

  it("renders fulltime score", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const ftHeader = screen.getByText("common.FT");
    expect(ftHeader).toBeTruthy();
  });

  it("renders halftime score", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const htHeader = screen.getByText("common.HT");
    expect(htHeader).toBeTruthy();
  });

  it("renders extratime score when present", () => {
    const propsWithET = {
      ...baseProps,
      score: {
        ...baseProps.score,
        extratime: { home: 2, away: 1 },
      },
    };
    render(<DetailsMainInfo {...propsWithET} />);
    const etHeader = screen.getByText("common.ET");
    expect(etHeader).toBeTruthy();
  });

  it("renders penalty score when present", () => {
    const propsWithPEN = {
      ...baseProps,
      score: {
        ...baseProps.score,
        penalty: { home: 3, away: 2 },
      },
    };
    render(<DetailsMainInfo {...propsWithPEN} />);
    const penHeader = screen.getByText("common.PEN");
    expect(penHeader).toBeTruthy();
  });

  it("renders league name", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const leagueLink = screen.getByTestId("league-link");
    expect(leagueLink).toBeTruthy();
  });

  it("renders venue name and city", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const venueDetails = screen.getByTestId("venue-details");
    expect(venueDetails).toBeTruthy();
    expect(screen.getByText("Stadium Name, City Name")).toBeTruthy();
  });

  it("renders match date", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const container = screen.getByTestId("details-main-info");
    expect(container).toBeTruthy();
  });

  it("navigates to league details when league pressed", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const leagueLink = screen.getByTestId("league-link");
    fireEvent.press(leagueLink);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.LEAGUE, {
      leagueId: "1",
    });
  });

  it("renders live button when isLiveNow is true", () => {
    const liveProps = { ...baseProps, isLiveNow: true };
    render(<DetailsMainInfo {...liveProps} />);
    const liveButton = screen.getByTestId("match-live-button");
    expect(liveButton).toBeTruthy();
  });

  it("renders status text when isLiveNow is false", () => {
    render(<DetailsMainInfo {...baseProps} />);
    const status = screen.getByText("Match Finished");
    expect(status).toBeTruthy();
  });

  it("renders ShareSvgButton component", () => {
    render(<DetailsMainInfo {...baseProps} />);
    expect(screen.getByTestId("share-svg-button")).toBeTruthy();
  });

  it("calls buildMatchInfoSvgString with correct parameters", () => {
    render(<DetailsMainInfo {...baseProps} />);

    expect(buildMatchInfoSvgString).toHaveBeenCalledWith(
      expect.objectContaining({
        homeTeamName: "Home FC",
        homeTeamLogo: "https://example.com/home-logo.png",
        awayTeamName: "Away FC",
        awayTeamLogo: "https://example.com/away-logo.png",
        goalsHome: 2,
        goalsAway: 1,
        score: expect.any(Object),
        leagueName: expect.any(String),
        leagueLogo: expect.any(String),
        venueName: "Stadium Name",
        venueCity: "City Name",
        formattedDate: expect.any(String),
        statusLabel: expect.any(String),
        labels: expect.objectContaining({
          ht: expect.any(String),
          ft: expect.any(String),
          et: expect.any(String),
          pen: expect.any(String),
        }),
      }),
    );
  });

  it("ShareSvgButton receives svgString from buildMatchInfoSvgString", () => {
    const mockSvgString = "<svg>match-info</svg>";
    (buildMatchInfoSvgString as jest.Mock).mockReturnValue(mockSvgString);

    render(<DetailsMainInfo {...baseProps} />);

    const shareSvgButton = screen.getByTestId("share-svg-button");
    expect(shareSvgButton.props["data-svg-string"]).toBe(mockSvgString);
  });

  it("includes league logo in SVG data", () => {
    const propsWithLeagueLogo = {
      ...baseProps,
      league: {
        ...baseProps.league,
        logo: "https://example.com/league-logo.png",
      },
    };
    render(<DetailsMainInfo {...propsWithLeagueLogo} />);

    const callArgs = (buildMatchInfoSvgString as jest.Mock).mock.calls[0][0];
    expect(callArgs.leagueLogo).toBe("https://example.com/league-logo.png");
  });

  describe("chart entry point", () => {
    it("renders the chart button for this fixture when charting is available", () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });

      render(<DetailsMainInfo {...baseProps} />);

      expect(screen.getByTestId("chart-button-123")).toBeTruthy();
    });

    it("does not render the chart button when charting is not available", () => {
      render(<DetailsMainInfo {...baseProps} />);

      expect(screen.queryByTestId("chart-button-123")).toBeNull();
    });

    it("calls useCharteableMatchNow with the apiService and the fixtureId", () => {
      render(<DetailsMainInfo {...baseProps} />);

      expect(useCharteableMatchNow).toHaveBeenCalledWith(mockApiService, 123);
    });
  });

  describe("top guys entry point", () => {
    it("renders the top guys button for this fixture when today's players is available", () => {
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<DetailsMainInfo {...baseProps} />);

      expect(screen.getByTestId("top-guys-button-123")).toBeTruthy();
    });

    it("does not render the top guys button when today's players is not available", () => {
      render(<DetailsMainInfo {...baseProps} />);

      expect(screen.queryByTestId("top-guys-button-123")).toBeNull();
    });

    it("calls useTopGuysAvailable with the apiService and the fixtureId", () => {
      render(<DetailsMainInfo {...baseProps} />);

      expect(useTopGuysAvailable).toHaveBeenCalledWith(mockApiService, 123);
    });

    it("renders the entry points row when only today's players is available, with no chart button", () => {
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<DetailsMainInfo {...baseProps} />);

      expect(screen.getByTestId("top-guys-button-123")).toBeTruthy();
      expect(screen.queryByTestId("chart-button-123")).toBeNull();
    });
  });
});
