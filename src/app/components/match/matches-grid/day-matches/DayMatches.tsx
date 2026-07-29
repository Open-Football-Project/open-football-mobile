import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ApiService, OnDayMatch } from '@matchinsights/core';
import DayMatchRow from './day-match-row/DayMatchRow';

interface Props {
  matches: OnDayMatch[];
  apiService: ApiService;
}

const DayMatches = ({ matches, apiService }: Props) => {
  return (
    <View style={styles.container} testID="day-matches-container">
      {matches.map((match) => (
        <DayMatchRow key={match.fixtureId} match={match} apiService={apiService} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default DayMatches;