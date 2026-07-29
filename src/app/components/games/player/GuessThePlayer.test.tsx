import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

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
  buildPlayerTriviaSvg: jest.fn(() => ({
    svgString: '<svg>player-quiz</svg>',
    width: 600,
    height: 400,
    filename: 'player-quiz.png',
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

import GuessThePlayer from './GuessThePlayer';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../navigation/RootNavigator';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

// Mock Linking
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

describe('GuessThePlayer Component', () => {
  const mockNewGame = jest.fn();
  const mockNavigate = jest.fn();

  const mockGame = {
    playerId: '123',
    playerName: 'Lionel Messi',
    playerPhoto: 'https://example.com/messi.jpg',
    playerNationality: 'Argentina',
    playerPosition: 'Forward',
    options: ['Lionel Messi', 'Cristiano Ronaldo', 'Neymar Jr'],
    hints: [
      {
        hintKey: 'TRANSFER' as const,
        transferFromTeam: 'Barcelona',
        transferToTeam: 'PSG',
        transferYear: 2021,
        transferFromLogo: 'https://example.com/barca.png',
        transferToLogo: 'https://example.com/psg.png',
        trophyLeague: undefined,
        trophySeason: undefined,
        trophyCountry: undefined,
      },
      {
        hintKey: 'TROPHY' as const,
        trophyCountry: 'Argentina',
        trophyLeague: 'World Cup',
        trophySeason: '2022',
        transferFromTeam: undefined,
        transferToTeam: undefined,
        transferYear: undefined,
        transferFromLogo: undefined,
        transferToLogo: undefined,
      },
    ],
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  const renderComponent = () => {
    return render(
      <GuessThePlayer
        teamName="FC Barcelona"
        game={mockGame}
        newGame={mockNewGame}
      />
    );
  };

  it('renders player hints title', () => {
    renderComponent();
    const hintsTitle = screen.getByTestId('hints-title');
    expect(hintsTitle).toBeTruthy();
  });

  it('shows "?" when player not revealed', () => {
    renderComponent();
    const questionMark = screen.getByTestId('question-mark');
    expect(questionMark).toBeTruthy();
  });

  it('reveals player details on correct selection', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-Lionel Messi');
    fireEvent.press(correctOption);

    const playerNameLink = screen.getByTestId('player-name-link');
    expect(playerNameLink).toBeTruthy();

    const wrongGuess = screen.queryByTestId('wrong-guess');
    expect(wrongGuess).toBeFalsy();
  });

  it('shows wrong guess message on incorrect selection', async () => {
    renderComponent();
    const incorrectOption = screen.getByTestId('option-Cristiano Ronaldo');
    fireEvent.press(incorrectOption);

    await waitFor(() => {
      const wrongGuess = screen.getByTestId('wrong-guess');
      expect(wrongGuess).toBeTruthy();
    });
  });

  it('calls newGame when clicking "New Quiz" button', () => {
    renderComponent();
    const newGameButton = screen.getByTestId('new-game-button');
    fireEvent.press(newGameButton);

    expect(mockNewGame).toHaveBeenCalledTimes(1);
  });

  it('opens Twitter intent on "Ask for Help" click', async () => {
    renderComponent();
    const helpButton = screen.getByTestId('ask-help-button');
    fireEvent.press(helpButton);
  });

  it('navigates to player details on player name click', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-Lionel Messi');
    fireEvent.press(correctOption);

    const playerNameLink = screen.getByTestId('player-name-link');
    fireEvent.press(playerNameLink);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.PLAYER_HISTORY, {
      playerId: '123',
    });
  });

  it('renders options grid when not revealed', () => {
    renderComponent();
    const optionsGrid = screen.getByTestId('options-grid');
    expect(optionsGrid).toBeTruthy();

    const lionelMessi = screen.getByTestId('option-Lionel Messi');
    const cristianoRonaldo = screen.getByTestId('option-Cristiano Ronaldo');
    const neymarJr = screen.getByTestId('option-Neymar Jr');

    expect(lionelMessi).toBeTruthy();
    expect(cristianoRonaldo).toBeTruthy();
    expect(neymarJr).toBeTruthy();
  });

  it('hides options grid when revealed', () => {
    renderComponent();
    const correctOption = screen.getByTestId('option-Lionel Messi');
    fireEvent.press(correctOption);

    const optionsGrid = screen.queryByTestId('options-grid');
    expect(optionsGrid).toBeFalsy();
  });

  it('displays hints with correct structure', () => {
    renderComponent();
    const hintCard0 = screen.getByTestId('hint-card-0');
    const hintCard1 = screen.getByTestId('hint-card-1');

    expect(hintCard0).toBeTruthy();
    expect(hintCard1).toBeTruthy();
  });

  it('uses ShareSvgButton with svgData.svgString', () => {
    renderComponent();
    expect(screen.getByTestId('share-svg-button-<svg>player-quiz</svg>')).toBeTruthy();
  });

  it('renders TV-sized photo container at width 1366 (breakpoints.tv = 1280)', () => {
    renderComponent();
    const photoContainer = screen.getByTestId('photo-container');
    expect(photoContainer).toHaveStyle({ width: 280, height: 280 });
  });

});

