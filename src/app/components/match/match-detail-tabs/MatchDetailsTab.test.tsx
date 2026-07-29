import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MatchDetailsTabs from './MatchDetailsTabs';
import { TeamsLineups, TwoTeamsStatistics, MatchEvent } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'detailtabs.events': 'Events',
        'detailtabs.stats': 'Stats',
        'detailtabs.lineups': 'Lineups',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => <Text testID="no-data">No Data</Text>,
  };
});

jest.mock('../match-events-table/MatchEventsTable', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ events }: any) => (
      <Text testID="events-table">Events: {events?.length || 0}</Text>
    ),
  };
});

jest.mock('../match-stats/MatchStats', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ statistics }: any) => (
      <Text testID="match-stats">
        Stats A:{statistics?.teamA ? 'Y' : 'N'} | B:{statistics?.teamB ? 'Y' : 'N'}
      </Text>
    ),
  };
});

jest.mock('../match-lineups/MatchLineups', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ lineups }: any) => (
      <Text testID="match-lineups">
        Lineup A:{lineups?.teamA ? 'Y' : 'N'} | B:{lineups?.teamB ? 'Y' : 'N'}
      </Text>
    ),
  };
});

const mockMatchEvents: MatchEvent[] = [
  {
    eventType: 'Goal',
    eventDetails: 'goal',
    playerName: 'Player 1',
    teamName: 'Team A',
    timeElapsed: 10,
  },
  {
    eventType: 'Yellow Card',
    eventDetails: 'yellow_card',
    playerName: 'Player 2',
    teamName: 'Team B',
    timeElapsed: 20,
  },
];

const mockStats: TwoTeamsStatistics = {
  teamA: {
    teamId: 1,
    teamLogo: 'https://example.com/team-a.png',
    teamName: 'Team A',
    statistics: [
      { name: 'Shots on Goal', value: 5, total: 10, isPositive: true },
      { name: 'Possession', value: 55, total: 100, isPositive: true },
      { name: 'Pass Accuracy', value: 85, total: 100, isPositive: true },
      { name: 'Tackles', value: 12, total: 20, isPositive: true },
    ],
  },
  teamB: {
    teamId: 2,
    teamLogo: 'https://example.com/team-b.png',
    teamName: 'Team B',
    statistics: [
      { name: 'Shots on Goal', value: 4, total: 10, isPositive: false },
      { name: 'Possession', value: 45, total: 100, isPositive: false },
      { name: 'Pass Accuracy', value: 82, total: 100, isPositive: false },
      { name: 'Tackles', value: 14, total: 20, isPositive: false },
    ],
  },
};

const mockLineups: TeamsLineups = {
  teamA: {
    teamId: 1,
    teamLogo: 'https://example.com/team-a.png',
    teamName: 'Team A',
    teamFormation: '4-3-3',
    lineup: [
      { name: 'Goalkeeper A', number: 1, pos: 'GK', grid: '1' },
      { name: 'Defender A 1', number: 4, pos: 'CB', grid: '2-1' },
      { name: 'Defender A 2', number: 5, pos: 'CB', grid: '2-2' },
    ],
    substitutes: [
      { name: 'Substitute A', number: 12, pos: 'GK', grid: 'sub' },
    ],
  },
  teamB: {
    teamId: 2,
    teamLogo: 'https://example.com/team-b.png',
    teamName: 'Team B',
    teamFormation: '4-4-2',
    lineup: [
      { name: 'Goalkeeper B', number: 1, pos: 'GK', grid: '1' },
      { name: 'Defender B 1', number: 4, pos: 'CB', grid: '2-1' },
      { name: 'Defender B 2', number: 5, pos: 'CB', grid: '2-2' },
    ],
    substitutes: [
      { name: 'Substitute B', number: 12, pos: 'GK', grid: 'sub' },
    ],
  },
};

describe('MatchDetailsTabs', () => {
  const baseProps = {
    matchEvents: [],
    liveStats: undefined,
    liveLineups: undefined,
    homeTeamName: 'Home Team',
    awayTeamName: 'Away Team',
    homeTeamLogo: 'home-logo.png',
    awayTeamLogo: 'away-logo.png',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders NoData when no tabs are available', () => {
    render(<MatchDetailsTabs {...baseProps} />);

    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders events tab by default when events exist', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
      />
    );

    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByTestId('events-table')).toBeTruthy();
    expect(screen.getByText('Events: 2')).toBeTruthy();
  });

  it('renders stats tab when only stats exist', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        liveStats={mockStats}
      />
    );

    expect(screen.getByText('Stats')).toBeTruthy();
    expect(screen.getByTestId('match-stats')).toBeTruthy();
  });

  it('renders lineups tab when only lineups exist', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        liveLineups={mockLineups}
      />
    );

    expect(screen.getByText('Lineups')).toBeTruthy();
    expect(screen.getByTestId('match-lineups')).toBeTruthy();
  });

  it('switches tabs when tab button is pressed', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
        liveStats={mockStats}
      />
    );

    // Initially on Events tab
    expect(screen.getByTestId('events-table')).toBeTruthy();

    // Click Stats tab
    const statsButton = screen.getByTestId('tab-button-stats');
    fireEvent.press(statsButton);

    // Should now show stats content
    expect(screen.getByTestId('match-stats')).toBeTruthy();
    expect(screen.queryByTestId('events-table')).toBeNull();
  });

  it('renders all available tabs when all data exists', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
        liveStats={mockStats}
        liveLineups={mockLineups}
      />
    );

    expect(screen.getByTestId('tab-button-events')).toBeTruthy();
    expect(screen.getByTestId('tab-button-stats')).toBeTruthy();
    expect(screen.getByTestId('tab-button-lineups')).toBeTruthy();
  });

  it('shows active tab indicator when tab is selected', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
        liveStats={mockStats}
      />
    );

    // Events tab should be active initially
    const eventsButton = screen.getByTestId('tab-button-events');
    expect(eventsButton).toBeTruthy();

    // Click Stats tab
    const statsButton = screen.getByTestId('tab-button-stats');
    fireEvent.press(statsButton);

    // Stats active indicator should be visible
    expect(screen.getByTestId('tab-button-stats-indicator-active')).toBeTruthy();
  });

  it('handles multiple tab switches', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
        liveStats={mockStats}
        liveLineups={mockLineups}
      />
    );

    // Events -> Stats
    fireEvent.press(screen.getByTestId('tab-button-stats'));
    expect(screen.getByTestId('match-stats')).toBeTruthy();

    // Stats -> Lineups
    fireEvent.press(screen.getByTestId('tab-button-lineups'));
    expect(screen.getByTestId('match-lineups')).toBeTruthy();

    // Lineups -> Events
    fireEvent.press(screen.getByTestId('tab-button-events'));
    expect(screen.getByTestId('events-table')).toBeTruthy();
  });

  it('renders main container with correct testID', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
      />
    );

    expect(screen.getByTestId('match-details-tabs')).toBeTruthy();
  });

  it('filters out empty tabs based on data availability', () => {
    render(
      <MatchDetailsTabs
        {...baseProps}
        matchEvents={mockMatchEvents}
        liveStats={undefined}
        liveLineups={undefined}
      />
    );

    // Only Events tab should exist
    expect(screen.getByTestId('tab-button-events')).toBeTruthy();
    expect(screen.queryByTestId('tab-button-stats')).toBeNull();
    expect(screen.queryByTestId('tab-button-lineups')).toBeNull();
  });
});
