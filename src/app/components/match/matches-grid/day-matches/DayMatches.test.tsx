import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';


jest.mock('../../../../navigation/RootNavigator', () => ({
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

import DayMatches from './DayMatches';
import { ApiService, OnDayMatch } from 'open-football-project-core';
import { Routes } from '../../../../navigation/RootNavigator';

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core') as object;
  return {
    ...actual,
    useCharteableMatchNow: jest.fn(() => ({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    })),
    useTopGuysAvailable: jest.fn(() => ({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    })),
  };
});

const mockApiService = {} as unknown as ApiService;

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
  NativeStackNavigationProp: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../../general/logo/Logo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ src, size, testID }: any) => (
      <View testID={`logo-${testID || 'fallback'}`} style={{ width: size, height: size }}>
        <Text>{src || 'fallback-logo'}</Text>
      </View>
    ),
  };
});

jest.mock('../../../general/match-button/MatchButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ isLiveNow, fixtureId }: any) => (
      <Pressable
        testID={`match-button-${fixtureId}`}
        onPress={() => {}}
      >
        <Text>{isLiveNow ? 'LIVE' : 'VIEW'}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../general/status-or-time/StatusOrTime', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ isFinished, statusShort, utcDate }: any) => (
      <Text testID="status-or-time">
        {isFinished ? statusShort : '12:00'}
      </Text>
    ),
  };
});

const mockMatches: OnDayMatch[] = [
  {
    fixtureId: 0,
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeamName: 'Arsenal',
    awayTeamName: 'Chelsea',
    homeTeamLogo: 'arsenal.png',
    awayTeamLogo: 'chelsea.png',
    homeTeamScore: 2,
    awayTeamScore: 1,
    isFinished: false,
    statusShort: 'NS',
    statusLong: 'Not Started',
    date: '2025-10-11T15:00:00Z',
    isLiveNow: false,
  },
  {
    fixtureId: 1,
    homeTeamId: 3,
    awayTeamId: 4,
    homeTeamName: 'Manchester United',
    awayTeamName: 'Liverpool',
    homeTeamLogo: 'man-united.png',
    awayTeamLogo: 'liverpool.png',
    homeTeamScore: 2,
    awayTeamScore: 1,
    isFinished: true,
    statusShort: 'FT',
    statusLong: 'Match Finished',
    date: '2025-10-11T15:00:00Z',
    isLiveNow: false,
  },
  {
    fixtureId: 2,
    homeTeamId: 5,
    awayTeamId: 6,
    homeTeamName: 'Real Madrid',
    awayTeamName: 'Barcelona',
    homeTeamLogo: 'rm.png',
    awayTeamLogo: 'barca.png',
    homeTeamScore: 0,
    awayTeamScore: 0,
    isFinished: false,
    statusShort: 'LIVE',
    statusLong: 'Match Live',
    date: '2025-10-12T18:00:00Z',
    isLiveNow: true,
  },
];

describe('DayMatches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all matches with correct team names', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByText('Arsenal')).toBeTruthy();
    expect(screen.getByText('Chelsea')).toBeTruthy();
    expect(screen.getByText('Manchester United')).toBeTruthy();
    expect(screen.getByText('Liverpool')).toBeTruthy();
    expect(screen.getByText('Real Madrid')).toBeTruthy();
    expect(screen.getByText('Barcelona')).toBeTruthy();
  });

  it('displays scores for finished matches and "-" for ongoing ones', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    // Finished match shows score
    expect(screen.getByText('2 - 1')).toBeTruthy();

    // Unfinished match shows dash
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  it('renders match buttons for all matches', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    const buttons = screen.getAllByTestId(/match-button/);
    expect(buttons).toHaveLength(3);
  });

  it('renders status or time for each match', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    const statusElements = screen.getAllByTestId('status-or-time');
    expect(statusElements).toHaveLength(3);
  });

  it('renders logos for each team in each match', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);


    const logos = screen.getAllByTestId(/logo/);
    expect(logos.length).toBeGreaterThanOrEqual(6);
  });

  it('handles match press for finished match navigation', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    const matchRow = screen.getByTestId('match-row-1');
    fireEvent.press(matchRow);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.MATCH_DETAILS, { matchId: '1' });
  });

  it('handles match press for live match navigation', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    const liveMatchRow = screen.getByTestId('match-row-2');
    fireEvent.press(liveMatchRow);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.LIVE, { fixtureId: '2' });
  });

  it('renders nothing if no matches are provided', () => {
    render(<DayMatches apiService={mockApiService} matches={[]} />);

    expect(screen.queryByText('Arsenal')).toBeNull();
    expect(screen.queryAllByTestId(/logo/).length).toBe(0);
  });

  it('renders container with correct testID', () => {
    render(<DayMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByTestId('day-matches-container')).toBeTruthy();
  });
});
