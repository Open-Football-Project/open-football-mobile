import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useLiveNowStatus } from 'open-football-project-core';
import LiveNow from './LiveNow';

jest.mock('open-football-project-core');
jest.mock('@react-navigation/native');
jest.mock('react-native-sse', () => jest.fn().mockImplementation(() => ({})));
jest.mock('../../icons/Icons', () => ({
  LiveIcon: ({ testID }: { testID?: string }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={testID ?? 'live-icon'}>🔴</Text>;
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'livepage.subheadertitle': 'Live Matches',
        'livepage.countrycontrol': 'Select Country',
        'livepage.leaguecontrol': 'Select League',
        'livepage.selectleague': 'Select a league to view matches',
        'country.england': 'England',
        'country.france': 'France',
      };
      return translations[key.toLowerCase()] || options?.defaultValue || key;
    },
  }),
}));

const mockUseRoute = require('@react-navigation/native').useRoute as jest.MockedFunction<any>;
mockUseRoute.mockReturnValue({
  params: { fixtureId: undefined },
} as any);

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title }: { title: string }) => (
      <View testID="sub-header">
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: any) => (
      <View testID="no-data">
        <Text>{loading ? 'Loading...' : 'No data'}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/controls/Controls', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => (
      <View testID="controls">
        <Pressable onPress={() => props.setDrop0('France')}>
          <Text>Change Country</Text>
        </Pressable>
        <Pressable onPress={() => props.setDrop1('123')}>
          <Text>Change League</Text>
        </Pressable>
      </View>
    ),
  };
});

jest.mock('../../components/general/logo/Logo', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return {
    __esModule: true,
    default: ({ src }: { src: string }) => (
      <Image testID="logo" source={{ uri: src }} style={{ width: 32, height: 32 }} />
    ),
  };
});

jest.mock('../../components/live-matches/LiveMatches', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    LiveMatches: ({ matches }: { matches: any[] }) => (
      <View testID="live-matches">
        <Text>Live Matches ({matches.length})</Text>
      </View>
    ),
  };
});

const mockUseLiveNowStatus = useLiveNowStatus as jest.MockedFunction<typeof useLiveNowStatus>;

describe('LiveNow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: { fixtureId: undefined },
    } as any);
  });

  const mockApiService = {} as any;
  const testApiHost = 'https://test-api.example';

  it('should render live now screen with correct testID', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [{ leagueId: 1, leagueName: 'Premier League' }],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('live-now-screen')).toBeTruthy();
  });

  it('should render NoData when there are no leagues', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: null,
      setSelectedCountry: jest.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: jest.fn(),
      countries: [],
      leagues: [],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('should render Controls and message when leagues exist but no league selected', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: jest.fn(),
      countries: ['England', 'France'],
      leagues: [
        { leagueId: 1, leagueName: 'Premier League' },
        { leagueId: 2, leagueName: 'La Liga' },
      ],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('controls')).toBeTruthy();
    expect(screen.getByText(/Select a league/i)).toBeTruthy();
  });

  it('should render selected league info and LiveMatches when a league is selected', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: 1,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [
        {
          leagueId: 1,
          leagueName: 'Premier League',
          leagueLogo: 'logo.png',
          leagueCountry: 'England',
        },
      ],
      selectedLeague: {
        leagueId: 1,
        leagueName: 'Premier League',
        leagueLogo: 'logo.png',
        leagueCountry: 'England',
      },
      selectedLeagueMatches: [{ id: 1, home: 'Team A', away: 'Team B' }],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('league-info-card')).toBeTruthy();
    expect(screen.getByTestId('logo')).toBeTruthy();
    expect(screen.getByTestId('live-matches')).toBeTruthy();
  });

  it('should call setSelectedCountry and setSelectedLeagueId when dropdowns change', () => {
    const mockSetCountry = jest.fn();
    const mockSetLeagueId = jest.fn();

    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: mockSetCountry,
      selectedLeagueId: null,
      setSelectedLeagueId: mockSetLeagueId,
      countries: ['England', 'France'],
      leagues: [
        { leagueId: 1, leagueName: 'Premier League' },
        { leagueId: 2, leagueName: 'La Liga' },
      ],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    const buttons = screen.getAllByText(/Change/i);
    fireEvent.press(buttons[0]); // Change Country
    fireEvent.press(buttons[1]); // Change League

    expect(mockSetCountry).toHaveBeenCalledWith('France');
    expect(mockSetLeagueId).toHaveBeenCalledWith(123);
  });

  it('should pass fixtureId from route params to useLiveNowStatus', () => {
    mockUseRoute.mockReturnValue({
      params: { fixtureId: '1234' },
    } as any);

    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: 1,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [
        {
          leagueId: 1,
          leagueName: 'Premier League',
          leagueLogo: 'logo.png',
          leagueCountry: 'England',
        },
      ],
      selectedLeague: {
        leagueId: 1,
        leagueName: 'Premier League',
        leagueLogo: 'logo.png',
        leagueCountry: 'England',
      },
      selectedLeagueMatches: [{ id: 1 }],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    expect(mockUseLiveNowStatus).toHaveBeenCalledWith(
      testApiHost,
      0,
      '1234',
      expect.any(Function)
    );
    expect(screen.getByTestId('live-matches')).toBeTruthy();
  });

  it('should not display league info card when no league selected', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [{ leagueId: 1, leagueName: 'Premier League' }],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.queryByTestId('league-info-card')).toBeNull();
  });

  it('should show live indicator icon when a league is selected', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: 1,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [{ leagueId: 1, leagueName: 'Premier League', leagueLogo: 'logo.png', leagueCountry: 'England' }],
      selectedLeague: { leagueId: 1, leagueName: 'Premier League', leagueLogo: 'logo.png', leagueCountry: 'England' },
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('live-indicator')).toBeTruthy();
  });

  it('should pass the RNEventSource factory to useLiveNowStatus', () => {
    mockUseLiveNowStatus.mockReturnValue({
      selectedCountry: 'England',
      setSelectedCountry: jest.fn(),
      selectedLeagueId: null,
      setSelectedLeagueId: jest.fn(),
      countries: ['England'],
      leagues: [{ leagueId: 1, leagueName: 'Premier League' }],
      selectedLeague: null,
      selectedLeagueMatches: [],
    } as any);

    render(<LiveNow apiService={mockApiService} apiHost={testApiHost} />);

    expect(mockUseLiveNowStatus).toHaveBeenCalledWith(
      testApiHost,
      0,
      undefined,
      expect.any(Function)
    );
  });
});
