import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TwoTeamsStatistics } from '@matchinsights/core';
import { useTranslation } from 'react-i18next';
import NoData from '../../general/no-data/NoData';
import TeamStats from '../../general/team-stats/TeamStats';
import { spacing, breakpoints } from '../../../theme';

interface LiveMatchStatsProps {
  statistics: TwoTeamsStatistics | undefined;
}

const MatchStats = ({ statistics }: LiveMatchStatsProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  if (!statistics) return <NoData />;

  const { teamA, teamB } = statistics as TwoTeamsStatistics;

  if (teamA?.statistics.length === 0 || teamB?.statistics.length === 0)
    return <NoData />;

  return (
    <View
      style={[
        styles.container,
        isLargeScreen || isTablet ? styles.containerLargeScreen : styles.containerMobile,
      ]}
      testID="match-stats-container"
    >
      <View
        style={[
          styles.statsWrapper,
          isLargeScreen || isTablet ? styles.statsWrapperRow : styles.statsWrapperColumn,
        ]}
      >
        <View
          style={[
            styles.teamStatsContainer,
            isLargeScreen || isTablet ? styles.teamStatsLarge : styles.teamStatsMobile,
          ]}
          testID="home-team-stats"
        >
          <TeamStats
            logo={teamA?.teamLogo}
            title={teamA?.teamName ?? t('team.home')}
            statistics={teamA?.statistics ?? []}
          />
        </View>

        <View
          style={[
            styles.teamStatsContainer,
            isLargeScreen || isTablet ? styles.teamStatsLarge : styles.teamStatsMobile,
          ]}
          testID="away-team-stats"
        >
          <TeamStats
            logo={teamB?.teamLogo}
            title={teamB?.teamName ?? t('team.away')}
            statistics={teamB?.statistics ?? []}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.md,
  },
  containerLargeScreen: {
    paddingHorizontal: spacing.lg,
  },
  containerMobile: {
    paddingHorizontal: spacing.md,
  },
  statsWrapper: {
    width: '100%',
  },
  statsWrapperRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  statsWrapperColumn: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  teamStatsContainer: {
    width: '100%',
  },
  teamStatsLarge: {
    flex: 1,
  },
  teamStatsMobile: {
    width: '100%',
  },
});

export default MatchStats;
