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

import RankingPlayerCard from './RankingPlayerCard';
import { LeagueRankingPlayer } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, _options?: any) => {
      const translations: Record<string, string> = {
        'common.age': 'Age',
        'common.goals': 'Goals',
        'common.assists': 'Assists',
        'common.y_cards': 'Yellow Cards',
        'common.r_cards': 'Red Cards',
        'common.appearences': 'Appearances',
        'common.view_team': 'View Team',
        'common.view_player': 'View Player',
        'accessibility.view_team': 'View team details',
        'accessibility.view_player': 'View player profile',
        'common.genquiz': 'Generate Quiz',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
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
      yellow: '#ffc61a',
      aqualight: '#17c0eb',
      royalblue: '#0d2769ff',
      red: '#ff4848',
    },
    text: {
      primary: '#FFFFFF',
      darker: '#000000',
      secondary: '#B0B0B0',
    },
    secondary: {
      default: '#E5E5E5',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
  fontWeight: {
    semibold: '600',
    bold: '700',
  },
  borderRadius: {
    full: 999,
    md: 12,
    lg: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
}));

jest.mock('../../../general/share-svg-button/ShareSvgButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ svgString, label }: { svgString: string; label?: string }) =>
      React.createElement(View, { testID: `share-svg-button-${label ?? 'default'}-${svgString}` }),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as object;
  return {
    ...actual,
    buildPlayerCardSvgString: jest.fn()
      .mockReturnValueOnce('<svg>player-card</svg>')
      .mockReturnValueOnce('<svg>quiz-card</svg>'),
    obscurePlayerName: jest.fn((name: string) => `***${name}***`),
  };
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native') as any;
  RN.Image.resolveAssetSource = jest.fn(() => ({ uri: 'file:///player-fallback.png' }));
  return RN;
});

// Mock Icons
jest.mock('../../../../icons/Icons', () => ({
  FootballIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: testID || 'football-icon' }, '⚽');
  },
  PlayerIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: testID || 'player-icon' }, '👟');
  },
}));

