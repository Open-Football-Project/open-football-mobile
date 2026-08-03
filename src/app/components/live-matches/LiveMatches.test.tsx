import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LiveMatches from './LiveMatches';

import {
  ApiService,
  LiveMatch,
  useLiveMatchesStatus,
  useValueBets,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) => {
      const translations: Record<string, string> = {
        'common.no_live_matches': 'No Live Matches Currently',
      };
      return translations[key] || options?.defaultValue || key;
    },
  }),
}));

jest.mock('../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ message }: { message: string }) => (
      <Text testID="no-data">{message}</Text>
    ),
  };
});

jest.mock('../general/logo/Logo', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return {
    __esModule: true,
    default: ({ src }: { src?: string }) => (
      <Image
        source={{ uri: src || '' }}
        testID="team-logo"
        style={{ width: 20, height: 20 }}
      />
    ),
  };
});

jest.mock('../general/match-button/MatchButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) => (
      <Pressable testID={`match-button-${fixtureId}`}>
        <Text>View</Text>
      </Pressable>
    ),
  };
});

jest.mock('../match/match-details/value-bets/wrapper/BettingToolWrapper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ data, isLoading }: { data: any; isLoading: boolean }) => (
      <View testID="betting-tool-wrapper">
        <Text>{isLoading ? 'Loading Bets' : `Markets: ${data.markets.length}`}</Text>
      </View>
    ),
  };
});

jest.mock('../match/match-detail-tabs/MatchDetailsTabs', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => <Text testID="match-details-tabs">Match Details Tabs</Text>,
  };
});

jest.mock('../live-indicators/MatchLiveIndicators', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="match-live-indicators" />,
  };
});

jest.mock('../general/chart-button/ChartButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) => <View testID={`chart-button-${fixtureId}`} />,
  };
});

jest.mock('../general/top-guys-button/TopGuysButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ fixtureId }: { fixtureId: number }) => <View testID={`top-guys-button-${fixtureId}`} />,
  };
});

jest.mock('open-football-project-core', () => ({
  useLiveMatchesStatus: jest.fn(),
  useValueBets: jest.fn(),
  useCharteableMatchNow: jest.fn(),
  useTopGuysAvailable: jest.fn(),
}));

jest.mock('../../icons/Icons', () => ({
  TimerIcon: ({ testID }: { testID?: string }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={testID ?? 'timer-icon'}>⏱</Text>;
  },
  LiveIcon: ({ testID }: { testID?: string }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={testID ?? 'live-icon'}>🔴</Text>;
  },
}));

const mockApiService = {} as unknown as ApiService;

const mockHomeAwayForm = {
  homeForm: ['W', 'D', 'L'],
  awayForm: ['L', 'W', 'D'],
  isHomeHot: false,
  isHomeCold: false,
  isAwayHot: false,
  isAwayCold: false,
  isDisplayable: false,
};

const mockMatches: LiveMatch[] = [
  {
    id: 1,
    homeTeamName: 'Home Team',
    awayTeamName: 'Away Team',
    homeTeamLogo: 'https://example.com/home.png',
    awayTeamLogo: 'https://example.com/away.png',
    homeTeamScore: 1,
    awayTeamScore: 2,
    elapsedTime: 45,
    homeAwayForm: mockHomeAwayForm,
  } as LiveMatch,
  {
    id: 2,
    homeTeamName: 'Team C',
    awayTeamName: 'Team D',
    homeTeamLogo: 'https://example.com/c.png',
    awayTeamLogo: 'https://example.com/d.png',
    homeTeamScore: 0,
    awayTeamScore: 1,
    elapsedTime: 25,
    homeAwayForm: mockHomeAwayForm,
  } as LiveMatch,
];

