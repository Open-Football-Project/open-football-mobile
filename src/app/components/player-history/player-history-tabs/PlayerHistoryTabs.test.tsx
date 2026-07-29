import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PlayerHistoryTabs from './PlayerHistoryTabs';
import { PlayerTransferInfo, PlayerTrophyInfo } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.transfers': 'Transfers',
        'common.trophies': 'Trophies',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../icons/Icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    TransferArrowIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'transfer-arrow-icon'}>→</Text>
    ),
    TrophyIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'trophy-icon'}>🏆</Text>
    ),
  };
});

jest.mock('../player-transfers/PlayerTransfers', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ transfers }: { transfers: any[] }) => (
      <View testID="player-transfers">
        <Text>{`Transfers: ${transfers.length}`}</Text>
      </View>
    ),
  };
});

jest.mock('../player-trophies/PlayerTrophies', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ trophies }: { trophies: any[] }) => (
      <View testID="player-trophies">
        <Text>{`Trophies: ${trophies.length}`}</Text>
      </View>
    ),
  };
});

describe('PlayerHistoryTabs', () => {
  const mockTransfers: PlayerTransferInfo[] = [
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

  const mockTrophies: PlayerTrophyInfo[] = [
    {
      league: 'LaLiga',
      country: 'Spain',
      season: '2020/21',
      place: 'Winner',
    },
    {
      league: 'Champions League',
      country: 'Europe',
      season: '2021/22',
      place: 'Runner-up',
    },
  ];

  it('should render transfers tab by default', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.getByTestId('player-transfers')).toBeTruthy();
    expect(screen.getByText('Transfers: 2')).toBeTruthy();
  });

  it('should not show trophies content by default', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.queryByTestId('player-trophies')).toBeNull();
  });

  it('should have transfers tab button active by default', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    const transfersButton = screen.getByTestId('tab-button-transfers');
    expect(transfersButton).toBeTruthy();
  });

  it('should switch to trophies tab when trophies button is pressed', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    const trophiesButton = screen.getByTestId('tab-button-trophies');
    fireEvent.press(trophiesButton);
    expect(screen.getByTestId('player-trophies')).toBeTruthy();
    expect(screen.getByText('Trophies: 2')).toBeTruthy();
  });

  it('should hide transfers when trophies tab is active', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    const trophiesButton = screen.getByTestId('tab-button-trophies');
    fireEvent.press(trophiesButton);
    expect(screen.queryByTestId('player-transfers')).toBeNull();
  });

  it('should switch back to transfers tab when transfers button is pressed again', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    const trophiesButton = screen.getByTestId('tab-button-trophies');
    const transfersButton = screen.getByTestId('tab-button-transfers');

    fireEvent.press(trophiesButton);
    expect(screen.getByTestId('player-trophies')).toBeTruthy();

    fireEvent.press(transfersButton);
    expect(screen.getByTestId('player-transfers')).toBeTruthy();
    expect(screen.queryByTestId('player-trophies')).toBeNull();
  });

  it('should render both tab buttons', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.getByTestId('tab-button-transfers')).toBeTruthy();
    expect(screen.getByTestId('tab-button-trophies')).toBeTruthy();
  });

  it('should display correct labels for tabs', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.getByText('TRANSFERS')).toBeTruthy();
    expect(screen.getByText('TROPHIES')).toBeTruthy();
  });

  it('should render tabs container with correct testID', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.getByTestId('player-history-tabs')).toBeTruthy();
  });

  it('should pass correct transfers data to PlayerTransfers component', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    expect(screen.getByText('Transfers: 2')).toBeTruthy();
  });

  it('should pass correct trophies data to PlayerTrophies component', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={mockTrophies} />);
    const trophiesButton = screen.getByTestId('tab-button-trophies');
    fireEvent.press(trophiesButton);
    expect(screen.getByText('Trophies: 2')).toBeTruthy();
  });

  it('should handle empty transfers array', () => {
    render(<PlayerHistoryTabs transfers={[]} trophies={mockTrophies} />);
    expect(screen.getByText('Transfers: 0')).toBeTruthy();
  });

  it('should handle empty trophies array', () => {
    render(<PlayerHistoryTabs transfers={mockTransfers} trophies={[]} />);
    const trophiesButton = screen.getByTestId('tab-button-trophies');
    fireEvent.press(trophiesButton);
    expect(screen.getByText('Trophies: 0')).toBeTruthy();
  });
});
