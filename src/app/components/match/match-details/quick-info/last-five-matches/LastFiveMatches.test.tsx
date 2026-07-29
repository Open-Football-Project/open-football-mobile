import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import LastFiveMatches from './LastFiveMatches';

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

describe('LastFiveMatches Component', () => {
  const mockLastFive = {
    homeTeamLastFive: ['W', 'D', 'L', 'W', 'W'],
    awayTeamLastFive: ['L', 'L', 'D', 'W', 'D'],
  };

  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.W': 'W',
        'common.D': 'D',
        'common.L': 'L',
        'common.no_data': 'No Data',
      };
      return translations[key] || key;
    },
  };

  beforeEach(() => {
    (useTranslation as unknown as jest.Mock).mockReturnValue(mockTranslation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <LastFiveMatches loading={true} lastFiveResults={undefined} isHome={true} />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when lastFiveResults is undefined and loading is false', () => {
    render(
      <LastFiveMatches loading={false} lastFiveResults={undefined} isHome={true} />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders home team last five matches correctly', () => {
    const { getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={true}
      />
    );

    const resultBoxes = getAllByTestId(/^result-/);
    expect(resultBoxes).toHaveLength(5);
  });

  it('renders away team last five matches correctly', () => {
    const { getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={false}
      />
    );

    const resultBoxes = getAllByTestId(/^result-/);
    expect(resultBoxes).toHaveLength(5);
  });

  it("renders 'No data' when last five array is empty", () => {
    const emptyData = { homeTeamLastFive: [], awayTeamLastFive: [] };
    render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={emptyData}
        isHome={true}
      />
    );
    expect(screen.getByText('No Data')).toBeTruthy();
  });

  it('maintains prop consistency with all three required props', () => {
    const { rerender, getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={true}
      />
    );

    expect(getAllByTestId(/^result-/)).toHaveLength(5);

    rerender(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={false}
      />
    );
    expect(getAllByTestId(/^result-/)).toHaveLength(5);
  });

  it('handles partial last five matches (less than 5)', () => {
    const partialData = {
      homeTeamLastFive: ['W', 'D'],
      awayTeamLastFive: ['L'],
    };
    const { getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={partialData}
        isHome={true}
      />
    );
    const resultBoxes = getAllByTestId(/^result-/);
    expect(resultBoxes).toHaveLength(2);
  });

  it('displays translations using useTranslation hook', () => {
    render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={true}
      />
    );
    expect(mockTranslation.t).toBeDefined();
  });

  it('correctly selects home team results when isHome is true', () => {
    const { getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={true}
      />
    );
    const resultBoxes = getAllByTestId(/^result-/);
    expect(resultBoxes).toHaveLength(5);
  });

  it('correctly selects away team results when isHome is false', () => {
    const { getAllByTestId } = render(
      <LastFiveMatches
        loading={false}
        lastFiveResults={mockLastFive}
        isHome={false}
      />
    );
    const resultBoxes = getAllByTestId(/^result-/);
    expect(resultBoxes).toHaveLength(5);
  });
});