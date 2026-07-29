import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import {
  TwoTeamsStatistics,
  useLiveIndicators,
  buildLiveIndicatorsDonutsSvgString,
} from "open-football-project-core";
import LiveMatchPieChart from "./pie-chart/LiveMatchPieChart";
import ShareSvgButton from "../general/share-svg-button/ShareSvgButton";
import { colors, spacing, borderRadius, borders, breakpoints } from "../../theme";
import {
  LIVE_MATCH_INDICATORS_BRAND,
  LIVE_MATCH_INDICATORS_DONUT,
  LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS,
} from "./pie-chart/constants";

interface MatchLiveIndicatorsProps {
  liveStats: TwoTeamsStatistics | undefined;
  homeTeamName: string;
  awayTeamName: string;
  style?: ViewStyle;
}

type TFunction = (key: string, opts?: Record<string, string>) => string;

const DONUT_TRKEYS = {
  veredictDominating: "indicators.verdict.dominating",
  veredictAhead: "indicators.verdict.ahead",
  veredictEven: "indicators.verdict.even",
  veredictDominated: "indicators.verdict.dominating",
  veredictNoData: "indicators.verdict.no_data",
} as const;

const MatchLiveIndicators = ({
  liveStats,
  homeTeamName,
  awayTeamName,
  style,
}: MatchLiveIndicatorsProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { control, momentum, goalThreat, hasData } =
    useLiveIndicators(liveStats);

  const isLargeScreen = width >= breakpoints.tablet;
  const chartSize = isLargeScreen ? 112 : 84;

  const svgString = useMemo(
    () =>
      buildLiveIndicatorsDonutsSvgString(
        homeTeamName,
        awayTeamName,
        momentum,
        control,
        goalThreat,
        hasData,
        t,
        LIVE_MATCH_INDICATORS_DONUT,
        LIVE_MATCH_INDICATORS_BRAND,
        LIVE_MATCH_INDICATORS_VERDICT_THRESHOLDS,
        DONUT_TRKEYS,
      ),
    [homeTeamName, awayTeamName, momentum, control, goalThreat, hasData, t],
  );

  return (
    <View style={[styles.container, style]} testID="match-live-indicators">
      <View style={styles.chartsRow}>
        <LiveMatchPieChart
          indicator={momentum}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
          chartSize={chartSize}
          testID="pie-chart-momentum"
        />
        <View style={styles.divider} />
        <LiveMatchPieChart
          indicator={control}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
          chartSize={chartSize}
          testID="pie-chart-control"
        />
        <View style={styles.divider} />
        <LiveMatchPieChart
          indicator={goalThreat}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          hasData={hasData}
          chartSize={chartSize}
          testID="pie-chart-goal-threat"
        />
      </View>

      <View style={styles.shareButtonContainer}>
        <ShareSvgButton svgString={svgString} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,

    borderWidth: 1,
    borderColor: colors.brand.dona,
    borderRadius: borderRadius.md,

    padding: spacing.md,
    gap: spacing.md,

    overflow: 'hidden',
  },

  chartsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.background.dark,
  },

  shareButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderTopWidth: 1,
    borderTopColor: colors.secondary.dark,

    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.dark,

    alignItems: 'flex-end',
  },
});

export default MatchLiveIndicators;
