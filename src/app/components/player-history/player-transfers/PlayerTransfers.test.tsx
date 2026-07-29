import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../../navigation/RootNavigator', () => ({
  Routes: {
    LANDING: 'landing',
    ALL_LEAGUES: 'all-leagues',
    GAME: 'game',
    GUESS_LEAGUE_TEAM: 'guess-league-team',
    GUESS_TEAM_PLAYER: 'guess-team-player',
    LEAGUE: 'league',
    LEAGUE_SPECIAL_ARG: 'league-special-arg',
    LEAGUE_SPECIAL_GROUPS: 'league-special-groups',
    LEAGUE_SPECIAL_KNOCKOUT: 'league-special-knockout',
    LIVE: 'live',
    MATCH_DETAILS: 'match-details',
    MATCHES: 'matches',
    PLAYER_HISTORY: 'player-history',
    TEAM_DETAILS: 'team-details',
  },
}));

import PlayerTransfers from './PlayerTransfers';
import { PlayerTransferInfo } from 'open-football-project-core';
import { Routes } from '../../../navigation/RootNavigator';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
  NativeStackNavigationProp: jest.fn(),
}));

jest.mock('../../general/logo/Logo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ src, size }: any) => (
      <View testID={`team-logo-${src || 'default'}`} style={{ width: size, height: size }}>
        <Text>{src || 'default-logo'}</Text>
      </View>
    ),
  };
});

jest.mock('../../../icons/Icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    TransferArrowIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'transfer-arrow-icon'} style={{ fontSize: size, color }}>→</Text>
    ),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nodata.notransfers': 'No transfers available',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ message }: { message: string }) => (
      <Text testID="no-data">{message}</Text>
    ),
  };
});

describe('PlayerTransfers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  const mockTransfers: PlayerTransferInfo[] = [
    {
      date: '2022-07-01',
      fromTeamId: 1,
      fromTeamName: 'Team A',
      fromTeamLogo: 'https://example.com/team-a.png',
      toTeamId: 2,
      toTeamName: 'Team B',
      toTeamLogo: 'https://example.com/team-b.png',
    },
    {
      date: '2023-08-15',
      fromTeamId: 3,
      fromTeamName: 'Team C',
      fromTeamLogo: 'https://example.com/team-c.png',
      toTeamId: 4,
      toTeamName: 'Team D',
      toTeamLogo: 'https://example.com/team-d.png',
    },
  ];

  it('should render NoData when transfers array is empty', () => {
    render(<PlayerTransfers transfers={[]} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
    expect(screen.getByTestId('no-data')).toHaveTextContent('No transfers available');
  });

  it('should render transfer cards for each transfer', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    expect(screen.getByTestId('transfer-card-0')).toBeTruthy();
    expect(screen.getByTestId('transfer-card-1')).toBeTruthy();
  });

  it('should display correctly formatted dates', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    // Should display dates in dd MMM yyyy format
    expect(screen.getByText('01 Jul 2022')).toBeTruthy();
    expect(screen.getByText('15 Aug 2023')).toBeTruthy();
  });

  it('should display team names for from and to teams', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    expect(screen.getByText('Team A')).toBeTruthy();
    expect(screen.getByText('Team B')).toBeTruthy();
    expect(screen.getByText('Team C')).toBeTruthy();
    expect(screen.getByText('Team D')).toBeTruthy();
  });

  it('should display team logos', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    expect(screen.getByTestId('team-logo-https://example.com/team-a.png')).toBeTruthy();
    expect(screen.getByTestId('team-logo-https://example.com/team-b.png')).toBeTruthy();
  });

  it('should display transfer arrow', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    const arrows = screen.getAllByText('→');
    expect(arrows.length).toBe(2); // One for each transfer
  });

  it('should sort transfers by date (newest first)', () => {
    const unsortedTransfers = [
      {
        date: '2022-07-01',
        fromTeamId: 1,
        fromTeamName: 'Team A',
        fromTeamLogo: null,
        toTeamId: 2,
        toTeamName: 'Team B',
        toTeamLogo: null,
      },
      {
        date: '2023-08-15',
        fromTeamId: 3,
        fromTeamName: 'Team C',
        fromTeamLogo: null,
        toTeamId: 4,
        toTeamName: 'Team D',
        toTeamLogo: null,
      },
    ];

    render(<PlayerTransfers transfers={unsortedTransfers} />);

    // Check that newest date appears first in rendering
    const dateElements = screen.getAllByText(/^(01 Jul 2022|15 Aug 2023)$/);
    expect(dateElements[0]).toHaveTextContent('15 Aug 2023');
    expect(dateElements[1]).toHaveTextContent('01 Jul 2022');
  });

  it('should navigate to team details when team is pressed', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    const fromTeamButton = screen.getByTestId('from-team-1');
    fireEvent.press(fromTeamButton);

      expect(mockNavigate).toHaveBeenCalledWith(Routes.TEAM_DETAILS, { teamId: '1' });
  });

  it('should navigate to correct team when to team is pressed', () => {
    render(<PlayerTransfers transfers={mockTransfers} />);

    const toTeamButton = screen.getByTestId('to-team-2');
    fireEvent.press(toTeamButton);

      expect(mockNavigate).toHaveBeenCalledWith(Routes.TEAM_DETAILS, { teamId: '2' });
  });

  it('should handle transfers with missing team logos gracefully', () => {
    const transfersWithoutLogos: PlayerTransferInfo[] = [
      {
        date: '2022-07-01',
        fromTeamId: 1,
        fromTeamName: 'Team A',
        fromTeamLogo: null,
        toTeamId: 2,
        toTeamName: 'Team B',
        toTeamLogo: null,
      },
    ];

    render(<PlayerTransfers transfers={transfersWithoutLogos} />);

    expect(screen.getByText('Team A')).toBeTruthy();
    expect(screen.getByText('Team B')).toBeTruthy();
    // Logo component mock renders with team-logo-default when src is null
    const defaultLogos = screen.getAllByTestId('team-logo-default');
    expect(defaultLogos.length).toBe(2); // Two transfers without logos
  });

  it('should handle transfers with unknown dates', () => {
    const transfersWithoutDates: PlayerTransferInfo[] = [
      {
        date: null,
        fromTeamId: 1,
        fromTeamName: 'Team A',
        fromTeamLogo: null,
        toTeamId: 2,
        toTeamName: 'Team B',
        toTeamLogo: null,
      },
    ];

    render(<PlayerTransfers transfers={transfersWithoutDates} />);

    expect(screen.getByText('Unknown Date')).toBeTruthy();
  });
});
