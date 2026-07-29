import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MatchDetailsSecondRow } from './MatchDetailsSecondRow';
import { ApiService } from 'open-football-project-core';

jest.mock('open-football-project-core', () => ({
  ...jest.requireActual('open-football-project-core'),
  useLastFiveMatchesEvents: jest.fn(),
  useSeasonStats: jest.fn(),
}));

jest.mock('../../../general/team-stats/TeamStats', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ title, statistics, testID }: any) =>
      React.createElement(
        View,
        { testID: testID || 'team-stats' },
        React.createElement(Text, null, title),
        React.createElement(Text, null, `Stats: ${statistics.length}`)
      )
    ),
  };
});

jest.mock('../../../general/screen-slider/ScreenSlider', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ items }: any) =>
      React.createElement(
        View,
        { testID: 'slider' },
        items && items.length > 0
          ? items.map((item: any, idx: number) =>
              React.createElement(View, { key: idx, testID: 'slide' }, item)
            )
          : React.createElement(Text, null, 'No slides')
      )
    ),
  };
});

jest.mock('../summaries/match-events/MatchEvents', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ loading, events }: any) =>
      React.createElement(
        View,
        { testID: 'match-events' },
        React.createElement(Text, null, loading ? 'Loading Events' : `Events: ${events?.id ?? 'none'}`)
      )
    ),
  };
});

const { useSeasonStats, useLastFiveMatchesEvents } = require('open-football-project-core');

describe('MatchDetailsSecondRow', () => {
  const mockApiService = {} as ApiService;

  const baseProps = {
    apiService: mockApiService,
    homeTeamId: 1,
    homeTeam: 'Team A',
    awayTeamId: 2,
    awayTeam: 'Team B',
    leagueId: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Season Stats Rendering', () => {
    it('renders TeamStats when season stats available', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: { id: 'home' },
        awayEventsSummary: { id: 'away' },
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: true,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: true,
        seasonStats: {
          teamA: { teamName: 'Team A', teamLogo: 'logo-a', statistics: [] },
          teamB: { teamName: 'Team B', teamLogo: 'logo-b', statistics: [] },
        },
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getByTestId('season-stats-container')).toBeTruthy();
      expect(screen.getAllByTestId('team-stats').length).toBe(2);
    });

    it('renders even if team names are null', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: {},
        awayEventsSummary: {},
        isHomeEventsAvailable: false,
        isAwayEventsAvailable: false,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: true,
        seasonStats: {
          teamA: { teamName: null, teamLogo: null, statistics: [] },
          teamB: { teamName: null, teamLogo: null, statistics: [] },
        },
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getAllByTestId('team-stats').length).toBe(2);
    });
  });

  describe('Slider Fallback Rendering', () => {
    beforeEach(() => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: { id: 'home' },
        awayEventsSummary: { id: 'away' },
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: true,
      });
    });

    it('renders slider when season stats not available', () => {
      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: false,
        seasonStats: null,
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.getAllByTestId('slide').length).toBe(2);
    });

    it('filters unavailable slider items', () => {
      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: false,
        seasonStats: null,
      });

      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: { id: 'home' },
        awayEventsSummary: null,
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: false,
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.getAllByTestId('slide').length).toBe(1);
    });
  });

  describe('Loading States', () => {
    it('renders nothing when season stats loading', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: true,
        loadingAwayEvents: true,
        homeEventsSummary: null,
        awayEventsSummary: null,
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: true,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: true,
        isSeasonStatsAvailable: false,
        seasonStats: null,
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.queryByTestId('season-stats-container')).toBeFalsy();
      expect(screen.queryByTestId('slider')).toBeFalsy();
    });

    it('shows loading state in match events', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: true,
        loadingAwayEvents: true,
        homeEventsSummary: null,
        awayEventsSummary: null,
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: true,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: false,
        seasonStats: null,
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.queryAllByText('Loading Events').length).toBeGreaterThan(0);
    });
  });

  describe('Data Availability', () => {
    it('handles empty season statistics array', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: {},
        awayEventsSummary: {},
        isHomeEventsAvailable: false,
        isAwayEventsAvailable: false,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: true,
        seasonStats: {
          teamA: { teamName: 'Team A', teamLogo: null, statistics: [] },
          teamB: { teamName: 'Team B', teamLogo: null, statistics: [] },
        },
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getAllByTestId('team-stats').length).toBe(2);
    });

    it('handles null seasonStats gracefully', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: { id: 'home' },
        awayEventsSummary: { id: 'away' },
        isHomeEventsAvailable: true,
        isAwayEventsAvailable: true,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: false,
        seasonStats: null,
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getByTestId('slider')).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('renders correct structure', () => {
      (useLastFiveMatchesEvents as jest.Mock).mockReturnValue({
        loadingHomeEvents: false,
        loadingAwayEvents: false,
        homeEventsSummary: {},
        awayEventsSummary: {},
        isHomeEventsAvailable: false,
        isAwayEventsAvailable: false,
      });

      (useSeasonStats as jest.Mock).mockReturnValue({
        loadingSeasonStats: false,
        isSeasonStatsAvailable: true,
        seasonStats: {
          teamA: { teamName: 'Team A', teamLogo: 'logo-a', statistics: [] },
          teamB: { teamName: 'Team B', teamLogo: 'logo-b', statistics: [] },
        },
      });

      render(<MatchDetailsSecondRow {...baseProps} />);
      expect(screen.getByTestId('season-stats-container')).toBeTruthy();
      expect(screen.getAllByTestId('team-stats').length).toBe(2);
    });
  });
});