import React from 'react';
import { render, screen } from '@testing-library/react-native';
import {
  useMatchDetail,
  useHeadToHead,
  useValueBets,
  isUTCDateTodayLocal,
  isUTCDateInFutureLocal,
  MatchDetails,
} from '@matchinsights/core';
import MatchDetail from './MatchDetail';

jest.mock('@matchinsights/core');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'matchdetails.title': 'Match Details',
        'matchdetails.nodatamsg': 'Match details not available',
        'nodata.loading': 'Loading...',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { matchId: 123 },
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title }: { title: string }) => (
      <View testID="sub-header">
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, message }: any) => (
      <View testID={loading ? 'loading-indicator' : 'no-data'}>
        <Text>{loading ? 'Loading...' : message || 'No data'}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/match-details/details-main-info/DetailsMainInfo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    DetailsMainInfo: () => (
      <View testID="details-main-info">
        <Text>Details Main Info</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/match-detail-tabs/MatchDetailsTabs', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => (
      <View testID="match-details-tabs">
        <Text>Match Details Tabs</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/match-details/match-indicators/MatchIndicators', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    MatchIndicators: () => (
      <View testID="match-indicators">
        <Text>Match Indicators</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/match-details/value-bets/wrapper/BettingToolWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View),
  };
});

jest.mock('../../components/match/match-details/match-details-second-row/MatchDetailsSecondRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    MatchDetailsSecondRow: () => (
      <View testID="match-details-second-row-component">
        <Text>Match Details Second Row</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/match-details/match-details-third-row/MatchDetailsThirdRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => (
      <View testID="match-details-third-row-component">
        <Text>Match Details Third Row</Text>
      </View>
    ),
  };
});

const mockUseMatchDetail = useMatchDetail as jest.MockedFunction<typeof useMatchDetail>;
const mockUseHeadToHead = useHeadToHead as jest.MockedFunction<typeof useHeadToHead>;
const mockUseValueBets = useValueBets as jest.MockedFunction<typeof useValueBets>;
const mockIsUTCDateTodayLocal = isUTCDateTodayLocal as jest.MockedFunction<typeof isUTCDateTodayLocal>;
const mockIsUTCDateInFutureLocal = isUTCDateInFutureLocal as jest.MockedFunction<typeof isUTCDateInFutureLocal>;

const mockMatchDetail: MatchDetails = {
  id: 123,
  homeTeam: { id: 10, name: 'Home Team', logo: 'logo1.png' },
  awayTeam: { id: 20, name: 'Away Team', logo: 'logo2.png' },
  date: '2025-10-27',
  venue: { name: 'Stadium A' },
  league: { id: 5, name: 'Premier League', season: 2025 },
  goals: { away: 1, home: 2 },
  score: {
    fulltime: { away: 1, home: 2 },
    halftime: { home: 1, away: 1 },
  },
  statusLong: 'Finished',
  isLiveNow: false,
  statusShort: 'FT',
};

describe('MatchDetail Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockUseHeadToHead.mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: false,
    } as any);

    mockIsUTCDateTodayLocal.mockReturnValue(false);
    mockIsUTCDateInFutureLocal.mockReturnValue(false);

    mockUseValueBets.mockReturnValue({
      loadingValueBets: false,
      valueBets: { markets: [] },
      isValueBetsAvailable: false,
    } as any);
  });

  const mockApiService = {} as any;

  it('should render match detail screen with correct testID', () => {
    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-detail-screen')).toBeTruthy();
  });

  it('should render SubHeader', () => {
    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
  });

  it('should display loading state when loadingMatchDetail is true', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: true,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display no data when matchDetail is unavailable', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: null,
      isMatcheDetailAvalable: false,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('should render match details when data is available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('details-main-info')).toBeTruthy();
    expect(screen.getByTestId('match-details-second-row')).toBeTruthy();
  });

  it('should render MatchDetailsTabs when stats or events are available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: true,
      matchLineups: [],
      isStatsAvailable: true,
      matchStats: [],
      events: [],
      isEventsAvailable: true,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-details-tabs-container')).toBeTruthy();
  });

  it('should not render MatchDetailsTabs when match is live', () => {
    const liveMatch = { ...mockMatchDetail, isLiveNow: true };
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: liveMatch,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: true,
      matchLineups: [],
      isStatsAvailable: true,
      matchStats: [],
      events: [],
      isEventsAvailable: true,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.queryByTestId('match-details-tabs-container')).toBeNull();
  });

  it('should render MatchIndicators when date is today', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockIsUTCDateTodayLocal.mockReturnValue(true);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-indicators-container')).toBeTruthy();
  });

  it('should not render MatchIndicators when date is not today', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockIsUTCDateTodayLocal.mockReturnValue(false);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.queryByTestId('match-indicators-container')).toBeNull();
  });

  it('renders BettingToolWrapper when value bets are available and date is in future', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);
    mockUseValueBets.mockReturnValue({
      loadingValueBets: false,
      valueBets: { markets: [{ betName: 'Match Winner', fairOdds: [], bookmakers: [] }] },
      isValueBetsAvailable: true,
    } as any);
    mockIsUTCDateInFutureLocal.mockReturnValue(true);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('betting-tool-container')).toBeTruthy();
  });

  it('does not render BettingToolWrapper when date is not in future', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);
    mockUseValueBets.mockReturnValue({
      loadingValueBets: false,
      valueBets: { markets: [{ betName: 'Match Winner', fairOdds: [], bookmakers: [] }] },
      isValueBetsAvailable: true,
    } as any);
    mockIsUTCDateInFutureLocal.mockReturnValue(false);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.queryByTestId('betting-tool-container')).toBeNull();
  });

  it('does not render BettingToolWrapper when value bets are not available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);
    mockIsUTCDateInFutureLocal.mockReturnValue(true);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.queryByTestId('betting-tool-container')).toBeNull();
  });

  it('should render match details third row when H2H is available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockUseHeadToHead.mockReturnValue({
      h2hDetails: [{ id: 1 }],
      loadingH2hDetail: false,
      isHead2HeadAvailable: true,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-details-third-row')).toBeTruthy();
  });

  it('should render match details third row even when H2H is loading', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockUseHeadToHead.mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: true,
      isHead2HeadAvailable: true,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-details-third-row')).toBeTruthy();
  });

  it('should not render match details third row when H2H is not available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    mockUseHeadToHead.mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.queryByTestId('match-details-third-row')).toBeNull();
  });

  it('should always render MatchDetailsSecondRow when match details available', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(screen.getByTestId('match-details-second-row')).toBeTruthy();
  });

  it('should pass correct matchId from route params', () => {
    mockUseMatchDetail.mockReturnValue({
      loadingMatchDetail: false,
      matchDetail: mockMatchDetail,
      isMatcheDetailAvalable: true,
      isLineupsAvailable: false,
      matchLineups: [],
      isStatsAvailable: false,
      matchStats: [],
      events: [],
      isEventsAvailable: false,
      isOddsAvailable: false,
      odds: [],
      loadingOdds: false,
    } as any);

    render(<MatchDetail apiService={mockApiService} />);
    expect(mockUseMatchDetail).toHaveBeenCalledWith(mockApiService, 123);
  });
});
