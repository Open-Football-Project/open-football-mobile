import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import LeagueRanking from './LeagueRanking';
import { LeagueRankingPlayer } from 'open-football-project-core';

// Mock RankingPlayerCard
jest.mock('./rankin-player-card/RankingPlayerCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ player }: any) =>
    React.createElement(View, { testID: 'player-card' }, 
      React.createElement(Text, null, player.playerName)
    );
});

// Mock ScreenSlider
jest.mock('../../general/screen-slider/ScreenSlider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ScreenSlider: ({ items, testIDPrefix }: any) =>
      React.createElement(View, { testID: testIDPrefix || 'screen-slider' }, 
        items?.map((item: any, index: number) => 
          React.createElement(View, { key: index, testID: `slider-item-${index}` }, item)
        )
      ),
  };
});

jest.mock('../../../theme', () => ({
  spacing: {
    md: 12,
  },
}));

describe('LeagueRanking', () => {
  const mockPlayers: LeagueRankingPlayer[] = [
    {
      playerId: 1,
      playerName: 'Erling Haaland',
      playerPhoto: 'https://example.com/haaland.png',
      playerAge: 24,
      playerTeamId: 33,
      playerTeamLogo: 'https://example.com/man-city-logo.png',
      playerTeamName: 'Manchester City',
      playerTotalGoals: 36,
      playerTotalAssists: 8,
      playerTotalYellowCards: 2,
      playerTotalRedCards: 0,
      playerTotalAppearances: 30,
    },
    {
      playerId: 2,
      playerName: 'Lionel Messi',
      playerPhoto: 'https://example.com/messi.png',
      playerAge: 36,
      playerTeamId: 10,
      playerTeamLogo: 'https://example.com/psg-logo.png',
      playerTeamName: 'PSG',
      playerTotalGoals: 25,
      playerTotalAssists: 12,
      playerTotalYellowCards: 1,
      playerTotalRedCards: 0,
      playerTotalAppearances: 28,
    },
  ];

  it('renders null when players array is empty', () => {
    render(<LeagueRanking players={[]} />);
    expect(screen.queryByTestId('league-ranking')).not.toBeOnTheScreen();
  });

  it('renders the container with testID', () => {
    render(<LeagueRanking players={mockPlayers} />);
    expect(screen.getByTestId('league-ranking')).toBeOnTheScreen();
  });

  it('renders the slider with correct testIDPrefix', () => {
    render(<LeagueRanking players={mockPlayers} />);
    expect(screen.getByTestId('ranking-slider')).toBeOnTheScreen();
  });

  it('renders the correct number of player cards in slider', () => {
    render(<LeagueRanking players={mockPlayers} />);

    const cards = screen.getAllByTestId('player-card');
    expect(cards).toHaveLength(mockPlayers.length);
  });

  it('renders each player name in the card', () => {
    render(<LeagueRanking players={mockPlayers} />);

    mockPlayers.forEach((player) => {
      expect(screen.getByText(player.playerName)).toBeOnTheScreen();
    });
  });

  it('creates a slider item for each player', () => {
    render(<LeagueRanking players={mockPlayers} />);

    expect(screen.getByTestId('slider-item-0')).toBeOnTheScreen();
    expect(screen.getByTestId('slider-item-1')).toBeOnTheScreen();
  });
});
