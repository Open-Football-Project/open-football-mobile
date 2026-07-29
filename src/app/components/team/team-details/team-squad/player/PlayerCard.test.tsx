import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';


jest.mock('../../../../../navigation/RootNavigator', () => ({
  Routes: {
    LANDING: 'landing',
    ALL_LEAGUES: 'all-leagues',
    PLAYER_HISTORY: 'player_history',
    TEAM_DETAILS: 'team_details',
    MATCH_DETAILS: 'match_details',
  },
}));

jest.mock('../../../../../theme', () => ({
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
      royalblue: '#0d2769ff',
      orange: '#FF7F00',
      aqualight: '#00CED1',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      darker: '#333333',
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
  },
  fontWeight: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    full: 9999,
  },
  shadows: {
    sm: {},
    md: {},
  },
}));

jest.mock('../../../../../icons/Icons', () => ({
  PlayerIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: testID || 'player-icon' }, '👟');
  },
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.age': 'Age',
        'common.position': 'Position',
        'common.number': 'Number',
        'common.view_player': 'View Player',
        'accessibility.view_player': 'View player details',
        'common.genquiz': 'Generate Quiz',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as any;
  return {
    ...actual,
    translatePlayerPosition: (position: string) => position,
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

jest.mock('../../../../general/share-svg-button/ShareSvgButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ svgString, label }: { svgString: string; label?: string }) =>
      React.createElement(View, { testID: `share-svg-button-${label ?? 'default'}-${svgString}` }),
  };
});

import PlayerCard from './PlayerCard';
import { TeamPlayer } from '@matchinsights/core';

describe('PlayerCard', () => {
  const mockPlayer: TeamPlayer = {
    playerId: 10,
    name: 'Lionel Messi',
    age: 36,
    position: 'Forward',
    playerNumber: 9,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('renders player card with correct testID', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-card-10')).toBeOnTheScreen();
    });

    it('renders player name correctly', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-name-10')).toHaveTextContent('Lionel Messi');
    });

    it('renders player image', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-image-10')).toBeOnTheScreen();
    });

    it('renders player age when provided', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-age-10')).toHaveTextContent('36');
    });

    it('renders player position when provided', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-position-10')).toBeOnTheScreen();
    });

    it('renders player number when provided', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-number-10')).toHaveTextContent('9');
    });

    it('renders view player button', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-view-button-10')).toBeOnTheScreen();
      expect(screen.getByText('View Player')).toBeOnTheScreen();
    });

    it('renders player icon in button', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('player-icon')).toBeOnTheScreen();
    });
  });

  describe('Optional fields', () => {
    it('does not render age when undefined', () => {
      const playerWithoutAge = { ...mockPlayer, age: undefined };
      render(<PlayerCard player={playerWithoutAge} />);
      expect(screen.queryByTestId('player-age-10')).not.toBeOnTheScreen();
    });

    it('does not render position when not provided', () => {
      const playerWithoutPosition = { ...mockPlayer, position: undefined };
      render(<PlayerCard player={playerWithoutPosition} />);
      expect(screen.queryByTestId('player-position-10')).not.toBeOnTheScreen();
    });

    it('does not render number when undefined', () => {
      const playerWithoutNumber = { ...mockPlayer, playerNumber: undefined };
      render(<PlayerCard player={playerWithoutNumber} />);
      expect(screen.queryByTestId('player-number-10')).not.toBeOnTheScreen();
    });
  });

  describe('Navigation', () => {
    it('navigates to player history when view button is pressed', () => {
      render(<PlayerCard player={mockPlayer} />);

      fireEvent.press(screen.getByTestId('player-view-button-10'));
      expect(mockNavigate).toHaveBeenCalledWith('player_history', { playerId: '10' });
    });
  });

  describe('Share', () => {
    beforeEach(() => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      jest.clearAllMocks();
      buildPlayerCardSvgString
        .mockReturnValueOnce('<svg>player-card</svg>')
        .mockReturnValueOnce('<svg>quiz-card</svg>');
    });

    it('renders ShareSvgButton with the normal player card svgString', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('share-svg-button-default-<svg>player-card</svg>')).toBeTruthy();
    });

    it('renders ShareSvgButton with Generate Quiz label for the quiz svgString', () => {
      render(<PlayerCard player={mockPlayer} />);
      expect(screen.getByTestId('share-svg-button-Generate Quiz-<svg>quiz-card</svg>')).toBeTruthy();
    });

    it('calls buildPlayerCardSvgString with player data for the share button', () => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      render(<PlayerCard player={mockPlayer} />);
      expect(buildPlayerCardSvgString).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          playerName: mockPlayer.name,
          playerPhoto: mockPlayer.photo ?? 'file:///player-fallback.png',
          playerAge: mockPlayer.age,
          position: mockPlayer.position,
          playerNumber: mockPlayer.playerNumber,
        }),
        expect.any(Map),
      );
    });

    it('calls buildPlayerCardSvgString with obscured data for the quiz button', () => {
      const { buildPlayerCardSvgString } = require('@matchinsights/core');
      render(<PlayerCard player={mockPlayer} />);
      expect(buildPlayerCardSvgString).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          playerName: `***${mockPlayer.name}***`,
          playerPhoto: 'file:///player-fallback.png',
        }),
        expect.any(Map),
      );
    });

    it('calls buildPlayerCardSvgString with labels for age, position, and number', () => {
      const { buildPlayerCardSvgString, PlayerSvgLabel } = require('@matchinsights/core');
      render(<PlayerCard player={mockPlayer} />);
      const labels: Map<unknown, string> = buildPlayerCardSvgString.mock.calls[0][1];
      expect(labels.get(PlayerSvgLabel.AGE)).toBe('Age');
      expect(labels.get(PlayerSvgLabel.POSITION)).toBe('Position');
      expect(labels.get(PlayerSvgLabel.PLAYER_NUMBER)).toBe('Number');
    });
  });
});
