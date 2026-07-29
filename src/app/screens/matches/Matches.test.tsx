import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useMatchesStatus } from '@matchinsights/core';
import Matches from './Matches';

jest.mock('@matchinsights/core');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.matches': 'Matches',
        'common.matchdate': 'Match Date',
        'common.countrycontrol': 'Country',
        'common.timerangelabel': 'Time Range',
        'matches.nodatamsg': 'No matches available for the selected filters',
        'nodata.loading': 'Loading...',
        'country.worldwide': 'Worldwide',
        'country.spain': 'Spain',
        'country.england': 'England',
        'country.france': 'France',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 375, height: 812, scale: 1, fontScale: 1 }),
}));

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

jest.mock('../../components/general/controls/Controls', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => {
      const { useDatePicker, datePickerLabel, drop0Label, drop0Options, selectedDrop0, setDrop0, useTimeRange, timeRangeLabel } = props;
      return (
        <View testID="controls">
          <Text testID="controls-label">{drop0Label}</Text>
          {drop0Options && drop0Options.length > 0 && (
            <Pressable
              testID="country-selector"
              onPress={() => setDrop0('France')}
            >
              <Text>{selectedDrop0}</Text>
            </Pressable>
          )}
          {useDatePicker && (
            <Text testID="date-picker-label">{datePickerLabel}</Text>
          )}
          {useTimeRange && (
            <Text testID="time-range-label">{timeRangeLabel}</Text>
          )}
        </View>
      );
    },
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, message }: any) => (
      <View testID={loading ? 'loading-indicator' : 'no-data'}>
        <Text>{loading ? 'Loading...' : message || 'No data'}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/match/matches-grid/MatchesGrid', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ league }: { league: any }) => (
      <View testID={`matches-grid-${league?.leagueId}`}>
        <Text>{`League: ${league?.leagueName}`}</Text>
      </View>
    ),
  };
});

const mockUseMatchesStatus = useMatchesStatus as jest.MockedFunction<
  typeof useMatchesStatus
>;

const createMockMatchesStatus = (overrides = {}) => ({
  loadingMatches: false,
  selectedCountry: 'Worldwide',
  setSelectedCountry: jest.fn(),
  selectedDate: '2024-01-01',
  setSelectedDate: jest.fn(),
  countries: ['Worldwide', 'Spain', 'England', 'France'],
  leagueMatches: [],
  isLeagueMatchesAvailable: false,
  selectedTimeRange: { from: 0, to: 8, name: 'Morning' },
  setSelectedTimeRange: jest.fn(),
  timeRangeOptions: [
    { from: 0, to: 8, name: 'Morning' },
    { from: 8, to: 16, name: 'Afternoon' },
    { from: 16, to: 24, name: 'Evening' },
  ],
  selectedTimeRangeIndex: 0,
  setSelectedTimeRangeIndex: jest.fn(),
  ...overrides,
});

describe('Matches Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMatchesStatus.mockReturnValue(createMockMatchesStatus());
  });

  const mockApiService = {} as any;

  it('should display loading indicator when loadingMatches is true', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({ loadingMatches: true })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('should show SubHeader and Controls even when loading', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({ loadingMatches: true })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByTestId('controls')).toBeTruthy();
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should show SubHeader and Controls even when no data available', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        loadingMatches: false,
        isLeagueMatchesAvailable: false,
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByTestId('controls')).toBeTruthy();
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('should display NoData when no matches available and not loading', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        loadingMatches: false,
        isLeagueMatchesAvailable: false,
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
    expect(screen.getByText('No matches available for the selected filters')).toBeTruthy();
  });

  it('should not render MatchesGrid when loading', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        loadingMatches: true,
        isLeagueMatchesAvailable: true,
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    expect(screen.queryByTestId('matches-grid-1')).toBeNull();
  });

  it('should display MatchesGrid per league when leagues are available', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        loadingMatches: false,
        isLeagueMatchesAvailable: true,
        leagueMatches: [
          {
            leagueId: 1,
            leagueName: 'La Liga',
            leagueLogo: 'logo.png',
            matches: [],
          },
          {
            leagueId: 2,
            leagueName: 'Premier League',
            leagueLogo: 'logo2.png',
            matches: [],
          },
        ],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('matches-grid-1')).toBeTruthy();
    expect(screen.getByTestId('matches-grid-2')).toBeTruthy();
    expect(screen.getByText('League: La Liga')).toBeTruthy();
    expect(screen.getByText('League: Premier League')).toBeTruthy();
  });

  it('should render SubHeader and Controls when leagues are available', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByText('Matches')).toBeTruthy();
    expect(screen.getByTestId('controls')).toBeTruthy();
  });

  it('should render date picker label', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('date-picker-label')).toBeTruthy();
  });

  it('should render time range selector', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('time-range-label')).toBeTruthy();
  });

  it('should render date picker label even when loading', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({ loadingMatches: true })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('date-picker-label')).toBeTruthy();
    expect(screen.getByTestId('time-range-label')).toBeTruthy();
  });

  it('should handle country selection change', () => {
    const mockSetCountry = jest.fn();
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
        selectedCountry: 'England',
        setSelectedCountry: mockSetCountry,
        countries: ['Worldwide', 'Spain', 'England', 'France'],
      })
    );
    render(<Matches apiService={mockApiService} />);
    const countrySelector = screen.getByTestId('country-selector');
    fireEvent.press(countrySelector);
    expect(mockSetCountry).toHaveBeenCalledWith('France');
  });

  it('should render country control with all available options', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
        countries: ['Worldwide', 'Spain', 'England'],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('controls-label')).toBeTruthy();
    expect(screen.getByText('Country')).toBeTruthy();
  });

  it('should not render NoData and MatchesGrid simultaneously', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        loadingMatches: false,
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('matches-grid-1')).toBeTruthy();
    expect(screen.queryByTestId('no-data')).toBeNull();
  });

  it('should handle empty league matches when available', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [],
      })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.queryByTestId(/matches-grid/)).toBeNull();
    expect(screen.queryByTestId('no-data')).toBeNull();
  });

  it('should pass correct props to Controls', () => {
    const mockSetCountry = jest.fn();
    const mockSetDate = jest.fn();
    const mockSetTimeRangeIndex = jest.fn();

    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({
        isLeagueMatchesAvailable: true,
        leagueMatches: [{ leagueId: 1, leagueName: 'La Liga', leagueLogo: null, matches: [] }],
        selectedCountry: 'Spain',
        setSelectedCountry: mockSetCountry,
        selectedDate: '2024-02-15',
        setSelectedDate: mockSetDate,
        selectedTimeRangeIndex: 1,
        setSelectedTimeRangeIndex: mockSetTimeRangeIndex,
      })
    );

    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('controls')).toBeTruthy();
    expect(screen.getByText('Spain')).toBeTruthy();
  });

  it('should render the outer screen container', () => {
    mockUseMatchesStatus.mockReturnValue(
      createMockMatchesStatus({ loadingMatches: true })
    );
    render(<Matches apiService={mockApiService} />);
    expect(screen.getByTestId('matches-screen')).toBeTruthy();
  });
});
