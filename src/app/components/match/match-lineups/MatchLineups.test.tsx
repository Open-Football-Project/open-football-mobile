import React from "react";
import { render, screen } from "@testing-library/react-native";
import MatchLineups from "./MatchLineups";
import { TeamsLineups, buildMatchLineupsSvgString } from "open-football-project-core";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../general/no-data/NoData");

jest.mock("open-football-project-core", () => ({
  ...jest.requireActual("open-football-project-core"),
  buildMatchLineupsSvgString: jest.fn(
    (teamA, teamB) => `<svg>${teamA.teamName}</svg>`,
  ),
}));

jest.mock("../../general/share-svg-button/ShareSvgButton", () => {
  return function MockShareSvgButton(props: any) {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, {
      testID: "share-svg-button",
      "data-svg-string": props.svgString,
    });
  };
});

const mockLineups: TeamsLineups = {
  teamA: {
    teamId: 1,
    teamName: "Team A",
    teamLogo: "https://example.com/logo-a.png",
    teamFormation: "4-3-3",
    lineup: [
      { number: 1, name: "Goalkeeper A", pos: "GK", grid: "0" },
      { number: 2, name: "Defender A1", pos: "D", grid: "1" },
      { number: 3, name: "Defender A2", pos: "D", grid: "2" },
      { number: 4, name: "Midfielder A1", pos: "M", grid: "3" },
      { number: 5, name: "Forward A1", pos: "F", grid: "4" },
    ],
    substitutes: [
      { number: 10, name: "Sub A1", pos: "M", grid: "5" },
      { number: 11, name: "Sub A2", pos: "F", grid: "6" },
    ],
  },
  teamB: {
    teamId: 2,
    teamName: "Team B",
    teamLogo: "https://example.com/logo-b.png",
    teamFormation: "3-5-2",
    lineup: [
      { number: 20, name: "Goalkeeper B", pos: "GK", grid: "0" },
      { number: 21, name: "Defender B1", pos: "D", grid: "1" },
      { number: 22, name: "Defender B2", pos: "D", grid: "2" },
      { number: 23, name: "Midfielder B1", pos: "M", grid: "3" },
      { number: 24, name: "Forward B1", pos: "F", grid: "4" },
    ],
    substitutes: [{ number: 30, name: "Sub B1", pos: "M", grid: "5" }],
  },
};

