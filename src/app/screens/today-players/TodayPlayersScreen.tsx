import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  MobileRoutes,
  PlayerPosition,
  translateLeague,
  useTodayPlayersStatus,
} from 'open-football-project-core';

import { RootStackParamList } from '../../navigation/RootNavigator';
import Controls from '../../components/general/controls/Controls';
import NoData from '../../components/general/no-data/NoData';
import SubHeader from '../../components/general/sub-header/SubHeader';
import TodayPlayersPositionRow from '../../components/today-players/today-players-position-row/TodayPlayersPositionRow';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

const POSITIONS_IN_PITCH_ORDER: PlayerPosition[] = [
  'ATTACKER',
  'MIDFIELDER',
  'DEFENDER',
  'GOALKEEPER',
];

interface TodayPlayersScreenProps {
  apiService: ApiService;
}

type TodayPlayersRoute = RouteProp<RootStackParamList, typeof MobileRoutes.TODAY_PLAYERS>;

const TodayPlayersScreen = ({ apiService }: TodayPlayersScreenProps) => {
  const { t } = useTranslation();
  const route = useRoute<TodayPlayersRoute>();
  const fixtureId = route.params?.fixtureId;

  const {
    leagues,
    selectedLeagueId,
    setSelectedLeagueId,
    fixturesInSelectedLeague,
    selectedFixtureId,
    setSelectedFixtureId,
    selectedFixture,
    loadingTodayPlayers,
    isTodayPlayersAvailable,
  } = useTodayPlayersStatus(apiService, fixtureId);

  const subHeaderTitle = t('todayplayers.subheadertitle', { defaultValue: "Today's Players" });

  if (loadingTodayPlayers) {
    return (
      <View style={styles.screen} testID="today-players-screen">
        <SubHeader title={subHeaderTitle} />
        <NoData loading />
      </View>
    );
  }

  if (!isTodayPlayersAvailable) {
    return (
      <View style={styles.screen} testID="today-players-screen">
        <SubHeader title={subHeaderTitle} />
        <NoData
          message={t('todayplayers.no_data', {
            defaultValue: 'No player data available right now',
          })}
        />
      </View>
    );
  }

  const drop0Options = leagues.map((league) => ({
    id: String(league.leagueId),
    value: translateLeague(league.leagueName, t),
  }));

  const drop1Options = fixturesInSelectedLeague.map((fixture) => ({
    id: String(fixture.fixtureId),
    value: `${fixture.homeTeamName} vs ${fixture.awayTeamName}`,
  }));

  const visiblePositions = selectedFixture
    ? POSITIONS_IN_PITCH_ORDER.filter(
        (position) =>
          selectedFixture.home[position].length > 0 || selectedFixture.away[position].length > 0,
      )
    : [];

  return (
    <View style={styles.screen} testID="today-players-screen">
      <ScrollView
        testID="today-players-scroll"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <SubHeader title={subHeaderTitle} />
        <Controls
          useDrop0
          drop0Label={t('todayplayers.pick_league', { defaultValue: 'Select league' })}
          selectedDrop0={selectedLeagueId !== undefined ? String(selectedLeagueId) : ''}
          setDrop0={(id) => setSelectedLeagueId(Number(id))}
          drop0Options={drop0Options}
          useDrop1
          drop1Label={t('todayplayers.pick_fixture', { defaultValue: 'Select match' })}
          selectedDrop1={selectedFixtureId !== undefined ? String(selectedFixtureId) : ''}
          setDrop1={(id) => setSelectedFixtureId(Number(id))}
          drop1Options={drop1Options}
        />
        {selectedFixture ? (
          <View>
            <Text testID="today-players-teams" style={styles.teamNames}>
              {selectedFixture.homeTeamName} vs {selectedFixture.awayTeamName}
            </Text>
            <Text testID="today-players-disclaimer" style={styles.disclaimer}>
              {t('todayplayers.disclaimer', { defaultValue: 'Predicted before kickoff' })}
            </Text>
            {visiblePositions.map((position) => (
              <TodayPlayersPositionRow
                key={position}
                position={position}
                homePlayerScores={selectedFixture.home[position]}
                awayPlayerScores={selectedFixture.away[position]}
                homeTeamName={selectedFixture.homeTeamName}
                awayTeamName={selectedFixture.awayTeamName}
              />
            ))}
          </View>
        ) : (
          <Text testID="today-players-no-fixture" style={styles.noFixture}>
            no fixture
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  teamNames: {
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.brand.aqualight,
    marginTop: spacing.sm,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  noFixture: {
    textAlign: 'center',
    color: colors.text.secondary,
    padding: spacing.lg,
  },
});

export default TodayPlayersScreen;
