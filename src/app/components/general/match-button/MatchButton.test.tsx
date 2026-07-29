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

import MatchButton from './MatchButton';
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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

describe('MatchButton', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('renders Live button when isLiveNow is true', () => {
    render(<MatchButton isLiveNow={true} fixtureId={123} />);

    const liveButton = screen.getByTestId('live-now-button');
    expect(liveButton).toBeTruthy();

    const text = screen.getByText('matchbtn.live');
    expect(text).toBeTruthy();
  });

  it('navigates to Live screen when live button is pressed', () => {
    render(<MatchButton isLiveNow={true} fixtureId={123} />);

    const liveButton = screen.getByTestId('live-now-button');
    fireEvent.press(liveButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.LIVE, {
      fixtureId: '123',
    });
  });

  it('renders Details button when isLiveNow is false', () => {
    render(<MatchButton isLiveNow={false} fixtureId={456} />);

    const detailsButton = screen.getByTestId('match-details-button');
    expect(detailsButton).toBeTruthy();

    const text = screen.getByText('matchbtn.detail');
    expect(text).toBeTruthy();
  });

  it('navigates to MatchDetail screen when details button is pressed', () => {
    render(<MatchButton isLiveNow={false} fixtureId={456} />);

    const detailsButton = screen.getByTestId('match-details-button');
    fireEvent.press(detailsButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.MATCH_DETAILS, {
      matchId: '456',
    });
  });

  it('live button has a minimum width so the row does not shift', () => {
    render(<MatchButton isLiveNow={true} fixtureId={123} />);
    expect(screen.getByTestId('live-now-button')).toHaveStyle({ minWidth: 50 });
  });

  it('detail button has the same minimum width as the live button', () => {
    render(<MatchButton isLiveNow={false} fixtureId={456} />);
    expect(screen.getByTestId('match-details-button')).toHaveStyle({ minWidth: 50 });
  });
});
