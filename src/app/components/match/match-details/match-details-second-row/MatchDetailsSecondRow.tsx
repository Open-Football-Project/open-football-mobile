import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import {
  ApiService,
  useSeasonStats,
  useLastFiveMatchesEvents,
} from "open-football-project-core";
import ScreenSlider from "../../../general/screen-slider/ScreenSlider";
import MatchEvents from "../summaries/match-events/MatchEvents";
import NoData from "../../../general/no-data/NoData";
import TeamStats from "../../../general/team-stats/TeamStats";
import { useTranslation } from "react-i18next";
import { colors, spacing, fontSize, fontWeight, breakpoints, borderRadius } from "../../../../theme";

interface MatchDetailsSecondRowProps {
  apiService: ApiService;
  homeTeamId: number;
  homeTeam: string;
  awayTeamId: number;
  awayTeam: string;
  leagueId: number;
}

export const MatchDetailsSecondRow = ({
  apiService,
  homeTeamId,
  homeTeam,
  awayTeamId,
  awayTeam,
  leagueId,
}: MatchDetailsSecondRowProps) => {
  const {
    loadingAwayEvents,
    awayEventsSummary,
    loadingHomeEvents,
    homeEventsSummary,
    isAwayEventsAvailable,
    isHomeEventsAvailable,
  } = useLastFiveMatchesEvents(apiService, homeTeamId, awayTeamId);

  const { loadingSeasonStats, seasonStats, isSeasonStatsAvailable } =
    useSeasonStats(apiService, homeTeamId, awayTeamId, leagueId);

  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;

  const sliderItems = [
    isHomeEventsAvailable ? (
      <View key="home-events">
        <Text style={styles.itemTitle}>
          {homeTeam} {t("common.last_five_summary")}
        </Text>
        <MatchEvents loading={loadingHomeEvents} events={homeEventsSummary} />
      </View>
    ) : null,
    isAwayEventsAvailable ? (
      <View key="away-events">
        <Text style={styles.itemTitle}>
          {awayTeam} {t("common.last_five_summary")}
        </Text>
        <MatchEvents loading={loadingAwayEvents} events={awayEventsSummary} />
      </View>
    ) : null,
  ].filter(Boolean) as React.ReactNode[];

  return (
    <>
      {loadingSeasonStats && (
        <View testID="second-row-loading">
          <NoData loading />
        </View>
      )}

      {!loadingSeasonStats && isSeasonStatsAvailable && (
        <View
          style={[
            styles.container,
            isLargeScreen ? styles.containerRow : styles.containerColumn,
          ]}
          testID="season-stats-container"
        >
          <View
            style={[styles.statsWrapper, isLargeScreen && styles.halfWidth]}
          >
            <TeamStats
              logo={seasonStats?.teamA?.teamLogo}
              title={`${t("common.season_summary")}`}
              statistics={seasonStats?.teamA?.statistics ?? []}
            />
          </View>
          <View
            style={[styles.statsWrapper, isLargeScreen && styles.halfWidth]}
          >
            <TeamStats
              logo={seasonStats?.teamB?.teamLogo}
              title={`${t("common.season_summary")}`}
              statistics={seasonStats?.teamB?.statistics ?? []}
            />
          </View>
        </View>
      )}

      {!loadingSeasonStats && !isSeasonStatsAvailable && (
        isLargeScreen && sliderItems.length > 1 ? (
          <View style={[styles.container, styles.containerRow]} testID="second-row-events-row">
            {sliderItems.map((item, index) => (
              <View key={index} style={[styles.halfWidth, styles.eventsCard]}>
                {item}
              </View>
            ))}
          </View>
        ) : (
          <ScreenSlider
            key={`second-row-slider-${homeTeamId}-${awayTeamId}`}
            items={sliderItems}
            testIDPrefix="second-row-slider"
          />
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: spacing.lg,
  },
  containerRow: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  containerColumn: {
    flexDirection: "column",
    gap: spacing.lg,
  },
  statsWrapper: {
    flex: 1,
  },
  halfWidth: {
    flex: 0.5,
  },
  eventsCard: {
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  itemTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.orange,
    textAlign: "center",
    paddingVertical: spacing.sm,
    textTransform: "uppercase",
  },
});
