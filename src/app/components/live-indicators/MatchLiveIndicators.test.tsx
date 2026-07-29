import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Share } from "react-native";
import MatchLiveIndicators from "./MatchLiveIndicators";
import { TwoTeamsStatistics, useLiveIndicators } from "@matchinsights/core";

const mockTranslationFunction = (
  key: string,
  opts?: Record<string, string>,
) => {
  const map: Record<string, string> = {
    "indicators.momentum": "Momentum",
    "indicators.match_control": "Match Control",
    "indicators.goal_threat": "Goal Threat",
    "indicators.live_insights": "Live Insights",
    "indicators.share": "Share Live Insights",
    "indicators.verdict.no_data": "No data yet",
    "indicators.verdict.even": "Contested",
  };
  if (opts?.team) return `${opts.team} ${key.split(".").pop()}`;
  return map[key] ?? key;
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslationFunction,
  }),
}));

jest.mock("@matchinsights/core", () => ({
  useLiveIndicators: jest.fn(),
  buildLiveIndicatorsDonutsSvgString: jest.fn(),
}));

jest.mock("./pie-chart/LiveMatchPieChart", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ testID }: { testID?: string }) => (
      <View testID={testID ?? "pie-chart"} />
    ),
  };
});

jest.mock("../general/share-svg-button/ShareSvgButton", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({
      svgString,
      testID,
    }: {
      svgString: string;
      testID?: string;
    }) => <View testID={testID ?? "share-svg-button"} data-svg={svgString} />,
  };
});

const mockIndicator = (emoji: string, label: string) => ({
  emoji,
  label,
  homePercent: 55,
  awayPercent: 45,
});

const defaultIndicators = {
  momentum: mockIndicator("⚡", "indicators.momentum"),
  control: mockIndicator("🎮", "indicators.match_control"),
  goalThreat: mockIndicator("🎯", "indicators.goal_threat"),
  hasData: true,
};

describe("MatchLiveIndicators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLiveIndicators as jest.Mock).mockReturnValue(defaultIndicators);
  });

  it("renders the container", () => {
    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );
    expect(screen.getByTestId("match-live-indicators")).toBeTruthy();
  });

  it("renders all three pie charts", () => {
    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );
    expect(screen.getByTestId("pie-chart-momentum")).toBeTruthy();
    expect(screen.getByTestId("pie-chart-control")).toBeTruthy();
    expect(screen.getByTestId("pie-chart-goal-threat")).toBeTruthy();
  });

  it("renders ShareSvgButton instead of text share button", () => {
    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );
    expect(screen.getByTestId("share-svg-button")).toBeTruthy();
  });

  it("renders ShareSvgButton in place of share button", () => {
    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    expect(screen.getByTestId("share-svg-button")).toBeTruthy();
  });

  it("calls buildLiveIndicatorsDonutsSvgString with correct parameters", () => {
    const {
      buildLiveIndicatorsDonutsSvgString,
    } = require("@matchinsights/core");
    buildLiveIndicatorsDonutsSvgString.mockReturnValue("<svg>test</svg>");

    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    expect(buildLiveIndicatorsDonutsSvgString).toHaveBeenCalledWith(
      "Home FC",
      "Away FC",
      defaultIndicators.momentum,
      defaultIndicators.control,
      defaultIndicators.goalThreat,
      defaultIndicators.hasData,
      expect.any(Function),
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
    );
  });

  it("passes svgString to ShareSvgButton", () => {
    const {
      buildLiveIndicatorsDonutsSvgString,
    } = require("@matchinsights/core");
    const testSvg = "<svg>live-indicators</svg>";
    buildLiveIndicatorsDonutsSvgString.mockReturnValue(testSvg);

    render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    const shareButton = screen.getByTestId("share-svg-button");
    expect(shareButton.props["data-svg"]).toBe(testSvg);
  });

  it("memoizes svgString based on indicators and team names", () => {
    const {
      buildLiveIndicatorsDonutsSvgString,
    } = require("@matchinsights/core");
    buildLiveIndicatorsDonutsSvgString.mockReturnValue("<svg>test</svg>");

    const { rerender } = render(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    const firstCallCount = buildLiveIndicatorsDonutsSvgString.mock.calls.length;

    rerender(
      <MatchLiveIndicators
        liveStats={undefined}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    expect(buildLiveIndicatorsDonutsSvgString.mock.calls.length).toBe(
      firstCallCount,
    );
  });

  it("passes liveStats to useLiveIndicators", () => {
    const mockStats = {
      teamA: { statistics: [] },
      teamB: { statistics: [] },
    } as unknown as TwoTeamsStatistics;

    render(
      <MatchLiveIndicators
        liveStats={mockStats}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
      />,
    );

    expect(useLiveIndicators).toHaveBeenCalledWith(mockStats);
  });
});
