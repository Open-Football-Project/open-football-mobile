import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LiveMatchCard from './LiveMatchCard';
import { ApiService, LiveMatch, useCharteableMatchNow, useTopGuysAvailable } from 'open-football-project-core';

jest.mock('../../general/logo/Logo', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return {
    __esModule: true,
    default: ({ src }: { src?: string }) => (
      <Image source={{ uri: src || '' }} testID="team-logo" style={{ width: 20, height: 20 }} />
    ),
  };
});

jest.mock('../../general/match-button/MatchButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) => (
      <Pressable testID={`match-button-${fixtureId}`}>
        <Text>View</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../general/chart-button/ChartButton', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: any) => (
      <View testID={`chart-button-${fixtureId}`}>
        <Text>Charts</Text>
      </View>
    ),
  };
});

jest.mock('../../general/top-guys-button/TopGuysButton', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: any) => (
      <View testID={`top-guys-button-${fixtureId}`}>
        <Text>Players</Text>
      </View>
    ),
  };
});

jest.mock('../../../icons/Icons', () => ({
  TimerIcon: ({ testID }: { testID?: string }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={testID ?? 'timer-icon'}>⏱</Text>;
  },
}));

jest.mock('open-football-project-core', () => ({
  useCharteableMatchNow: jest.fn(),
  useTopGuysAvailable: jest.fn(),
}));

const mockApiService = {} as unknown as ApiService;

const mockHomeAwayForm = {
  homeForm: ['W', 'D', 'L'],
  awayForm: ['L', 'W', 'D'],
  isHomeHot: false,
  isHomeCold: false,
  isAwayHot: false,
  isAwayCold: false,
  isDisplayable: false,
};

const match: LiveMatch = {
  id: 1,
  homeTeamName: 'Home Team',
  awayTeamName: 'Away Team',
  homeTeamLogo: 'https://example.com/home.png',
  awayTeamLogo: 'https://example.com/away.png',
  homeTeamScore: 1,
  awayTeamScore: 2,
  elapsedTime: 45,
  homeAwayForm: mockHomeAwayForm,
} as LiveMatch;

describe('LiveMatchCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCharteableMatchNow as jest.Mock).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });
    (useTopGuysAvailable as jest.Mock).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });
  });

  it('renders team names and score', () => {
    render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

    expect(screen.getByTestId('match-card-1')).toBeTruthy();
    expect(screen.getByText('Home Team')).toBeTruthy();
    expect(screen.getByText('Away Team')).toBeTruthy();
    expect(screen.getByText('1 - 2')).toBeTruthy();
  });

  it('renders elapsed time with extra time when present', () => {
    const withExtra = { ...match, elapsedTime: 90, extraTime: 3 } as LiveMatch;
    render(<LiveMatchCard match={withExtra} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

    expect(screen.getByTestId('elapsed-time-1')).toHaveTextContent("90+3'");
  });

  it('renders the match button for this fixture', () => {
    render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

    expect(screen.getByTestId('match-button-1')).toBeTruthy();
  });

  it('renders the timer icon', () => {
    render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

    expect(screen.getByTestId('timer-icon-1')).toBeTruthy();
  });

  it('shows a selected accent bar only when isSelected is true', () => {
    const { rerender } = render(
      <LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />,
    );
    expect(screen.queryByTestId('selected-accent')).toBeNull();

    rerender(<LiveMatchCard match={match} isSelected onPress={jest.fn()} apiService={mockApiService} />);
    expect(screen.getByTestId('selected-accent')).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    const onPress = jest.fn();
    render(<LiveMatchCard match={match} isSelected={false} onPress={onPress} apiService={mockApiService} />);

    fireEvent.press(screen.getByTestId('match-card-1'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe('entry points', () => {
    it('renders the chart button when charting is available', () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });

      render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

      expect(screen.getByTestId('chart-button-1')).toBeTruthy();
    });

    it('renders the top guys button when top guys is available', () => {
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

      expect(screen.getByTestId('top-guys-button-1')).toBeTruthy();
    });

    it('renders neither button when neither is available', () => {
      render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

      expect(screen.queryByTestId('chart-button-1')).toBeNull();
      expect(screen.queryByTestId('top-guys-button-1')).toBeNull();
    });

    it('renders both buttons together when both are available', () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

      expect(screen.getByTestId('chart-button-1')).toBeTruthy();
      expect(screen.getByTestId('top-guys-button-1')).toBeTruthy();
    });

    it('calls useCharteableMatchNow and useTopGuysAvailable with the apiService and match id', () => {
      render(<LiveMatchCard match={match} isSelected={false} onPress={jest.fn()} apiService={mockApiService} />);

      expect(useCharteableMatchNow).toHaveBeenCalledWith(mockApiService, 1);
      expect(useTopGuysAvailable).toHaveBeenCalledWith(mockApiService, 1);
    });
  });
});
