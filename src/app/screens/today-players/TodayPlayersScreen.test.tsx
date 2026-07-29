import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useTodayPlayersStatus } from '@matchinsights/core';

import TodayPlayersScreen from './TodayPlayersScreen';

jest.mock('@matchinsights/core', () => ({
  ...jest.requireActual('@matchinsights/core'),
  useTodayPlayersStatus: jest.fn(),
  translateLeague: jest.fn((leagueName: string) => leagueName),
}));

jest.mock('@react-navigation/native');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title }: { title?: string }) => (
      <View testID="sub-header">
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, message }: { loading?: boolean; message?: string }) => (
      <View testID={loading ? 'no-data-loading' : 'no-data'}>
        <Text>{loading ? 'loading' : message}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/general/controls/Controls', () => {
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: ({
      drop0Label,
      drop0Options,
      selectedDrop0,
      setDrop0,
      drop1Label,
      drop1Options,
      selectedDrop1,
      setDrop1,
    }: any) => (
      <View testID="controls">
        <Text testID="drop0-label">{drop0Label}</Text>
        {drop0Options?.map((option: { id: string; value: string }) => (
          <Pressable
            key={option.id}
            testID={`league-option-${option.id}`}
            onPress={() => setDrop0(option.id)}
          >
            <Text>{option.value}</Text>
            <Text testID={`league-option-${option.id}-selected`}>
              {String(option.id === selectedDrop0)}
            </Text>
          </Pressable>
        ))}
        <Text testID="drop1-label">{drop1Label}</Text>
        {drop1Options?.map((option: { id: string; value: string }) => (
          <Pressable
            key={option.id}
            testID={`fixture-option-${option.id}`}
            onPress={() => setDrop1(option.id)}
          >
            <Text>{option.value}</Text>
            <Text testID={`fixture-option-${option.id}-selected`}>
              {String(option.id === selectedDrop1)}
            </Text>
          </Pressable>
        ))}
      </View>
    ),
  };
});

jest.mock('../../components/today-players/today-players-position-row/TodayPlayersPositionRow', () => {
  const { View, Text } = require('react-native');
  return ({ position, homePlayerScores, awayPlayerScores, homeTeamName, awayTeamName }: any) => (
    <View testID={`today-players-position-row-${position}`}>
      <Text>{`ROW/${position}/${homePlayerScores.length}/${awayPlayerScores.length}/${homeTeamName}/${awayTeamName}`}</Text>
    </View>
  );
});

const mockUseRoute = require('@react-navigation/native').useRoute as jest.MockedFunction<any>;
const mockUseTodayPlayersStatus = useTodayPlayersStatus as jest.MockedFunction<
  typeof useTodayPlayersStatus
>;

const mockApiService = {} as any;

const playerScore = (id: number, name: string) => ({
  player: { id, name, age: null, number: null, position: null, photo: null },
  score: 1,
  signal: 'ODDS_IMPLIED' as const,
  reason: { markets: ['Anytime Goal Scorer'] },
});

const emptyStatus = (overrides = {}) => ({
  leagues: [],
  selectedLeagueId: undefined,
  setSelectedLeagueId: jest.fn(),
  fixturesInSelectedLeague: [],
  selectedFixtureId: undefined,
  setSelectedFixtureId: jest.fn(),
  selectedFixture: undefined,
  loadingTodayPlayers: false,
  isTodayPlayersAvailable: false,
  ...overrides,
});

const twoLeaguesTwoFixtures = () => ({
  leagues: [
    { leagueId: 3, leagueName: 'La Liga' },
    { leagueId: 2, leagueName: 'Premier League' },
  ],
  selectedLeagueId: 3,
  fixturesInSelectedLeague: [
    { fixtureId: 201, homeTeamName: 'Real Madrid', awayTeamName: 'Barcelona' },
    { fixtureId: 202, homeTeamName: 'Sevilla', awayTeamName: 'Valencia' },
  ],
  selectedFixtureId: 201,
  selectedFixture: {
    fixtureId: 201,
    leagueId: 3,
    leagueName: 'La Liga',
    homeTeamName: 'Real Madrid',
    awayTeamName: 'Barcelona',
    home: {
      GOALKEEPER: [],
      DEFENDER: [playerScore(1, 'Militao')],
      MIDFIELDER: [playerScore(2, 'Modric')],
      ATTACKER: [playerScore(3, 'Mbappe')],
    },
    away: {
      GOALKEEPER: [],
      DEFENDER: [playerScore(4, 'Araujo')],
      MIDFIELDER: [],
      ATTACKER: [playerScore(5, 'Lewandowski')],
    },
  },
  isTodayPlayersAvailable: true,
});

