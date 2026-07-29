import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

jest.mock('../../../../navigation/RootNavigator', () => ({
  Routes: {
    LANDING: 'landing',
    ALL_LEAGUES: 'all-leagues',
    GAME: 'game',
    GUESS_LEAGUE_TEAM: 'guess-league-team',
    GUESS_TEAM_PLAYER: 'guess-team-player',
    LEAGUE: 'league',
    LEAGUE_SPECIAL_ARG: 'league-special-arg',
    LEAGUE_SPECIAL_GROUPS: 'league-special-groups',
    LEAGUE_SPECIAL_KNOCKOUT: 'league-special-knockout',
    LIVE: 'live',
    MATCH_DETAILS: 'match-details',
    MATCHES: 'matches',
    PLAYER_HISTORY: 'player-history',
    TEAM_DETAILS: 'team-details',
  },
}));

import { LeaguesMenuGrid } from './LeaguesMenuGrid';
import { LeagueBasicInfo } from 'open-football-project-core';

const mockLeagues: LeagueBasicInfo[] = [
  {
    id: 39,
    name: 'Premier League',
    logo: 'https://example.com/epl-logo.png',

    type: 'league',
  },
  {
    id: 140,
    name: 'La Liga',
    logo: 'https://example.com/laliga-logo.png',
    type: 'league',
  },
];

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key.includes('league.')) {
        return options?.defaultValue || key;
      }
      return key;
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../../../components/general/logo/Logo', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ src }: { src: string }) =>
    React.createElement(View, {
      testID: 'mock-logo',
      style: { width: 20, height: 20 },
      data: { src },
    });
});

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

jest.mock('../../../../theme', () => ({
  breakpoints: {
    tablet: 768,
    desktop: 1024,
    tv: 1280,
  },
  colors: {
    background: {
      card: '#1E1E1E',
      dark: '#121212',
    },
    brand: {
      purple: '#d793f7ff',
      aqualight: '#6FDFEE',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
  spacing: {
    sm: 8,
    md: 12,
  },
  fontSize: {
    xs: 12,
    base: 16,
  },
  fontWeight: {
    semibold: '600',
  },
  borderRadius: {
    sm: 8,
    lg: 16,
  },
  borders: {
    hairline: 0.5,
    thin: 1,
    thick: 2,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  },
}));

describe('LeaguesMenuGrid', () => {
  it('renders without crashing', () => {
    render(<LeaguesMenuGrid leagues={mockLeagues} />);
    expect(screen.getByTestId('39')).toBeOnTheScreen();
    expect(screen.getByTestId('140')).toBeOnTheScreen();
  });

  it('renders all leagues with their logos', () => {
    render(<LeaguesMenuGrid leagues={mockLeagues} />);

    mockLeagues.forEach((league) => {
      expect(screen.getByTestId(`${league.id}`)).toBeOnTheScreen();
    });

    const logos = screen.getAllByTestId('mock-logo');
    expect(logos).toHaveLength(mockLeagues.length);
  });

  it('renders league items with correct structure', () => {
    render(<LeaguesMenuGrid leagues={mockLeagues} />);

    mockLeagues.forEach((league) => {
      const leagueItem = screen.getByTestId(`${league.id}`);
      expect(leagueItem).toBeOnTheScreen();
    });
  });

  it('applies TV typography at width 1366 (breakpoints.tv = 1280)', () => {
    render(<LeaguesMenuGrid leagues={mockLeagues} />);

    expect(screen.getByText('Premier Lg.')).toHaveStyle({ fontSize: 16 });
  });
});
