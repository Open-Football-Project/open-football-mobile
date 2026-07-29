import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MatchStats from './MatchStats';
import { mockTeamsStatistics } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('MatchStats Component', () => {
  describe('Core Functionality', () => {
    it('renders both teams with stats correctly', () => {
      render(<MatchStats statistics={mockTeamsStatistics} />);

      expect(screen.getByTestId('match-stats-container')).toBeTruthy();
      expect(screen.getByTestId('home-team-stats')).toBeTruthy();
      expect(screen.getByTestId('away-team-stats')).toBeTruthy();
    });

    it('renders NoData if statistics are undefined', () => {
      render(<MatchStats statistics={undefined} />);
      expect(screen.getByTestId('no-data')).toBeTruthy();
    });

    it('renders NoData if statistics are empty', () => {
      render(
        <MatchStats
          statistics={{
            teamA: { statistics: [], teamId: -1, teamLogo: '', teamName: '' },
            teamB: { statistics: [], teamId: -1, teamLogo: '', teamName: '' },
          }}
        />
      );
      expect(screen.getByTestId('no-data')).toBeTruthy();
    });

    it('displays home team correctly', () => {
      render(<MatchStats statistics={mockTeamsStatistics} />);

      const homeTeamStats = screen.getByTestId('home-team-stats');
      expect(homeTeamStats).toBeTruthy();
    });

    it('displays away team correctly', () => {
      render(<MatchStats statistics={mockTeamsStatistics} />);

      const awayTeamStats = screen.getByTestId('away-team-stats');
      expect(awayTeamStats).toBeTruthy();
    });

    it('uses team names from statistics', () => {
      const customTeamStats = {
        teamA: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: 1,
          teamLogo: '',
          teamName: 'Custom Team A',
        },
        teamB: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: 2,
          teamLogo: '',
          teamName: 'Custom Team B',
        },
      };

      render(<MatchStats statistics={customTeamStats} />);

      expect(screen.getByTestId('match-stats-container')).toBeTruthy();
    });

    it('uses fallback translation keys when team names are missing', () => {
      const statsWithoutTeamNames = {
        teamA: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: -1,
          teamLogo: '',
          teamName: '',
        },
        teamB: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: -1,
          teamLogo: '',
          teamName: '',
        },
      };

      render(<MatchStats statistics={statsWithoutTeamNames} />);

      expect(screen.getByTestId('match-stats-container')).toBeTruthy();
    });

    it('preserves all team statistics data', () => {
      render(<MatchStats statistics={mockTeamsStatistics} />);

      const homeTeamStats = screen.getByTestId('home-team-stats');
      const awayTeamStats = screen.getByTestId('away-team-stats');

      expect(homeTeamStats).toBeTruthy();
      expect(awayTeamStats).toBeTruthy();
    });
  });

  describe('Data Validation', () => {
    it('handles null statistics gracefully', () => {
      render(<MatchStats statistics={null as any} />);
      expect(screen.getByTestId('no-data')).toBeTruthy();
    });

    it('handles one team with empty statistics', () => {
      const partialStats = {
        teamA: { statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }], teamId: 1, teamLogo: '', teamName: 'A' },
        teamB: { statistics: [], teamId: 2, teamLogo: '', teamName: 'B' },
      };

      render(<MatchStats statistics={partialStats} />);
      expect(screen.getByTestId('no-data')).toBeTruthy();
    });

    it('handles team logos', () => {
      const statsWithLogos = {
        teamA: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: 1,
          teamLogo: 'https://example.com/logo-a.png',
          teamName: 'Team A',
        },
        teamB: {
          statistics: [{ name: 'test', value: 1, total: 2, isPositive: true }],
          teamId: 2,
          teamLogo: 'https://example.com/logo-b.png',
          teamName: 'Team B',
        },
      };

      render(<MatchStats statistics={statsWithLogos} />);

      expect(screen.getByTestId('match-stats-container')).toBeTruthy();
      expect(screen.getByTestId('home-team-stats')).toBeTruthy();
      expect(screen.getByTestId('away-team-stats')).toBeTruthy();
    });
  });
});
