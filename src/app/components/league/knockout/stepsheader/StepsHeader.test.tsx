import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react-native";
import StepsHeader from "./StepsHeader";
import { LeagueFixtureRound } from "open-football-project-core";
import { colors } from "../../../../theme";

jest.mock("open-football-project-core", () => {
  const actual = jest.requireActual("open-football-project-core") as any;
  return {
    ...actual,
    normalizeLeagueRound: (name: string) =>
      name.toLowerCase().replace(/\s/g, "-"),
  };
});

jest.mock("../../../../theme", () => ({
  breakpoints: {
    tablet: 768,
    desktop: 1024,
    tv: 1280,
  },
  colors: {
    brand: {
      yellow: "#ffc61a",
      red: "#ff4848",
    },
    background: {
      card: "#1E1E1E",
      dark: "#121212",
    },
    text: {
      secondary: "#B0B0B0",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    md: 12,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
  },
  fontWeight: {
    semibold: "600",
  },
}));

jest.mock("../../../../icons/Icons", () => {
  const { Text } = require("react-native");
  return {
    LiveIcon: ({ testID }: any) => <Text testID={testID}>LIVE</Text>,
  };
});

describe("StepsHeader", () => {
  const rounds: LeagueFixtureRound[] = [
    { name: "Quarter-finals", days: [] },
    { name: "Semi-finals", days: [] },
    { name: "Final", days: [] },
  ];

  const t = (key: string, options?: any) => options?.defaultValue ?? key;

  it("renders the correct number of buttons", () => {
    const mockOnSelect = jest.fn();
    render(
      <StepsHeader
        rounds={rounds}
        activeIndex={1}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    const buttons = screen.getAllByTestId(/^step-button-/);
    expect(buttons).toHaveLength(rounds.length);
  });

  it("renders active button with yellow background", () => {
    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <StepsHeader
        rounds={rounds}
        activeIndex={1}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    const activeButton = getByTestId("step-button-1");
    expect(activeButton).toHaveStyle({ backgroundColor: colors.brand.yellow });
  });

  it("renders inactive button with dark background", () => {
    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <StepsHeader
        rounds={rounds}
        activeIndex={0}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    const inactiveButton = getByTestId("step-button-1");
    expect(inactiveButton).toHaveStyle({ backgroundColor: "#1E1E1E" });
  });

  it("calls onSelect with correct index when button is pressed", () => {
    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <StepsHeader
        rounds={rounds}
        activeIndex={0}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    const finalButton = getByTestId("step-button-2");
    fireEvent.press(finalButton);

    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });

  it("handles multiple button presses correctly", () => {
    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <StepsHeader
        rounds={rounds}
        activeIndex={0}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    fireEvent.press(getByTestId("step-button-1"));
    fireEvent.press(getByTestId("step-button-2"));

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, 1);
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, 2);
  });

  it("does not show live indicator when currentRoundIndex is undefined", () => {
    const mockOnSelect = jest.fn();
    render(
      <StepsHeader
        rounds={rounds}
        activeIndex={0}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    expect(screen.queryByTestId("step-live-0")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("step-live-1")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("step-live-2")).not.toBeOnTheScreen();
  });

  it("has correct accessibility attributes", () => {
    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <StepsHeader
        rounds={rounds}
        activeIndex={1}
        onSelect={mockOnSelect}
        t={t}
      />,
    );

    const activeButton = getByTestId("step-button-1");
    expect(activeButton).toHaveAccessibilityState({ selected: true });

    const inactiveButton = getByTestId("step-button-0");
    expect(inactiveButton).toHaveAccessibilityState({ selected: false });
  });
});
