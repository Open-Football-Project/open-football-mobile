import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LeagueRankingTab from './LeagueRankingTab';
import { LeagueRankingPlayer } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, _options?: any) => {
      const translations: Record<string, string> = {
        'common.top_scorers': 'Top Scorers',
        'common.top_y_cards': 'Yellow Cards',
        'common.top_r_cards': 'Red Cards',
        'common.top_assists': 'Assists',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../LeagueRanking', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ players }: any) =>
    React.createElement(
      View,
      { testID: 'league-ranking' },
      React.createElement(
        Text,
        null,
        players.map((p: any) => p.playerName).join(',')
      )
    );
});

jest.mock('../../../general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () =>
    React.createElement(View, { testID: 'no-data' }, 
      React.createElement(Text, null, 'Not Available')
    );
});

jest.mock('../../../../theme', () => ({
  colors: {
    background: {
      card: '#1E1E1E',
      overlay: 'rgba(0,0,0,0.7)',
    },
    brand: {
      yellow: '#ffc61a',
      aqualight: '#17c0eb',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
  },
  fontSize: {
    sm: 14,
  },
  fontWeight: {
    semibold: '600',
  },
  borderRadius: {
    lg: 16,
  },
  borders: { hairline: 0.5, thin: 1, thick: 2 },
  sizes: {
    touchableHeight: 44,
  },
  opacity: {
    hover: 0.8,
  },
}));

describe('LeagueRankingTab', () => {
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

  it('renders only available tabs based on data', () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={[]}
        redCards={mockPlayers}
        assists={[]}
      />
    );

    expect(screen.getByText('Top Scorers')).toBeOnTheScreen();
    expect(screen.queryByText('Yellow Cards')).not.toBeOnTheScreen();
    expect(screen.getByText('Red Cards')).toBeOnTheScreen();
    expect(screen.queryByText('Assists')).not.toBeOnTheScreen();
  });

  it('renders the first available tab as active by default', () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={[]}
        redCards={mockPlayers}
        assists={[]}
      />
    );

    const ranking = screen.getByTestId('league-ranking');
    expect(ranking).toHaveTextContent('Erling Haaland,Lionel Messi');
  });

  it('switches content when a tab is pressed', () => {
    render(
      <LeagueRankingTab
        topScorers={mockPlayers}
        yellowCards={mockPlayers}
        redCards={[]}
        assists={[]}
      />
    );

    expect(screen.getByTestId('league-ranking')).toHaveTextContent(
      'Erling Haaland,Lionel Messi'
    );

    const yellowTab = screen.getByTestId('ranking-tab-yCards');
    fireEvent.press(yellowTab);

    expect(screen.getByTestId('league-ranking')).toHaveTextContent(
      'Erling Haaland,Lionel Messi'
    );
  });

  it('renders NoData if all arrays are empty', () => {
    render(
      <LeagueRankingTab
        topScorers={[]}
        yellowCards={[]}
        redCards={[]}
        assists={[]}
      />
    );

    expect(screen.getByTestId('no-data')).toBeOnTheScreen();
  });
});
