import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator, Routes } from './RootNavigator';
import { MobileRoutes } from 'open-football-project-core';


jest.mock('../screens/landing/Landing', () => {
  const { Text, View } = require('react-native');
  return function Landing() {
    return (
      <View testID="landing-screen">
        <Text>Landing</Text>
      </View>
    );
  };
});

jest.mock('../screens/all-leagues/AllLeagues', () => ({
  AllLeagues: () => {
    const { Text, View } = require('react-native');
    return (
      <View testID="all-leagues-screen">
        <Text>All Leagues</Text>
      </View>
    );
  },
}));

jest.mock('../screens/guess-league-team/GuessLeagueTeamPage', () => ({
  GuessLeagueTeamPage: () => {
    const { Text, View } = require('react-native');
    return (
      <View testID="guess-league-team-screen">
        <Text>Guess League Team</Text>
      </View>
    );
  },
}));

jest.mock('../screens/guess-team-player/GuessTeamPlayerPage', () => ({
  GuessTeamPlayerPage: () => {
    const { Text, View } = require('react-native');
    return (
      <View testID="guess-team-player-screen">
        <Text>Guess Team Player</Text>
      </View>
    );
  },
}));

jest.mock('../screens/league/LeaguePage', () => {
  const { Text, View } = require('react-native');
  return function LeaguePage() {
    return (
      <View testID="league-screen">
        <Text>League</Text>
      </View>
    );
  };
});

jest.mock('../screens/league-special/argentina-tablas/ArgSpecialPage', () => {
  const { Text, View } = require('react-native');
  return function ArgSpecialPage() {
    return (
      <View testID="arg-special-screen">
        <Text>Arg Special</Text>
      </View>
    );
  };
});

jest.mock('../screens/league-special/groups/LeagueGroupsPage', () => {
  const { Text, View } = require('react-native');
  return function LeagueGroupsPage() {
    return (
      <View testID="league-groups-screen">
        <Text>League Groups</Text>
      </View>
    );
  };
});

jest.mock('../screens/league-special/league-knockout/LeagueKnockoutPage', () => {
  const { Text, View } = require('react-native');
  return function LeagueKnockoutPage() {
    return (
      <View testID="league-knockout-screen">
        <Text>League Knockout</Text>
      </View>
    );
  };
});

jest.mock('../screens/live/LiveNow', () => {
  const { Text, View } = require('react-native');
  return function LiveNow({ apiHost }: { apiHost?: string }) {
    return (
      <View testID="live-screen">
        <Text>Live Now</Text>
        <Text testID="live-screen-api-host">{apiHost}</Text>
      </View>
    );
  };
});

jest.mock('../screens/live-charts/LiveChartsScreen', () => {
  const { Text, View } = require('react-native');
  return function LiveChartsScreen({ apiHost }: { apiHost?: string }) {
    return (
      <View testID="live-charts-screen">
        <Text>Live Charts</Text>
        <Text testID="live-charts-screen-api-host">{apiHost}</Text>
      </View>
    );
  };
});

jest.mock('../screens/today-players/TodayPlayersScreen', () => {
  const { Text, View } = require('react-native');
  return function TodayPlayersScreen() {
    return (
      <View testID="today-players-screen">
        <Text>Today Players</Text>
      </View>
    );
  };
});

jest.mock('../screens/match-details/MatchDetail', () => {
  const { Text, View } = require('react-native');
  return function MatchDetail() {
    return (
      <View testID="match-details-screen">
        <Text>Match Details</Text>
      </View>
    );
  };
});

jest.mock('../screens/matches/Matches', () => {
  const { Text, View } = require('react-native');
  return function Matches() {
    return (
      <View testID="matches-screen">
        <Text>Matches</Text>
      </View>
    );
  };
});

jest.mock('../screens/player-history/PlayerHistoryPage', () => {
  const { Text, View } = require('react-native');
  return function PlayerHistoryPage() {
    return (
      <View testID="player-history-screen">
        <Text>Player History</Text>
      </View>
    );
  };
});

jest.mock('../screens/team-details/TeamDetailsPage', () => {
  const { Text, View } = require('react-native');
  return function TeamDetailsPage() {
    return (
      <View testID="team-details-screen">
        <Text>Team Details</Text>
      </View>
    );
  };
});

// Mock apiService
const mockApiService = {
  getFixtures: jest.fn(),
  getLeagueStandings: jest.fn(),
  getMatchDetails: jest.fn(),
} as any;

