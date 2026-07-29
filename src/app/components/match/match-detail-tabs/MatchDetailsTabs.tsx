import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TeamsLineups,
  MatchEvent,
  TwoTeamsStatistics,
} from 'open-football-project-core';

import MatchEventsTable from '../match-events-table/MatchEventsTable';
import MatchStats from '../match-stats/MatchStats';
import MatchLineups from '../match-lineups/MatchLineups';
import { ScreenTabs, TabItem } from '../../general/screen-tabs/ScreenTabs';

import {
  colors,
  borderRadius,
  borders,
} from '../../../theme';

interface MatchDetailsTabsProps {
  matchEvents: MatchEvent[];
  liveStats: TwoTeamsStatistics | undefined;
  liveLineups: TeamsLineups | undefined;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
}

const MatchDetailsTabs = ({
  matchEvents,
  liveStats,
  liveLineups,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
}: MatchDetailsTabsProps) => {
  const hasEvents = !!(matchEvents && matchEvents.length > 0);
  const hasStats = !!(liveStats && liveStats.teamA && liveStats.teamB);
  const hasLineups = !!(liveLineups && liveLineups.teamA && liveLineups.teamB);

  const tabs: TabItem[] = [
    {
      titleTranslationKey: 'detailtabs.events',
      isAvailable: hasEvents,
      component: hasEvents ? (
        <MatchEventsTable
          events={matchEvents}
          homeTeamName={homeTeamName}
          homeTeamLogo={homeTeamLogo}
          awayTeamName={awayTeamName}
          awayTeamLogo={awayTeamLogo}
        />
      ) : null,
      testID: 'tab-button-events',
    },
    {
      titleTranslationKey: 'detailtabs.stats',
      isAvailable: hasStats,
      component: hasStats ? (
        <MatchStats statistics={liveStats} />
      ) : null,
      testID: 'tab-button-stats',
    },
    {
      titleTranslationKey: 'detailtabs.lineups',
      isAvailable: hasLineups,
      component: hasLineups ? (
        <MatchLineups lineups={liveLineups!} />
      ) : null,
      testID: 'tab-button-lineups',
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenTabs
        tabs={tabs}
        testIDPrefix="match-details-tabs"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,

    borderWidth: borders.thin,
    borderColor: colors.brand.dona,

    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
});

export default MatchDetailsTabs;
