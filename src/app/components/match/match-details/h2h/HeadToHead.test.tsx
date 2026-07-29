import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HeadToHead } from './HeadToHead';
import { useTranslation } from 'react-i18next';
import { H2HDetails } from '@matchinsights/core';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (opts?.defaultValue) {
        return opts.defaultValue;
      }
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock @matchinsights/core
jest.mock('@matchinsights/core', () => ({
  ...jest.requireActual('@matchinsights/core'),
  getFormattedDate: (date: string) => '2025-09-30',
}));

// Mock NoData component
jest.mock('../../../general/no-data/NoData', () => {
  return function MockNoData({ loading }: any) {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'no-data-component' },
      React.createElement(Text, null, loading ? 'Loading...' : 'No Data')
    );
  };
});

describe('HeadToHead', () => {
  const mockH2HDetails: H2HDetails = {
    date: '2025-09-30',
    winner: 'Home Team',
    venue: { name: 'Stadium A' },
    leagueName: 'Premier League',
    season: 2025,
    round: 'Round 5',
    homeHalfTimeGoal: 1,
    awayHalfTimeGoal: 0,
    homeFullTimeGoal: 2,
    awayFullTimeGoal: 1,
    homeExtraTimeGoal: 0,
    awayExtraTimeGoal: 0,
    homePenalty: 0,
    awayPenalty: 0,
  };

  describe('Loading State', () => {
    it('renders loading state when loading is true', () => {
      render(<HeadToHead h2hDetails={null} loading={true} />);
      const noData = screen.getByTestId('no-data-component');
      expect(noData).toBeTruthy();
    });
  });

  describe('No Data State', () => {
    it('renders no data state when h2hDetails is null and loading is false', () => {
      render(<HeadToHead h2hDetails={null} loading={false} />);
      const noData = screen.getByTestId('no-data-component');
      expect(noData).toBeTruthy();
    });
  });

  describe('Main Info Card', () => {
    beforeEach(() => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
    });

    it('renders main info card', () => {
      const mainCard = screen.getByTestId('h2h-main-info-card');
      expect(mainCard).toBeTruthy();
    });

    it('displays date in main info card', () => {
      const date = screen.getByTestId('h2h-date');
      expect(date).toBeTruthy();
    });

    it('displays winner in main info card', () => {
      const winner = screen.getByTestId('h2h-winner');
      expect(winner).toBeTruthy();
    });

    it('renders localized header "common.main_info"', () => {
      const text = screen.getByText('common.main_info');
      expect(text).toBeTruthy();
    });
  });

  describe('League Info Card', () => {
    beforeEach(() => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
    });

    it('renders league info card', () => {
      const leagueCard = screen.getByTestId('h2h-league-info-card');
      expect(leagueCard).toBeTruthy();
    });

    it('displays venue', () => {
      const venue = screen.getByTestId('h2h-venue');
      expect(venue).toBeTruthy();
    });

    it('displays league name', () => {
      const league = screen.getByTestId('h2h-league');
      expect(league).toBeTruthy();
    });

    it('displays season', () => {
      const season = screen.getByTestId('h2h-season');
      expect(season).toBeTruthy();
    });

    it('displays round when present', () => {
      const round = screen.getByTestId('h2h-round');
      expect(round).toBeTruthy();
    });

    it('does not display round when not present', () => {
      const h2hWithoutRound = { ...mockH2HDetails, round: undefined };
      render(<HeadToHead h2hDetails={h2hWithoutRound} loading={false} />);
      const round = screen.queryByTestId('h2h-round');
      expect(round).toBeNull();
    });

    it('renders localized header "common.league_info"', () => {
      const text = screen.getByText('common.league_info');
      expect(text).toBeTruthy();
    });
  });

  describe('Score Info Card', () => {
    beforeEach(() => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
    });

    it('renders score info card', () => {
      const scoreCard = screen.getByTestId('h2h-score-info-card');
      expect(scoreCard).toBeTruthy();
    });

    it('displays halftime score', () => {
      const halftime = screen.getByTestId('h2h-halftime');
      expect(halftime).toBeTruthy();
    });

    it('displays fulltime score', () => {
      const fulltime = screen.getByTestId('h2h-fulltime');
      expect(fulltime).toBeTruthy();
    });

    it('displays extra time score', () => {
      const extratime = screen.getByTestId('h2h-extratime');
      expect(extratime).toBeTruthy();
    });

    it('displays penalty score', () => {
      const penalties = screen.getByTestId('h2h-penalties');
      expect(penalties).toBeTruthy();
    });

    it('renders localized header "common.score_info"', () => {
      const text = screen.getByText('common.score_info');
      expect(text).toBeTruthy();
    });
  });

  describe('Multiple Cards Rendering', () => {
    it('renders all three cards together', () => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
      const mainCard = screen.getByTestId('h2h-main-info-card');
      const leagueCard = screen.getByTestId('h2h-league-info-card');
      const scoreCard = screen.getByTestId('h2h-score-info-card');

      expect(mainCard).toBeTruthy();
      expect(leagueCard).toBeTruthy();
      expect(scoreCard).toBeTruthy();
    });

    it('renders container', () => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
      const container = screen.getByTestId('h2h-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Localization Keys', () => {
    beforeEach(() => {
      render(<HeadToHead h2hDetails={mockH2HDetails} loading={false} />);
    });

    it('renders all expected localization keys', () => {
      expect(screen.getByText('common.main_info')).toBeTruthy();
      expect(screen.getByText('common.league_info')).toBeTruthy();
      expect(screen.getByText('common.score_info')).toBeTruthy();
      expect(screen.getByTestId('h2h-date')).toBeTruthy();
      expect(screen.getByTestId('h2h-winner')).toBeTruthy();
      expect(screen.getByTestId('h2h-venue')).toBeTruthy();
      expect(screen.getByTestId('h2h-league')).toBeTruthy();
      expect(screen.getByTestId('h2h-season')).toBeTruthy();
      expect(screen.getByTestId('h2h-round')).toBeTruthy();
      expect(screen.getByTestId('h2h-halftime')).toBeTruthy();
      expect(screen.getByTestId('h2h-fulltime')).toBeTruthy();
      expect(screen.getByTestId('h2h-extratime')).toBeTruthy();
      expect(screen.getByTestId('h2h-penalties')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero scores correctly', () => {
      const zeroScoreH2H = {
        ...mockH2HDetails,
        homeHalfTimeGoal: 0,
        awayHalfTimeGoal: 0,
        homeFullTimeGoal: 0,
        awayFullTimeGoal: 0,
      };
      render(<HeadToHead h2hDetails={zeroScoreH2H} loading={false} />);
      const halftime = screen.getByTestId('h2h-halftime');
      expect(halftime).toBeTruthy();
    });

    it('handles empty round gracefully', () => {
      const noRoundH2H = { ...mockH2HDetails, round: undefined };
      render(<HeadToHead h2hDetails={noRoundH2H} loading={false} />);
      const round = screen.queryByTestId('h2h-round');
      expect(round).toBeNull();
    });

    it('handles missing winner gracefully', () => {
      const noWinnerH2H = { ...mockH2HDetails, winner: '' };
      render(<HeadToHead h2hDetails={noWinnerH2H} loading={false} />);
      const winner = screen.getByTestId('h2h-winner');
      expect(winner).toBeTruthy();
    });
  });
});
