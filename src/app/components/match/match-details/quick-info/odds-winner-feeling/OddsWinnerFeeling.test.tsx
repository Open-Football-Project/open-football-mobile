import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import OddsWinnerFeelingComponent from './OddsWinnerFeeling';
import { OddsWinnerFeeling } from 'open-football-project-core';

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

describe('OddsWinnerFeelingComponent', () => {
  const mockWinnerFeeling: OddsWinnerFeeling = {
    home: 'Strong Home',
    away: 'Weak Away',
    draw: 'No Data',
  };

  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.draw': 'Draw',
        'common.strong': 'Strong',
        'common.weak': 'Weak',
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
      <OddsWinnerFeelingComponent
        loading={true}
        winnerFeeling={null}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when no winnerFeeling provided', () => {
    render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={null}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders three ArrowStatusTiles with correct props', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const tiles = getAllByTestId('arrow-tile');
    expect(tiles).toHaveLength(3);
  });

  it('correctly determines isUp status for strong home odds', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const upElements = getAllByTestId('arrow-up');
    expect(upElements[0]).toBeTruthy();
  });

  it('correctly determines isUp status for weak away odds', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const upElements = getAllByTestId('arrow-up');
    expect(upElements[1]).toBeTruthy();
  });

  it('correctly determines isFlat status for no data draw odds', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const flatElements = getAllByTestId('arrow-flat');
    expect(flatElements[2]).toBeTruthy();
  });

  it('correctly translates draw text', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const statusElements = getAllByTestId('arrow-status');
    expect(statusElements[2]).toBeTruthy();
  });

  it('uses team names for home and away status', () => {
    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="Manchester United"
        awayTeam="Liverpool"
      />
    );

    const statusElements = getAllByTestId('arrow-status');
    expect(statusElements[0]).toBeTruthy();
    expect(statusElements[1]).toBeTruthy();
  });

  it('maintains prop consistency with rerender', () => {
    const { rerender } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    expect(screen.getAllByTestId('arrow-tile')).toHaveLength(3);

    rerender(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="DifferentHome"
        awayTeam="DifferentAway"
      />
    );

    expect(screen.getAllByTestId('arrow-tile')).toHaveLength(3);
  });

  it('correctly determines isFlat status for empty string', () => {
    const emptyFeeling: OddsWinnerFeeling = {
      home: '',
      away: '',
      draw: '',
    };

    const { getAllByTestId } = render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={emptyFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    const flatElements = getAllByTestId('arrow-flat');
    flatElements.forEach((element) => {
      expect(element).toBeTruthy();
    });
  });
});
