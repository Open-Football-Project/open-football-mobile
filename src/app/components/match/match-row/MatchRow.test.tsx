import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ApiService, useCharteableMatchNow, useTopGuysAvailable } from '@matchinsights/core';

import MatchRow, { MatchRowData } from './MatchRow';

jest.mock('../../general/logo/Logo', () => {
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

jest.mock('../../general/match-button/MatchButton', () => {
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

jest.mock('../../general/status-or-time/StatusOrTime', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ isFinished, statusShort }: any) => (
      <Text testID="status-or-time">{isFinished ? statusShort : '12:00'}</Text>
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

jest.mock('@matchinsights/core', () => ({
  useCharteableMatchNow: jest.fn(),
  useTopGuysAvailable: jest.fn(),
}));

const mockApiService = {} as unknown as ApiService;

const mockMatch: MatchRowData = {
  fixtureId: 42,
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
  homeTeamLogo: 'arsenal.png',
  awayTeamLogo: 'chelsea.png',
  homeTeamScore: 2,
  awayTeamScore: 1,
  isFinished: false,
  statusShort: 'NS',
  date: '2025-10-11T15:00:00Z',
  isLiveNow: false,
};

describe('MatchRow (shared)', () => {
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

  it('renders team names and logos', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    expect(screen.getByText('Arsenal')).toBeTruthy();
    expect(screen.getByText('Chelsea')).toBeTruthy();
    expect(screen.getByTestId('logo-arsenal.png')).toBeTruthy();
    expect(screen.getByTestId('logo-chelsea.png')).toBeTruthy();
  });

  it('renders fallback logos when logos are missing', () => {
    render(
      <MatchRow
        match={{ ...mockMatch, homeTeamLogo: null, awayTeamLogo: null }}
        testID="match-row-42"
        apiService={mockApiService}
      />,
    );
    expect(screen.getAllByTestId('logo-fallback')).toHaveLength(2);
  });

  it('renders score as dash when not finished', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    expect(screen.getByText('-')).toBeTruthy();
  });

  it('renders score when finished', () => {
    render(
      <MatchRow
        match={{ ...mockMatch, isFinished: true }}
        testID="match-row-42"
        apiService={mockApiService}
      />,
    );
    expect(screen.getByText('2 - 1')).toBeTruthy();
  });

  it('renders status or time', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    expect(screen.getByTestId('status-or-time')).toBeTruthy();
  });

  it('renders the match button with the match fixtureId and isLiveNow', () => {
    render(
      <MatchRow
        match={{ ...mockMatch, isLiveNow: true }}
        testID="match-row-42"
        apiService={mockApiService}
      />,
    );
    expect(screen.getByTestId('match-button-42')).toBeTruthy();
    expect(screen.getByText('LIVE')).toBeTruthy();
  });

  it('applies the given testID to the root', () => {
    render(<MatchRow match={mockMatch} testID="match-card-42" apiService={mockApiService} />);
    expect(screen.getByTestId('match-card-42')).toBeTruthy();
  });

  it('sets an accessibility label describing the fixture', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    expect(screen.getByTestId('match-row-42').props.accessibilityLabel).toBe(
      'Arsenal vs Chelsea',
    );
  });

  it('calls onPress when the row is pressed, if provided', () => {
    const onPress = jest.fn();
    render(
      <MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} onPress={onPress} />,
    );
    fireEvent.press(screen.getByTestId('match-row-42'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders as non-pressable when onPress is not provided', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    const row = screen.getByTestId('match-row-42');
    expect(row.props.onPress).toBeUndefined();
  });

  it('uses default sizing when no sizing override is given', () => {
    render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);
    expect(screen.getByTestId('logo-arsenal.png').props.style).toMatchObject({
      width: 16,
      height: 16,
    });
  });

  it('applies a sizing override for logo size and font sizes', () => {
    render(
      <MatchRow
        match={mockMatch}
        testID="match-row-42"
        apiService={mockApiService}
        sizing={{ logoSize: 28, teamNameFontSize: 14, scoreFontSize: 18 }}
      />,
    );
    expect(screen.getByTestId('logo-arsenal.png').props.style).toMatchObject({
      width: 28,
      height: 28,
    });

    const homeName = screen.getByText('Arsenal');
    const flattenedHomeStyle = [].concat(homeName.props.style).reduce(
      (acc: object, s: object) => ({ ...acc, ...s }),
      {},
    );
    expect(flattenedHomeStyle).toMatchObject({ fontSize: 14 });

    const score = screen.getByText('-');
    const flattenedScoreStyle = [].concat(score.props.style).reduce(
      (acc: object, s: object) => ({ ...acc, ...s }),
      {},
    );
    expect(flattenedScoreStyle).toMatchObject({ fontSize: 18 });
  });

  describe('chart entry point', () => {
    it('renders the chart button for this fixture when charting is available', () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });

      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.getByTestId('chart-button-42')).toBeTruthy();
    });

    it('does not render the chart button when charting is not available', () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: false,
        loadingCharteableMatchNow: false,
      });

      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.queryByTestId('chart-button-42')).toBeNull();
    });

    it('calls useCharteableMatchNow with the apiService and the match fixtureId', () => {
      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(useCharteableMatchNow).toHaveBeenCalledWith(mockApiService, 42);
    });
  });

  describe('top guys entry point', () => {
    it('renders the top guys button for this fixture when top guys is available', () => {
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.getByTestId('top-guys-button-42')).toBeTruthy();
    });

    it('does not render the top guys button when top guys is not available', () => {
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: false,
        loadingTopGuysAvailable: false,
      });

      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.queryByTestId('top-guys-button-42')).toBeNull();
    });

    it('calls useTopGuysAvailable with the apiService and the match fixtureId', () => {
      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(useTopGuysAvailable).toHaveBeenCalledWith(mockApiService, 42);
    });

    it('renders both the chart and top guys buttons together when both are available', () => {
      (useCharteableMatchNow as jest.Mock).mockReturnValue({
        isCharteableMatchNow: true,
        loadingCharteableMatchNow: false,
      });
      (useTopGuysAvailable as jest.Mock).mockReturnValue({
        isTopGuysAvailable: true,
        loadingTopGuysAvailable: false,
      });

      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.getByTestId('chart-button-42')).toBeTruthy();
      expect(screen.getByTestId('top-guys-button-42')).toBeTruthy();
    });

    it('renders neither button when neither is available', () => {
      render(<MatchRow match={mockMatch} testID="match-row-42" apiService={mockApiService} />);

      expect(screen.queryByTestId('chart-button-42')).toBeNull();
      expect(screen.queryByTestId('top-guys-button-42')).toBeNull();
    });
  });
});
