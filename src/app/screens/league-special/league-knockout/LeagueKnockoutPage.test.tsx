import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import LeagueKnockoutPage from './LeagueKnockoutPage';
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
        'knockout.title': 'Knockout',
        'knockout.header': 'Knockout Header',
        'knockout.bracketView': 'Final Rounds',
        'knockout.stepperView': 'Each Round',
        'country.spain': 'Spain',
      },
    },
  },
});

jest.mock('open-football-project-core', () => ({
  useLeaguePage: jest.fn(),
  cleanLeagueName: jest.fn((name) => name),
  leagueTranslationKey: jest.fn((name) => name.toLowerCase().replace(/\s+/g, '_')),
  leagueLinksToMobileRoutes: jest.fn((links) => links),
}));

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue ?? key,
  }),
}));

jest.mock('../../../components/league/knockout/stepper/KnockoutStepper', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="knockout-stepper" />,
  };
});

jest.mock('../../../components/sharing-content/knockouts-image/KnockoutsImage', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="knockout-bracket-image" />,
  };
});

jest.mock('../../../components/general/screen-tabs/ScreenTabs', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    ScreenTabs: ({ tabs, testIDPrefix }: any) => (
      <View testID={testIDPrefix ?? 'screen-tabs'}>
        {tabs.map((tab: any, i: number) => (
          <View key={i} testID={`${testIDPrefix ?? 'screen-tabs'}-tab-${i}`}>{tab.component}</View>
        ))}
      </View>
    ),
  };
});

jest.mock('../../../components/general/sub-header/SubHeader', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title, optionalLinks }: any) => (
      <View testID="subheader">
        <Text>{title}</Text>
        {optionalLinks?.length > 0 && <View testID="optional-links" />}
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
        <Text>{loading ? 'Loading' : 'nodata.default'}</Text>
      </View>
    ),
  };
});

import { useLeaguePage } from 'open-football-project-core';

const Stack = createNativeStackNavigator();

const mockApiService: any = {};

const renderPage = (leagueId: string) => {
  const LeagueKnockoutComponent = (props: any) => <LeagueKnockoutPage {...props} apiService={mockApiService} />;
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LeagueKnockout"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="LeagueKnockout"
            component={LeagueKnockoutComponent}
            initialParams={{ leagueId }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

const mockUseLeaguePage = (
  overrides: Partial<{
    fixtures: any;
    leagueInfo: any;
    loadingFixtures: boolean;
    isLeaguefixturesAvailable: boolean;
    hasKnockoutPhase: boolean;
    leagueLinks: any[];
  }> = {}
) => {
  (useLeaguePage as jest.Mock).mockReturnValue({
    fixtures: undefined,
    leagueInfo: {
      name: 'Champions League',
      logo: 'logo.png',
      country: 'Spain',
    },
    loadingFixtures: false,
    isLeaguefixturesAvailable: true,
    hasKnockoutPhase: false,
    leagueLinks: [],
    ...overrides,
  });
};

describe('LeagueKnockoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fallback header when league name is missing', async () => {
    mockUseLeaguePage({
      leagueInfo: { name: 'Unknown League' },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('subheader')).toBeOnTheScreen();
    });
  });

  it('renders league name when available', async () => {
    mockUseLeaguePage({
      leagueInfo: { name: 'Copa Libertadores' },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('subheader')).toBeOnTheScreen();
    });
  });

  it('shows NOT knockout message when no knockout rounds exist', async () => {
    mockUseLeaguePage({
      hasKnockoutPhase: false,
      isLeaguefixturesAvailable: true,
      fixtures: {
        rounds: [
          {
            name: 'Regular Season',
            days: [],
          },
        ],
      },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('no-data')).toBeOnTheScreen();
    });
  });

  it('renders KnockoutStepper directly when knockout rounds exist', async () => {
    mockUseLeaguePage({
      hasKnockoutPhase: true,
      isLeaguefixturesAvailable: true,
      fixtures: {
        rounds: [
          {
            name: 'Quarter-finals',
            days: [{ date: '2024-01-01', matches: [{ fixtureId: 1, isFinished: false }] }],
          },
        ],
      },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('knockout-stepper')).toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-bracket-image')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-tabs')).not.toBeOnTheScreen();
    });
  });

  it('renders KnockoutStepper without tabs when knockout rounds exist', async () => {
    mockUseLeaguePage({
      hasKnockoutPhase: true,
      isLeaguefixturesAvailable: true,
      fixtures: {
        rounds: [
          {
            name: 'Quarter-finals',
            days: [
              {
                date: '2024-01-01',
                matches: [
                  {
                    fixtureId: 1,
                    homeTeamId: 1,
                    awayTeamId: 2,
                    homeTeamName: 'A',
                    awayTeamName: 'B',
                    date: '2024-01-01',
                    isFinished: false,
                    statusShort: 'NS',
                    statusLong: 'Not Started',
                    isLiveNow: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('knockout-stepper')).toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-bracket-image')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-tabs')).not.toBeOnTheScreen();
    });
  });

  it('does not render KnockoutStepper while loading', async () => {
    mockUseLeaguePage({
      loadingFixtures: true,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-stepper')).not.toBeOnTheScreen();
    });
  });

  it('does not render KnockoutStepper when fixtures are unavailable', async () => {
    mockUseLeaguePage({
      isLeaguefixturesAvailable: false,
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('no-data')).toBeOnTheScreen();
      expect(screen.queryByTestId('knockout-stepper')).not.toBeOnTheScreen();
    });
  });

  it('renders optional links when league links are provided', async () => {
    mockUseLeaguePage({
      hasKnockoutPhase: true,
      isLeaguefixturesAvailable: true,
      leagueLinks: [{ label: 'Groups', routeName: 'league-groups', param: { leagueId: '123' } }],
      fixtures: {
        rounds: [
          {
            name: 'Final',
            days: [{ date: '2024-01-01', matches: [{ fixtureId: 1, isFinished: false }] }],
          },
        ],
      },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('optional-links')).toBeOnTheScreen();
    });
  });

  it('renders knockout screen with correct testID', async () => {
    mockUseLeaguePage({
      hasKnockoutPhase: true,
      isLeaguefixturesAvailable: true,
      fixtures: {
        rounds: [
          {
            name: 'Final',
            days: [{ date: '2024-01-01', matches: [{ fixtureId: 1, isFinished: false }] }],
          },
        ],
      },
    });

    renderPage('123');

    await waitFor(() => {
      expect(screen.getByTestId('knockout-screen')).toBeOnTheScreen();
    });
  });

  it('handles invalid leagueId gracefully', async () => {
    mockUseLeaguePage({});

    renderPage('invalid');

    await waitFor(() => {
      expect(screen.getByTestId('knockout-screen')).toBeOnTheScreen();
      expect(screen.getByTestId('no-data')).toBeOnTheScreen();
    });
  });
});
