import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core') as any;

  return {
    __esModule: true,
    ...actual,
    useTeamDetail: jest.fn(),
    useGuessThePlayer: jest.fn(),
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

import GuessTeamPlayerPage from './GuessTeamPlayerPage';
import { useTeamDetail, useGuessThePlayer } from 'open-football-project-core';
import { useRoute } from '@react-navigation/native';
import NoData from '../../components/general/no-data/NoData';
import SubHeader from '../../components/general/sub-header/SubHeader';
import GuessThePlayer from '../../components/games/player/GuessThePlayer';
import { spacing } from '../../theme';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

const mockUseTeamDetail = useTeamDetail as jest.MockedFunction<typeof useTeamDetail>;
const mockUseGuessThePlayer = useGuessThePlayer as jest.MockedFunction<typeof useGuessThePlayer>;
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

jest.mock('../../components/games/player/GuessThePlayer', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    __esModule: true,
    default: ({ teamName }: any) =>
      React.createElement(
        View,
        { testID: 'guess-the-player' },
        React.createElement(Text, null, 'Guess The Player'),
        React.createElement(Text, { testID: 'player-game-team' }, teamName)
      ),
  };
});

const createDefaultTeamMockReturnValue = () => ({
  loadingTeamDetails: false,
  teamDetails: { teamName: 'Barcelona', teamLogo: 'barcelona.png' },
  loadingTeamLeagues: false,
  teamlinks: [],
  canDisplayTeamPlayerGame: true,
});

const createDefaultPlayerMockReturnValue = () => ({
  isGuessThePlayerAvailable: true,
  guessThePlayer: { playerName: 'Messi', options: ['Messi', 'Neymar'] },
  loadingGuessThePlayer: false,
  getNewGame: jest.fn(),
});

const createUnavailableTeamMockReturnValue = () => ({
  loadingTeamDetails: false,
  teamDetails: null,
  loadingTeamLeagues: false,
  teamlinks: [],
  canDisplayTeamPlayerGame: false,
});

const createUnavailablePlayerMockReturnValue = () => ({
  isGuessThePlayerAvailable: false,
  guessThePlayer: null,
  loadingGuessThePlayer: false,
  getNewGame: jest.fn(),
});

describe('GuessTeamPlayerPage', () => {
  const apiService = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: { leagueId: '42' },
    } as any);
    mockUseTeamDetail.mockReturnValue(createDefaultTeamMockReturnValue() as any);
    mockUseGuessThePlayer.mockReturnValue(createDefaultPlayerMockReturnValue() as any);
  });

  it('renders loading state when team details are loading', () => {
    mockUseTeamDetail.mockReturnValueOnce({
      ...createDefaultTeamMockReturnValue(),
      loadingTeamDetails: true,
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('renders loading state when player game is loading', () => {
    mockUseGuessThePlayer.mockReturnValueOnce({
      ...createDefaultPlayerMockReturnValue(),
      loadingGuessThePlayer: true,
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('renders loading state when team leagues are loading', () => {
    mockUseTeamDetail.mockReturnValueOnce({
      ...createDefaultTeamMockReturnValue(),
      loadingTeamLeagues: true,
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('renders not available message when game cannot be displayed', () => {
    mockUseTeamDetail.mockReturnValueOnce({
      ...createDefaultTeamMockReturnValue(),
      canDisplayTeamPlayerGame: false,
      teamDetails: { teamName: 'Barcelona', teamLogo: 'barcelona.png' },
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('not-available')).toBeTruthy();
  });

  it('renders SubHeader and GuessThePlayer when data is available', () => {
    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByTestId('guess-the-player')).toBeTruthy();
    expect(screen.getByTestId('player-game-team').props.children).toBe('Barcelona');
  });

  it('passes team name correctly to GuessThePlayer', () => {
    mockUseTeamDetail.mockReturnValueOnce({
      ...createDefaultTeamMockReturnValue(),
      teamDetails: { teamName: 'Real Madrid', teamLogo: 'madrid.png' },
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('player-game-team').props.children).toBe('Real Madrid');
  });

  it('renders unknown text when team name is missing', () => {
    mockUseTeamDetail.mockReturnValueOnce({
      ...createDefaultTeamMockReturnValue(),
      teamDetails: { teamName: '', teamLogo: '' },
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('player-game-team').props.children).toBe('common.unknown');
  });

  it('handles missing team ID gracefully', () => {
    mockUseRoute.mockReturnValueOnce({
      params: undefined,
    } as any);
    mockUseTeamDetail.mockReturnValueOnce(createUnavailableTeamMockReturnValue() as any);
    mockUseGuessThePlayer.mockReturnValueOnce(createUnavailablePlayerMockReturnValue() as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('does not render GuessThePlayer when game is not available', () => {
    mockUseGuessThePlayer.mockReturnValueOnce({
      ...createDefaultPlayerMockReturnValue(),
      isGuessThePlayerAvailable: false,
      guessThePlayer: null,
    } as any);

    render(<GuessTeamPlayerPage apiService={apiService} />);

    // SubHeader should still render
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    // But GuessThePlayer component should not be rendered when unavailable
    expect(() => screen.getByTestId('guess-the-player')).toThrow();
  });

  it('applies TV padding at width 1366 (breakpoints.tv = 1280)', () => {
    render(<GuessTeamPlayerPage apiService={apiService} />);
    const scroll = screen.getByTestId('guess-team-player-scroll');
    expect(scroll.props.contentContainerStyle).toEqual(
      expect.arrayContaining([expect.objectContaining({ padding: spacing.xxl })])
    );
  });
});
