import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TodayPlayerScore } from 'open-football-project-core';

import TodayPlayersPositionRow from './TodayPlayersPositionRow';

jest.mock('../today-players-slider/TodayPlayersSlider', () => {
  const { View, Text } = require('react-native');
  return ({ playerScores, teamName }: any) => (
    <View testID={`today-players-slider-${teamName}`}>
      <Text>{`${teamName}-${playerScores.length}`}</Text>
    </View>
  );
});

const playerScore = (id: number): TodayPlayerScore => ({
  player: { id, name: `P${id}`, age: null, number: null, position: null, photo: null },
  score: 1,
  signal: 'ODDS_IMPLIED',
  reason: { markets: ['Anytime Goal Scorer'] },
});

describe('TodayPlayersPositionRow', () => {
  it('renders a slider for home only when home has players', () => {
    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[playerScore(1)]}
        awayPlayerScores={[]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.getByTestId('today-players-slider-Argentina')).toBeTruthy();
    expect(screen.queryByTestId('today-players-slider-Brazil')).toBeNull();
  });

  it('renders a slider for away only when away has players', () => {
    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[]}
        awayPlayerScores={[playerScore(2)]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.queryByTestId('today-players-slider-Argentina')).toBeNull();
    expect(screen.getByTestId('today-players-slider-Brazil')).toBeTruthy();
  });

  it('renders both sliders when both sides have players', () => {
    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[playerScore(1)]}
        awayPlayerScores={[playerScore(2)]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.getByTestId('today-players-slider-Argentina')).toBeTruthy();
    expect(screen.getByTestId('today-players-slider-Brazil')).toBeTruthy();
  });

  it("passes each side's player scores and team name through to its slider", () => {
    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[playerScore(1), playerScore(2)]}
        awayPlayerScores={[playerScore(3)]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.getByText('Argentina-2')).toBeTruthy();
    expect(screen.getByText('Brazil-1')).toBeTruthy();
  });

  it('stacks sliders in a column on phone-width screens', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 2 });

    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[playerScore(1)]}
        awayPlayerScores={[playerScore(2)]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.getByTestId('today-players-position-row')).toHaveStyle({
      flexDirection: 'column',
    });
  });

  it('lays out sliders side by side at tablet width and above', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 800, height: 1200, scale: 2, fontScale: 2 });

    render(
      <TodayPlayersPositionRow
        position="ATTACKER"
        homePlayerScores={[playerScore(1)]}
        awayPlayerScores={[playerScore(2)]}
        homeTeamName="Argentina"
        awayTeamName="Brazil"
      />,
    );
    expect(screen.getByTestId('today-players-position-row')).toHaveStyle({
      flexDirection: 'row',
    });
  });
});
