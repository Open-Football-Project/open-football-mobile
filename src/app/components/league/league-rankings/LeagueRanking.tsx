import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LeagueRankingPlayer } from 'open-football-project-core';
import RankingPlayerCard from './rankin-player-card/RankingPlayerCard';
import { ScreenSlider } from '../../general/screen-slider/ScreenSlider';

interface LeagueRankingProps {
  players: LeagueRankingPlayer[];
}

const LeagueRanking = ({ players }: LeagueRankingProps) => {
  if (!players || players.length === 0) {
    return null;
  }

  const sliderItems = players.map((player) => (
    <RankingPlayerCard key={player.playerId} player={player} />
  ));

  return (
    <View style={styles.container} testID="league-ranking">
      <ScreenSlider
        items={sliderItems}
        testIDPrefix="ranking-slider"
        showArrows={true}
        showPagination={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  } as ViewStyle,
});

export default LeagueRanking;
