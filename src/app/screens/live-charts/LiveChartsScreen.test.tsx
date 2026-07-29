import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import {
  useChartsPageStatus,
  useCharteableOddsStatus,
  useBetMarkets,
  BetMarketInfo,
} from 'open-football-project-core';

import LiveChartsScreen from './LiveChartsScreen';

jest.mock('open-football-project-core');
jest.mock('@react-navigation/native');
jest.mock('react-native-sse', () => jest.fn().mockImplementation(() => ({})));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
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

jest.mock('../../components/general/controls/Controls', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: ({ drop0Label, drop0Options, selectedDrop0, setDrop0 }: any) => (
      <View testID="controls">
        <Text testID="controls-label">{drop0Label}</Text>
        {drop0Options?.map((option: { id: string; value: string }) => (
          <Pressable
            key={option.id}
            testID={`chart-match-option-${option.id}`}
            onPress={() => setDrop0(option.id)}
          >
            <Text>{option.value}</Text>
            <Text testID={`chart-match-option-${option.id}-selected`}>
              {String(option.id === selectedDrop0)}
            </Text>
          </Pressable>
        ))}
      </View>
    ),
  };
});

jest.mock('../../components/general/no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, message }: any) => (
      <View testID={loading ? 'no-data-loading' : 'no-data'}>
        <Text>{loading ? 'loading' : message}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/live-charts/panels/Panels', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ panels }: any) => (
      <View testID="panels">
        {panels.map((panel: any, index: number) => (
          <View key={index}>
            <Text testID={`panel-${index}`}>
              {`${panel.type}-${panel.homeTeamName}-${panel.awayTeamName}-${panel.points.length}`}
            </Text>
            <Text testID={`panel-${index}-title`}>{panel.title ?? ''}</Text>
            <Text testID={`panel-${index}-lines`}>{panel.lines?.length ?? 0}</Text>
          </View>
        ))}
      </View>
    ),
  };
});

jest.mock('../../components/live-charts/panels/odds/OddsMarketMenu', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: ({ markets, enabledMarketNames, onToggleMarket, onClose }: any) => (
      <View testID="odds-market-menu">
        {markets.map((market: any) => (
          <Pressable
            key={market.id}
            testID={`menu-toggle-${market.name}`}
            onPress={() => onToggleMarket(market.name)}
          >
            <Text testID={`menu-toggle-${market.name}-selected`}>
              {String(enabledMarketNames.includes(market.name))}
            </Text>
          </Pressable>
        ))}
        <Pressable testID="menu-close" onPress={onClose}>
          <Text>close</Text>
        </Pressable>
      </View>
    ),
  };
});

const mockUseRoute = require('@react-navigation/native').useRoute as jest.MockedFunction<any>;
const mockUseChartsPageStatus = useChartsPageStatus as jest.MockedFunction<
  typeof useChartsPageStatus
>;
const mockUseCharteableOddsStatus = useCharteableOddsStatus as jest.MockedFunction<
  typeof useCharteableOddsStatus
>;
const mockUseBetMarkets = useBetMarkets as jest.MockedFunction<typeof useBetMarkets>;

const mockApiService = {} as any;
const testApiHost = 'https://test-api.example';

const baseStatus = {
  chartMatches: [],
  effectiveFixtureId: undefined,
  setEffectiveFixtureId: jest.fn(),
  loadingChartMatches: false,
  isChartNotAvailable: false,
  homeTeamName: undefined,
  awayTeamName: undefined,
  momentumPoints: [],
  controlPoints: [],
  goalThreatPoints: [],
};

const baseOddsStatus = {
  oddsMatches: [],
  effectiveFixtureId: undefined,
  setEffectiveFixtureId: jest.fn(),
  isOddsNotAvailable: true,
  homeTeamName: undefined,
  awayTeamName: undefined,
  oddsEventReceivedAt: 0,
};

const baseBetMarkets = {
  betMarketGroups: [],
  loadingBetMarkets: false,
  isBetMarketsAvailable: false,
};

