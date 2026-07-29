import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { usePlayerHistory, usePlayerInfo } from '@matchinsights/core';
import { useRoute } from '@react-navigation/native';
import PlayerHistoryPage from './PlayerHistoryPage';

jest.mock('@matchinsights/core');
jest.mock('@react-navigation/native');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'playerhistory.title': 'Player History',
        'playerhistory.invalidmsg': 'Invalid player',
        'playerhistory.nodatamsg': 'Player data not available',
      };
      return translations[key] || key;
    },
  }),
}));

const mockUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

// Set default mock return value for useRoute
mockUseRoute.mockReturnValue({
  params: { playerId: '1' },
} as any);

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title }: { title: string }) => (
      <View testID="sub-header">
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, message }: any) => (
      <View testID={loading ? 'loading-indicator' : 'no-data'}>
        <Text>{loading ? 'Loading...' : message || 'No data'}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/player-history/player-header/PlayerHistoryHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ player }: any) => (
      <View testID="player-header">
        <Text>{player?.name}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/player-history/player-history-tabs/PlayerHistoryTabs', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ transfers, trophies }: any) => (
      <View testID="player-tabs">
        <Text>{`Transfers: ${transfers.length}, Trophies: ${trophies.length}`}</Text>
      </View>
    ),
  };
});

const mockUsePlayerHistory = usePlayerHistory as jest.MockedFunction<
  typeof usePlayerHistory
>;
const mockUsePlayerInfo = usePlayerInfo as jest.MockedFunction<
  typeof usePlayerInfo
>;

const mockPlayerInfo = {
  playerId: 1,
  age: 30,
  height: '180',
  weight: '75',
  injured: false,
  nationality: 'Argentina',
  position: 'Forward',
  teamId: 10,
  teamName: 'FC Barcelona',
  teamLogo: 'https://example.com/barcelona.png',
  name: 'Lionel Messi',
  photo: 'https://example.com/messi.png',
};

const mockPlayerHistory = {
  player: { id: 2, photo: 'aaaa', name: 'Lionel Messi' },
  transfers: [],
  trophies: [],
};

describe('PlayerHistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset useRoute mock to default
    mockUseRoute.mockReturnValue({
      params: { playerId: '1' },
    } as any);

    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: false,
      loadingPlayerHistory: false,
      playerHistory: null,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: false,
      playerInfo: null,
    } as any);
  });

  const mockApiService = {} as any;

  it('should render player history screen with correct testID', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('player-history-screen')).toBeTruthy();
  });

  it('should render SubHeader with title', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
  });

  it('should display loading state when loading player info', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: false,
      loadingPlayerHistory: false,
      playerHistory: null,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: true,
      playerInfo: null,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display loading state when loading player history', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: false,
      loadingPlayerHistory: true,
      playerHistory: null,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: false,
      playerInfo: null,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display no data when no player data available', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: false,
      loadingPlayerHistory: false,
      playerHistory: null,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: false,
      playerInfo: null,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('should render player header when player info is available', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('player-header')).toBeTruthy();
  });

  it('should render player history tabs when player history is available', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('player-tabs')).toBeTruthy();
  });

  it('should render emergency player header when player info unavailable but history available', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: false,
      playerInfo: null,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('player-header')).toBeTruthy();
  });

  it('should pass correct playerId from route params', () => {
    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: mockPlayerHistory,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(mockUsePlayerInfo).toHaveBeenCalledWith(mockApiService, 1);
    expect(mockUsePlayerHistory).toHaveBeenCalledWith(mockApiService, 1);
  });

  it('should handle invalid player ID', () => {
    mockUseRoute.mockReturnValue({
      params: { playerId: undefined },
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByTestId('player-history-screen-invalid')).toBeTruthy();
  });

  it('should render tabs with correct transfer and trophy data', () => {
    const tabsData = {
      player: { id: 2, photo: 'aaaa', name: 'Lionel Messi' },
      transfers: [{ id: 1 }, { id: 2 }],
      trophies: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };

    mockUsePlayerHistory.mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: tabsData,
    } as any);

    mockUsePlayerInfo.mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: mockPlayerInfo,
    } as any);

    render(<PlayerHistoryPage apiService={mockApiService} />);
    expect(screen.getByText('Transfers: 2, Trophies: 3')).toBeTruthy();
  });
});
