import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import LeagueGroupCard from "./LeagueGroupCard";
import { LeagueGroup } from "open-football-project-core";

jest.mock("../../league-table/LeagueTable", () => ({
  LeagueTable: ({ teams }: { teams: any[] }) => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return React.createElement(View, { testID: "league-table" }, 
      React.createElement(Text, null, `Teams: ${teams.length}`)
    );
  },
}));

jest.mock("open-football-project-core", () => {
  const actual = jest.requireActual("open-football-project-core") as any;
  return {
    ...actual,
    leagueGroupTranslation: jest.fn((label: string) => {
      const translations: Record<string, string> = {
        "Group A": "GROUP A",
        "Group B": "GROUP B",
        "": "NO LABEL",
      };
      return translations[label] || label.toUpperCase();
    }),
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
  }),
}));

jest.mock("../../../../theme", () => ({
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
      orange: "#FF8C00",
    },
  },
  spacing: {
    sm: 8,
    md: 12,
  },
  fontSize: {
    sm: 14,
  },
  fontWeight: {
    bold: "700",
  },
  borderRadius: {
    md: 12,
    lg: 16,
  },
}));

const mockGroup: LeagueGroup = {
  label: "Group A",
  teams: [
    {
      teamId: 1,
      rank: 1,
      teamName: "Team One",
      logo: "/logo.png",
      points: 10,
      played: 4,
      won: 3,
      draw: 1,
      lost: 0,
      goalsFor: 8,
      goalsAgainst: 2,
      form: "WWDW",
    },
  ],
};

describe("LeagueGroupCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders translated group title", () => {
    render(<LeagueGroupCard group={mockGroup} />);

    expect(screen.getByText("GROUP A")).toBeOnTheScreen();
  });

  it("renders LeagueTable with correct teams", () => {
    render(<LeagueGroupCard group={mockGroup} />);

    const table = screen.getByTestId("league-table");
    expect(table).toBeOnTheScreen();
    expect(screen.getByText("Teams: 1")).toBeOnTheScreen();
  });

  it("handles missing group label gracefully", () => {
    render(
      <LeagueGroupCard
        group={{
          ...mockGroup,
          label: undefined,
        }}
      />
    );

    expect(screen.getByText("NO LABEL")).toBeOnTheScreen();
  });
});
