import { describe, it, expect, jest } from "@jest/globals";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";
import LeagueStanding from "./LeagueStanding";
import { mockLeagueInfo } from "@matchinsights/core";

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
    buildStandingsSvgString: jest.fn(() => "<svg>standings</svg>"),
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
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

jest.mock("../league-table/LeagueTable", () => ({
  LeagueTable: ({ teams }: { teams: any[] }) => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return React.createElement(
      View,
      { testID: "league-table" },
      teams.map((t: any) =>
        React.createElement(
          Text,
          { key: t.teamId, testID: `team-${t.teamId}` },
          t.teamName,
        ),
      ),
    );
  },
}));

jest.mock("../../general/no-data/NoData", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return ({ loading }: { loading: boolean }) =>
    React.createElement(
      View,
      { testID: "no-data" },
      React.createElement(
        Text,
        null,
        loading ? "nodata.loading" : "nodata.default",
      ),
    );
});

jest.mock("../../../theme", () => ({
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
      dark50: "rgba(0,0,0,0.50)",
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
    semibold: "600",
  },
  opacity: {
    disabled: 0.5,
    hover: 0.8,
  },
  borderRadius: {
    md: 12,
    lg: 16,
    sm: 8,
    xl: 20,
  },
  borders: { hairline: 0.5, thin: 1, thick: 2 },
}));

describe("LeagueStanding", () => {
  it("renders loading state", () => {
    render(<LeagueStanding leagueInfo={undefined} loading={true} />);
    expect(screen.getByText("nodata.loading")).toBeOnTheScreen();
  });

  it("renders no league info state", () => {
    render(<LeagueStanding leagueInfo={undefined} loading={false} />);
    expect(screen.getByText("nodata.default")).toBeOnTheScreen();
  });

  it("renders teams from first group", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeOnTheScreen();
  });

  it("navigates between groups with arrows", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeOnTheScreen();

    const rightButton = screen.getByTestId("button-right");
    fireEvent.press(rightButton);
    expect(
      screen.getByText(mockLeagueInfo.group[1].teams[0].teamName),
    ).toBeOnTheScreen();

    const leftButton = screen.getByTestId("button-left");
    fireEvent.press(leftButton);
    expect(
      screen.getByText(mockLeagueInfo.group[0].teams[0].teamName),
    ).toBeOnTheScreen();
  });

  describe("Accessibility", () => {
    it("has an accessibility label and role on the previous-group button", () => {
      render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
      const leftButton = screen.getByTestId("button-left");
      expect(leftButton.props.accessibilityLabel).toBe(
        "accessibility.previous_group",
      );
      expect(leftButton.props.accessibilityRole).toBe("button");
    });

    it("has an accessibility label and role on the next-group button", () => {
      render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
      const rightButton = screen.getByTestId("button-right");
      expect(rightButton.props.accessibilityLabel).toBe(
        "accessibility.next_group",
      );
      expect(rightButton.props.accessibilityRole).toBe("button");
    });
  });

  it("toggles dropdown and selects another group", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    const toggleBtn = screen.getByTestId("drop-down-btn");
    fireEvent.press(toggleBtn);

    const groupOption = screen.getByTestId("group-option-1");
    fireEvent.press(groupOption);

    expect(
      screen.getByText(mockLeagueInfo.group[1].teams[0].teamName),
    ).toBeOnTheScreen();
  });

  it("uses ShareSvgButton with the svgString", () => {
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);
    expect(screen.getByTestId("share-svg-button-<svg>standings</svg>")).toBeTruthy();
  });

  it("passes updated svgString to ShareSvgButton after group change", () => {
    const { buildStandingsSvgString } = require("@matchinsights/core");
    render(<LeagueStanding leagueInfo={mockLeagueInfo} loading={false} />);

    fireEvent.press(screen.getByTestId("button-right"));

    expect(buildStandingsSvgString).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          teamId: mockLeagueInfo.group[1].teams[0].teamId,
        }),
      ]),
      expect.any(String),
      expect.anything(),
      expect.anything(),
      expect.any(Array),
      expect.any(Function),
    );
  });
});
