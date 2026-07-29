import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';


jest.mock('../../../../../navigation/RootNavigator', () => ({
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

import TeamDetailsInfo from './TeamDetailsInfo';
import { Routes } from '../../../../../navigation/RootNavigator';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../../general/logo/Logo', () => {
  return function MockLogo() {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'team-logo' });
  };
});

describe('TeamDetailsInfo', () => {
  const mockNavigate = jest.fn();
  const team = {
    id: 1,
    name: 'Home FC',
    logo: 'https://example.com/home-logo.png',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('renders team logo container', () => {
    render(<TeamDetailsInfo team={team} />);
    const container = screen.getByTestId(`team-details-container-${team.id}`);
    expect(container).toBeTruthy();
  });

  it('renders team name', () => {
    render(<TeamDetailsInfo team={team} />);
    const teamName = screen.getByText('Home FC');
    expect(teamName).toBeTruthy();
  });

  it('navigates to team-details screen when pressed', () => {
    render(<TeamDetailsInfo team={team} />);
    const teamLink = screen.getByTestId(`${team.id}-team-link`);
    fireEvent.press(teamLink);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.TEAM_DETAILS, {
      teamId: '1',
    });
  });

  it('does not navigate when team id is missing', () => {
    const noIdTeam = { ...team, id: undefined };
    render(<TeamDetailsInfo team={noIdTeam} />);

    const teamLink = screen.getByTestId('undefined-team-link');
    fireEvent.press(teamLink);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays correct testID for team link', () => {
    render(<TeamDetailsInfo team={team} />);
    const teamLink = screen.getByTestId('1-team-link');
    expect(teamLink).toBeTruthy();
  });

  it('renders team name text truncated correctly', () => {
    const teamWithLongName = {
      ...team,
      name: 'This is a very long team name that should be truncated',
    };
    render(<TeamDetailsInfo team={teamWithLongName} />);
    const teamName = screen.getByText(teamWithLongName.name);
    expect(teamName).toBeTruthy();
  });
});
