import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import OddsChart from './OddsChart';
import { BetOddsPoint } from 'open-football-project-core';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    Rect: (props: any) => <View {...props} />,
    Line: (props: any) => <View {...props} />,
    Path: (props: any) => <View {...props} />,
    Polyline: (props: any) => <View {...props} />,
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

const point = (minute: number, odd: string, capturedAt: string): BetOddsPoint => ({
  minute,
  odd,
  capturedAt,
});

const brand = {
  darkBg: '#1e1e1e',
  divider: '#333333',
};

const colors = ['#3987e5', '#199e70', '#c98500', '#008300', '#9085e9'];

describe('OddsChart', () => {
  it('renders an svg with the expected width, height and viewBox', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    const svg = screen.getByTestId('odds-chart');
    expect(svg).toHaveProp('width', 1990);
    expect(svg).toHaveProp('height', 250);
    expect(svg).toHaveProp('viewBox', '0 0 1990 250');
  });

  it('uses the injected brand colors for background and baseline', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    expect(screen.getByTestId('odds-chart-background')).toHaveProp('fill', brand.darkBg);
    expect(screen.getByTestId('odds-chart-baseline')).toHaveProp('stroke', brand.divider);
  });

  it('draws the baseline at the vertical center of the plot area', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    const baseline = screen.getByTestId('odds-chart-baseline');
    expect(baseline).toHaveProp('y1', 110);
    expect(baseline).toHaveProp('y2', 110);
  });

  it('draws a time-axis gridline and label for each unique minute across all lines', () => {
    render(
      <OddsChart
        lines={[
          { label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] },
          { label: 'Draw', points: [point(30, '3.40', '2026-06-24T15:30:00Z')] },
        ]}
        colors={colors}
        brand={brand}
      />,
    );

    const ticks = screen.getAllByTestId('odds-chart-tick');
    const tickLabels = screen.getAllByTestId('odds-chart-tick-label');
    expect(ticks).toHaveLength(2);
    expect(tickLabels).toHaveLength(2);
    expect(tickLabels[0]).toHaveTextContent("5'");
    expect(tickLabels[1]).toHaveTextContent("30'");
  });

  it('renders no path for a line with 0 points', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [] }]}
        colors={colors}
        brand={brand}
      />,
    );

    expect(screen.queryByTestId('odds-chart-path-0')).toBeNull();
  });

  it('renders a path for each of the first 4 lines by default, colored from the injected palette', () => {
    render(
      <OddsChart
        lines={[
          { label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] },
          { label: 'Draw', points: [point(5, '3.40', '2026-06-24T15:05:00Z')] },
        ]}
        colors={colors}
        brand={brand}
      />,
    );

    expect(screen.getByTestId('odds-chart-path-0')).toHaveProp('stroke', colors[0]);
    expect(screen.getByTestId('odds-chart-path-1')).toHaveProp('stroke', colors[1]);
  });

  it('does not render a path for lines beyond the first 4, hidden by default', () => {
    const lines = ['A', 'B', 'C', 'D', 'E'].map((label, index) => ({
      label,
      points: [point(5, String(2 + index), '2026-06-24T15:05:00Z')],
    }));

    render(<OddsChart lines={lines} colors={colors} brand={brand} />);

    expect(screen.getByTestId('odds-chart-path-0')).toBeTruthy();
    expect(screen.getByTestId('odds-chart-path-3')).toBeTruthy();
    expect(screen.queryByTestId('odds-chart-path-4')).toBeNull();
  });

  it('spreads points sharing a minute within one line across distinct x positions instead of collapsing them', () => {
    render(
      <OddsChart
        lines={[
          {
            label: 'Home',
            points: [
              point(30, '2.00', '2026-06-24T15:30:00Z'),
              point(30, '4.00', '2026-06-24T15:30:05Z'),
            ],
          },
        ]}
        colors={colors}
        brand={brand}
      />,
    );

    const toCommands = (d: string) => d.trim().split(' ').filter((c) => c === 'M' || c === 'L');
    expect(toCommands(screen.getByTestId('odds-chart-path-0').props.d)).toEqual(['M', 'L']);
  });

  it('draws a single point at the vertical center of the usable plot height (flat log range)', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    expect(screen.getByTestId('odds-chart-path-0')).toHaveProp('d', 'M 95.00 110.00');
  });

  it('draws a line with a higher odd value higher on the chart (smaller y) than a line with a lower odd value', () => {
    render(
      <OddsChart
        lines={[
          { label: 'Low', points: [point(5, '2.00', '2026-06-24T15:05:00Z')] },
          { label: 'High', points: [point(5, '4.00', '2026-06-24T15:05:00Z')] },
        ]}
        colors={colors}
        brand={brand}
      />,
    );

    const lowD = screen.getByTestId('odds-chart-path-0').props.d as string;
    const highD = screen.getByTestId('odds-chart-path-1').props.d as string;
    const lowY = Number(lowD.split(' ')[2]);
    const highY = Number(highD.split(' ')[2]);
    expect(highY).toBeLessThan(lowY);
  });

  it('renders a toggle pill for every line, selected only for the first 4 by default', () => {
    const lines = ['A', 'B', 'C', 'D', 'E'].map((label, index) => ({
      label,
      points: [point(5, String(2 + index), '2026-06-24T15:05:00Z')],
    }));

    render(<OddsChart lines={lines} colors={colors} brand={brand} />);

    expect(screen.getByTestId('odds-chart-toggle-0')).toHaveProp('accessibilityState', { selected: true });
    expect(screen.getByTestId('odds-chart-toggle-3')).toHaveProp('accessibilityState', { selected: true });
    expect(screen.getByTestId('odds-chart-toggle-4')).toHaveProp('accessibilityState', { selected: false });
  });

  it('pressing a hidden line\'s toggle shows its path', () => {
    const lines = ['A', 'B', 'C', 'D', 'E'].map((label, index) => ({
      label,
      points: [point(5, String(2 + index), '2026-06-24T15:05:00Z')],
    }));

    render(<OddsChart lines={lines} colors={colors} brand={brand} />);

    fireEvent.press(screen.getByTestId('odds-chart-toggle-4'));

    expect(screen.getByTestId('odds-chart-path-4')).toBeTruthy();
    expect(screen.getByTestId('odds-chart-toggle-4')).toHaveProp('accessibilityState', { selected: true });
  });

  it('pressing a visible line\'s toggle hides its path', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    fireEvent.press(screen.getByTestId('odds-chart-toggle-0'));

    expect(screen.queryByTestId('odds-chart-path-0')).toBeNull();
    expect(screen.getByTestId('odds-chart-toggle-0')).toHaveProp('accessibilityState', { selected: false });
  });

  it('pressing a toggle twice restores that line\'s path', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    const toggle = screen.getByTestId('odds-chart-toggle-0');
    fireEvent.press(toggle);
    fireEvent.press(toggle);

    expect(screen.getByTestId('odds-chart-path-0')).toBeTruthy();
    expect(screen.getByTestId('odds-chart-toggle-0')).toHaveProp('accessibilityState', { selected: true });
  });

  it('shows a latest-value dashed line and label for each visible line with points', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    expect(screen.getByTestId('odds-chart-latest-line-0')).toBeTruthy();
    const label = screen.getByTestId('odds-chart-latest-label-0');
    expect(label).toHaveTextContent('2.10');
    expect(label).toHaveProp('fill', colors[0]);
  });

  it('does not show a latest-value label for a line hidden by its toggle', () => {
    render(
      <OddsChart
        lines={[{ label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] }]}
        colors={colors}
        brand={brand}
      />,
    );

    fireEvent.press(screen.getByTestId('odds-chart-toggle-0'));

    expect(screen.queryByTestId('odds-chart-latest-label-0')).toBeNull();
  });

  describe('responsive canvas width', () => {
    const threeMinuteLines = [
      { label: 'Home', points: [point(5, '2.10', '2026-06-24T15:05:00Z')] },
      { label: 'Draw', points: [point(30, '3.40', '2026-06-24T15:30:00Z')] },
      { label: 'Away', points: [point(60, '4.50', '2026-06-24T16:00:00Z')] },
    ];

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('wraps the chart in a horizontal ScrollView', () => {
      render(<OddsChart lines={threeMinuteLines} colors={colors} brand={brand} />);

      expect(screen.getByTestId('odds-chart-scroll')).toHaveProp('horizontal', true);
    });

    it('stays at the minimum canvas width on a phone-width window', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 2,
      });

      render(<OddsChart lines={threeMinuteLines} colors={colors} brand={brand} />);

      const svg = screen.getByTestId('odds-chart');
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

      render(<OddsChart lines={threeMinuteLines} colors={colors} brand={brand} />);

      const svg = screen.getByTestId('odds-chart');
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

      render(<OddsChart lines={threeMinuteLines} colors={colors} brand={brand} />);

      const svg = screen.getByTestId('odds-chart');
      expect(svg).toHaveProp('width', 2200);
      expect(svg).toHaveProp('viewBox', '0 0 2200 250');

      const expectedPixelsPerMinute = (2200 - 20 * 2) / 130;
      const expectedTickX = 20 + 60 * expectedPixelsPerMinute;
      const ticks = screen.getAllByTestId('odds-chart-tick');
      expect(Number(ticks[2].props.x1)).toBeCloseTo(expectedTickX, 5);
    });
  });
});
