import React from 'react';
import { render, screen } from '@testing-library/react-native';
import IndicatorsPanel from './IndicatorsPanel';
import { ChartPanel, ChartPanelType } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

jest.mock('../../charts/momentum-oscillator/MomentumOscillatorChart', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({
      points,
      homeTeamName,
      awayTeamName,
    }: {
      points: unknown[];
      homeTeamName: string;
      awayTeamName: string;
    }) => (
      <View testID="momentum-oscillator-chart">
        <Text>{`${homeTeamName}-${awayTeamName}-${points.length}`}</Text>
      </View>
    ),
  };
});

jest.mock('../../charts/percentage-chart/PercentageChart', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({
      points,
      homeTeamName,
      awayTeamName,
      brand,
    }: {
      points: unknown[];
      homeTeamName: string;
      awayTeamName: string;
      brand: { home: string; away: string };
    }) => (
      <View testID="percentage-chart">
        <Text>{`${homeTeamName}-${awayTeamName}-${points.length}-${brand.home}-${brand.away}`}</Text>
      </View>
    ),
  };
});

jest.mock('../../charts/odds/OddsChart', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({
      lines,
      colors,
      brand,
    }: {
      lines: unknown[];
      colors: string[];
      brand: { darkBg: string; divider: string; axisLabel?: string };
    }) => (
      <View testID="odds-chart">
        <Text>{`${lines.length}-${colors.length}-${brand.darkBg}-${brand.divider}-${brand.axisLabel}`}</Text>
      </View>
    ),
  };
});

const momentumPanel: ChartPanel = {
  type: ChartPanelType.Momentum,
  points: [{ minute: 5, value: 20, capturedAt: '2026-06-24T15:05:00Z' }],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
};

const controlPanel: ChartPanel = {
  type: ChartPanelType.Control,
  points: [{ minute: 5, value: 60, capturedAt: '2026-06-24T15:05:00Z' }],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
};

const goalThreatPanel: ChartPanel = {
  type: ChartPanelType.GoalThreat,
  points: [{ minute: 5, value: 70, capturedAt: '2026-06-24T15:05:00Z' }],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
};

const oddsPanel: ChartPanel = {
  type: ChartPanelType.Odds,
  points: [],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
  id: 1,
  title: 'fulltime_result',
  lines: [
    { label: 'Home', points: [{ minute: 5, odd: '1.50', capturedAt: '2026-06-24T15:05:00Z' }] },
    { label: 'Draw', points: [{ minute: 5, odd: '3.20', capturedAt: '2026-06-24T15:05:00Z' }] },
  ],
};

describe('IndicatorsPanel', () => {
  it('renders the localized title for a Momentum panel', () => {
    render(<IndicatorsPanel panel={momentumPanel} />);

    expect(screen.getByText('Live Momentum')).toBeTruthy();
  });

  it("renders MomentumOscillatorChart with the panel's data for a Momentum panel", () => {
    render(<IndicatorsPanel panel={momentumPanel} />);

    expect(screen.getByTestId('momentum-oscillator-chart')).toHaveTextContent('Arsenal-Chelsea-1');
  });

  it('renders the localized title for a Control panel', () => {
    render(<IndicatorsPanel panel={controlPanel} />);

    expect(screen.getByText('Live Control')).toBeTruthy();
  });

  it("renders PercentageChart with the panel's data, using the dedicated percentage-chart colors", () => {
    render(<IndicatorsPanel panel={controlPanel} />);

    expect(screen.getByTestId('percentage-chart')).toHaveTextContent(
      'Arsenal-Chelsea-1-#f97316-#ffc61a',
    );
  });

  it('renders the localized title for a Goal Threat panel', () => {
    render(<IndicatorsPanel panel={goalThreatPanel} />);

    expect(screen.getByText('Live Goal Threat')).toBeTruthy();
  });

  it("renders PercentageChart with the panel's data for a Goal Threat panel, using the dedicated percentage-chart colors", () => {
    render(<IndicatorsPanel panel={goalThreatPanel} />);

    expect(screen.getByTestId('percentage-chart')).toHaveTextContent(
      'Arsenal-Chelsea-1-#f97316-#ffc61a',
    );
  });

  it("renders the market name as the title for an Odds panel", () => {
    render(<IndicatorsPanel panel={oddsPanel} />);

    expect(screen.getByText('fulltime_result')).toBeTruthy();
  });

  it("renders OddsChart with the panel's lines, the odds color palette, and the shared dark brand colors", () => {
    render(<IndicatorsPanel panel={oddsPanel} />);

    expect(screen.getByTestId('odds-chart')).toHaveTextContent('2-8-#121212-#2a2a2a-#9ca3af');
  });

  it('renders OddsChart with an empty lines array when the panel has no lines', () => {
    render(<IndicatorsPanel panel={{ ...oddsPanel, lines: undefined }} />);

    expect(screen.getByTestId('odds-chart')).toHaveTextContent('0-8-#121212-#2a2a2a-#9ca3af');
  });
});
