import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BettingToolWrapper from './BettingToolWrapper';
import { ValueBetsResponse } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: any) => opts?.defaultValue ?? _key,
  }),
}));

jest.mock('../ValueBetTable', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ market }: { market: { betName: string } }) =>
      React.createElement(View, { testID: 'value-bet-table', accessibilityLabel: market.betName }),
  };
});

const data: ValueBetsResponse = {
  markets: [
    { betName: 'Match Winner', fairOdds: [], bookmakers: [] },
    { betName: 'Goals Over/Under', fairOdds: [], bookmakers: [] },
    { betName: 'Both Teams Score', fairOdds: [], bookmakers: [] },
  ],
};

describe('BettingToolWrapper', () => {
  it('renders one button per market', () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByText('Match Winner')).toBeTruthy();
    expect(screen.getByText('Goals Over/Under')).toBeTruthy();
    expect(screen.getByText('Both Teams Score')).toBeTruthy();
  });

  it('shows the first market table by default', () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByTestId('value-bet-table')).toBeTruthy();
    expect(screen.getByTestId('value-bet-table').props.accessibilityLabel).toBe('Match Winner');
  });

  it('switches the displayed table when a market button is pressed', () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    fireEvent.press(screen.getByText('Goals Over/Under'));

    expect(screen.getByTestId('value-bet-table').props.accessibilityLabel).toBe('Goals Over/Under');
  });

  it('always renders the Gamble Aware footer', () => {
    render(<BettingToolWrapper data={data} isLoading={false} />);

    expect(screen.getByText('+18 | Gamble Aware')).toBeTruthy();
  });
});
