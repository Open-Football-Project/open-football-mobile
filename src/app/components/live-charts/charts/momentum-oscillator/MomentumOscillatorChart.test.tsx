import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MomentumOscillatorChart from './MomentumOscillatorChart';
import { LiveChartPoint, MomentumOscillatorBrandColor } from '@matchinsights/core';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    Rect: (props: any) => <View {...props} />,
    Line: (props: any) => <View {...props} />,
    Path: (props: any) => <View {...props} />,
    Polyline: (props: any) => <View {...props} />,
    Defs: ({ children }: any) => <>{children}</>,
    ClipPath: ({ children }: any) => <>{children}</>,
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

const points: LiveChartPoint[] = [
  { minute: 5, value: 20, capturedAt: '2026-06-24T15:05:00Z' },
  { minute: 30, value: -40, capturedAt: '2026-06-24T15:30:00Z' },
  { minute: 60, value: 0, capturedAt: '2026-06-24T16:00:00Z' },
];

const brand: MomentumOscillatorBrandColor = {
  positive: '#6faa54',
  negative: '#ff4848',
  darkBg: '#1e1e1e',
  divider: '#333333',
  branding: '#ffc61a',
};

const homeTeamName = 'Arsenal';
const awayTeamName = 'Chelsea';

describe('MomentumOscillatorChart', () => {
  it('renders an svg with the expected width, height and viewBox', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const svg = screen.getByTestId('momentum-oscillator-chart');
    expect(svg).toHaveProp('width', 1990);
    expect(svg).toHaveProp('height', 250);
    expect(svg).toHaveProp('viewBox', '0 0 1990 250');
  });

  it('draws a horizontal neutral line at the vertical center', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const line = screen.getByTestId('momentum-oscillator-center-line');
    expect(line).toHaveProp('y1', 110);
    expect(line).toHaveProp('y2', 110);
  });

  it('spreads points sharing a minute across distinct x positions instead of collapsing them', () => {
    render(
      <MomentumOscillatorChart
        points={[
          { minute: 60, value: 50, capturedAt: '2026-06-24T16:00:00Z' },
          { minute: 60, value: -50, capturedAt: '2026-06-24T16:00:05Z' },
        ]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('momentum-oscillator-path-positive')).toHaveProp(
      'd',
      'M 920.00 70.00 L 927.50 150.00',
    );
  });

  it('renders no path when there are 0 points', () => {
    render(
      <MomentumOscillatorChart points={[]} brand={brand} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />,
    );

    expect(screen.queryByTestId('momentum-oscillator-path-positive')).toBeNull();
    expect(screen.queryByTestId('momentum-oscillator-path-negative')).toBeNull();
  });

  it('renders a positive path and a negative path connecting all points in order', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const toCommands = (d: string) => d.trim().split(' ').filter((c) => c === 'M' || c === 'L');
    expect(toCommands(screen.getByTestId('momentum-oscillator-path-positive').props.d)).toEqual([
      'M',
      'L',
      'L',
    ]);
    expect(toCommands(screen.getByTestId('momentum-oscillator-path-negative').props.d)).toEqual([
      'M',
      'L',
      'L',
    ]);
  });

  it('uses the injected brand colors for background, divider, positive path and negative path', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('momentum-oscillator-background')).toHaveProp('fill', brand.darkBg);
    expect(screen.getByTestId('momentum-oscillator-center-line')).toHaveProp('stroke', brand.divider);
    expect(screen.getByTestId('momentum-oscillator-path-positive')).toHaveProp('stroke', brand.positive);
    expect(screen.getByTestId('momentum-oscillator-path-negative')).toHaveProp('stroke', brand.negative);
  });

  it('colors the home team name with the positive color and the away team name with the negative color', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('momentum-oscillator-team-name-home')).toHaveProp('fill', brand.positive);
    expect(screen.getByTestId('momentum-oscillator-team-name-away')).toHaveProp('fill', brand.negative);
  });

  it("draws a time-axis gridline and label for each captured point's minute", () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    const ticks = screen.getAllByTestId('momentum-oscillator-tick');
    const tickLabels = screen.getAllByTestId('momentum-oscillator-tick-label');
    expect(ticks).toHaveLength(points.length);
    expect(tickLabels).toHaveLength(points.length);
    expect(tickLabels[0]).toHaveTextContent("5'");
  });

  it('draws only one gridline and label per minute when multiple points share the same minute', () => {
    const pointsWithDuplicateMinutes: LiveChartPoint[] = [
      { minute: 45, value: 33, capturedAt: '2026-06-24T19:47:06Z' },
      { minute: 45, value: 17, capturedAt: '2026-06-24T19:50:06Z' },
      { minute: 45, value: -6, capturedAt: '2026-06-24T19:53:06Z' },
      { minute: 90, value: 85, capturedAt: '2026-06-24T20:53:06Z' },
      { minute: 90, value: 83, capturedAt: '2026-06-24T20:59:06Z' },
    ];

    render(
      <MomentumOscillatorChart
        points={pointsWithDuplicateMinutes}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getAllByTestId('momentum-oscillator-tick')).toHaveLength(2);
    expect(screen.getAllByTestId('momentum-oscillator-tick-label')).toHaveLength(2);
  });

  it('shows a dashed reference line and value label at the latest point', () => {
    render(
      <MomentumOscillatorChart
        points={points}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('momentum-oscillator-latest-line')).toHaveProp(
      'points',
      '920.00,110.00 960.00,110.00',
    );
    const label = screen.getByTestId('momentum-oscillator-latest-label');
    expect(label).toHaveTextContent('0');
    expect(label).toHaveProp('y', '110.00');
    expect(label).toHaveProp('fill', brand.positive);
  });

  it('colors the latest-value label negative when the latest value is below zero', () => {
    render(
      <MomentumOscillatorChart
        points={[{ minute: 30, value: -40, capturedAt: '2026-06-24T15:30:00Z' }]}
        brand={brand}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />,
    );

    expect(screen.getByTestId('momentum-oscillator-latest-label')).toHaveProp('fill', brand.negative);
  });

  describe('responsive canvas width', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('wraps the chart in a horizontal ScrollView', () => {
      render(
        <MomentumOscillatorChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      expect(screen.getByTestId('momentum-oscillator-scroll')).toHaveProp('horizontal', true);
    });

    it('stays at the minimum canvas width on a phone-width window', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 2,
      });

      render(
        <MomentumOscillatorChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('momentum-oscillator-chart');
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
        <MomentumOscillatorChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('momentum-oscillator-chart');
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
        <MomentumOscillatorChart
          points={points}
          brand={brand}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />,
      );

      const svg = screen.getByTestId('momentum-oscillator-chart');
      expect(svg).toHaveProp('width', 2200);
      expect(svg).toHaveProp('viewBox', '0 0 2200 250');

      const expectedPixelsPerMinute = (2200 - 20 * 2) / 130;
      const expectedTickX = 20 + 60 * expectedPixelsPerMinute;
      const ticks = screen.getAllByTestId('momentum-oscillator-tick');
      expect(Number(ticks[2].props.x1)).toBeCloseTo(expectedTickX, 5);
    });
  });
});
