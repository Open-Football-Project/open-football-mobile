import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LiveMatchPieChart from './LiveMatchPieChart';
import { IndicatorResult } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const map: Record<string, string> = {
        'indicators.momentum': 'Momentum',
        'indicators.verdict.no_data': 'No data yet',
        'indicators.verdict.dominating': `${opts?.team ?? ''} dominating`,
        'indicators.verdict.ahead': `${opts?.team ?? ''} ahead`,
        'indicators.verdict.even': 'Contested',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children, testID }: any) => <View testID={testID}>{children}</View>,
    Circle: () => null,
    Line: () => null,
    Text: ({ children }: any) => <Text>{children}</Text>,
  };
});

const baseIndicator: IndicatorResult = {
  emoji: '⚡',
  label: 'indicators.momentum',
  homePercent: 60,
  awayPercent: 40,
};

describe('LiveMatchPieChart', () => {
  it('renders label with emoji and translation', () => {
    render(
      <LiveMatchPieChart
        indicator={baseIndicator}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('⚡ Momentum')).toBeTruthy();
  });

  it('renders the svg element', () => {
    render(
      <LiveMatchPieChart
        indicator={baseIndicator}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
        testID="pie-chart-test"
      />
    );
    expect(screen.getByTestId('pie-chart-test')).toBeTruthy();
  });

  it('shows home leading verdict when homePercent >= 58', () => {
    render(
      <LiveMatchPieChart
        indicator={{ ...baseIndicator, homePercent: 65, awayPercent: 35 }}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('Home FC ahead')).toBeTruthy();
  });

  it('shows dominating verdict when homePercent >= 70', () => {
    render(
      <LiveMatchPieChart
        indicator={{ ...baseIndicator, homePercent: 75, awayPercent: 25 }}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('Home FC dominating')).toBeTruthy();
  });

  it('shows away leading verdict when homePercent <= 42', () => {
    render(
      <LiveMatchPieChart
        indicator={{ ...baseIndicator, homePercent: 35, awayPercent: 65 }}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('Away FC ahead')).toBeTruthy();
  });

  it('shows contested verdict when homePercent is near 50', () => {
    render(
      <LiveMatchPieChart
        indicator={{ ...baseIndicator, homePercent: 50, awayPercent: 50 }}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('Contested')).toBeTruthy();
  });

  it('shows no_data verdict when hasData is false', () => {
    render(
      <LiveMatchPieChart
        indicator={{ ...baseIndicator, homePercent: 80, awayPercent: 20 }}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={false}
      />
    );
    expect(screen.getByText('No data yet')).toBeTruthy();
  });

  it('renders legend with team names', () => {
    render(
      <LiveMatchPieChart
        indicator={baseIndicator}
        homeTeamName="Home FC"
        awayTeamName="Away FC"
        hasData={true}
      />
    );
    expect(screen.getByText('Home FC')).toBeTruthy();
    expect(screen.getByText('Away FC')).toBeTruthy();
  });
});