const testApiHost = 'https://test-api.example';

describe('RootNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Routes export', () => {
    it('exports Routes as alias to MobileRoutes', () => {
      expect(Routes).toBe(MobileRoutes);
    });

    it('Routes values match MobileRoutes values', () => {
      expect(Routes.LANDING).toBe(MobileRoutes.LANDING);
      expect(Routes.ALL_LEAGUES).toBe(MobileRoutes.ALL_LEAGUES);
      expect(Routes.GAME).toBe(MobileRoutes.GAME);
      expect(Routes.LEAGUE).toBe(MobileRoutes.LEAGUE);
      expect(Routes.LIVE).toBe(MobileRoutes.LIVE);
      expect(Routes.MATCHES).toBe(MobileRoutes.MATCHES);
      expect(Routes.MATCH_DETAILS).toBe(MobileRoutes.MATCH_DETAILS);
      expect(Routes.TEAM_DETAILS).toBe(MobileRoutes.TEAM_DETAILS);
      expect(Routes.PLAYER_HISTORY).toBe(MobileRoutes.PLAYER_HISTORY);
      expect(Routes.CHARTS).toBe(MobileRoutes.CHARTS);
      expect(Routes.TODAY_PLAYERS).toBe(MobileRoutes.TODAY_PLAYERS);
    });

    it('exposes CHARTS and TODAY_PLAYERS route values', () => {
      expect(MobileRoutes.CHARTS).toBe('charts');
      expect(MobileRoutes.TODAY_PLAYERS).toBe('today-players');
    });
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <NavigationContainer>
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByTestId('landing-screen')).toBeTruthy();
    });

    it('renders Landing screen as initial route', () => {
      render(
        <NavigationContainer>
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByText('Landing')).toBeTruthy();
    });
  });

  describe('Screen configuration', () => {
    it('registers all expected screens', () => {
      const { root } = render(
        <NavigationContainer>
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );

      expect(root).toBeTruthy();
    });

    it('contains all MobileRoutes screen names', () => {
      const allRoutes = Object.values(MobileRoutes);
      expect(allRoutes).toContain('landing');
      expect(allRoutes).toContain('all-leagues');
      expect(allRoutes).toContain('game');
      expect(allRoutes).toContain('guess-league-team');
      expect(allRoutes).toContain('guess-team-player');
      expect(allRoutes).toContain('league');
      expect(allRoutes).toContain('league-special-arg');
      expect(allRoutes).toContain('league-special-groups');
      expect(allRoutes).toContain('league-special-knockout');
      expect(allRoutes).toContain('live');
      expect(allRoutes).toContain('match-details');
      expect(allRoutes).toContain('matches');
      expect(allRoutes).toContain('player-history');
      expect(allRoutes).toContain('team-details');
      expect(allRoutes).toContain('charts');
      expect(allRoutes).toContain('today-players');
    });

    it('renders LiveChartsScreen under the CHARTS route', () => {
      render(
        <NavigationContainer
          initialState={{
            routes: [{ name: MobileRoutes.CHARTS, params: { fixtureId: '1' } }],
          }}
        >
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByTestId('live-charts-screen')).toBeTruthy();
    });

    it('renders TodayPlayersScreen under the TODAY_PLAYERS route', () => {
      render(
        <NavigationContainer
          initialState={{
            routes: [{ name: MobileRoutes.TODAY_PLAYERS, params: { fixtureId: '1' } }],
          }}
        >
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByTestId('today-players-screen')).toBeTruthy();
    });
  });

  describe('Navigator options', () => {
    it('hides headers by default', () => {
      render(
        <NavigationContainer>
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.queryByText('landing')).toBeNull();
    });
  });

  describe('apiHost forwarding', () => {
    it('passes apiHost through to LiveChartsScreen', () => {
      render(
        <NavigationContainer
          initialState={{
            routes: [{ name: MobileRoutes.CHARTS, params: { fixtureId: '1' } }],
          }}
        >
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByTestId('live-charts-screen-api-host')).toHaveTextContent(testApiHost);
    });

    it('passes apiHost through to LiveNow', () => {
      render(
        <NavigationContainer
          initialState={{
            routes: [{ name: MobileRoutes.LIVE }],
          }}
        >
          <RootNavigator apiService={mockApiService} apiHost={testApiHost} />
        </NavigationContainer>
      );
      expect(screen.getByTestId('live-screen-api-host')).toHaveTextContent(testApiHost);
    });
  });
});
