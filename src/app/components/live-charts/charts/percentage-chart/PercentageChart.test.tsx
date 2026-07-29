import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PercentageChart from './PercentageChart';
import { LiveChartPoint } from '@matchinsights/core';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    Rect: (props: any) => <View {...props} />,
    Line: (props: any) => <View {...props} />,
    Path: (props: any) => <View {...props} />,
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

const points: LiveChartPoint[] = [
  { minute: 5, value: 80, capturedAt: '2026-06-24T15:05:00Z' },
  { minute: 30, value: 35, capturedAt: '2026-06-24T15:30:00Z' },
  { minute: 60, value: 50, capturedAt: '2026-06-24T16:00:00Z' },
];

const brand = {
  home: '#f97316',
  away: '#ffc61a',
  darkBg: '#1e1e1e',
  divider: '#333333',
};

const homeTeamName = 'Arsenal';
const awayTeamName = 'Chelsea';

describe('PercentageChart', () => {
  it('draws a horizontal center line at the midpoint value', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const centerLine = screen.getByTestId('percentage-chart-center-line');
    expect(centerLine).toHaveProp('y1', 110);
    expect(centerLine).toHaveProp('y2', 110);
  });

  it('renders an svg with the expected width, height and viewBox', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const svg = screen.getByTestId('percentage-chart');
    expect(svg).toHaveProp('width', 1990);
    expect(svg).toHaveProp('height', 250);
    expect(svg).toHaveProp('viewBox', '0 0 1990 250');
  });

  it('spreads points sharing a minute across distinct x positions instead of collapsing them', () => {
    render(
      <PercentageChart
        points={[
          { minute: 30, value: 60, capturedAt: '2026-06-24T15:30:00Z' },
          { minute: 30, value: 40, capturedAt: '2026-06-24T15:30:05Z' },
        ]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('percentage-chart-path-home')).toHaveProp(
      'd',
      'M 470.00 94.00 L 477.50 126.00',
    );
  });

  it('renders no paths when there are 0 points', () => {
    render(
      <PercentageChart points={[]} brand={brand} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />,
    );

    expect(screen.queryByTestId('percentage-chart-path-home')).toBeNull();
    expect(screen.queryByTestId('percentage-chart-path-away')).toBeNull();
  });

  it('renders a home path and an away path connecting all points in order', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const toCommands = (d: string) => d.trim().split(' ').filter((c) => c === 'M' || c === 'L');
    expect(toCommands(screen.getByTestId('percentage-chart-path-home').props.d)).toEqual([
      'M',
      'L',
      'L',
    ]);
    expect(toCommands(screen.getByTestId('percentage-chart-path-away').props.d)).toEqual([
      'M',
      'L',
      'L',
    ]);
  });

  it('derives the away line as the complement of the home value (100 - value)', () => {
    render(
      <PercentageChart
        points={[{ minute: 5, value: 80, capturedAt: '2026-06-24T15:05:00Z' }]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('percentage-chart-path-home')).toHaveProp('d', 'M 95.00 62.00');
    expect(screen.getByTestId('percentage-chart-path-away')).toHaveProp('d', 'M 95.00 158.00');
  });

  it('uses the injected brand colors for background, divider, home line and away line', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('percentage-chart-background')).toHaveProp('fill', brand.darkBg);
    expect(screen.getByTestId('percentage-chart-center-line')).toHaveProp('stroke', brand.divider);
    expect(screen.getByTestId('percentage-chart-path-home')).toHaveProp('stroke', brand.home);
    expect(screen.getByTestId('percentage-chart-path-away')).toHaveProp('stroke', brand.away);
  });

  it('colors the home team name with the home color and the away team name with the away color', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('percentage-chart-team-name-home')).toHaveProp('fill', brand.home);
    expect(screen.getByTestId('percentage-chart-team-name-away')).toHaveProp('fill', brand.away);
  });

  it('draws a time-axis gridline and label for each captured point\'s minute', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const ticks = screen.getAllByTestId('percentage-chart-tick');
    const tickLabels = screen.getAllByTestId('percentage-chart-tick-label');
    expect(ticks).toHaveLength(points.length);
    expect(tickLabels).toHaveLength(points.length);
    expect(tickLabels[0]).toHaveTextContent("5'");
  });

  it('shows value labels at the latest point, pushed apart when they collide', () => {
    render(
      <PercentageChart
        points={[{ minute: 60, value: 50, capturedAt: '2026-06-24T16:00:00Z' }]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const homeLabel = screen.getByTestId('percentage-chart-latest-label-home');
    const awayLabel = screen.getByTestId('percentage-chart-latest-label-away');
    const homeY = Number(homeLabel.props.y);
    const awayY = Number(awayLabel.props.y);
    expect(Math.abs(awayY - homeY)).toBeGreaterThanOrEqual(10);
  });

  it('renders a toggle pill for each team, both selected by default', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('percentage-chart-toggle-home')).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByTestId('percentage-chart-toggle-away')).toHaveProp('accessibilityState', {
      selected: true,
    });
  });

  it('pressing the home toggle hides only the home line', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    fireEvent.press(screen.getByTestId('percentage-chart-toggle-home'));

    expect(screen.queryByTestId('percentage-chart-path-home')).toBeNull();
    expect(screen.getByTestId('percentage-chart-path-away')).toBeTruthy();
    expect(screen.getByTestId('percentage-chart-toggle-home')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('pressing the away toggle hides only the away line', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    fireEvent.press(screen.getByTestId('percentage-chart-toggle-away'));

    expect(screen.queryByTestId('percentage-chart-path-away')).toBeNull();
    expect(screen.getByTestId('percentage-chart-path-home')).toBeTruthy();
    expect(screen.getByTestId('percentage-chart-toggle-away')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('pressing a toggle twice restores that line', () => {
    render(
      <PercentageChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const homeToggle = screen.getByTestId('percentage-chart-toggle-home');
    fireEvent.press(homeToggle);
    fireEvent.press(homeToggle);

    expect(screen.getByTestId('percentage-chart-path-home')).toBeTruthy();
    expect(screen.getByTestId('percentage-chart-toggle-home')).toHaveProp('accessibilityState', {
      selected: true,
    });
  });

  describe('responsive canvas width', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('wraps the chart in a horizontal ScrollView', () => {
      render(
        <PercentageChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      expect(screen.getByTestId('percentage-chart-scroll')).toHaveProp('horizontal', true);
    });

    it('stays at the minimum canvas width on a phone-width window', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 2,
      });

      render(
        <PercentageChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('percentage-chart');
      expect(svg).toHaveProp('width', 1990);
      expect(svg).toHaveProp('viewBox', '0 0 1990 250');
    });

    it('stays at the minimum canvas width on a tablet-width window', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 900,
        height: 1200,
        scale: 2,
        fontScale: 1,
      });

      render(
        <PercentageChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('percentage-chart');
      expect(svg).toHaveProp('width', 1990);
      expect(svg).toHaveProp('viewBox', '0 0 1990 250');
    });

    it('grows the canvas past the minimum width on a window wider than the chart', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 2200,
        height: 1080,
        scale: 1,
        fontScale: 1,
      });

      render(
        <PercentageChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('percentage-chart');
      expect(svg).toHaveProp('width', 2200);
      expect(svg).toHaveProp('viewBox', '0 0 2200 250');

      const expectedPixelsPerMinute = (2200 - 20 * 2) / 130;
      const expectedTickX = 20 + 60 * expectedPixelsPerMinute;
      const ticks = screen.getAllByTestId('percentage-chart-tick');
      expect(Number(ticks[2].props.x1)).toBeCloseTo(expectedTickX, 5);
    });
  });
});