describe('LiveMatches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useValueBets as jest.Mock).mockReturnValue({
      valueBets: { markets: [] },
      loadingValueBets: false,
      isValueBetsAvailable: false,
    });
    (useCharteableMatchNow as jest.Mock).mockReturnValue({
      isCharteableMatchNow: false,
      loadingCharteableMatchNow: false,
    });
    (useTopGuysAvailable as jest.Mock).mockReturnValue({
      isTopGuysAvailable: false,
      loadingTopGuysAvailable: false,
    });
  });

  it('should render NoData when there are no matches', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 0,
    });

    render(<LiveMatches apiService={mockApiService} matches={[]} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
    expect(screen.getByTestId('no-data')).toHaveTextContent(
      'No Live Matches Currently'
    );
  });

  it('should render match cards grid with all matches', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 2,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: {
        id: 1,
        homeTeamName: 'Home Team',
        awayTeamName: 'Away Team',
        homeTeamLogo: 'https://example.com/home.png',
        awayTeamLogo: 'https://example.com/away.png',
      },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByTestId('match-card-1')).toBeTruthy();
    expect(screen.getByTestId('match-card-2')).toBeTruthy();
    expect(screen.getByText('Home Team')).toBeTruthy();
    expect(screen.getByText('Away Team')).toBeTruthy();
    expect(screen.getByText('Team C')).toBeTruthy();
    expect(screen.getByText('Team D')).toBeTruthy();
  });

  it('should display correct scores and elapsed time', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={[mockMatches[0]]} />);

    expect(screen.getByText('1 - 2')).toBeTruthy();
    expect(screen.getByTestId('elapsed-time-1')).toHaveTextContent("45'");
  });

  it('should allow selecting a match by pressing on it', () => {
    const setSelectedMatchId = jest.fn();
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 2,
      selectedMatchId: 1,
      setSelectedMatchId,
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    const secondMatchCard = screen.getByTestId('match-card-2');
    fireEvent.press(secondMatchCard);

    expect(setSelectedMatchId).toHaveBeenCalledWith(2);
  });

  it('should render MatchDetailsTabs when stats or events exist', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: true,
      matchLineups: { teamA: null, teamB: null },
      isStatsAvailable: true,
      matchStats: { teamA: null, teamB: null },
      selectedMatch: {
        id: 1,
        homeTeamName: 'Home Team',
        awayTeamName: 'Away Team',
        homeTeamLogo: 'https://example.com/home.png',
        awayTeamLogo: 'https://example.com/away.png',
        events: [{ id: 1, type: 'goal' }],
      },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByTestId('match-details-tabs')).toBeTruthy();
    expect(screen.getByTestId('match-details-section')).toBeTruthy();
  });

  it('should not render MatchDetailsTabs when no stats, events, or lineups', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: {
        id: 1,
        homeTeamName: 'Home Team',
        awayTeamName: 'Away Team',
        homeTeamLogo: 'https://example.com/home.png',
        awayTeamLogo: 'https://example.com/away.png',
        events: [],
      },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.queryByTestId('match-details-tabs')).toBeNull();
  });

  it('renders BettingToolWrapper when value bets are available', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
    });
    (useValueBets as jest.Mock).mockReturnValue({
      valueBets: { markets: [{ betName: 'Match Winner', fairOdds: [], bookmakers: [] }] },
      loadingValueBets: false,
      isValueBetsAvailable: true,
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByTestId('betting-section')).toBeTruthy();
    expect(screen.getByTestId('betting-tool-wrapper')).toBeTruthy();
  });

  it('does not render betting section when value bets are not available', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
    });
    (useValueBets as jest.Mock).mockReturnValue({
      valueBets: { markets: [] },
      loadingValueBets: false,
      isValueBetsAvailable: false,
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.queryByTestId('betting-section')).toBeNull();
  });

  it('renders BettingToolWrapper before MatchDetailsTabs', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: true,
      matchLineups: { teamA: null, teamB: null },
      isStatsAvailable: true,
      matchStats: { teamA: null, teamB: null },
      selectedMatch: {
        id: 1,
        homeTeamName: 'Home Team',
        awayTeamName: 'Away Team',
        homeTeamLogo: '',
        awayTeamLogo: '',
        events: [{ id: 1, type: 'goal' }],
      },
    });
    (useValueBets as jest.Mock).mockReturnValue({
      valueBets: { markets: [{ betName: 'Match Winner', fairOdds: [], bookmakers: [] }] },
      loadingValueBets: false,
      isValueBetsAvailable: true,
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    const allTestIds = screen.queryAllByTestId('betting-section');
    const bettingSection = screen.getByTestId('betting-section');
    const detailsSection = screen.getByTestId('match-details-section');

    expect(bettingSection).toBeTruthy();
    expect(detailsSection).toBeTruthy();
    expect(allTestIds.length).toBe(1);
  });

  it('should render match buttons for each match', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 2,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(screen.getByTestId('match-button-1')).toBeTruthy();
    expect(screen.getByTestId('match-button-2')).toBeTruthy();
  });

  it('should display timer icon for each match', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={[mockMatches[0]]} />);
    expect(screen.getByTestId('timer-icon-1')).toBeTruthy();
  });

  it('should display extraTime when present', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    const matchWithExtra = [{ ...mockMatches[0], elapsedTime: 90, extraTime: 3 }] as LiveMatch[];
    render(<LiveMatches apiService={mockApiService} matches={matchWithExtra} />);

    expect(screen.getByTestId('elapsed-time-1')).toHaveTextContent("90+3'");
  });

  it('should NOT render polls section (polls removed for mobile)', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: mockMatches[0],
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);


    expect(screen.queryByTestId('match-poll')).toBeNull();
  });

  it('threads apiService through to each match card entry-point check', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 2,
      selectedMatchId: null,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: null,
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(<LiveMatches apiService={mockApiService} matches={mockMatches} />);

    expect(useCharteableMatchNow).toHaveBeenCalledWith(mockApiService, 1);
    expect(useCharteableMatchNow).toHaveBeenCalledWith(mockApiService, 2);
    expect(useTopGuysAvailable).toHaveBeenCalledWith(mockApiService, 1);
    expect(useTopGuysAvailable).toHaveBeenCalledWith(mockApiService, 2);
  });

  it('renders both entry-point buttons on a match card when both are available', () => {
    (useLiveMatchesStatus as jest.Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: null,
      setSelectedMatchId: jest.fn(),
      isLineupsAvailable: false,
      matchLineups: null,
      isStatsAvailable: false,
      matchStats: null,
      selectedMatch: null,
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });
    (useCharteableMatchNow as jest.Mock).mockReturnValue({
      isCharteableMatchNow: true,
      loadingCharteableMatchNow: false,
    });
    (useTopGuysAvailable as jest.Mock).mockReturnValue({
      isTopGuysAvailable: true,
      loadingTopGuysAvailable: false,
    });

    render(<LiveMatches apiService={mockApiService} matches={[mockMatches[0]]} />);

    expect(screen.getByTestId('chart-button-1')).toBeTruthy();
    expect(screen.getByTestId('top-guys-button-1')).toBeTruthy();
  });
});