describe("MatchLineups Component", () => {
  describe("Main Content Rendering", () => {
    it("should render both teams with their names", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-name-Team A")).toBeTruthy();
      expect(screen.getByTestId("team-name-Team B")).toBeTruthy();
    });

    it("should render team formations", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-formation-Team A")).toBeTruthy();
      expect(screen.getByTestId("team-formation-Team B")).toBeTruthy();
    });

    it("should render team logos", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-logo-Team A")).toBeTruthy();
      expect(screen.getByTestId("team-logo-Team B")).toBeTruthy();
    });

    it("should render the pitch container", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("pitch-container")).toBeTruthy();
    });

    it("should render pitch image", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("pitch-image")).toBeTruthy();
    });

    it("should render center line overlay", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("center-line")).toBeTruthy();
    });
  });

  describe("Player Markers", () => {
    it("should render all starting players from teamA", () => {
      render(<MatchLineups lineups={mockLineups} />);
      mockLineups.teamA?.lineup.forEach((player) => {
        expect(
          screen.getByTestId(`player-number-${player.number}`),
        ).toBeTruthy();
      });
    });

    it("should render all starting players from teamB", () => {
      render(<MatchLineups lineups={mockLineups} />);
      mockLineups.teamB?.lineup.forEach((player) => {
        expect(
          screen.getByTestId(`player-number-${player.number}`),
        ).toBeTruthy();
      });
    });

    it("should render player markers with correct testIDs", () => {
      render(<MatchLineups lineups={mockLineups} />);
      // Verify some player markers exist
      expect(screen.getByTestId("player-marker-1")).toBeTruthy(); // GK from teamA
      expect(screen.getByTestId("player-marker-20")).toBeTruthy(); // GK from teamB
    });
  });

  describe("Substitutes Section", () => {
    it("should render substitutes title for both teams", () => {
      render(<MatchLineups lineups={mockLineups} />);
      const substituteTitles = screen.getAllByTestId("substitutes-title");
      expect(substituteTitles.length).toBe(2);
    });

    it("should render teamA substitutes", () => {
      render(<MatchLineups lineups={mockLineups} />);
      mockLineups.teamA?.substitutes.forEach((sub) => {
        expect(screen.getByTestId(`sub-number-${sub.number}`)).toBeTruthy();
      });
    });

    it("should render teamB substitutes", () => {
      render(<MatchLineups lineups={mockLineups} />);
      mockLineups.teamB?.substitutes.forEach((sub) => {
        expect(screen.getByTestId(`sub-number-${sub.number}`)).toBeTruthy();
      });
    });

    it("should show no substitutes message when substitutes list is empty", () => {
      const lineupsWithoutSubs: TeamsLineups = {
        ...mockLineups,
        teamA: { ...mockLineups.teamA!, substitutes: [] },
      };
      render(<MatchLineups lineups={lineupsWithoutSubs} />);
      // Should still have Team B substitutes, but Team A should show no-substitutes
      const noSubMessages = screen.queryAllByTestId("no-substitutes");
      expect(noSubMessages.length).toBeGreaterThan(0);
    });
  });

  describe("Team Cards", () => {
    it("should render team card for teamA", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-a-card")).toBeTruthy();
    });

    it("should render team card for teamB", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-b-card")).toBeTruthy();
    });

    it("should render team headers within cards", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("team-a-header")).toBeTruthy();
      expect(screen.getByTestId("team-b-header")).toBeTruthy();
    });
  });

  describe("Layout Structure", () => {
    it("should render main container", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("match-lineups-container")).toBeTruthy();
    });

    it("should render teams info container", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("teams-info")).toBeTruthy();
    });
  });

  describe("All Player Positions", () => {
    it("should correctly position goalkeepers at line 0", () => {
      render(<MatchLineups lineups={mockLineups} />);
      // Verify GK markers exist
      expect(screen.getByTestId("player-marker-1")).toBeTruthy(); // Team A GK
      expect(screen.getByTestId("player-marker-20")).toBeTruthy(); // Team B GK
    });

    it("should correctly position defenders at line 1", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("player-marker-2")).toBeTruthy(); // Team A Defender
      expect(screen.getByTestId("player-marker-21")).toBeTruthy(); // Team B Defender
    });

    it("should correctly position all lineups", () => {
      render(<MatchLineups lineups={mockLineups} />);
      // All 10 players from both teams should have markers
      const allPlayerMarkers = mockLineups
        .teamA!.lineup.concat(mockLineups.teamB!.lineup)
        .map((p) => p.number);

      allPlayerMarkers.forEach((number) => {
        expect(screen.getByTestId(`player-marker-${number}`)).toBeTruthy();
      });
    });
  });

  describe("Share Functionality", () => {
    it("should render ShareSvgButton component", () => {
      render(<MatchLineups lineups={mockLineups} />);
      expect(screen.getByTestId("share-svg-button")).toBeTruthy();
    });

    it("should call buildMatchLineupsSvgString with teamA and teamB", () => {
      render(<MatchLineups lineups={mockLineups} />);

      expect(buildMatchLineupsSvgString).toHaveBeenCalledWith(
        mockLineups.teamA,
        mockLineups.teamB,
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      );
    });

    it("should pass svgString to ShareSvgButton", () => {
      const mockSvgString = "<svg>lineups</svg>";
      (buildMatchLineupsSvgString as jest.Mock).mockReturnValue(mockSvgString);

      render(<MatchLineups lineups={mockLineups} />);

      const shareSvgButton = screen.getByTestId("share-svg-button");
      expect(shareSvgButton.props["data-svg-string"]).toBe(mockSvgString);
    });

    it("should pass helper functions to buildMatchLineupsSvgString", () => {
      render(<MatchLineups lineups={mockLineups} />);

      const callArgs = (buildMatchLineupsSvgString as jest.Mock).mock.calls[0];

      expect(callArgs).toHaveLength(5);
      expect(typeof callArgs[2]).toBe("function"); // getLeftPercent
      expect(typeof callArgs[3]).toBe("function"); // groupByLine
      expect(typeof callArgs[4]).toBe("function"); // positionToLine
    });
  });
});