describe('RankingPlayerCard', () => {
  const mockPlayer: LeagueRankingPlayer = {
    playerId: 14,
    playerName: 'Erling Haaland',
    playerPhoto: 'https://example.com/haaland.png',
    playerAge: 24,
    playerTeamId: 33,
    playerTeamLogo: 'https://example.com/man-city-logo.png',
    playerTeamName: 'Manchester City',
    playerTotalGoals: 36,
    playerTotalAssists: 8,
    playerTotalYellowCards: 2,
    playerTotalRedCards: 0,
    playerTotalAppearances: 30,
  };

  it("renders the player's name, age, and team", () => {
    render(<RankingPlayerCard player={mockPlayer} />);

    expect(screen.getByText(mockPlayer.playerName)).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTeamName}`)
    ).toBeOnTheScreen();
  });

  it("renders all the player's stats correctly", () => {
    render(<RankingPlayerCard player={mockPlayer} />);

    expect(screen.getByTestId('goals')).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTotalGoals}`)
    ).toBeOnTheScreen();

    expect(screen.getByTestId('assists')).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTotalAssists}`)
    ).toBeOnTheScreen();

    expect(screen.getByTestId('y-cards')).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTotalYellowCards}`)
    ).toBeOnTheScreen();

    expect(screen.getByTestId('r-cards')).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTotalRedCards}`)
    ).toBeOnTheScreen();

    expect(screen.getByTestId('appearences')).toBeOnTheScreen();
    expect(
      screen.getByText(`${mockPlayer.playerTotalAppearances}`)
    ).toBeOnTheScreen();
  });

  it('renders player and team images correctly', () => {
    render(<RankingPlayerCard player={mockPlayer} />);

    const playerImg = screen.getByTestId('player-photo');
    const teamLogo = screen.getByTestId('team-logo');

    expect(playerImg).toBeOnTheScreen();
    expect(teamLogo).toBeOnTheScreen();

    expect(playerImg.props.source.uri).toBe(mockPlayer.playerPhoto);
    expect(teamLogo.props.source.uri).toBe(mockPlayer.playerTeamLogo);
  });

  it('renders view team button and has correct onPress', () => {
    render(<RankingPlayerCard player={mockPlayer} />);

    const viewTeamButton = screen.getByTestId('view-team-button');
    expect(viewTeamButton).toBeOnTheScreen();
    expect(screen.getByText('View Team')).toBeOnTheScreen();
  });

  it('renders view player button and has correct onPress', () => {
    render(<RankingPlayerCard player={mockPlayer} />);

    const viewPlayerButton = screen.getByTestId('view-player-button');
    expect(viewPlayerButton).toBeOnTheScreen();
    expect(screen.getByText('View Player')).toBeOnTheScreen();
  });

  it('handles optional player age', () => {
    const playerWithAge: LeagueRankingPlayer = {
      ...mockPlayer,
      playerAge: 25,
    };

    render(<RankingPlayerCard player={playerWithAge} />);

    expect(screen.getByTestId('player-age')).toBeOnTheScreen();
  });

  describe('Share', () => {
    beforeEach(() => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      buildPlayerCardSvgString
        .mockReturnValueOnce('<svg>player-card</svg>')
        .mockReturnValueOnce('<svg>quiz-card</svg>');
      jest.clearAllMocks();
      buildPlayerCardSvgString
        .mockReturnValueOnce('<svg>player-card</svg>')
        .mockReturnValueOnce('<svg>quiz-card</svg>');
    });

    it('renders ShareSvgButton with the normal player card svgString', () => {
      render(<RankingPlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('share-svg-button-default-<svg>player-card</svg>')).toBeTruthy();
    });

    it('renders ShareSvgButton with Generate Quiz label for the quiz svgString', () => {
      render(<RankingPlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('share-svg-button-Generate Quiz-<svg>quiz-card</svg>')).toBeTruthy();
    });

    it('calls buildPlayerCardSvgString with normal player data for the share button', () => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      render(<RankingPlayerCard player={mockPlayer} />);
      expect(buildPlayerCardSvgString).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          playerName: mockPlayer.playerName,
          playerPhoto: mockPlayer.playerPhoto,
          playerAge: mockPlayer.playerAge,
          playerTeamName: mockPlayer.playerTeamName,
          playerTeamLogo: mockPlayer.playerTeamLogo,
          goals: mockPlayer.playerTotalGoals,
          assists: mockPlayer.playerTotalAssists,
          yellowCards: mockPlayer.playerTotalYellowCards,
          redCards: mockPlayer.playerTotalRedCards,
          appearances: mockPlayer.playerTotalAppearances,
        }),
        expect.any(Map),
      );
    });

    it('calls buildPlayerCardSvgString with obscured data for the quiz button', () => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      render(<RankingPlayerCard player={mockPlayer} />);
      expect(buildPlayerCardSvgString).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          playerName: `***${mockPlayer.playerName}***`,
          playerPhoto: 'file:///player-fallback.png',
        }),
        expect.any(Map),
      );
    });

    it('calls buildPlayerCardSvgString with translated labels', () => {
      const { buildPlayerCardSvgString, PlayerSvgLabel } = require('@matchinsights/core');
      render(<RankingPlayerCard player={mockPlayer} />);
      const labels: Map<unknown, string> = buildPlayerCardSvgString.mock.calls[0][1];
      expect(labels.get(PlayerSvgLabel.AGE)).toBe('Age');
      expect(labels.get(PlayerSvgLabel.GOALS)).toBe('Goals');
      expect(labels.get(PlayerSvgLabel.ASSISTS)).toBe('Assists');
      expect(labels.get(PlayerSvgLabel.YELLOW_CARDS)).toBe('Yellow Cards');
      expect(labels.get(PlayerSvgLabel.RED_CARDS)).toBe('Red Cards');
      expect(labels.get(PlayerSvgLabel.APPEARANCES)).toBe('Appearances');
    });
  });
});
