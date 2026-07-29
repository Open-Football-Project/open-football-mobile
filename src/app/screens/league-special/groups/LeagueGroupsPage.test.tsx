import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import LeagueGroupsPage from './LeagueGroupsPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'lggroups.title': 'League Groups',
        'lggroups.header': 'Groups',
        'league.lg__prof_arg': 'Lg..prof_arg',
        'country.argentina': 'Argentina',
      },
    },
  },
});

jest.mock('@matchinsights/core', () => ({
  useLeaguePage: jest.fn(),
  cleanLeagueName: jest.fn((name) => name),
  leagueTranslationKey: jest.fn((name) => 'lg__prof_arg'),
  leagueGroupTranslation: jest.fn((label) => `group.${label}`),
  leagueLinksToMobileRoutes: jest.fn().mockImplementation((links: any[]) => 
    links.map((l: any) => ({ routeName: l.name, param: l.param, label: l.label }))
  ),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('../../../components/league/groups/grp-card/LeagueGroupCard', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ group }: any) => (
      <View testID={`group-card-${group.label}`}>
        <Text>{group.label}</Text>
        <Text>Teams: {group.teams?.length || 0}</Text>
      </View>
    ),
  };
});

jest.mock('../../../components/general/screen-tabs/ScreenTabs', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    ScreenTabs: ({ tabs, testIDPrefix }: any) => {
      const [activeIndex, setActiveIndex] = React.useState(0);
      if (!tabs || tabs.length === 0) return null;
      return (
        <View testID={testIDPrefix}>
          <View testID={`${testIDPrefix}-tabs-bar`}>
            {tabs.map((tab: any, index: number) => (
              <Pressable
                key={index}
                testID={tab.testID || `${testIDPrefix}-tab-${index}`}
                onPress={() => setActiveIndex(index)}
              >
                <Text>{tab.titleTranslationKey}</Text>
              </Pressable>
            ))}
          </View>
          <View testID={`${testIDPrefix}-content`}>
            {tabs[activeIndex]?.component}
          </View>
        </View>
      );
    },
    TabItem: {},
  };
});

jest.mock('../../../components/general/sub-header/SubHeader', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title, optionalLinks }: any) => (
      <View testID="subheader">
        <Text testID="subheader-title">{title}</Text>
        {optionalLinks && optionalLinks.length > 0 && (
          <View testID="subheader-optional-links">
            {optionalLinks.map((link: any, index: number) => (
              <Text key={index} testID={`optional-link-${index}`}>{link.label}</Text>
            ))}
          </View>
        )}
      </View>
    ),
  };
});

jest.mock('../../../components/general/no-data/NoData', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: any) => (
      <View testID={loading ? 'loading' : 'no-data'}>
        <Text>{loading ? 'Loading' : 'No Data'}</Text>
      </View>
    ),
  };
});

import { useLeaguePage } from '@matchinsights/core';

const Stack = createNativeStackNavigator();

const mockLeagueInfo: any = {
  id: 1,
  name: 'Prof. Arg.',
  country: 'Argentina',
  logo: 'logo.png',
  season: 2024,
  group: [
    {
      label: 'Group A',
      teams: [{ teamId: 1, teamName: 'Team 1' }],
    },
    {
      label: 'Group B',
      teams: [{ teamId: 2, teamName: 'Team 2' }],
    },
    {
      label: 'Group C',
      teams: [{ teamId: 3, teamName: 'Team 3' }],
    },
  ],
};

const mockLeagueLinks = [
  { name: 'league', param: { leagueId: '1' }, label: 'League Details' },
  { name: 'matches', param: {}, label: 'Matches' },
];

const renderPage = (leagueId: string, mockApiService: any = {}) => {
  const LeagueGroupsComponent = (props: any) => <LeagueGroupsPage {...props} apiService={mockApiService} />;
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LeagueGroups"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="LeagueGroups"
            component={LeagueGroupsComponent}
            initialParams={{ leagueId }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

describe('LeagueGroupsPage', () => {
  const mockApiService: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header, subheader and tabs when groups are available', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: mockLeagueLinks,
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('subheader')).toBeOnTheScreen();
      expect(screen.getByTestId('league-groups-tabs')).toBeOnTheScreen();
    });
  });

  it('renders first group tab by default', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('group-card-Group A')).toBeOnTheScreen();
    });
  });

  it('switches to another group when clicking its tab', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('league-groups-tabs')).toBeOnTheScreen();
    });

    fireEvent.press(screen.getByTestId('league-group-tab-1'));

    await waitFor(() => {
      expect(screen.getByTestId('group-card-Group B')).toBeOnTheScreen();
    });
  });

  it('shows NoData when league has no groups', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: { ...mockLeagueInfo, group: [] },
      leagueLinks: [],
      hasMultipleGroups: false,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('no-data')).toBeOnTheScreen();
      expect(screen.queryByTestId('league-groups-tabs')).not.toBeOnTheScreen();
    });
  });

  it('shows NoData when league info is unavailable', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: undefined,
      leagueLinks: [],
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('no-data')).toBeOnTheScreen();
    });
  });

  it('shows loading state while fetching league info', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: null,
      leagueLinks: [],
      hasMultipleGroups: false,
      loadingLeagueInfo: true,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeOnTheScreen();
      expect(screen.getByTestId('league-groups-screen-loading')).toBeOnTheScreen();
    });
  });

  it('displays tabs for each group', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('league-groups-tabs-tabs-bar')).toBeOnTheScreen();
      expect(screen.getByTestId('league-group-tab-0')).toBeOnTheScreen();
      expect(screen.getByTestId('league-group-tab-1')).toBeOnTheScreen();
      expect(screen.getByTestId('league-group-tab-2')).toBeOnTheScreen();
    });
  });

  it('passes leagueLinks to SubHeader via leagueLinksToMobileRoutes', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: mockLeagueLinks,
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('subheader-optional-links')).toBeOnTheScreen();
      expect(screen.getByTestId('optional-link-0')).toBeOnTheScreen();
      expect(screen.getByTestId('optional-link-1')).toBeOnTheScreen();
    });
  });

  it('renders tabs content area', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: true,
      loadingLeagueInfo: false,
    });

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByTestId('league-groups-tabs-content')).toBeOnTheScreen();
    });
  });
});
