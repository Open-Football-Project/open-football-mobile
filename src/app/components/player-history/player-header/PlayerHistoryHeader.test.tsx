import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../../navigation/RootNavigator', () => ({
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

import PlayerHistoryHeader from './PlayerHistoryHeader';
import { PlayerMainInfo } from '@matchinsights/core';
import { Routes } from '../../../navigation/RootNavigator';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
  NativeStackNavigationProp: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'player.nationality': 'Nationality',
        'player.age': 'Age',
        'player.position': 'Position',
        'player.height': 'Height',
        'player.weight': 'Weight',
        'player.injured': 'Injured',
        'player.isInjured': 'Yes',
        'player.notInjured': 'No',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../general/logo/Logo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ src, size }: any) => (
      <View testID={`logo-${src || 'default'}`} style={{ width: size, height: size }}>
        <Text>{src ? 'logo' : 'shield'}</Text>
      </View>
    ),
  };
});

jest.mock('../../../icons/Icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    PersonIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'person-icon'} style={{ fontSize: size, color }}>👤</Text>
    ),
    InjuredIcon: ({ size, color, testID }: any) => (
      <Text testID={testID || 'injured-icon'} style={{ fontSize: size, color }}>🏥</Text>
    ),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core');
  return {
    ...actual,
    translateCountry: (country: string, t?: any) => {
      const translations: Record<string, string> = {
        Argentina: 'Argentina',
        Brazil: 'Brazil',
        Spain: 'Spain',
      };
      return translations[country] || country;
    },
    translatePlayerPosition: (position: string, t?: any) => {
      const translations: Record<string, string> = {
        Forward: 'Forward',
        Midfielder: 'Midfielder',
        Defender: 'Defender',
        Goalkeeper: 'Goalkeeper',
      };
      return translations[position] || position;
    },
  };
});

describe('PlayerHistoryHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  const mockPlayer: PlayerMainInfo = {
    playerId: 1,
    name: 'Lionel Messi',
    photo: 'https://example.com/messi.png',
    nationality: 'Argentina',
    age: 30,
    position: 'Forward',
    height: '180',
    weight: '75',
    injured: false,
    teamId: 1,
    teamName: 'FC Barcelona',
    teamLogo: 'https://example.com/barcelona.png',
  };

  const playerWithoutPhoto: PlayerMainInfo = {
    ...mockPlayer,
    photo: null,
  };

  const playerWithoutTeam: PlayerMainInfo = {
    ...mockPlayer,
    teamId: 0,
  };

  it('should render player name', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('Lionel Messi')).toBeTruthy();
  });

  it('should render player photo when available', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByTestId('player-photo')).toBeTruthy();
  });

  it('should render placeholder with PersonIcon when photo is missing', () => {
    render(<PlayerHistoryHeader player={playerWithoutPhoto} />);
    expect(screen.getByTestId('player-photo-placeholder')).toBeTruthy();
    expect(screen.getByTestId('player-placeholder-icon')).toBeTruthy();
  });

  it('should display player nationality', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('Argentina')).toBeTruthy();
  });

  it('should display player age', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('30')).toBeTruthy();
  });

  it('should display player position', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('Forward')).toBeTruthy();
  });

  it('should display player height with cm suffix', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('180 cm')).toBeTruthy();
  });

  it('should display player weight with kg suffix', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('75 kg')).toBeTruthy();
  });

  it('should not display injury status when not injured', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.queryByTestId('injury-status')).toBeNull();
  });

  it('should display injury status when injured', () => {
    const injuredPlayer = { ...mockPlayer, injured: true };
    render(<PlayerHistoryHeader player={injuredPlayer} />);
    expect(screen.getByTestId('injury-status')).toBeTruthy();
    expect(screen.getByTestId('injured-icon')).toBeTruthy();
  });

  it('should render team section when teamId is valid', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByTestId('team-section')).toBeTruthy();
  });

  it('should display team name', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByText('FC Barcelona')).toBeTruthy();
  });

  it('should not render team section when teamId is 0', () => {
    render(<PlayerHistoryHeader player={playerWithoutTeam} />);
    expect(screen.queryByTestId('team-section')).toBeNull();
  });

  it('should navigate to team details when team is pressed', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    const teamSection = screen.getByTestId('team-section');
    fireEvent.press(teamSection);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.TEAM_DETAILS, { teamId: '1' });
  });

  it('should render header container with correct testID', () => {
    render(<PlayerHistoryHeader player={mockPlayer} />);
    expect(screen.getByTestId('player-history-header')).toBeTruthy();
  });

  it('should not display nationality when it is Unknown', () => {
    const unknownNationality = { ...mockPlayer, nationality: 'Unknown' };
    render(<PlayerHistoryHeader player={unknownNationality} />);
    // Should not render the nationality section
    expect(screen.queryByText('Argentina')).toBeNull();
  });

  it('should not display position when it is Unknown', () => {
    const unknownPosition = { ...mockPlayer, position: 'Unknown' };
    render(<PlayerHistoryHeader player={unknownPosition} />);
    expect(screen.queryByText('Forward')).toBeNull();
  });

  it('should not display height when it is Unknown', () => {
    const unknownHeight = { ...mockPlayer, height: 'Unknown' };
    render(<PlayerHistoryHeader player={unknownHeight} />);
    expect(screen.queryByText('180 cm')).toBeNull();
  });

  it('should not display weight when it is Unknown', () => {
    const unknownWeight = { ...mockPlayer, weight: 'Unknown' };
    render(<PlayerHistoryHeader player={unknownWeight} />);
    expect(screen.queryByText('75 kg')).toBeNull();
  });
});
