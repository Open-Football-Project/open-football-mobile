import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as any;

  return {
    __esModule: true,
    ...actual,
    useLeaguePage: jest.fn(),
    useGuessTheTeam: jest.fn(),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

import GuessLeagueTeamPage from './GuessLeagueTeamPage';
import { useLeaguePage, useGuessTheTeam } from '@matchinsights/core';
import { useRoute } from '@react-navigation/native';

const mockUseLeaguePage = useLeaguePage as jest.MockedFunction<typeof useLeaguePage>;
const mockUseGuessTheTeam = useGuessTheTeam as jest.MockedFunction<typeof useGuessTheTeam>;
const mockUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({ loading, isBigMessage, message }: any) =>
      React.createElement(
        View,
        { testID: 'no-data' },
        loading && React.createElement(Text, { testID: 'loading' }, 'Loading'),
        isBigMessage && React.createElement(Text, { testID: 'not-available' }, message)
      ),
  };
});

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({ title, subTitle }: any) =>
      React.createElement(
        View,
        { testID: 'sub-header' },
        React.createElement(Text, null, title),
        React.createElement(Text, { testID: 'sub-header-subtitle' }, subTitle)
      ),
  };
});

jest.mock('../../components/games/team/GuessTheTeam', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({ leagueName }: any) =>
      React.createElement(
        View,
        { testID: 'guess-the-team' },
        React.createElement(Text, null, 'Guess The Team'),
        React.createElement(Text, { testID: 'team-game-league' }, leagueName)
      ),
  };
});

const createDefaultMockReturnValue = () => ({
  leagueInfo: { name: 'Premier League', logo: 'pl.png' },
  leagueLinks: [],
  loadingLeagueInfo: false,
  isLeagueInfoAvailable: true,
});

const createDefaultGameMockReturnValue = () => ({
  isGuessTheTeamAvailable: true,
  guessTheTeam: { teamName: 'Arsenal', teamId: 1 },
  loadingGuessTheTeam: false,
  getNewGame: jest.fn(),
});

const createUnavailableMockReturnValue = () => ({
  leagueInfo: null,
  leagueLinks: [],
  loadingLeagueInfo: false,
  isLeagueInfoAvailable: false,
});

const createUnavailableGameMockReturnValue = () => ({
  isGuessTheTeamAvailable: false,
  guessTheTeam: null,
  loadingGuessTheTeam: false,
  getNewGame: jest.fn(),
});

describe('GuessLeagueTeamPage', () => {
  const apiService = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: { leagueId: '1' },
    } as any);
    mockUseLeaguePage.mockReturnValue(createDefaultMockReturnValue() as any);
    mockUseGuessTheTeam.mockReturnValue(createDefaultGameMockReturnValue() as any);
  });

  it('renders loading state when league info is loading', () => {
    mockUseLeaguePage.mockReturnValueOnce({
      ...createDefaultMockReturnValue(),
      loadingLeagueInfo: true,
    } as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('renders loading state when game is loading', () => {
    mockUseGuessTheTeam.mockReturnValueOnce({
      ...createDefaultGameMockReturnValue(),
      loadingGuessTheTeam: true,
    } as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('renders not available message when game is not available', () => {
    mockUseGuessTheTeam.mockReturnValueOnce({
      ...createDefaultGameMockReturnValue(),
      isGuessTheTeamAvailable: false,
    } as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('not-available')).toBeTruthy();
  });

  it('renders SubHeader and GuessTheTeam when data is available', () => {
    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByTestId('guess-the-team')).toBeTruthy();
    expect(screen.getByTestId('team-game-league').props.children).toBe('Premier League');
  });

  it('passes league name correctly to GuessTheTeam', () => {
    mockUseLeaguePage.mockReturnValue({
      ...createDefaultMockReturnValue(),
      leagueInfo: { name: 'La Liga', logo: 'laliga.png' },
    } as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('team-game-league').props.children).toBe('La Liga');
  });

  it('renders unknown text when league name is missing', () => {
    mockUseLeaguePage.mockReturnValue({
      ...createDefaultMockReturnValue(),
      leagueInfo: { name: '', logo: '' },
    } as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('team-game-league').props.children).toBe('common.unknown');
  });

  it('handles missing league ID gracefully', () => {
    mockUseRoute.mockReturnValue({
      params: undefined,
    } as any);
    mockUseLeaguePage.mockReturnValueOnce(createUnavailableMockReturnValue() as any);
    mockUseGuessTheTeam.mockReturnValueOnce(createUnavailableGameMockReturnValue() as any);

    render(<GuessLeagueTeamPage apiService={apiService} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
  });
});
