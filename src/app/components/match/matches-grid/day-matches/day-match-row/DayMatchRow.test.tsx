import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../../../../navigation/RootNavigator', () => ({
  Routes: {
    LIVE: 'live',
    MATCH_DETAILS: 'match-details',
  },
}));

import DayMatchRow from './DayMatchRow';
import { ApiService, OnDayMatch, useCharteableMatchNow, useTopGuysAvailable } from '@matchinsights/core';
import { Routes } from '../../../../../navigation/RootNavigator';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as object;
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

jest.mock('../../../../../icons/Icons', () => ({
  LiveIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={testID}>🔴</Text>;
  },
}));

jest.mock('../../../../general/logo/Logo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ src, size }: any) => (
      <View testID={`logo-${src || 'fallback'}`} style={{ width: size, height: size }}>
        <Text>{src || 'fallback-logo'}</Text>
      </View>
    ),
  };
});

jest.mock('../../../../general/match-button/MatchButton', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ isLiveNow, fixtureId }: any) => (
      <View testID={`match-button-${fixtureId}`}>
        <Text>{isLiveNow ? 'LIVE' : 'VIEW'}</Text>
      </View>
    ),
  };
});

jest.mock('../../../../general/status-or-time/StatusOrTime', () => {
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

const mockMatch: OnDayMatch = {
  fixtureId: 42,
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
};

const liveMatch: OnDayMatch = {
  ...mockMatch,
  fixtureId: 99,
  isLiveNow: true,
  statusShort: 'LIVE',
};

describe('DayMatchRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders team names and logos', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.getByText('Arsenal')).toBeTruthy();
    expect(screen.getByText('Chelsea')).toBeTruthy();
    expect(screen.getByTestId('logo-arsenal.png')).toBeTruthy();
    expect(screen.getByTestId('logo-chelsea.png')).toBeTruthy();
  });

  it('renders score as dash when not finished', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.getByText('-')).toBeTruthy();
  });

  it('renders score when finished', () => {
    render(<DayMatchRow apiService={mockApiService} match={{ ...mockMatch, isFinished: true }} />);
    expect(screen.getByText('2 - 1')).toBeTruthy();
  });

  it('renders status or time', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.getByTestId('status-or-time')).toBeTruthy();
  });

  it('renders match button', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.getByTestId('match-button-42')).toBeTruthy();
  });

  it('navigates to match details when pressed and not live', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    fireEvent.press(screen.getByTestId('match-row-42'));
    expect(mockNavigate).toHaveBeenCalledWith(Routes.MATCH_DETAILS, { matchId: '42' });
  });

  it('navigates to live when pressed and live', () => {
    render(<DayMatchRow apiService={mockApiService} match={liveMatch} />);
    fireEvent.press(screen.getByTestId('match-row-99'));
    expect(mockNavigate).toHaveBeenCalledWith(Routes.LIVE, { fixtureId: '99' });
  });

  it('does not show live icon for non-live matches', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.queryByTestId('live-icon-42')).toBeNull();
  });

  it('renders with fallback logos when logos are null', () => {
    render(<DayMatchRow apiService={mockApiService} match={{ ...mockMatch, homeTeamLogo: null, awayTeamLogo: null }} />);
    expect(screen.getAllByTestId('logo-fallback')).toHaveLength(2);
  });

  it('row has testID for accessibility', () => {
    render(<DayMatchRow apiService={mockApiService} match={mockMatch} />);
    expect(screen.getByTestId('match-row-42')).toBeTruthy();
  });
});
