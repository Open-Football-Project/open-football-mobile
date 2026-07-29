import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../general/share-svg-button/ShareSvgButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ svgString }: { svgString: string }) =>
      React.createElement(View, { testID: `share-svg-button-${svgString}` }),
  };
});

jest.mock('@matchinsights/core', () => ({
  ...jest.requireActual('@matchinsights/core'),
  buildTeamTriviaSvg: jest.fn(() => ({
    svgString: '<svg>team-quiz</svg>',
    width: 600,
    height: 400,
    filename: 'team-quiz.png',
  })),
}));

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

import GuessTheTeam from './GuessTheTeam';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../navigation/RootNavigator';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));


jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn().mockResolvedValue(true),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

describe('GuessTheTeam Component', () => {
  const mockNewGame = jest.fn();
  const mockNavigate = jest.fn();

  const mockGame = {
    isAvailable: true,
    teamId: 42,
    teamLogo: 'https://example.com/logo.png',
    teamName: 'FC Awesome',
    venue: 'Dream Stadium',
    founded: 1990,
    season: 2025,
    hints: [
      { hintKey: 'PLAYER' as const, description: 'great_player_key', value: 'Pelé' },
      { hintKey: 'STAT' as const, description: 'total_goals_key', value: '500+' },
    ],
    options: ['FC Awesome', 'United Stars', 'City FC'],
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  const renderComponent = () => {
    return render(
      <GuessTheTeam
        game={mockGame}
        newGame={mockNewGame}
        leagueName="Premier League"
      />
    );
  };

  it('renders hints title', () => {
    renderComponent();
    const hintsTitle = screen.getByTestId('hints-title');
    expect(hintsTitle).toBeTruthy();
  });

  it('shows "?" when team not revealed', () => {
    renderComponent();
    const questionMark = screen.getByTestId('question-mark');
    expect(questionMark).toBeTruthy();
  });

  it('reveals team name and navigates to team detail on correct selection', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-FC Awesome');
    fireEvent.press(correctOption);

    const teamNameLink = screen.getByTestId('team-name-link');
    expect(teamNameLink).toBeTruthy();
  });

  it('shows wrong guess message on incorrect selection', () => {
    renderComponent();
    const wrongOption = screen.getByTestId('option-City FC');
    fireEvent.press(wrongOption);

    const wrongGuess = screen.getByTestId('wrong-guess');
    expect(wrongGuess).toBeTruthy();
  });

  it('displays hints correctly', () => {
    renderComponent();
    const hintCard0 = screen.getByTestId('hint-card-0');
    const hintCard1 = screen.getByTestId('hint-card-1');
    expect(hintCard0).toBeTruthy();
    expect(hintCard1).toBeTruthy();
  });

  it('displays venue as fallback when no hints', () => {
    const gameNoHints = { ...mockGame, hints: [] };
    render(
      <GuessTheTeam
        game={gameNoHints}
        newGame={mockNewGame}
        leagueName="Premier League"
      />
    );
    

    expect(screen.getByText(/common.venue/)).toBeTruthy();
  });

  it('displays photo container', () => {
    renderComponent();
    const photoContainer = screen.getByTestId('photo-container');
    expect(photoContainer).toBeTruthy();
  });

  it('displays ask help button', () => {
    renderComponent();
    const helpButton = screen.getByTestId('ask-help-button');
    expect(helpButton).toBeTruthy();
  });

  it('calls newGame when new game button is pressed', () => {
    renderComponent();
    const newGameButton = screen.getByTestId('new-game-button');
    fireEvent.press(newGameButton);

    expect(mockNewGame).toHaveBeenCalled();
  });

  it('renders options grid when not revealed', () => {
    renderComponent();
    const firstOption = screen.getByTestId('option-FC Awesome');
    expect(firstOption).toBeTruthy();
  });

  it('shows all team options', () => {
    renderComponent();
    mockGame.options.forEach((option: string) => {
      expect(screen.getByText(option)).toBeTruthy();
    });
  });

  it('hides options grid when team is revealed', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-FC Awesome');
    fireEvent.press(correctOption);

    expect(screen.queryByTestId('option-United Stars')).toBeNull();
  });

  it('navigates to TeamDetail when team name is pressed after correct guess', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-FC Awesome');
    fireEvent.press(correctOption);

    const teamNameLink = screen.getByTestId('team-name-link');
    fireEvent.press(teamNameLink);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.TEAM_DETAILS, { teamId: String(mockGame.teamId) });
  });

  it('uses ShareSvgButton with svgData.svgString', () => {
    renderComponent();
    expect(screen.getByTestId('share-svg-button-<svg>team-quiz</svg>')).toBeTruthy();
  });

  it('renders TV-sized photo container at width 1366 (breakpoints.tv = 1280)', () => {
    renderComponent();
    const photoContainer = screen.getByTestId('photo-container');
    expect(photoContainer).toHaveStyle({ width: 280, height: 280 });
  });
});
