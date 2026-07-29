import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import LeaguePage from './LeaguePage';
import { ApiService, MobileRoutes } from '@matchinsights/core';
import {
  mockLeagueInfo,
  mockLeagueFixture,
  mockLeagueRankingPlayers,
} from '@matchinsights/core';

import { useLeaguePage } from '@matchinsights/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native') as any,
  useRoute: jest.fn(),
}));

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title, logoUrl, subTitle }: any) => (
      <View testID="subheader">
        <Text testID="subheader-title">{title}</Text>
        {logoUrl && <Text>{logoUrl}</Text>}
        {subTitle && <Text testID="subheader-subtitle">{subTitle}</Text>}
      </View>
    ),
  };
});

jest.mock(
  '../../components/league/league-fixture/LeagueFixtureComponent',
  () => ({
    LeagueFixtureComponent: ({ loading }: { loading: boolean }) => {
      const React = require('react');
      const { View, Text } = require('react-native');
      return React.createElement(
        View,
        { testID: 'fixture' },
        React.createElement(Text, null, loading ? 'Loading Fixture' : 'Fixture Loaded')
      );
    },
  })
);

jest.mock('../../components/league/league-standing/LeagueStanding', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: { loading: boolean }) =>
      React.createElement(
        View,
        { testID: 'standing' },
        React.createElement(Text, null, loading ? 'Loading Standing' : 'Standing Loaded')
      ),
  };
});

jest.mock(
  '../../components/league/league-rankings/league-ranking-tabs/LeagueRankingTab',
  () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
      __esModule: true,
      default: (props: any) =>
        React.createElement(
          View,
          { testID: 'rankings' },
          React.createElement(Text, null, 'Rankings Loaded')
        ),
    };
  }
);

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: any) =>
      React.createElement(
        View,
        { testID: 'no-data' },
        React.createElement(Text, null, loading ? 'Loading' : 'Not Available')
      ),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as any;
  return {
    ...actual,
    useLeaguePage: jest.fn(),
  };
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationWrapper = ({
  children,
  leagueId = '1',
}: {
  children: React.ReactNode;
  leagueId?: string;
}) => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={MobileRoutes.LEAGUE}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={MobileRoutes.LEAGUE}
        options={{ headerShown: false }}
        listeners={{
          beforeRemove: (e) => {
            e.preventDefault();
          },
        }}
        initialParams={{ leagueId }}
      >
        {() => children as any}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

const mockLeaguePage = (overrides = {}) => ({
  fixtures: mockLeagueFixture,
  leagueInfo: mockLeagueInfo,
  loadingFixtures: false,
  loadingLeagueInfo: false,
  isLeagueInfoAvailable: true,
  isLeaguefixturesAvailable: true,

  topScorers: mockLeagueRankingPlayers,
  assists: mockLeagueRankingPlayers,
  yellowCards: mockLeagueRankingPlayers,
  redCards: mockLeagueRankingPlayers,

  isTopScorersAvailable: true,
  isAssistsAvailable: true,
  isYellowCardsAvailable: true,
  isRedCardsAvailable: true,

  ...overrides,
});

const { useRoute } = require('@react-navigation/native');

