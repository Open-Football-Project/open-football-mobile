import {
  DonutsBrandColor,
  DonutsChartColors,
  LiveMatchIndicatorsDonut,
  LiveMatchIndicatorsDonutVerdictThresholds,
} from "@matchinsights/core";
import { colors } from "../../../theme";

export const LIVE_MATCH_INDICATORS_BRAND: DonutsBrandColor = {
  orange: "#FF6B00",
  aqualight: "#85f1e8",
  darkBg: "#121212",
  divider: "#2a2a2a",
};

export const LIVE_MATCH_INDICATORS_CHART_COLORS: DonutsChartColors = {
  homeTeam: LIVE_MATCH_INDICATORS_BRAND.orange,
  awayTeam: LIVE_MATCH_INDICATORS_BRAND.aqualight,
  track: LIVE_MATCH_INDICATORS_BRAND.darkBg,
  divider: LIVE_MATCH_INDICATORS_BRAND.divider,
};

export const LIVE_MATCH_INDICATORS_DONUT: LiveMatchIndicatorsDonut = {
  center: 50,
  radius: 35,
  strokeWidth: 14,
  circumference: 2 * Math.PI * 35,
  size: 100,
};

export const LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS: LiveMatchIndicatorsDonutVerdictThresholds =
  {
    dominating: 70,
    leading: 58,
    trailing: 42,
    dominated: 30,
  };

export const LIVE_MATCH_INDICATORS_VERDICT_COLORS = {
  homeLeading: colors.brand.orange,
  awayLeading: colors.brand.aqualight,
  contested: colors.brand.yellow,
} as const;
