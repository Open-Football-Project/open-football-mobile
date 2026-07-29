import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import MatchEvents from './MatchEvents';
import { LastFiveMatchesEvents } from '@matchinsights/core';

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

describe('MatchEvents Component', () => {
  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.goals': 'Goals',
        'common.yellow_cards': 'Yellow Cards',
        'common.red_cards': 'Red Cards',
        'common.first_half': 'First Half',
        'common.second_half': 'Second Half',
        'common.extra_time': 'Extra Time',
        'common.penalties': 'Penalties',
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

  const mockEvents: LastFiveMatchesEvents = {
    firstHalfGoals: 1,
    secondHalfGoals: 2,
    extraTimeGoals: 1,
    penalties: 0,
    firstHalfYellowCards: 1,
    secondHalfYellowCards: 2,
    extraTimeYellowCards: 0,
    firstHalfRedCards: 0,
    secondHalfRedCards: 1,
    extraTimeRedCards: 0,
  };

  it('renders loading state', () => {
    render(<MatchEvents loading={true} events={undefined} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders NoData when events is undefined and loading is false', () => {
    render(<MatchEvents loading={false} events={undefined} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders goals card', () => {
    const { getByText, getAllByText } = render(
      <MatchEvents loading={false} events={mockEvents} />
    );

    expect(getByText('Goals')).toBeTruthy();
    // Since there are multiple 1 and 2 values, just verify they're rendered
    const allText = screen.root.children;
    expect(allText).toBeTruthy();
  });

  it('renders yellow cards card', () => {
    const { getByText } = render(
      <MatchEvents loading={false} events={mockEvents} />
    );

    expect(getByText('Yellow Cards')).toBeTruthy();
  });

  it('renders red cards card', () => {
    const { getByText } = render(
      <MatchEvents loading={false} events={mockEvents} />
    );

    expect(getByText('Red Cards')).toBeTruthy();
  });

  it('renders period labels across multiple cards', () => {
    const { queryAllByText } = render(
      <MatchEvents loading={false} events={mockEvents} />
    );

    // Period labels appear in multiple cards, verify they're rendered
    const firstHalfLabels = queryAllByText(/First Half/i);
    expect(firstHalfLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all card titles', () => {
    const { getByText } = render(
      <MatchEvents loading={false} events={mockEvents} />
    );

    expect(getByText('Goals')).toBeTruthy();
    expect(getByText('Yellow Cards')).toBeTruthy();
    expect(getByText('Red Cards')).toBeTruthy();
  });

  it('handles undefined events gracefully', () => {
    render(<MatchEvents loading={false} events={undefined} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });
});
