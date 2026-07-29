import React from "react";
import { render, screen } from "@testing-library/react-native";
import {
  HamburgerIcon,
  CloseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LiveIcon,
  FootballIcon,
  ChartIcon,
  CalendarIcon,
  TrophyIcon,
  BackArrowIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  GlobeIcon,
  SearchIcon,
  XIcon,
  TimerIcon,
  RefreshIcon,
  CorrectIcon,
  IncorrectIcon,
  HintIcon,
  PlayerIcon,
  StadiumIcon,
  CelebrationIcon,
  SparkleIcon,
  TableIcon,
  RankingIcon,
  ListIcon,
  ShieldIcon,
  TransferArrowIcon,
  InjuredIcon,
  PersonIcon,
} from "./Icons";
import { colors } from "../theme";

jest.mock("react-native-feather", () => {
  const React = require("react");
  const { View } = require("react-native");
  return new Proxy(
    {},
    {
      get: (_target: object, _iconName: string) =>
        ({ testID, size, color }: { testID?: string; size?: number; color?: string }) =>
          React.createElement(View, { testID, size, color }),
    },
  );
});

describe("Icons", () => {
  describe("HamburgerIcon", () => {
    it("renders with default testID", () => {
      render(<HamburgerIcon />);
      expect(screen.getByTestId("hamburger-icon")).toBeTruthy();
    });

    it("renders with custom testID", () => {
      render(<HamburgerIcon testID="custom-icon" />);
      expect(screen.getByTestId("custom-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<HamburgerIcon />);
      expect(screen.queryByText("☰")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<HamburgerIcon size={32} testID="sized-icon" />);
      expect(screen.getByTestId("sized-icon").props.size).toBe(32);
    });

    it("passes color to the icon", () => {
      render(<HamburgerIcon color="#FF0000" testID="colored-icon" />);
      expect(screen.getByTestId("colored-icon").props.color).toBe("#FF0000");
    });
  });

  describe("CloseIcon", () => {
    it("renders with default testID", () => {
      render(<CloseIcon />);
      expect(screen.getByTestId("close-icon")).toBeTruthy();
    });

    it("renders with custom testID", () => {
      render(<CloseIcon testID="custom-close" />);
      expect(screen.getByTestId("custom-close")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<CloseIcon />);
      expect(screen.queryByText("✕")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<CloseIcon size={24} testID="sized-close" />);
      expect(screen.getByTestId("sized-close").props.size).toBe(24);
    });

    it("passes color to the icon", () => {
      render(<CloseIcon color="#00FF00" testID="colored-close" />);
      expect(screen.getByTestId("colored-close").props.color).toBe("#00FF00");
    });

    it("uses white color by default", () => {
      render(<CloseIcon testID="default-close" />);
      expect(screen.getByTestId("default-close").props.color).toBe(colors.white);
    });
  });

  describe("ArrowUpIcon", () => {
    it("renders with default testID", () => {
      render(<ArrowUpIcon />);
      expect(screen.getByTestId("arrow-up-icon")).toBeTruthy();
    });

    it("renders with custom testID", () => {
      render(<ArrowUpIcon testID="custom-up" />);
      expect(screen.getByTestId("custom-up")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ArrowUpIcon />);
      expect(screen.queryByText("▲")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ArrowUpIcon size={20} testID="sized-up" />);
      expect(screen.getByTestId("sized-up").props.size).toBe(20);
    });

    it("passes color to the icon", () => {
      render(<ArrowUpIcon color="#0000FF" testID="colored-up" />);
      expect(screen.getByTestId("colored-up").props.color).toBe("#0000FF");
    });
  });

  describe("ArrowDownIcon", () => {
    it("renders with default testID", () => {
      render(<ArrowDownIcon />);
      expect(screen.getByTestId("arrow-down-icon")).toBeTruthy();
    });

    it("renders with custom testID", () => {
      render(<ArrowDownIcon testID="custom-down" />);
      expect(screen.getByTestId("custom-down")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ArrowDownIcon />);
      expect(screen.queryByText("▼")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ArrowDownIcon size={18} testID="sized-down" />);
      expect(screen.getByTestId("sized-down").props.size).toBe(18);
    });

    it("passes color to the icon", () => {
      render(<ArrowDownIcon color="#FFFF00" testID="colored-down" />);
      expect(screen.getByTestId("colored-down").props.color).toBe("#FFFF00");
    });
  });

  describe("LiveIcon", () => {
    it("renders the live icon character", () => {
      render(<LiveIcon />);
      expect(screen.getByText("🔴")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<LiveIcon />);
      expect(screen.getByTestId("live-icon")).toBeTruthy();
    });

    it("uses live semantic color by default", () => {
      render(<LiveIcon testID="default-live" />);
      const icon = screen.getByTestId("default-live");
      expect(icon.props.style.color).toBe(colors.semantic.live);
    });

    it("applies custom size", () => {
      render(<LiveIcon size={24} testID="sized-live" />);
      const icon = screen.getByTestId("sized-live");
      expect(icon.props.style.fontSize).toBe(24);
    });
  });

  describe("FootballIcon", () => {
    it("renders the football icon character", () => {
      render(<FootballIcon />);
      expect(screen.getByText("⚽")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<FootballIcon />);
      expect(screen.getByTestId("football-icon")).toBeTruthy();
    });

    it("applies custom size", () => {
      render(<FootballIcon size={32} testID="sized-football" />);
      const icon = screen.getByTestId("sized-football");
      expect(icon.props.style.fontSize).toBe(32);
    });
  });

  describe("ChartIcon", () => {
    it("renders the chart icon character", () => {
      render(<ChartIcon />);
      expect(screen.getByText("📈")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<ChartIcon />);
      expect(screen.getByTestId("chart-icon")).toBeTruthy();
    });

    it("applies custom size", () => {
      render(<ChartIcon size={28} testID="sized-chart" />);
      const icon = screen.getByTestId("sized-chart");
      expect(icon.props.style.fontSize).toBe(28);
    });
  });

  describe("CalendarIcon", () => {
    it("renders with default testID", () => {
      render(<CalendarIcon />);
      expect(screen.getByTestId("calendar-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<CalendarIcon />);
      expect(screen.queryByText("📅")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<CalendarIcon size={20} testID="sized-calendar" />);
      expect(screen.getByTestId("sized-calendar").props.size).toBe(20);
    });

    it("passes color to the icon", () => {
      render(<CalendarIcon color="#FF0000" testID="colored-calendar" />);
      expect(screen.getByTestId("colored-calendar").props.color).toBe("#FF0000");
    });
  });

  describe("TrophyIcon", () => {
    it("renders with default testID", () => {
      render(<TrophyIcon />);
      expect(screen.getByTestId("trophy-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<TrophyIcon />);
      expect(screen.queryByText("🏆")).toBeNull();
    });

    it("uses yellow color by default", () => {
      render(<TrophyIcon testID="default-trophy" />);
      expect(screen.getByTestId("default-trophy").props.color).toBe(colors.brand.yellow);
    });

    it("passes size to the icon", () => {
      render(<TrophyIcon size={36} testID="sized-trophy" />);
      expect(screen.getByTestId("sized-trophy").props.size).toBe(36);
    });
  });

  describe("BackArrowIcon", () => {
    it("renders with default testID", () => {
      render(<BackArrowIcon />);
      expect(screen.getByTestId("back-arrow-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<BackArrowIcon />);
      expect(screen.queryByText("←")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<BackArrowIcon size={24} testID="sized-back" />);
      expect(screen.getByTestId("sized-back").props.size).toBe(24);
    });

    it("passes color to the icon", () => {
      render(<BackArrowIcon color="#FF0000" testID="colored-back" />);
      expect(screen.getByTestId("colored-back").props.color).toBe("#FF0000");
    });
  });

  describe("ChevronRightIcon", () => {
    it("renders with default testID", () => {
      render(<ChevronRightIcon />);
      expect(screen.getByTestId("chevron-right-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ChevronRightIcon />);
      expect(screen.queryByText("›")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ChevronRightIcon size={16} testID="sized-chevron" />);
      expect(screen.getByTestId("sized-chevron").props.size).toBe(16);
    });

    it("passes color to the icon", () => {
      render(<ChevronRightIcon color="#FF0000" testID="colored-chevron" />);
      expect(screen.getByTestId("colored-chevron").props.color).toBe("#FF0000");
    });
  });

  describe("ChevronLeftIcon", () => {
    it("renders with default testID", () => {
      render(<ChevronLeftIcon />);
      expect(screen.getByTestId("chevron-left-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ChevronLeftIcon />);
      expect(screen.queryByText("‹")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ChevronLeftIcon size={16} testID="sized-chevron-left" />);
      expect(screen.getByTestId("sized-chevron-left").props.size).toBe(16);
    });

    it("passes color to the icon", () => {
      render(<ChevronLeftIcon color="#FF0000" testID="colored-chevron-left" />);
      expect(screen.getByTestId("colored-chevron-left").props.color).toBe("#FF0000");
    });
  });

  describe("ChevronUpIcon", () => {
    it("renders with default testID", () => {
      render(<ChevronUpIcon />);
      expect(screen.getByTestId("chevron-up-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ChevronUpIcon />);
      expect(screen.queryByText("▲")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ChevronUpIcon size={16} testID="sized-chevron-up" />);
      expect(screen.getByTestId("sized-chevron-up").props.size).toBe(16);
    });

    it("passes color to the icon", () => {
      render(<ChevronUpIcon color="#FF0000" testID="colored-chevron-up" />);
      expect(screen.getByTestId("colored-chevron-up").props.color).toBe("#FF0000");
    });
  });

  describe("ChevronDownIcon", () => {
    it("renders with default testID", () => {
      render(<ChevronDownIcon />);
      expect(screen.getByTestId("chevron-down-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<ChevronDownIcon />);
      expect(screen.queryByText("▼")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<ChevronDownIcon size={16} testID="sized-chevron-down" />);
      expect(screen.getByTestId("sized-chevron-down").props.size).toBe(16);
    });

    it("passes color to the icon", () => {
      render(<ChevronDownIcon color="#FF0000" testID="colored-chevron-down" />);
      expect(screen.getByTestId("colored-chevron-down").props.color).toBe("#FF0000");
    });
  });

  describe("GlobeIcon", () => {
    it("renders with default testID", () => {
      render(<GlobeIcon />);
      expect(screen.getByTestId("globe-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<GlobeIcon />);
      expect(screen.queryByText("🌍")).toBeNull();
    });

    it("passes size to the icon", () => {
      render(<GlobeIcon size={20} testID="sized-globe" />);
      expect(screen.getByTestId("sized-globe").props.size).toBe(20);
    });

    it("passes color to the icon", () => {
      render(<GlobeIcon color="#FF0000" testID="colored-globe" />);
      expect(screen.getByTestId("colored-globe").props.color).toBe("#FF0000");
    });
  });

  describe("TimerIcon", () => {
    it("renders with default testID", () => {
      render(<TimerIcon />);
      expect(screen.getByTestId("timer-icon")).toBeTruthy();
    });

    it("does not render a text character", () => {
      render(<TimerIcon />);
      expect(screen.queryByText("⏱")).toBeNull();
    });

    it("uses yellow color by default", () => {
      render(<TimerIcon testID="default-timer" />);
      expect(screen.getByTestId("default-timer").props.color).toBe(colors.brand.yellow);
    });

    it("passes size to the icon", () => {
      render(<TimerIcon size={24} testID="sized-timer" />);
      expect(screen.getByTestId("sized-timer").props.size).toBe(24);
    });

    it("passes color to the icon", () => {
      render(<TimerIcon color="#FF0000" testID="colored-timer" />);
      expect(screen.getByTestId("colored-timer").props.color).toBe("#FF0000");
    });
  });

  describe("SearchIcon", () => {
    it("renders the search icon character", () => {
      render(<SearchIcon />);
      expect(screen.getByText("🔍")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<SearchIcon />);
      expect(screen.getByTestId("search-icon")).toBeTruthy();
    });

    it("uses secondary color by default", () => {
      render(<SearchIcon testID="default-search" />);
      const icon = screen.getByTestId("default-search");
      expect(icon.props.style.color).toBe(colors.text.secondary);
    });

    it("applies custom size", () => {
      render(<SearchIcon size={22} testID="sized-search" />);
      const icon = screen.getByTestId("sized-search");
      expect(icon.props.style.fontSize).toBe(22);
    });
  });

  describe("XIcon", () => {
    it("renders the X icon character", () => {
      render(<XIcon />);
      expect(screen.getByText("𝕏")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<XIcon />);
      expect(screen.getByTestId("x-icon")).toBeTruthy();
    });

    it("uses primary color by default", () => {
      render(<XIcon testID="default-x" />);
      const icon = screen.getByTestId("default-x");
      expect(icon.props.style.color).toBe(colors.text.primary);
    });

    it("applies custom size and color", () => {
      render(<XIcon size={20} color={colors.brand.yellow} testID="custom-x" />);
      const icon = screen.getByTestId("custom-x");
      expect(icon.props.style.fontSize).toBe(20);
      expect(icon.props.style.color).toBe(colors.brand.yellow);
    });
  });

  describe("RefreshIcon", () => {
    it("renders the refresh icon character", () => {
      render(<RefreshIcon />);
      expect(screen.getByText("🔄")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<RefreshIcon />);
      expect(screen.getByTestId("refresh-icon")).toBeTruthy();
    });

    it("applies custom size", () => {
      render(<RefreshIcon size={24} testID="sized-refresh" />);
      const icon = screen.getByTestId("sized-refresh");
      expect(icon.props.style.fontSize).toBe(24);
    });
  });

  describe("CorrectIcon", () => {
    it("renders the correct icon character", () => {
      render(<CorrectIcon />);
      expect(screen.getByText("✓")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<CorrectIcon />);
      expect(screen.getByTestId("correct-icon")).toBeTruthy();
    });

    it("uses success color by default", () => {
      render(<CorrectIcon testID="default-correct" />);
      const icon = screen.getByTestId("default-correct");
      expect(icon.props.style.color).toBe(colors.brand.success);
    });
  });

  describe("IncorrectIcon", () => {
    it("renders the incorrect icon character", () => {
      render(<IncorrectIcon />);
      expect(screen.getByText("✗")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<IncorrectIcon />);
      expect(screen.getByTestId("incorrect-icon")).toBeTruthy();
    });

    it("uses danger color by default", () => {
      render(<IncorrectIcon testID="default-incorrect" />);
      const icon = screen.getByTestId("default-incorrect");
      expect(icon.props.style.color).toBe(colors.brand.danger);
    });
  });

  describe("HintIcon", () => {
    it("renders the hint icon character", () => {
      render(<HintIcon />);
      expect(screen.getByText("💡")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<HintIcon />);
      expect(screen.getByTestId("hint-icon")).toBeTruthy();
    });

    it("uses yellow color by default", () => {
      render(<HintIcon testID="default-hint" />);
      const icon = screen.getByTestId("default-hint");
      expect(icon.props.style.color).toBe(colors.brand.yellow);
    });
  });

  describe("PlayerIcon", () => {
    it("renders the player icon character", () => {
      render(<PlayerIcon />);
      expect(screen.getByText("👟")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<PlayerIcon />);
      expect(screen.getByTestId("player-icon")).toBeTruthy();
    });

    it("applies custom size", () => {
      render(<PlayerIcon size={28} testID="sized-player" />);
      const icon = screen.getByTestId("sized-player");
      expect(icon.props.style.fontSize).toBe(28);
    });
  });

  describe("StadiumIcon", () => {
    it("renders the stadium icon character", () => {
      render(<StadiumIcon />);
      expect(screen.getByText("🏟️")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<StadiumIcon />);
      expect(screen.getByTestId("stadium-icon")).toBeTruthy();
    });

    it("applies custom size", () => {
      render(<StadiumIcon size={24} testID="sized-stadium" />);
      const icon = screen.getByTestId("sized-stadium");
      expect(icon.props.style.fontSize).toBe(24);
    });
  });

  describe("CelebrationIcon", () => {
    it("renders the celebration icon character", () => {
      render(<CelebrationIcon />);
      expect(screen.getByText("🎉")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<CelebrationIcon />);
      expect(screen.getByTestId("celebration-icon")).toBeTruthy();
    });

    it("uses yellow color by default", () => {
      render(<CelebrationIcon testID="default-celebration" />);
      const icon = screen.getByTestId("default-celebration");
      expect(icon.props.style.color).toBe(colors.brand.yellow);
    });
  });

  describe("SparkleIcon", () => {
    it("renders the sparkle icon character", () => {
      render(<SparkleIcon />);
      expect(screen.getByText("✨")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<SparkleIcon />);
      expect(screen.getByTestId("sparkle-icon")).toBeTruthy();
    });

    it("uses yellow color by default", () => {
      render(<SparkleIcon testID="default-sparkle" />);
      const icon = screen.getByTestId("default-sparkle");
      expect(icon.props.style.color).toBe(colors.brand.yellow);
    });

    it("applies custom size and color", () => {
      render(<SparkleIcon size={32} color="#FFFFFF" testID="custom-sparkle" />);
      const icon = screen.getByTestId("custom-sparkle");
      expect(icon.props.style.fontSize).toBe(32);
      expect(icon.props.style.color).toBe("#FFFFFF");
    });
  });

  describe("TableIcon", () => {
    it("renders the table icon character", () => {
      render(<TableIcon />);
      expect(screen.getByText("📊")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<TableIcon />);
      expect(screen.getByTestId("table-icon")).toBeTruthy();
    });

    it("uses primary text color by default", () => {
      render(<TableIcon testID="default-table" />);
      const icon = screen.getByTestId("default-table");
      expect(icon.props.style.color).toBe(colors.text.primary);
    });

    it("applies custom size and color", () => {
      render(<TableIcon size={28} color="#00FF00" testID="custom-table" />);
      const icon = screen.getByTestId("custom-table");
      expect(icon.props.style.fontSize).toBe(28);
      expect(icon.props.style.color).toBe("#00FF00");
    });
  });

  describe("RankingIcon", () => {
    it("renders the ranking icon character", () => {
      render(<RankingIcon />);
      expect(screen.getByText("🏅")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<RankingIcon />);
      expect(screen.getByTestId("ranking-icon")).toBeTruthy();
    });

    it("uses yellow color by default", () => {
      render(<RankingIcon testID="default-ranking" />);
      const icon = screen.getByTestId("default-ranking");
      expect(icon.props.style.color).toBe(colors.brand.yellow);
    });

    it("applies custom size and color", () => {
      render(<RankingIcon size={24} color="#FFD700" testID="custom-ranking" />);
      const icon = screen.getByTestId("custom-ranking");
      expect(icon.props.style.fontSize).toBe(24);
      expect(icon.props.style.color).toBe("#FFD700");
    });
  });

  describe("ListIcon", () => {
    it("renders the list icon character", () => {
      render(<ListIcon />);
      expect(screen.getByText("📋")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<ListIcon />);
      expect(screen.getByTestId("list-icon")).toBeTruthy();
    });

    it("uses primary text color by default", () => {
      render(<ListIcon testID="default-list" />);
      const icon = screen.getByTestId("default-list");
      expect(icon.props.style.color).toBe(colors.text.primary);
    });

    it("applies custom size and color", () => {
      render(<ListIcon size={20} color="#0000FF" testID="custom-list" />);
      const icon = screen.getByTestId("custom-list");
      expect(icon.props.style.fontSize).toBe(20);
      expect(icon.props.style.color).toBe("#0000FF");
    });
  });

  describe("ShieldIcon", () => {
    it("renders the shield icon character", () => {
      render(<ShieldIcon />);
      expect(screen.getByText("🛡️")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<ShieldIcon />);
      expect(screen.getByTestId("shield-icon")).toBeTruthy();
    });

    it("uses secondary text color by default", () => {
      render(<ShieldIcon testID="default-shield" />);
      const icon = screen.getByTestId("default-shield");
      expect(icon.props.style.color).toBe(colors.text.secondary);
    });

    it("applies custom size and color", () => {
      render(<ShieldIcon size={24} color="#888888" testID="custom-shield" />);
      const icon = screen.getByTestId("custom-shield");
      expect(icon.props.style.fontSize).toBe(24);
      expect(icon.props.style.color).toBe("#888888");
    });
  });

  describe("TransferArrowIcon", () => {
    it("renders the transfer arrow icon character", () => {
      render(<TransferArrowIcon />);
      expect(screen.getByText("➜")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<TransferArrowIcon />);
      expect(screen.getByTestId("transfer-arrow-icon")).toBeTruthy();
    });

    it("uses orange brand color by default", () => {
      render(<TransferArrowIcon testID="default-transfer-arrow" />);
      const icon = screen.getByTestId("default-transfer-arrow");
      expect(icon.props.style.color).toBe(colors.brand.orange);
    });

    it("applies custom size and color", () => {
      render(
        <TransferArrowIcon
          size={20}
          color="#00FF00"
          testID="custom-transfer-arrow"
        />,
      );
      const icon = screen.getByTestId("custom-transfer-arrow");
      expect(icon.props.style.fontSize).toBe(20);
      expect(icon.props.style.color).toBe("#00FF00");
    });
  });

  describe("InjuredIcon", () => {
    it("renders the injured icon character", () => {
      render(<InjuredIcon />);
      expect(screen.getByText("🏥")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<InjuredIcon />);
      expect(screen.getByTestId("injured-icon")).toBeTruthy();
    });

    it("uses red brand color by default", () => {
      render(<InjuredIcon testID="default-injured" />);
      const icon = screen.getByTestId("default-injured");
      expect(icon.props.style.color).toBe(colors.brand.red);
    });

    it("applies custom size and color", () => {
      render(<InjuredIcon size={18} color="#FF0000" testID="custom-injured" />);
      const icon = screen.getByTestId("custom-injured");
      expect(icon.props.style.fontSize).toBe(18);
      expect(icon.props.style.color).toBe("#FF0000");
    });
  });

  describe("PersonIcon", () => {
    it("renders the person icon character", () => {
      render(<PersonIcon />);
      expect(screen.getByText("👤")).toBeTruthy();
    });

    it("renders with default testID", () => {
      render(<PersonIcon />);
      expect(screen.getByTestId("person-icon")).toBeTruthy();
    });

    it("uses primary text color by default", () => {
      render(<PersonIcon testID="default-person" />);
      const icon = screen.getByTestId("default-person");
      expect(icon.props.style.color).toBe(colors.text.primary);
    });

    it("applies custom size and color", () => {
      render(<PersonIcon size={28} color="#333333" testID="custom-person" />);
      const icon = screen.getByTestId("custom-person");
      expect(icon.props.style.fontSize).toBe(28);
      expect(icon.props.style.color).toBe("#333333");
    });
  });
});
