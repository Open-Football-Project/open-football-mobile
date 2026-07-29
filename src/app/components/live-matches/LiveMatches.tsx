import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  LiveMatch,
  useLiveMatchesStatus,
  useValueBets,
} from 'open-football-project-core';
import NoData from '../general/no-data/NoData';
import BettingToolWrapper from '../match/match-details/value-bets/wrapper/BettingToolWrapper';
import MatchDetailsTabs from '../match/match-detail-tabs/MatchDetailsTabs';
import MatchLiveIndicators from '../live-indicators/MatchLiveIndicators';
import LiveMatchCard from './live-match-card/LiveMatchCard';
import { spacing, breakpoints } from '../../theme';

interface LiveMatchesProps {
  apiService: ApiService;
  matches: LiveMatch[];
  fixtureId?: number;
}

export const LiveMatches = ({
  apiService,
  matches,
  fixtureId,
}: LiveMatchesProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const matchesGridGap = isLargeScreen ? spacing.md : isTablet ? spacing.sm : spacing.sm;
  const gridColumns = isLargeScreen ? 3 : isTablet ? 2 : 1;

  const {
    totalMatches,
    selectedMatchId,
    setSelectedMatchId,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    selectedMatch,
  } = useLiveMatchesStatus(apiService, matches, fixtureId);

  const { valueBets, loadingValueBets, isValueBetsAvailable } = useValueBets(
    apiService,
    selectedMatchId ?? -1
  );

  if (totalMatches === 0) {
    return <NoData message={t('common.no_live_matches', { defaultValue: 'No Live Matches Currently' })} />;
  }

  const handleMatchPress = useCallback(
    (matchId: number) => {
      setSelectedMatchId(matchId);
    },
    [setSelectedMatchId]
  );

  const renderMatchCard = ({ item: match }: { item: LiveMatch }) => (
    <LiveMatchCard
      match={match}
      isSelected={selectedMatchId === match.id}
      onPress={() => handleMatchPress(match.id)}
      apiService={apiService}
    />
  );

  return (
  <View
    style={[
      styles.container,
      {
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.md,
      },
    ]}
    testID="live-matches-container"
  >
    <View
      style={[
        styles.matchesGridContainer,
        {
          gap: matchesGridGap,
        },
      ]}
      testID="matches-grid"
    >
      <FlatList
        data={matches}
        renderItem={renderMatchCard}
        keyExtractor={(item) => `live-match-${item.id}`}
        numColumns={gridColumns}
        columnWrapperStyle={
          gridColumns > 1 ? { gap: matchesGridGap } : undefined
        }
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>

    {(isStatsAvailable ||
      (selectedMatch?.events?.length ?? 0) > 0 ||
      isLineupsAvailable) && (
      <View
        style={[styles.detailsSection, { marginTop: spacing.lg }]}
        testID="match-details-section"
      >
        <MatchDetailsTabs
          liveStats={matchStats}
          matchEvents={selectedMatch?.events ?? []}
          homeTeamName={selectedMatch?.homeTeamName ?? ''}
          homeTeamLogo={selectedMatch?.homeTeamLogo ?? ''}
          awayTeamName={selectedMatch?.awayTeamName ?? ''}
          awayTeamLogo={selectedMatch?.awayTeamLogo ?? ''}
          liveLineups={matchLineups}
        />
      </View>
    )}

    <MatchLiveIndicators
      liveStats={matchStats}
      homeTeamName={selectedMatch?.homeTeamName ?? ''}
      awayTeamName={selectedMatch?.awayTeamName ?? ''}
      style={{ marginTop: spacing.lg }}
    />

    {isValueBetsAvailable && (
      <View
        style={[styles.bettingSection, { marginTop: spacing.lg }]}
        testID="betting-section"
      >
        <BettingToolWrapper
          data={valueBets}
          isLoading={loadingValueBets}
        />
      </View>
    )}
  </View>
 );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  matchesGridContainer: {
    width: '100%',
  },
  listContent: {
    gap: spacing.sm,
  },
  detailsSection: {
    width: '100%',
  },
  bettingSection: {
    width: '100%',
  },
});

export default LiveMatches;
