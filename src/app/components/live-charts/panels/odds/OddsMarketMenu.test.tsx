import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import OddsMarketMenu from './OddsMarketMenu';
import { BetMarketInfo } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

const markets: BetMarketInfo[] = [
  { id: 1, name: 'fulltime_result', history: {} },
  { id: 2, name: 'both_teams_to_score', history: {} },
];

describe('OddsMarketMenu', () => {
  it('renders a menu title', () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={['fulltime_result']}
        onToggleMarket={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText('Markets')).toBeTruthy();
  });

  it('renders one row per market with its name', () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={['fulltime_result']}
        onToggleMarket={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText('fulltime_result')).toBeTruthy();
    expect(screen.getByText('both_teams_to_score')).toBeTruthy();
  });

  it('marks a market enabled when its name is in enabledMarketNames, and disabled otherwise', () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={['fulltime_result']}
        onToggleMarket={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByTestId('odds-market-toggle-fulltime_result')).toHaveProp(
      'accessibilityState',
      { selected: true },
    );
    expect(screen.getByTestId('odds-market-toggle-both_teams_to_score')).toHaveProp(
      'accessibilityState',
      { selected: false },
    );
  });

  it('calls onToggleMarket with the market name when a row is pressed', () => {
    const onToggleMarket = jest.fn();
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={['fulltime_result']}
        onToggleMarket={onToggleMarket}
        onClose={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId('odds-market-toggle-both_teams_to_score'));

    expect(onToggleMarket).toHaveBeenCalledWith('both_teams_to_score');
  });

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn();
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={['fulltime_result']}
        onToggleMarket={jest.fn()}
        onClose={onClose}
      />,
    );

    fireEvent.press(screen.getByTestId('odds-market-menu-close'));

    expect(onClose).toHaveBeenCalled();
  });
});
