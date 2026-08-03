import React, { useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import {
  ApiService,
  buildFixtureSvgString,
  teamFixtureMatchesToFixtureRound,
} from "open-football-project-core";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import MatchRow from "../../match/match-row/MatchRow";
import NoData from "../../general/no-data/NoData";
import { spacing, breakpoints, fontSize, colors, borderRadius } from "../../../theme";

export interface TeamMatch {
  fixtureId: number;
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  isFinished: boolean;
  isLiveNow: boolean;
  statusShort: string;
  date: string;
}

interface MatchItemProps {
  match: TeamMatch;
  responsiveStyles: ReturnType<typeof useResponsiveStyles>;
  apiService: ApiService;
}

const useResponsiveStyles = () => {
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  return useMemo(() => {
    if (isTV) {
      return {
        matchItemPadding: spacing.lg,
        teamNameFontSize: fontSize.base,
        scoreFontSize: fontSize.lg,
        scoreWidth: 60,
        logoSize: 32,
        matchItemGap: spacing.md,
      };
    }
    if (isLargeScreen) {
      return {
        matchItemPadding: spacing.md,
        teamNameFontSize: fontSize.base,
        scoreFontSize: fontSize.base,
        scoreWidth: 50,
        logoSize: 28,
        matchItemGap: spacing.sm,
      };
    }
    if (isTablet) {
      return {
        matchItemPadding: spacing.md,
        teamNameFontSize: fontSize.sm,
        scoreFontSize: fontSize.sm,
        scoreWidth: 45,
        logoSize: 24,
        matchItemGap: spacing.sm,
      };
    }
    return {
      matchItemPadding: spacing.sm,
      teamNameFontSize: fontSize.xs,
      scoreFontSize: fontSize.sm,
      scoreWidth: 45,
      logoSize: 20,
      matchItemGap: spacing.xs,
    };
  }, [isTV, isLargeScreen, isTablet]);
};

const MatchItem = ({ match, responsiveStyles, apiService }: MatchItemProps) => {
  return (
    <MatchRow
      match={match}
      testID={`match-${match.fixtureId}`}
      apiService={apiService}
      logoOuter={false}
      style={[styles.matchItemRow, { gap: responsiveStyles.matchItemGap }]}
      cardStyle={[
        styles.matchItem,
        { paddingHorizontal: responsiveStyles.matchItemPadding },
      ]}
      sizing={{
        teamNameFontSize: responsiveStyles.teamNameFontSize,
        scoreFontSize: responsiveStyles.scoreFontSize,
        logoSize: responsiveStyles.logoSize,
        scoreWidth: responsiveStyles.scoreWidth,
      }}
    />
  );
};

interface TeamMatchesListProps {
  matches: TeamMatch[];
  teamName: string;
  teamLogo?: string;
  label: string;
  apiService: ApiService;
  loading?: boolean;
  emptyMessageKey?: string;
  testID?: string;
}

const TeamMatchesList = ({
  matches,
  teamName,
  teamLogo,
  label,
  apiService,
  loading = false,
  emptyMessageKey = "common.no_matches",
  testID = "team-matches-list",
}: TeamMatchesListProps) => {
  const responsiveStyles = useResponsiveStyles();
  const fixtureRound = teamFixtureMatchesToFixtureRound(matches as any, label);
  const svgString = buildFixtureSvgString(fixtureRound, teamName, teamLogo);

  if (loading) {
    return (
      <View style={styles.loadingContainer} testID={`${testID}-loading`}>
        <NoData loading />
      </View>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer} testID={`${testID}-empty`}>
        <NoData />
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>

      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchItem match={item} responsiveStyles={responsiveStyles} apiService={apiService} />
        )}
        keyExtractor={(item, index) => `${item.fixtureId}-${index}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        testID={`${testID}-flatlist`}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.toolbar}>
        <ShareSvgButton svgString={svgString} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: spacing.xs,
  } as ViewStyle,
  loadingContainer: {
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyContainer: {
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  matchItem: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  matchItemRow: {
    justifyContent: "space-between",
  } as ViewStyle,
  separator: {
    height: spacing.sm,
  } as ViewStyle,
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  } as ViewStyle,
});

export default TeamMatchesList;
