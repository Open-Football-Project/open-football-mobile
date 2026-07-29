import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TodayPlayerScore } from 'open-football-project-core';

import TodayPlayersSlider from './TodayPlayersSlider';

jest.mock('../today-player-card/TodayPlayerCard', () => {
  const { View, Text } = require('react-native');
  return ({ playerScore, teamName }: any) => (
    <View testID={`today-player-card-${playerScore.player.id}`}>
      <Text>{`${playerScore.player.name}-${teamName}`}</Text>
    </View>
  );
});

jest.mock('../../general/no-data/NoData', () => {
  const { View, Text } = require('react-native');
  return () => (
    <View testID="no-data">
      <Text>no data</Text>
    </View>
  );
});

jest.mock('../../general/screen-slider/ScreenSlider', () => {
  const { View, Text } = require('react-native');
  return {
    ScreenSlider: ({ items, testIDPrefix, showArrows, showPagination }: any) => (
      <View testID={testIDPrefix || 'screen-slider'}>
        <View testID={`${testIDPrefix}-props`}>
          <Text testID={`${testIDPrefix}-show-arrows`}>{String(showArrows)}</Text>
          <Text testID={`${testIDPrefix}-show-pagination`}>{String(showPagination)}</Text>
        </View>
        {items?.map((item: any, index: number) => (
          <View key={index} testID={`slider-item-${index}`}>
            {item}
          </View>
        ))}
      </View>
    ),
  };
});

const playerScore = (id: number, name: string): TodayPlayerScore => ({
  player: { id, name, age: null, number: null, position: null, photo: null },
  score: 1,
  signal: 'ODDS_IMPLIED',
  reason: { markets: ['Anytime Goal Scorer'] },
});

describe('TodayPlayersSlider', () => {
  it('renders NoData when playerScores is empty', () => {
    render(<TodayPlayersSlider playerScores={[]} teamName="Argentina" />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders the slider with the correct testIDPrefix when playerScores has items', () => {
    render(
      <TodayPlayersSlider
        playerScores={[playerScore(1, 'Messi')]}
        teamName="Argentina"
      />,
    );
    expect(screen.getByTestId('today-players-slider')).toBeTruthy();
    expect(screen.queryByTestId('no-data')).toBeNull();
  });

  it('creates one slide per player score, passing playerScore and teamName through', () => {
    render(
      <TodayPlayersSlider
        playerScores={[playerScore(1, 'Messi'), playerScore(2, 'Di Maria')]}
        teamName="Argentina"
      />,
    );

    expect(screen.getByTestId('today-player-card-1')).toBeTruthy();
    expect(screen.getByTestId('today-player-card-2')).toBeTruthy();
    expect(screen.getByText('Messi-Argentina')).toBeTruthy();
    expect(screen.getByText('Di Maria-Argentina')).toBeTruthy();
    expect(screen.queryByTestId('slider-item-2')).toBeNull();
  });

  it('shows navigation arrows but no pagination dots, matching web (prev/next only)', () => {
    render(
      <TodayPlayersSlider
        playerScores={[playerScore(1, 'Messi'), playerScore(2, 'Di Maria')]}
        teamName="Argentina"
      />,
    );
    expect(screen.getByTestId('today-players-slider-show-arrows')).toHaveTextContent('true');
    expect(screen.getByTestId('today-players-slider-show-pagination')).toHaveTextContent('false');
  });
});
