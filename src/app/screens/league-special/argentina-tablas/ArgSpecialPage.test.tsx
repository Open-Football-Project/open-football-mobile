import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import ArgSpecialPage from './ArgSpecialPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { ArgSpecial } from 'open-football-project-core';


i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'argspecial.title': 'Argentina Tables',
        'argspecial.anual': 'Annual',
        'argspecial.promedios': 'Average',
        'country.argentina': 'Argentina',
      },
    },
  },
});

jest.mock('open-football-project-core', () => ({
  useLeaguePage: jest.fn(),
  leagueLinksToMobileRoutes: jest.fn().mockImplementation((links: any[]) => links.map((l: any) => ({ routeName: l.name, param: l.param, label: l.label }))),
  MobileRoutes: {
    LANDING: 'landing',
    ALL_LEAGUES: 'all-leagues',
    GAME: 'game',
    GUESS_LEAGUE_TEAM: 'guess-league-team',
    GUESS_TEAM_PLAYER: 'guess-team-player',
    LEAGUE: 'league',
    LEAGUE_SPECIAL_ARG: 'league-special-arg',
    LEAGUE_SPECIAL_GROUPS: 'league-special-groups',
    LEAGUE_SPECIAL_KNOCKOUT: 'league-special-knockout',
    LIVE: 'live',
    MATCH_DETAILS: 'match-details',
    MATCHES: 'matches',
    PLAYER_HISTORY: 'player-history',
    TEAM_DETAILS: 'team-details',
  },
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../components/league/arg-special/ArgSpecialTable', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ teams, mode }: any) => (
      <View testID={`arg-special-table-${mode}`}>
        <Text>{teams.map((t: any) => t.teamName).join(',')}</Text>
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
      const availableTabs = tabs.filter((t: any) => t.isAvailable !== false);
      if (availableTabs.length === 0) {
        return <View testID={`${testIDPrefix}-no-data`} />;
      }
      return (
        <View testID={testIDPrefix}>
          <View testID={`${testIDPrefix}-tabs`}>
            {availableTabs.map((tab: any, index: number) => (
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
            {availableTabs[activeIndex]?.component}
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
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: any) => (
      <View testID={loading ? 'loading' : 'nodata'} />
    ),
  };
});

import { useLeaguePage } from 'open-football-project-core';

const Stack = createNativeStackNavigator();

describe('ArgSpecialPage', () => {
  const mockApiService: any = {};
  const mockArgSpecial: ArgSpecial = {
    annualTable: [
      { teamId: 1, teamName: 'Team A', points: 30, played: 15 },
      { teamId: 2, teamName: 'Team B', points: 28, played: 15 },
    ],
    promediosTable: [
      { teamId: 1, teamName: 'Team A', points: 0, played: 0, promedio: 1.5 },
      { teamId: 2, teamName: 'Team B', points: 0, played: 0, promedio: 1.3 },
    ],
  };

  const mockLeagueLinks = [
    { name: 'league', param: { leagueId: '123' }, label: 'League Details' },
    { name: 'matches', param: {}, label: 'Matches' },
  ];

  const renderPage = (leagueId: string) => {
    const ArgSpecialComponent = (props: any) => <ArgSpecialPage {...props} apiService={mockApiService} />;
    return render(
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="ArgSpecial"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="ArgSpecial"
              component={ArgSpecialComponent}
              initialParams={{ leagueId }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: null,
      leagueLinks: [],
      isArgSpecialAvailable: false,
      loadingArgSpecial: true,
      loadingLeagueInfo: true,
      argSpecial: null,
    });

    renderPage('123');
    expect(screen.getByTestId('loading')).toBeOnTheScreen();
    expect(screen.getByTestId('arg-special-screen-loading')).toBeOnTheScreen();
  });

  it('renders NoData when argSpecial is not available', () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: null,
      leagueLinks: [],
      isArgSpecialAvailable: false,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: null,
    });

    renderPage('123');
    expect(screen.getByTestId('nodata')).toBeOnTheScreen();
  });

  it('renders ScreenTabs with annual and promedios tabs when data is available', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: { logo: 'logo.png', country: 'Argentina' },
      leagueLinks: mockLeagueLinks,
      isArgSpecialAvailable: true,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: mockArgSpecial,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('arg-special-tabs')).toBeOnTheScreen();
      expect(screen.getByTestId('arg-special-tab-annual')).toBeOnTheScreen();
      expect(screen.getByTestId('arg-special-tab-promedios')).toBeOnTheScreen();
    });
  });

  it('switches between annual and promedios tabs', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: { logo: 'logo.png', country: 'Argentina' },
      leagueLinks: [],
      isArgSpecialAvailable: true,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: mockArgSpecial,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('arg-special-table-promedios')).toBeOnTheScreen();
    });

    fireEvent.press(screen.getByTestId('arg-special-tab-annual'));

    await waitFor(() => {
      expect(screen.getByTestId('arg-special-table-annual')).toBeOnTheScreen();
    });
  });

  it('passes leagueLinks to SubHeader via leagueLinksToMobileRoutes', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: { logo: 'logo.png', country: 'Argentina' },
      leagueLinks: mockLeagueLinks,
      isArgSpecialAvailable: true,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: mockArgSpecial,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('subheader')).toBeOnTheScreen();
      expect(screen.getByTestId('subheader-optional-links')).toBeOnTheScreen();
      expect(screen.getByTestId('optional-link-0')).toBeOnTheScreen();
      expect(screen.getByTestId('optional-link-1')).toBeOnTheScreen();
    });
  });

  it('renders SubHeader with correct title', async () => {
    (useLeaguePage as jest.Mock).mockReturnValue({
      leagueInfo: { logo: 'logo.png', country: 'Argentina' },
      leagueLinks: [],
      isArgSpecialAvailable: true,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: mockArgSpecial,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('subheader-title')).toHaveTextContent('argspecial.title');
    });
  });
});
