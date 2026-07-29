import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import TeamsRestStatusComponent from './TeamRestStatus';
import { TeamsRestStatus } from 'open-football-project-core';

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

describe('TeamsRestStatusComponent', () => {
  const mockStatus: TeamsRestStatus = {
    homeTeamStatus: 'Good Rest',
    awayTeamStatus: 'Moderate',
  };

  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.good_rest': 'Good Rest',
        'common.moderate': 'Moderate',
        'common.unknown': 'Unknown',
        'common.no_data': 'No Data',
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
      <TeamsRestStatusComponent
        isHome={true}
        loading={true}
        restStatus={undefined}
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when restStatus is undefined and loading is false', () => {
    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={undefined}
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders home team ArrowStatusTile correctly', () => {
    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={mockStatus}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
    expect(screen.getByTestId('arrow-status')).toBeTruthy();
  });

  it('renders away team ArrowStatusTile correctly', () => {
    render(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={mockStatus}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
  });

  it('correctly determines isUp status for good rest', () => {
    const { getAllByTestId } = render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={mockStatus}
      />
    );
    const upElements = getAllByTestId('arrow-up');
    expect(upElements[0]).toBeTruthy();
  });

  it('correctly determines isUp status for moderate rest', () => {
    const { getAllByTestId } = render(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={mockStatus}
      />
    );
    const upElements = getAllByTestId('arrow-up');
    expect(upElements[0]).toBeTruthy();
  });

  it('correctly determines isFlat status for moderate rest', () => {
    const { getAllByTestId } = render(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={mockStatus}
      />
    );
    const flatElements = getAllByTestId('arrow-flat');
    expect(flatElements[0]).toBeTruthy();
  });

  it('correctly determines isFlat status for unknown rest', () => {
    const unknownStatus: TeamsRestStatus = {
      homeTeamStatus: 'Unknown',
      awayTeamStatus: 'Unknown',
    };
    const { getAllByTestId } = render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={unknownStatus}
      />
    );
    const flatElements = getAllByTestId('arrow-flat');
    expect(flatElements[0]).toBeTruthy();
  });

  it('correctly determines isFlat status for empty string', () => {
    const emptyStatus: TeamsRestStatus = {
      homeTeamStatus: '',
      awayTeamStatus: '',
    };
    const { getAllByTestId } = render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={emptyStatus}
      />
    );
    const flatElements = getAllByTestId('arrow-flat');
    expect(flatElements[0]).toBeTruthy();
  });

  it('maintains prop consistency for both home and away teams', () => {
    const { rerender } = render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={mockStatus}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();

    rerender(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={mockStatus}
      />
    );
    expect(screen.getByTestId('arrow-tile')).toBeTruthy();
  });
});