describe('LeaguePage', () => {
  const mockApiService = {} as ApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    (useLeaguePage as jest.Mock).mockReturnValue(mockLeaguePage());
    (useRoute as jest.Mock).mockReturnValue({
      params: { leagueId: '1' },
    });
  });

  describe('Tab Navigation', () => {
    it('renders SubHeader and ScreenTabs with all available tabs', () => {
      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      // SubHeader should always render
      expect(screen.getByTestId('subheader')).toBeTruthy();
      
      // ScreenTabs should render
      expect(screen.getByTestId('league-screen-tabs')).toBeTruthy();
      
      // All tab buttons should be present
      expect(screen.getByTestId('league-tab-standing')).toBeTruthy();
      expect(screen.getByTestId('league-tab-fixtures')).toBeTruthy();
      expect(screen.getByTestId('league-tab-rankings')).toBeTruthy();
    });

    it('shows standing content by default (first tab)', () => {
      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      // Standing content should be visible by default
      expect(screen.getByTestId('standing')).toBeTruthy();
      
      // Other content should not be visible
      expect(screen.queryByTestId('fixture')).toBeFalsy();
      expect(screen.queryByTestId('rankings')).toBeFalsy();
    });

    it('switches to fixtures tab when pressed', () => {
      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      // Click fixtures tab
      fireEvent.press(screen.getByTestId('league-tab-fixtures'));

      // Fixtures content should now be visible
      expect(screen.getByTestId('fixture')).toBeTruthy();
      
      // Standing should no longer be visible
      expect(screen.queryByTestId('standing')).toBeFalsy();
    });

    it('switches to rankings tab when pressed', () => {
      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      // Click rankings tab
      fireEvent.press(screen.getByTestId('league-tab-rankings'));

      // Rankings content should now be visible
      expect(screen.getByTestId('rankings')).toBeTruthy();
      
      // Standing should no longer be visible
      expect(screen.queryByTestId('standing')).toBeFalsy();
    });
  });

  describe('Data Availability', () => {
    it('shows no-data when all data is unavailable', async () => {
      (useLeaguePage as jest.Mock).mockReturnValue(
        mockLeaguePage({
          fixtures: undefined,
          leagueInfo: undefined,
          isLeagueInfoAvailable: false,
          isLeaguefixturesAvailable: false,
          isTopScorersAvailable: false,
          isAssistsAvailable: false,
          isYellowCardsAvailable: false,
          isRedCardsAvailable: false,
          topScorers: [],
          assists: [],
          yellowCards: [],
          redCards: [],
        })
      );

      render(
        <NavigationWrapper leagueId="3">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('subheader')).toBeTruthy();
      });

      // No tab content should be visible
      expect(screen.queryByTestId('standing')).toBeFalsy();
      expect(screen.queryByTestId('fixture')).toBeFalsy();
      expect(screen.queryByTestId('rankings')).toBeFalsy();
      
      // No-data should be shown for empty tabs
      expect(screen.getByTestId('league-screen-tabs-no-data')).toBeTruthy();
    });

    it('renders only standings tab when fixtures and rankings unavailable', () => {
      (useLeaguePage as jest.Mock).mockReturnValue(
        mockLeaguePage({
          isLeaguefixturesAvailable: false,
          isTopScorersAvailable: false,
          isAssistsAvailable: false,
          isYellowCardsAvailable: false,
          isRedCardsAvailable: false,
        })
      );

      render(
        <NavigationWrapper leagueId="2">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      // Standing tab should be present and content visible
      expect(screen.getByTestId('league-tab-standing')).toBeTruthy();
      expect(screen.getByTestId('standing')).toBeTruthy();
      
      // Fixtures and rankings tabs should not exist
      expect(screen.queryByTestId('league-tab-fixtures')).toBeFalsy();
      expect(screen.queryByTestId('league-tab-rankings')).toBeFalsy();
    });
  });

  describe('Loading States', () => {
    it('displays global loading indicator when loading', () => {
      (useLeaguePage as jest.Mock).mockReturnValue(
        mockLeaguePage({
          loadingFixtures: true,
          loadingLeagueInfo: true,
        })
      );

      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      expect(screen.getByTestId('league-page-loading')).toBeTruthy();
    });

    it('keeps rankings tab available when isLoading is true but rankings data is already loaded', () => {
      (useLeaguePage as jest.Mock).mockReturnValue(
        mockLeaguePage({
          loadingFixtures: true,
          loadingLeagueInfo: true,
          isTopScorersAvailable: true,
          isAssistsAvailable: true,
          isYellowCardsAvailable: true,
          isRedCardsAvailable: true,
        })
      );

      render(
        <NavigationWrapper leagueId="1">
          <LeaguePage apiService={mockApiService} />
        </NavigationWrapper>
      );

      expect(screen.getByTestId('league-tab-rankings')).toBeTruthy();
    });
  });
});