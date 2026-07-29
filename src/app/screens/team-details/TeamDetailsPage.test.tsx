import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen,  fireEvent } from '@testing-library/react-native';
import TeamDetailsPage from './TeamDetailsPage';
import { ApiService, useTeamDetail, useTeamFixture,  MobileRoutes } from '@matchinsights/core';
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

jest.mock('../../components/team/team-details/team-info/TeamInfo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () =>
      React.createElement(
        View,
        { testID: 'team-info' },
        React.createElement(Text, null, 'Team Info')
      ),
  };
});

jest.mock('../../components/team/team-details/team-squad/TeamSquad', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () =>
      React.createElement(
        View,
        { testID: 'team-squad' },
        React.createElement(Text, null, 'Team Squad')
      ),
  };
});

jest.mock('../../components/team/team-fixture/TeamMatchesList', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ testID }: any) =>
      React.createElement(
        View,
        { testID: testID || 'team-matches-list' },
        React.createElement(Text, null, 'Matches List')
      ),
  };
});

jest.mock('../../components/general/screen-tabs/ScreenTabs', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    ScreenTabs: ({ tabs, testIDPrefix }: any) => {
      const [activeIndex, setActiveIndex] = React.useState(0);
      const availableTabs = tabs.filter((t: any) => t.isAvailable !== false);
      return React.createElement(
        View,
        { testID: testIDPrefix || 'screen-tabs' },
        React.createElement(
          View,
          { testID: `${testIDPrefix}-tab-bar` },
          availableTabs.map((tab: any, index: number) =>
            React.createElement(
              Pressable,
              {
                key: index,
                testID: tab.testID,
                onPress: () => setActiveIndex(index),
              },
              React.createElement(Text, null, tab.titleTranslationKey)
            )
          )
        ),
        React.createElement(
          View,
          { testID: `${testIDPrefix}-content` },
          availableTabs[activeIndex]?.component
        )
      );
    },
    TabItem: {},
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: any) =>
      React.createElement(
        View,
        { testID: 'no-data' },
        React.createElement(Text, null, loading ? 'Loading...' : 'No Data')
      ),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as any;
  return {
    ...actual,
    useTeamDetail: jest.fn(),
    useTeamFixture: jest.fn(),
  };
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationWrapper = ({
  children,
  teamId = '1',
}: {
  children: React.ReactNode;
  teamId?: string;
}) => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={MobileRoutes.TEAM_DETAILS}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={MobileRoutes.TEAM_DETAILS}
        options={{ headerShown: false }}
        listeners={{
          beforeRemove: (e) => {
            e.preventDefault();
          },
        }}
        initialParams={{ teamId }}
      >
        {() => children as any}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

const mockTeamDetail = (overrides = {}) => ({
  loadingTeamDetails: false,
  loadingTeamLeagues: false,
  teamDetails: {
    teamName: 'Barcelona',
    teamLogo: '/barca.png',
  },
  teamPlayers: [{ id: 1, name: 'Messi' }],
  teamLeagues: [],
  isTeamDetailsAvailable: true,
  isTeamPlayersAvailable: true,
  isTeamLeaguesAvailable: false,
  teamlinks: [],
  ...overrides,
});

const mockTeamFixtureData = (overrides = {}) => ({
  isPreviousMatchesAvailable: true,
  isUpcommingMatchesAvailable: true,
  teamFixture: {
    previous: [
      { fixtureId: 1, homeTeamName: 'Barcelona', awayTeamName: 'Real Madrid', isFinished: true },
    ],
    upcoming: [
      { fixtureId: 2, homeTeamName: 'Barcelona', awayTeamName: 'Atletico', isFinished: false },
    ],
  },
  ...overrides,
});

const { useRoute } = require('@react-navigation/native');

describe('TeamDetailsPage', () => {
  const mockApiService = {} as ApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { teamId: '1' },
    });
    (useTeamDetail as jest.Mock).mockReturnValue(mockTeamDetail());
    (useTeamFixture as jest.Mock).mockReturnValue(mockTeamFixtureData());
  });

  it('shows loading state', () => {
    (useTeamDetail as jest.Mock).mockReturnValue(
      mockTeamDetail({
        loadingTeamDetails: true,
        isTeamDetailsAvailable: false,
        teamDetails: undefined,
      })
    );
    (useTeamFixture as jest.Mock).mockReturnValue({
      isPreviousMatchesAvailable: false,
      isUpcommingMatchesAvailable: false,
      teamFixture: undefined,
    });

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.getByTestId('team-details-loading')).toBeTruthy();
  });

  it('shows loading state when team details are loaded but teamFixture is still undefined', () => {
    (useTeamDetail as jest.Mock).mockReturnValue(
      mockTeamDetail({
        loadingTeamDetails: false,
        isTeamDetailsAvailable: true,
      })
    );
    (useTeamFixture as jest.Mock).mockReturnValue({
      isPreviousMatchesAvailable: false,
      isUpcommingMatchesAvailable: false,
      teamFixture: undefined,
    });

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.getByTestId('team-details-loading')).toBeTruthy();
    expect(screen.queryByTestId('team-tabs-container')).toBeFalsy();
  });

  it('renders team info and screen tabs when data is available', () => {
    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.getByTestId('subheader')).toBeTruthy();
    expect(screen.getByTestId('team-info-section')).toBeTruthy();
    expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
  });

  it('renders all three tabs when data is available', () => {
    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.getByTestId('team-tab-previous')).toBeTruthy();
    expect(screen.getByTestId('team-tab-upcoming')).toBeTruthy();
    expect(screen.getByTestId('team-tab-squad')).toBeTruthy();
  });

  it('renders NoData when team details are unavailable', () => {
    (useTeamDetail as jest.Mock).mockReturnValue(
      mockTeamDetail({
        isTeamDetailsAvailable: false,
        teamDetails: null,
      })
    );

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.getByTestId('team-details-no-data')).toBeTruthy();
  });

  it('does not render squad tab when players are unavailable', () => {
    (useTeamDetail as jest.Mock).mockReturnValue(
      mockTeamDetail({
        teamPlayers: [],
        isTeamPlayersAvailable: false,
      })
    );

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.queryByTestId('team-tab-squad')).toBeFalsy();
  });

  it('does not render previous matches tab when unavailable', () => {
    (useTeamFixture as jest.Mock).mockReturnValue(
      mockTeamFixtureData({
        teamFixture: { previous: [], upcoming: [] },
        isPreviousMatchesAvailable: false,
      })
    );

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.queryByTestId('team-tab-previous')).toBeFalsy();
  });

  it('does not render upcoming matches tab when unavailable', () => {
    (useTeamFixture as jest.Mock).mockReturnValue(
      mockTeamFixtureData({
        teamFixture: { previous: [], upcoming: [] },
        isUpcommingMatchesAvailable: false,
      })
    );

    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    expect(screen.queryByTestId('team-tab-upcoming')).toBeFalsy();
  });

  it('switches between tabs when pressed', () => {
    render(
      <NavigationWrapper teamId="1">
        <TeamDetailsPage apiService={mockApiService} />
      </NavigationWrapper>
    );

    // Initially shows first tab content (previous matches)
    expect(screen.getByTestId('previous-matches-list')).toBeTruthy();

    // Press upcoming matches tab
    fireEvent.press(screen.getByTestId('team-tab-upcoming'));
    expect(screen.getByTestId('upcoming-matches-list')).toBeTruthy();

    // Press squad tab
    fireEvent.press(screen.getByTestId('team-tab-squad'));
    expect(screen.getByTestId('team-squad')).toBeTruthy();
  });
});
