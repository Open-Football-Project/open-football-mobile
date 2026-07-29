import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle, Line, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { IndicatorResult } from "@matchinsights/core";
import {
  LIVE_MATCH_INDICATORS_CHART_COLORS as CHART_COLORS,
  LIVE_MATCH_INDICATORS_DONUT as DONUT,
  LIVE_MATCH_INDICATORS_VERDICT_COLORS as VERDICT_COLORS,
  LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS as VERDICT_THRESHOLDS,
} from "./constants";
import { colors, fontSize, fontWeight, spacing } from "../../../theme";

interface LiveMatchPieChartProps {
  indicator: IndicatorResult;
  homeTeamName: string;
  awayTeamName: string;
  hasData: boolean;
  chartSize?: number;
  testID?: string;
}

const getVerdictColor = (homePercent: number, hasData: boolean): string => {
  if (!hasData) return VERDICT_COLORS.contested;
  if (homePercent >= VERDICT_THRESHOLDS.leading)
    return VERDICT_COLORS.homeLeading;
  if (homePercent <= VERDICT_THRESHOLDS.trailing)
    return VERDICT_COLORS.awayLeading;
  return VERDICT_COLORS.contested;
};

const toVerdictLabel = (
  homePercent: number,
  homeTeamName: string,
  awayTeamName: string,
  hasData: boolean,
  t: (key: string, opts?: Record<string, string>) => string,
): string => {
  if (!hasData) return t("indicators.verdict.no_data");
  if (homePercent >= VERDICT_THRESHOLDS.dominating)
    return t("indicators.verdict.dominating", { team: homeTeamName });
  if (homePercent >= VERDICT_THRESHOLDS.leading)
    return t("indicators.verdict.ahead", { team: homeTeamName });
  if (homePercent > VERDICT_THRESHOLDS.trailing)
    return t("indicators.verdict.even");
  if (homePercent > VERDICT_THRESHOLDS.dominated)
    return t("indicators.verdict.ahead", { team: awayTeamName });
  return t("indicators.verdict.dominating", { team: awayTeamName });
};

const toHomeDashLength = (homePercent: number, hasData: boolean): number =>
  hasData ? (homePercent / 100) * DONUT.circumference : 0;

const LiveMatchPieChart = ({
  indicator,
  homeTeamName,
  awayTeamName,
  hasData,
  chartSize = DONUT.size,
  testID,
}: LiveMatchPieChartProps) => {
  const { t } = useTranslation();

  const homeDash = toHomeDashLength(indicator.homePercent, hasData);
  const awayDash = DONUT.circumference - homeDash;
  const verdict = toVerdictLabel(
    indicator.homePercent,
    homeTeamName,
    awayTeamName,
    hasData,
    t,
  );
  const verdictColor = getVerdictColor(indicator.homePercent, hasData);

  return (
    <View
      style={styles.container}
      testID={testID ?? `live-pie-chart-${indicator.label}`}
    >
      <Text style={styles.label} numberOfLines={1}>
        {indicator.emoji} {t(indicator.label)}
      </Text>

      <Svg
        width={chartSize}
        height={chartSize}
        viewBox="0 0 100 100"
        testID={`pie-svg-${indicator.label}`}
      >
        <Circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.track}
          strokeWidth={DONUT.strokeWidth}
        />
        <Circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.awayTeam}
          strokeWidth={DONUT.strokeWidth}
          strokeDasharray={`${awayDash} ${homeDash}`}
          strokeDashoffset={awayDash}
          rotation={-90}
          origin={`${DONUT.center}, ${DONUT.center}`}
        />
        <Circle
          cx={DONUT.center}
          cy={DONUT.center}
          r={DONUT.radius}
          fill="none"
          stroke={CHART_COLORS.homeTeam}
          strokeWidth={DONUT.strokeWidth}
          strokeDasharray={`${homeDash} ${DONUT.circumference}`}
          rotation={-90}
          origin={`${DONUT.center}, ${DONUT.center}`}
        />
        <Line
          x1="38"
          y1="51"
          x2="62"
          y2="51"
          stroke={CHART_COLORS.divider}
          strokeWidth="1"
        />
        <SvgText
          x={DONUT.center}
          y="46"
          textAnchor="middle"
          fontSize="10"
          fill={CHART_COLORS.homeTeam}
          fontWeight="bold"
        >
          {Math.round(indicator.homePercent)}%
        </SvgText>
        <SvgText
          x={DONUT.center}
          y="62"
          textAnchor="middle"
          fontSize="10"
          fill={CHART_COLORS.awayTeam}
          fontWeight="bold"
        >
          {Math.round(indicator.awayPercent)}%
        </SvgText>
      </Svg>

      <Text style={[styles.verdict, { color: verdictColor }]} numberOfLines={2}>
        {verdict}
      </Text>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: CHART_COLORS.homeTeam },
            ]}
          />
          <Text style={styles.legendName} numberOfLines={1}>
            {homeTeamName}
          </Text>
        </View>
        <View style={[styles.legendItem, styles.legendItemRight]}>
          <Text style={styles.legendName} numberOfLines={1}>
            {awayTeamName}
          </Text>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: CHART_COLORS.awayTeam },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    textAlign: "center",
  },
  verdict: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: spacing.xs,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
    minWidth: 0,
  },
  legendItemRight: {
    justifyContent: "flex-end",
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  legendName: {
    fontSize: 9,
    color: colors.text.primary,
    flexShrink: 1,
  },
});

export default LiveMatchPieChart;
