import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MatchIndicators } from './MatchIndicators';
import { ApiService } from '@matchinsights/core';

jest.mock('@matchinsights/core', () => ({
  ...jest.requireActual('@matchinsights/core'),
  useOddsFeeling: jest.fn(),
  useTeamLeaguesStats: jest.fn(),
  useRestStatus: jest.fn(),
  useTeamsScorePerformance: jest.fn(),
  useLastFiveResults: jest.fn(),
  useHeadToHead: jest.fn(),
}));

jest.mock('./matchindicator-slider/MatchIndicatorsSlider', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    MatchIndicatorsSlider: jest.fn((props) =>
      React.createElement(
        View,
        { testID: 'match-indicators-slider' },
        React.createElement(View, { testID: 'slider-item-0', isLoading: props.lastFiveLoading }),
        React.createElement(View, { testID: 'slider-item-1', isLoading: props.loadingRanksAndPoints })
      )
    ),
  };
});

const {
  useOddsFeeling,
  useLastFiveResults,
  useTeamsScorePerformance,
  useRestStatus,
  useTeamLeaguesStats,
  useHeadToHead,
} = require('@matchinsights/core');

const { MatchIndicatorsSlider } = require('./matchindicator-slider/MatchIndicatorsSlider');

describe('MatchIndicators', () => {
  const mockApiService = {} as ApiService;
  const baseProps = {
    apiService: mockApiService,
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeam: 'Liverpool',
    awayTeam: 'Manchester City',
    leagueId: 10,
    fixtureDate: '2025-10-06',
    matchId: 123,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAllHooks = (overrides: any = {}) => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: { homeTeamLastFive: [], awayTeamLastFive: [] },
      loadingLastFiveResults: false,
      isLastFiveResultsAvailable: true,
      ...overrides.lastFive,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: {},
      loadingTeamsPerformance: false,
      isPerformanceAvailable: true,
      ...overrides.performance,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: {},
      loadingRestStatus: false,
      isRestStatusAvailable: true,
      ...overrides.rest,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: {},
      loadingRanksAndPoints: false,
      isRankingAndPointsAvailable: true,
      ...overrides.ranks,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: {},
      loadingOddsFeeling: false,
      isOddsFeelingAvailable: true,
      ...overrides.odds,
    });
    (useHeadToHead as any).mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: false,
      ...overrides.h2h,
    });
  };

  it('renders the indicators Slider with correct props', () => {
    mockAllHooks();
    render(<MatchIndicators {...baseProps} />);

    expect(screen.getByTestId('match-indicators-slider')).toBeTruthy();
    expect(screen.getByTestId("slider-item-0")).toBeTruthy();
    expect(screen.getByTestId("slider-item-1")).toBeTruthy();
  });

  it('passes h2h indicator and isH2HAvailable to slider when h2h is loaded', () => {
    mockAllHooks({ h2h: { h2hDetails: [], loadingH2hDetail: false, isHead2HeadAvailable: true } });
    render(<MatchIndicators {...baseProps} />);

    const props = (MatchIndicatorsSlider as jest.Mock).mock.calls[0][0];
    expect(props).toMatchObject({
      isH2HAvailable: true,
      h2hIndicator: expect.objectContaining({ label: 'indicators.h2h_history' }),
    });
  });

});