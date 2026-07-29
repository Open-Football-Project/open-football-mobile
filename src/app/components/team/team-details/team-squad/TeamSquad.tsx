import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TeamPlayer } from '@matchinsights/core';
import PlayerCard from './player/PlayerCard';
import { ScreenSlider } from '../../../general/screen-slider/ScreenSlider';

interface TeamSquadProps {
  players: TeamPlayer[];
}

const TeamSquad = ({ players }: TeamSquadProps) => {
  if (!players || players.length === 0) {
    return null;
  }

  const sliderItems = players.map((player) => (
    <PlayerCard key={player.playerId} player={player} />
  ));

  return (
    <View style={styles.container} testID="team-squad-container">
      <ScreenSlider
        items={sliderItems}
        testIDPrefix="squad-slider"
        showArrows={true}
        showPagination={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  } as ViewStyle,
});

export default TeamSquad;