const matches = [
  { fixtureId: 1, homeTeamName: 'Arsenal', awayTeamName: 'Chelsea', indicators: {} },
  { fixtureId: 2, homeTeamName: 'Liverpool', awayTeamName: 'City', indicators: {} },
];

const oddsMatches = [
  { fixtureId: 3, homeTeamName: 'PSG', awayTeamName: 'Bayern', indicators: {} },
  { fixtureId: 4, homeTeamName: 'Real', awayTeamName: 'Barca', indicators: {} },
];

describe('LiveChartsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({ params: undefined });
    mockUseCharteableOddsStatus.mockReturnValue(baseOddsStatus);
    mockUseBetMarkets.mockReturnValue(baseBetMarkets);
  });

  it('has the screen-level testID', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('live-charts-screen')).toBeTruthy();
  });

  it('wraps its content in a vertically scrollable container', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('live-charts-scroll')).toBeTruthy();
    expect(screen.getByTestId('live-charts-scroll')).not.toHaveProp('horizontal', true);
  });

  it('renders a SubHeader with the page title, matching every other screen', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
    expect(screen.getByText('Live Football Charts')).toBeTruthy();
  });

  it('renders the SubHeader even in the loading and no-data states', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, loadingChartMatches: true });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('sub-header')).toBeTruthy();
  });

  it('shows loading state', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, loadingChartMatches: true });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('no-data-loading')).toBeTruthy();
  });

  it('shows empty state when no chartable matches', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, isChartNotAvailable: true });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('passes the fixtureId route param into useChartsPageStatus', () => {
    mockUseRoute.mockReturnValue({ params: { fixtureId: '2' } });
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(mockUseChartsPageStatus).toHaveBeenCalledWith(
      testApiHost,
      expect.any(Number),
      '2',
      expect.any(Function),
    );
  });

  it('renders a picker option for each chartable match', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByText('Arsenal vs Chelsea')).toBeTruthy();
    expect(screen.getByText('Liverpool vs City')).toBeTruthy();
  });

  it('reflects effectiveFixtureId as the selected option', () => {
    mockUseChartsPageStatus.mockReturnValue({
      ...baseStatus,
      chartMatches: matches,
      effectiveFixtureId: 2,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('chart-match-option-2-selected')).toHaveTextContent('true');
    expect(screen.getByTestId('chart-match-option-1-selected')).toHaveTextContent('false');
  });

  it('calls setEffectiveFixtureId when a different match is selected', () => {
    const setEffectiveFixtureId = jest.fn();
    mockUseChartsPageStatus.mockReturnValue({
      ...baseStatus,
      chartMatches: matches,
      effectiveFixtureId: 1,
      setEffectiveFixtureId,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
    fireEvent.press(screen.getByTestId('chart-match-option-2'));
    expect(setEffectiveFixtureId).toHaveBeenCalledWith(2);
  });

  it('renders a Momentum, Control, and Goal Threat panel from the live status data, stacked together', () => {
    mockUseChartsPageStatus.mockReturnValue({
      ...baseStatus,
      chartMatches: matches,
      homeTeamName: 'Arsenal',
      awayTeamName: 'Chelsea',
      momentumPoints: [{ minute: 5, value: 20, capturedAt: '2026-06-24T15:05:00Z' }],
      controlPoints: [{ minute: 5, value: 60, capturedAt: '2026-06-24T15:05:00Z' }],
      goalThreatPoints: [{ minute: 5, value: 70, capturedAt: '2026-06-24T15:05:00Z' }],
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('panel-0')).toHaveTextContent('momentum-Arsenal-Chelsea-1');
    expect(screen.getByTestId('panel-1')).toHaveTextContent('control-Arsenal-Chelsea-1');
    expect(screen.getByTestId('panel-2')).toHaveTextContent('goal_threat-Arsenal-Chelsea-1');
  });

  it('does not render the panels when the home/away team names have not resolved yet', () => {
    mockUseChartsPageStatus.mockReturnValue({
      ...baseStatus,
      chartMatches: matches,
      homeTeamName: undefined,
      awayTeamName: undefined,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.queryByTestId('panels')).toBeNull();
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders an Odds mode toggle and an Indicators mode toggle', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('mode-toggle-odds')).toBeTruthy();
    expect(screen.getByTestId('mode-toggle-indicators')).toBeTruthy();
  });

  it('defaults to Odds mode when odds data is available', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('mode-toggle-odds')).toHaveProp('accessibilityState', { selected: true });
    expect(screen.getByTestId('mode-toggle-indicators')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('falls back to Indicators mode when odds data is not available but indicator data is', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('mode-toggle-indicators')).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByTestId('mode-toggle-odds')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('passes the fixtureId route param, apiHost and apiMock into useCharteableOddsStatus and useBetMarkets', () => {
    mockUseRoute.mockReturnValue({ params: { fixtureId: '2' } });
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(mockUseCharteableOddsStatus).toHaveBeenCalledWith(
      testApiHost,
      expect.any(Number),
      '2',
      expect.any(Function),
    );
    expect(mockUseBetMarkets).toHaveBeenCalledWith(mockApiService, undefined, 0);
  });

  it('shows the odds match options in Odds mode, and switches to the indicators match options when Indicators is pressed', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByText('PSG vs Bayern')).toBeTruthy();
    expect(screen.queryByText('Arsenal vs Chelsea')).toBeNull();

    fireEvent.press(screen.getByTestId('mode-toggle-indicators'));

    expect(screen.getByText('Arsenal vs Chelsea')).toBeTruthy();
    expect(screen.queryByText('PSG vs Bayern')).toBeNull();
  });

  it('renders one Odds panel per available bet market when in Odds mode', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
      homeTeamName: 'PSG',
      awayTeamName: 'Bayern',
    });
    mockUseBetMarkets.mockReturnValue({
      ...baseBetMarkets,
      betMarketGroups: [
        [
          {
            id: 1,
            name: 'fulltime_result',
            history: { Home: [{ minute: 5, odd: '1.50', capturedAt: 't' }] },
          },
          {
            id: 2,
            name: 'both_teams_to_score',
            history: { Yes: [{ minute: 5, odd: '2.10', capturedAt: 't' }] },
          },
        ],
      ],
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('panel-0')).toHaveTextContent('odds-PSG-Bayern-0');
    expect(screen.getByTestId('panel-0-title')).toHaveTextContent('fulltime_result');
    expect(screen.getByTestId('panel-0-lines')).toHaveTextContent('1');
    expect(screen.getByTestId('panel-1-title')).toHaveTextContent('both_teams_to_score');
  });

  it('does not render odds panels when the odds home/away team names have not resolved yet', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
      homeTeamName: undefined,
      awayTeamName: undefined,
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.queryByTestId('panels')).toBeNull();
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('shows the no-data empty state only when both odds and indicators have no matches available', () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, isChartNotAvailable: true });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      isOddsNotAvailable: false,
      oddsMatches,
      homeTeamName: 'PSG',
      awayTeamName: 'Bayern',
    });
    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.queryByTestId('no-data')).toBeNull();
    expect(screen.getByTestId('mode-toggle-odds')).toBeTruthy();
    expect(screen.getByTestId('panels')).toBeTruthy();
  });

  const fourMarketGroups: BetMarketInfo[][] = [
    [
      { id: 1, name: 'fulltime_result', history: { Home: [{ minute: 5, odd: '1.50', capturedAt: 't' }] } },
      { id: 2, name: 'both_teams_to_score', history: { Yes: [{ minute: 5, odd: '2.10', capturedAt: 't' }] } },
      { id: 3, name: 'draw_no_bet', history: { Home: [{ minute: 5, odd: '1.20', capturedAt: 't' }] } },
      { id: 4, name: 'double_chance', history: { '1X': [{ minute: 5, odd: '1.10', capturedAt: 't' }] } },
    ],
  ];

  const renderInOddsModeWithMarkets = () => {
    mockUseChartsPageStatus.mockReturnValue({ ...baseStatus, chartMatches: matches });
    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
      homeTeamName: 'PSG',
      awayTeamName: 'Bayern',
    });
    mockUseBetMarkets.mockReturnValue({ ...baseBetMarkets, betMarketGroups: fourMarketGroups });
    return render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);
  };

  it('renders Odds panels only for the default-enabled markets, not every available market', () => {
    renderInOddsModeWithMarkets();

    expect(screen.getByTestId('panel-0-title')).toHaveTextContent('fulltime_result');
    expect(screen.getByTestId('panel-1-title')).toHaveTextContent('both_teams_to_score');
    expect(screen.getByTestId('panel-2-title')).toHaveTextContent('draw_no_bet');
    expect(screen.queryByTestId('panel-3')).toBeNull();
  });

  it('shows a market menu toggle button only in Odds mode', () => {
    renderInOddsModeWithMarkets();
    expect(screen.getByTestId('odds-market-menu-toggle')).toBeTruthy();

    fireEvent.press(screen.getByTestId('mode-toggle-indicators'));
    expect(screen.queryByTestId('odds-market-menu-toggle')).toBeNull();
  });

  it('opens the market menu when its toggle button is pressed', () => {
    renderInOddsModeWithMarkets();

    expect(screen.queryByTestId('odds-market-menu')).toBeNull();
    fireEvent.press(screen.getByTestId('odds-market-menu-toggle'));
    expect(screen.getByTestId('odds-market-menu')).toBeTruthy();
  });

  it('closes the market menu when its onClose callback fires', () => {
    renderInOddsModeWithMarkets();

    fireEvent.press(screen.getByTestId('odds-market-menu-toggle'));
    fireEvent.press(screen.getByTestId('menu-close'));
    expect(screen.queryByTestId('odds-market-menu')).toBeNull();
  });

  it('adds a panel for a market enabled via the menu, and removes one for a market disabled via the menu', () => {
    renderInOddsModeWithMarkets();
    fireEvent.press(screen.getByTestId('odds-market-menu-toggle'));

    fireEvent.press(screen.getByTestId('menu-toggle-double_chance'));
    fireEvent.press(screen.getByTestId('menu-toggle-draw_no_bet'));

    expect(screen.getByTestId('panel-0-title')).toHaveTextContent('fulltime_result');
    expect(screen.getByTestId('panel-1-title')).toHaveTextContent('both_teams_to_score');
    expect(screen.getByTestId('panel-2-title')).toHaveTextContent('double_chance');
    expect(screen.queryByTestId('panel-3')).toBeNull();
  });

  it('resets the enabled markets to the default set when the effective odds fixture changes', () => {
    renderInOddsModeWithMarkets();
    fireEvent.press(screen.getByTestId('odds-market-menu-toggle'));
    fireEvent.press(screen.getByTestId('menu-toggle-draw_no_bet'));

    mockUseCharteableOddsStatus.mockReturnValue({
      ...baseOddsStatus,
      oddsMatches,
      isOddsNotAvailable: false,
      homeTeamName: 'Real',
      awayTeamName: 'Barca',
      effectiveFixtureId: 4,
    });
    mockUseBetMarkets.mockReturnValue({ ...baseBetMarkets, betMarketGroups: fourMarketGroups });

    render(<LiveChartsScreen apiService={mockApiService} apiHost={testApiHost} />);

    expect(screen.getByTestId('panel-0-title')).toHaveTextContent('fulltime_result');
    expect(screen.getByTestId('panel-1-title')).toHaveTextContent('both_teams_to_score');
    expect(screen.getByTestId('panel-2-title')).toHaveTextContent('draw_no_bet');
    expect(screen.queryByTestId('panel-3')).toBeNull();
  });
});
