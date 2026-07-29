import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Panels from './Panels';
import { ChartPanel, ChartPanelType } from '@matchinsights/core';

jest.mock('./indicators-panel/IndicatorsPanel', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ panel }: { panel: ChartPanel }) => (
      <View testID="indicators-panel">
        <Text>{panel.homeTeamName}</Text>
      </View>
    ),
  };
});

const momentumPanel: ChartPanel = {
  type: ChartPanelType.Momentum,
  points: [],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
};

const controlPanel: ChartPanel = {
  type: ChartPanelType.Control,
  points: [],
  homeTeamName: 'Man City',
  awayTeamName: 'Liverpool',
};

const oddsPanelA: ChartPanel = {
  type: ChartPanelType.Odds,
  points: [],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
  id: 1,
};

const oddsPanelB: ChartPanel = {
  type: ChartPanelType.Odds,
  points: [],
  homeTeamName: 'Arsenal',
  awayTeamName: 'Chelsea',
  id: 2,
};

describe('Panels', () => {
  it('renders one IndicatorsPanel per entry in the panels array', () => {
    render(<Panels panels={[momentumPanel, controlPanel]} />);

    expect(screen.getAllByTestId('indicators-panel')).toHaveLength(2);
  });

  it('renders panels in array order, top to bottom', () => {
    render(<Panels panels={[momentumPanel, controlPanel]} />);

    const rendered = screen.getAllByTestId('indicators-panel');
    expect(rendered[0]).toHaveTextContent('Arsenal');
    expect(rendered[1]).toHaveTextContent('Man City');
  });

  it('assigns distinct keys to multiple Odds panels that share the same type, using their id', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Panels panels={[oddsPanelA, oddsPanelB]} />);

    const sameKeyWarning = errorSpy.mock.calls.some((call) => String(call[0]).includes('same key'));
    expect(sameKeyWarning).toBe(false);

    errorSpy.mockRestore();
  });
});
