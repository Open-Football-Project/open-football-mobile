import React from 'react';
import { TodayPlayerScore } from '@matchinsights/core';

import NoData from '../../general/no-data/NoData';
import TodayPlayerCard from '../today-player-card/TodayPlayerCard';
import { ScreenSlider } from '../../general/screen-slider/ScreenSlider';

interface TodayPlayersSliderProps {
  playerScores: TodayPlayerScore[];
  teamName: string;
}

const TodayPlayersSlider = ({ playerScores, teamName }: TodayPlayersSliderProps) => {
  if (!playerScores || playerScores.length === 0) {
    return <NoData />;
  }

  const sliderItems = playerScores.map((playerScore, index) => (
    <TodayPlayerCard
      key={playerScore.player.id ?? index}
      playerScore={playerScore}
      teamName={teamName}
    />
  ));

  return (
    <ScreenSlider
      items={sliderItems}
      testIDPrefix="today-players-slider"
      showArrows
      showPagination={false}
    />
  );
};

export default TodayPlayersSlider;
