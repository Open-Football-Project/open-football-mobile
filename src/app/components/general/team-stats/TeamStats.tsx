import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TeamStatistic, buildTeamStatsSvgString } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../../theme";
import ShareSvgButton from "../share-svg-button/ShareSvgButton";

interface StatChartProps {
  title: string;
  statistics: TeamStatistic[];
  logo?: string;
}

const TeamStats = ({ title, statistics, logo }: StatChartProps) => {
  const { t } = useTranslation();

  const getBarColor = (percent: number, isPositive: boolean): string => {
    if (isPositive && percent <= 20) return colors.brand.red;
    if (isPositive && percent > 20 && percent <= 50)
      return colors.brand.yellowl;
    if (isPositive && percent > 50) return colors.brand.green;

    if (!isPositive && percent <= 20) return colors.brand.green;
    if (!isPositive && percent > 20 && percent <= 50)
      return colors.brand.yellowl;
    if (!isPositive && percent > 50) return colors.brand.red;

    return colors.brand.dona;
  };

  const displayedName = (statName: string): string => {
    if (statName.includes("_")) {
      return statName.replace("_", " ").trim().toUpperCase();
    }
    return statName.trim();
  };

  const widthPercent = (stat: TeamStatistic): number =>
    Math.min((stat.value / stat.total) * 100, 100);

  const translationKey = (statDisplayed: string): string =>
    statDisplayed.trim().toLowerCase().replace(/\s+/g, "_");

  const statLabel = (statName: string): string =>
    t(`stats.${translationKey(displayedName(statName))}`).toUpperCase();

  const svgString = buildTeamStatsSvgString({
    title,
    statistics,
    logo,
    statLabel,
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {logo && (
          <Image
            source={{ uri: logo }}
            style={styles.logo}
            testID="team-stats-logo"
          />
        )}
        <Text style={styles.title} numberOfLines={1} testID="team-stats-title">
          {title}
        </Text>
        <ShareSvgButton svgString={svgString} />
      </View>

      <View style={styles.statsContainer}>
        {statistics.map((stat, idx) => {
          const barWidthPercent = widthPercent(stat);
          const barColor = getBarColor(barWidthPercent, stat.isPositive);

          return (
            <View
              key={stat.name}
              style={styles.statItem}
              testID={`${title}-stat-${idx}`}
            >
              <View style={styles.statHeader}>
                <Text
                  style={styles.statName}
                  numberOfLines={1}
                  testID={`stat-name-${idx}`}
                >
                  {statLabel(stat.name)}
                </Text>
                <Text style={styles.statValue} testID={`stat-value-${idx}`}>
                  {stat.value}
                </Text>
              </View>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { width: `${barWidthPercent}%`, backgroundColor: barColor },
                  ]}
                  testID={`stat-bar-${idx}`}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.background.navbar,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    minWidth: 80,
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  statsContainer: {
    gap: spacing.sm,
  },
  statItem: {
    marginBottom: spacing.sm,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  statName: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.text.primary,
    fontWeight: fontWeight.normal,
  },
  statValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.brand.cream,
  },
  barContainer: {
    width: "100%",
    height: 8,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  bar: {
    height: 8,
    borderRadius: borderRadius.sm,
  },
});

export default TeamStats;
