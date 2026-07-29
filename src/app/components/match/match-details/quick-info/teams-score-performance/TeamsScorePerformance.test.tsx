import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import TeamsScorePerformanceComponent from './TeamsScorePerformance';
import { TeamsScorePerformance } from 'open-football-project-core';

jest.mock('react-i18next');
jest.mock('../../../../general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: function DummyNoData({ loading }: { loading?: boolean }) {
      return (
        <View testID="no-data">
          <Text testID="no-data-text">
            {loading ? 'Loading...' : 'No Data'}
          </Text>
        </View>
      );
    },
  };
});

jest.mock('../../../../general/status-tile/ArrowStatusTile', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: function DummyArrowStatusTile({
      status,
      isFlat,
      isUp,
    }: {
      status: string;
      isFlat: boolean;
      isUp: boolean;
    }) {
      return (
        <View testID="arrow-tile">
          <Text testID="arrow-status">{status}</Text>
          <Text testID="arrow-flat">{String(isFlat)}</Text>
          <Text testID="arrow-up">{String(isUp)}</Text>
        </View>
      );
    },
  };
});

describe('TeamsScorePerformanceComponent', () => {
  const mockPerformance: TeamsScorePerformance = {
    homeTeamPerformance: 'Good Form',
    awayTeamPerformance: 'Bad Form',
  };

  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.good_form': 'Good Form',
        'common.bad_form': 'Bad Form',
        'common.no_data': 'No Data',
        'common.moderate': 'Moderate',
      };
      return translations[key] || key;
    },
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={true}
        performance={undefined}
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when no performance provided', () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={undefined}
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders home team performance with good form', () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
    expect(screen.getByTestId('arrow-status')).toBeTruthy();
  });

  it('renders away team performance with bad form', () => {
    render(
      <TeamsScorePerformanceComponent
        isHome={false}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
  });

  it('correctly determines isUp status for good performance', () => {
    const { getByTestId } = render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(getByTestId('arrow-up')).toHaveTextContent('true');
  });

  it('correctly determines isUp status for bad performance', () => {
    const { getByTestId } = render(
      <TeamsScorePerformanceComponent
        isHome={false}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(getByTestId('arrow-up')).toHaveTextContent('false');
  });

  it('maintains prop consistency for both home and away teams', () => {
    const { rerender } = render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();

    rerender(
      <TeamsScorePerformanceComponent
        isHome={false}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
  });

  it('correctly determines isFlat status for no data', () => {
    const noDataPerformance: TeamsScorePerformance = {
      homeTeamPerformance: 'No Data',
      awayTeamPerformance: 'No Data',
    };
    const { getByTestId } = render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={noDataPerformance}
      />
    );
    expect(getByTestId('arrow-flat')).toHaveTextContent('true');
  });

  it('correctly determines isFlat status for empty string', () => {
    const emptyPerformance: TeamsScorePerformance = {
      homeTeamPerformance: '',
      awayTeamPerformance: '',
    };
    const { getByTestId } = render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={emptyPerformance}
      />
    );
    expect(getByTestId('arrow-flat')).toHaveTextContent('true');
  });

  it('correctly translates performance status', () => {
    const { getByTestId } = render(
      <TeamsScorePerformanceComponent
        isHome={true}
        loading={false}
        performance={mockPerformance}
      />
    );
    expect(getByTestId('arrow-status')).toBeTruthy();
  });
});
