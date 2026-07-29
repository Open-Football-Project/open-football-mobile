import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { RanksAndPoints } from './RanksAndPoints';
import { PositionAndPoints } from 'open-football-project-core';

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

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core');
  return {
    ...actual,
    leagueGroupTranslation: (desc: string, lang: string) => desc,
  };
});

describe('RanksAndPoints Component', () => {
  const mockTranslation = {
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockData: PositionAndPoints[] = [
    { description: 'Team A', position: 1, points: 30 },
    { description: 'Team B', position: 2, points: 25 },
  ];

  it('renders loading state', () => {
    render(<RanksAndPoints positionAndPoints={[]} loading={true} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when array is empty and loading is false', () => {
    render(<RanksAndPoints positionAndPoints={[]} loading={false} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders card for each positionAndPoints item', () => {
    const { getByTestId } = render(
      <RanksAndPoints positionAndPoints={mockData} loading={false} />
    );

    expect(getByTestId('Team A-0')).toBeTruthy();
    expect(getByTestId('Team B-1')).toBeTruthy();
  });

  it('displays position and points correctly for each item', () => {
    const { getByText } = render(
      <RanksAndPoints positionAndPoints={mockData} loading={false} />
    );

    expect(getByText('1')).toBeTruthy(); // Position 1
    expect(getByText('30')).toBeTruthy(); // Points 30
    expect(getByText('2')).toBeTruthy(); // Position 2
    expect(getByText('25')).toBeTruthy(); // Points 25
  });

  it('renders cards for multiple items', () => {
    const manyItems: PositionAndPoints[] = [
      { description: 'Team A', position: 1, points: 30 },
      { description: 'Team B', position: 2, points: 25 },
      { description: 'Team C', position: 3, points: 20 },
    ];

    const { getByTestId } = render(
      <RanksAndPoints positionAndPoints={manyItems} loading={false} />
    );

    expect(getByTestId('Team A-0')).toBeTruthy();
    expect(getByTestId('Team B-1')).toBeTruthy();
    expect(getByTestId('Team C-2')).toBeTruthy();
  });

  it('handles empty description gracefully', () => {
    const dataWithEmptyDesc: PositionAndPoints[] = [
      { description: '', position: 5, points: 10 },
    ];

    const { getByText } = render(
      <RanksAndPoints positionAndPoints={dataWithEmptyDesc} loading={false} />
    );

    expect(getByText('5')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
  });

  it('renders ScrollView container for data', () => {
    const { getByTestId } = render(
      <RanksAndPoints positionAndPoints={mockData} loading={false} />
    );

    // Cards should be rendered
    expect(getByTestId('Team A-0')).toBeTruthy();
  });

  it('handles undefined positionAndPoints array', () => {
    render(
      <RanksAndPoints positionAndPoints={undefined as any} loading={false} />
    );
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('displays all position and point values correctly', () => {
    const testData: PositionAndPoints[] = [
      { description: 'League A', position: 10, points: 100 },
    ];

    const { getByText } = render(
      <RanksAndPoints positionAndPoints={testData} loading={false} />
    );

    expect(getByText('10')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });
});
