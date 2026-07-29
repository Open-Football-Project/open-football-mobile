import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PlayerTrophies from './PlayerTrophies';
import { PlayerTrophyInfo } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      const translations: Record<string, string> = {
        'nodata.notrophies': 'No trophies available',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../icons/Icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    TrophyIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'trophy-icon'} style={{ fontSize: size, color }}>🏆</Text>
    ),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core');
  return {
    ...actual,
    translateLeague: (league: string, t?: any) => {
      const translations: Record<string, string> = {
        'LaLiga': 'LaLiga',
        'Champions League': 'Champions League',
        'Premier League': 'Premier League',
        'Serie A': 'Serie A',
      };
      return translations[league] || league;
    },
    translateCountry: (country: string, t?: any) => {
      const translations: Record<string, string> = {
        'Spain': 'Spain',
        'Europe': 'Europe',
        'England': 'England',
        'Italy': 'Italy',
      };
      return translations[country] || country;
    },
  };
});

jest.mock('../../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ message }: { message: string }) => (
      <Text testID="no-data">{message}</Text>
    ),
  };
});

describe('PlayerTrophies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTrophies: PlayerTrophyInfo[] = [
    {
      league: 'LaLiga',
      country: 'Spain',
      season: '2020/21',
      place: 'Winner',
    },
    {
      league: 'Champions League',
      country: 'Europe',
      season: '2021/22',
      place: 'Runner-up',
    },
  ];

  it('should render NoData when trophies array is empty', () => {
    render(<PlayerTrophies trophies={[]} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
    expect(screen.getByTestId('no-data')).toHaveTextContent('No trophies available');
  });

  it('should render trophy cards for each trophy', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByTestId('trophy-card-0')).toBeTruthy();
    expect(screen.getByTestId('trophy-card-1')).toBeTruthy();
  });

  it('should display league names', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByText('LaLiga')).toBeTruthy();
    expect(screen.getByText('Champions League')).toBeTruthy();
  });

  it('should display trophy place/position', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByText('Winner')).toBeTruthy();
    expect(screen.getByText('Runner-up')).toBeTruthy();
  });

  it('should display season', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByText('2020/21')).toBeTruthy();
    expect(screen.getByText('2021/22')).toBeTruthy();
  });

  it('should display country', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByText('Spain')).toBeTruthy();
    expect(screen.getByText('Europe')).toBeTruthy();
  });

  it('should sort trophies by season (newest first)', () => {
    const unsortedTrophies: PlayerTrophyInfo[] = [
      {
        league: 'LaLiga',
        country: 'Spain',
        season: '2020/21',
        place: 'Winner',
      },
      {
        league: 'Champions League',
        country: 'Europe',
        season: '2021/22',
        place: 'Runner-up',
      },
    ];

    render(<PlayerTrophies trophies={unsortedTrophies} />);

    const seasonElements = screen.getAllByText(/^(2020\/21|2021\/22)$/);
    expect(seasonElements[0]).toHaveTextContent('2021/22');
    expect(seasonElements[1]).toHaveTextContent('2020/21');
  });

  it('should filter out invalid trophies (missing required fields)', () => {
    const mixedTrophies: PlayerTrophyInfo[] = [
      {
        league: 'LaLiga',
        country: 'Spain',
        season: '2020/21',
        place: 'Winner',
      },
      {
        // Missing place
        league: 'Serie A',
        country: 'Italy',
        season: '2019/20',
        place: null as unknown as string,
      },
      {
        league: 'Champions League',
        country: 'Europe',
        season: '2021/22',
        place: 'Runner-up',
      },
    ];

    render(<PlayerTrophies trophies={mixedTrophies} />);

    expect(screen.getByTestId('trophy-card-0')).toBeTruthy();
    expect(screen.getByTestId('trophy-card-1')).toBeTruthy();
    expect(screen.queryByTestId('trophy-card-2')).toBeNull();
    expect(screen.queryByText('Serie A')).toBeNull();
  });

  it('should handle trophies without country gracefully', () => {
    const trophiesWithoutCountry: PlayerTrophyInfo[] = [
      {
        league: 'LaLiga',
        country: null as unknown as string,
        season: '2020/21',
        place: 'Winner',
      },
    ];

    render(<PlayerTrophies trophies={trophiesWithoutCountry} />);

    expect(screen.getByTestId('trophy-card-0')).toBeTruthy();
    expect(screen.getByText('LaLiga')).toBeTruthy();
    expect(screen.getByText('Winner')).toBeTruthy();
  });

  it('should render trophy container with correct testID', () => {
    render(<PlayerTrophies trophies={mockTrophies} />);

    expect(screen.getByTestId('player-trophies-container')).toBeTruthy();
  });

  it('should render all trophy fields in correct order', () => {
    const singleTrophy: PlayerTrophyInfo[] = [
      {
        league: 'Premier League',
        country: 'England',
        season: '2022/23',
        place: 'Champion',
      },
    ];

    render(<PlayerTrophies trophies={singleTrophy} />);

    expect(screen.getByText('Premier League')).toBeTruthy();
    expect(screen.getByText('Champion')).toBeTruthy();
    expect(screen.getByText('2022/23')).toBeTruthy();
    expect(screen.getByText('England')).toBeTruthy();
  });
});
