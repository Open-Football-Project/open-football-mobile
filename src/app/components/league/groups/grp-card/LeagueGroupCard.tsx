import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { LeagueGroup, leagueGroupTranslation } from "open-football-project-core";
import { useTranslation } from "react-i18next";
import { LeagueTable } from "../../league-table/LeagueTable";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  breakpoints,
} from "../../../../theme";

interface LeagueGroupCardProps {
  group: LeagueGroup;
}

const LeagueGroupCard = ({ group }: LeagueGroupCardProps) => {
  const { i18n } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const getResponsiveStyles = () => {
    if (isTV) {
      return {
        containerPadding: spacing.lg,
        titleFontSize: fontSize.lg,
        titlePadding: spacing.md,
      };
    }
    if (isLargeScreen) {
      return {
        containerPadding: spacing.md,
        titleFontSize: fontSize.base,
        titlePadding: spacing.sm,
      };
    }
    if (isTablet) {
      return {
        containerPadding: spacing.sm,
        titleFontSize: fontSize.sm,
        titlePadding: spacing.sm,
      };
    }
    return {
      containerPadding: spacing.sm,
      titleFontSize: fontSize.sm,
      titlePadding: spacing.xs,
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <View
      style={[styles.container, { padding: responsiveStyles.containerPadding }]}
      accessible
      accessibilityLabel={`${leagueGroupTranslation(
        group.label ?? "",
        i18n.language,
      )}`}
    >
      <View
        style={[
          styles.titleContainer,
          { paddingVertical: responsiveStyles.titlePadding },
        ]}
      >
        <Text
          style={[styles.title, { fontSize: responsiveStyles.titleFontSize }]}
        >
          {leagueGroupTranslation(group.label ?? "", i18n.language)}
        </Text>
      </View>
      <LeagueTable teams={group.teams} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.dark,
  } as ViewStyle,
  titleContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  } as ViewStyle,
  title: {
    textAlign: "center",
    color: colors.white,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
  } as TextStyle,
});

export default LeagueGroupCard;