describe('TodayPlayersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({ params: undefined });
  });

  it('calls useTodayPlayersStatus with apiService and no fixtureId when the route has none', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus());
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(mockUseTodayPlayersStatus).toHaveBeenCalledWith(mockApiService, undefined);
  });

  it('calls useTodayPlayersStatus with apiService and the route fixtureId when present', () => {
    mockUseRoute.mockReturnValue({ params: { fixtureId: '201' } });
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus());
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(mockUseTodayPlayersStatus).toHaveBeenCalledWith(mockApiService, '201');
  });

  it('has the screen-level testID', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus());
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(screen.getByTestId('today-players-screen')).toBeTruthy();
  });

  it('renders the SubHeader with the page title even in the loading and no-data states', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus({ loadingTodayPlayers: true }));
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByText("Today's Players")).toBeTruthy();
  });

  it('shows a loading state and no controls while today-players are loading', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus({ loadingTodayPlayers: true }));
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(screen.getByTestId('no-data-loading')).toBeTruthy();
    expect(screen.queryByTestId('controls')).toBeNull();
  });

  it('shows a not-available state and no controls when nothing is cached', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus());
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
    expect(screen.getByText('No player data available right now')).toBeTruthy();
    expect(screen.queryByTestId('controls')).toBeNull();
  });

  it('renders Controls with league and fixture options and current selections once available', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));
    render(<TodayPlayersScreen apiService={mockApiService} />);

    expect(screen.getByTestId('controls')).toBeTruthy();
    expect(screen.getByText('La Liga')).toBeTruthy();
    expect(screen.getByText('Premier League')).toBeTruthy();
    expect(screen.getByTestId('league-option-3-selected')).toHaveTextContent('true');
    expect(screen.getByTestId('today-players-teams')).toHaveTextContent(
      'Real Madrid vs Barcelona',
    );
    expect(screen.getByText('Sevilla vs Valencia')).toBeTruthy();
    expect(screen.getByTestId('fixture-option-201-selected')).toHaveTextContent('true');
  });

  it('calls setSelectedLeagueId when a league option is pressed', () => {
    const setSelectedLeagueId = jest.fn();
    mockUseTodayPlayersStatus.mockReturnValue(
      emptyStatus({ ...twoLeaguesTwoFixtures(), setSelectedLeagueId }),
    );
    render(<TodayPlayersScreen apiService={mockApiService} />);
    fireEvent.press(screen.getByTestId('league-option-2'));
    expect(setSelectedLeagueId).toHaveBeenCalledWith(2);
  });

  it('calls setSelectedFixtureId when a fixture option is pressed', () => {
    const setSelectedFixtureId = jest.fn();
    mockUseTodayPlayersStatus.mockReturnValue(
      emptyStatus({ ...twoLeaguesTwoFixtures(), setSelectedFixtureId }),
    );
    render(<TodayPlayersScreen apiService={mockApiService} />);
    fireEvent.press(screen.getByTestId('fixture-option-202'));
    expect(setSelectedFixtureId).toHaveBeenCalledWith(202);
  });

  it("renders the resolved fixture's team names and a predicted-before-kickoff disclaimer", () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));
    render(<TodayPlayersScreen apiService={mockApiService} />);

    expect(screen.getByTestId('today-players-teams')).toHaveTextContent(
      'Real Madrid vs Barcelona',
    );
    expect(screen.getByTestId('today-players-disclaimer')).toHaveTextContent(
      'Predicted before kickoff',
    );
  });

  it('renders a fallback state when data is available but no fixture is resolved yet', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus({ isTodayPlayersAvailable: true }));
    render(<TodayPlayersScreen apiService={mockApiService} />);
    expect(screen.getByTestId('today-players-no-fixture')).toBeTruthy();
  });

  it('renders a position row for every position with at least one player on either side, attackers first and goalkeepers last, skipping empty ones', () => {
    mockUseTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));
    render(<TodayPlayersScreen apiService={mockApiService} />);

    expect(screen.getByTestId('today-players-position-row-ATTACKER')).toHaveTextContent(
      'ROW/ATTACKER/1/1/Real Madrid/Barcelona',
    );
    expect(screen.getByTestId('today-players-position-row-MIDFIELDER')).toHaveTextContent(
      'ROW/MIDFIELDER/1/0/Real Madrid/Barcelona',
    );
    expect(screen.getByTestId('today-players-position-row-DEFENDER')).toHaveTextContent(
      'ROW/DEFENDER/1/1/Real Madrid/Barcelona',
    );
    expect(screen.queryByTestId('today-players-position-row-GOALKEEPER')).toBeNull();
  });

  it('renders no position rows when neither side has players at any position', () => {
    const fixtures = twoLeaguesTwoFixtures();
    mockUseTodayPlayersStatus.mockReturnValue(
      emptyStatus({
        ...fixtures,
        selectedFixture: {
          ...fixtures.selectedFixture,
          home: { GOALKEEPER: [], DEFENDER: [], MIDFIELDER: [], ATTACKER: [] },
          away: { GOALKEEPER: [], DEFENDER: [], MIDFIELDER: [], ATTACKER: [] },
        },
      }),
    );
    render(<TodayPlayersScreen apiService={mockApiService} />);

    expect(screen.queryByTestId('today-players-position-row-ATTACKER')).toBeNull();
    expect(screen.queryByTestId('today-players-position-row-MIDFIELDER')).toBeNull();
    expect(screen.queryByTestId('today-players-position-row-DEFENDER')).toBeNull();
    expect(screen.queryByTestId('today-players-position-row-GOALKEEPER')).toBeNull();
  });
});
