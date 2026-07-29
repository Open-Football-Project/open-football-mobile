import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { PlayerPosition, TodayPlayerScore } from 'open-football-project-core';

import TodayPlayersSlider from '../today-players-slider/TodayPlayersSlider';
import { spacing, breakpoints } from '../../../theme';

interface TodayPlayersPositionRowProps {
  position: PlayerPosition;
  homePlayerScores: TodayPlayerScore[];
  awayPlayerScores: TodayPlayerScore[];
  homeTeamName: string;
  awayTeamName: string;
}

const TodayPlayersPositionRow = ({
  homePlayerScores,
  awayPlayerScores,
  homeTeamName,
  awayTeamName,
}: TodayPlayersPositionRowProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= breakpoints.tablet;

  return (
    <View
      testID="today-players-position-row"
      style={[styles.row, { flexDirection: isTablet ? 'row' : 'column' }]}
    >
      {homePlayerScores.length > 0 && (
        <View style={isTablet && styles.column}>
          <TodayPlayersSlider playerScores={homePlayerScores} teamName={homeTeamName} />
        </View>
      )}
      {awayPlayerScores.length > 0 && (
        <View style={isTablet && styles.column}>
          <TodayPlayersSlider playerScores={awayPlayerScores} teamName={awayTeamName} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    gap: spacing.md,
  },
  column: {
    flex: 1,
  },
});

export default TodayPlayersPositionRow;
