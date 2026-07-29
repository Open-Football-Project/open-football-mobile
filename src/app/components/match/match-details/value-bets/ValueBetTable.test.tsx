import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ValueBetTable from './ValueBetTable';
import { ValueBetMarket } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: any) => opts?.defaultValue ?? _key,
  }),
}));

const market: ValueBetMarket = {
  betName: 'Match Winner',
  fairOdds: [
    { label: 'Home', odd: 1.85 },
    { label: 'Draw', odd: 3.60 },
    { label: 'Away', odd: 4.20 },
  ],
  bookmakers: [
    {
      name: 'Bookmaker A',
      outcomes: [
        { label: 'Home', odd: 1.80, isValue: false },
        { label: 'Draw', odd: 3.50, isValue: false },
        { label: 'Away', odd: 4.50, isValue: true },
      ],
    },
    {
      name: 'Bookmaker B',
      outcomes: [
        { label: 'Home', odd: 1.90, isValue: true },
        { label: 'Draw', odd: 3.70, isValue: true },
        { label: 'Away', odd: 4.00, isValue: false },
      ],
    },
  ],
};

describe('ValueBetTable', () => {
  it('renders fair odds row with each outcome label and value', () => {
    render(<ValueBetTable market={market} />);

    expect(screen.getByText('Fair Odds')).toBeTruthy();
    expect(screen.getByText('1.85')).toBeTruthy();
    expect(screen.getByText('3.60')).toBeTruthy();
    expect(screen.getByText('4.20')).toBeTruthy();
  });

  it('renders one row per bookmaker', () => {
    render(<ValueBetTable market={market} />);

    expect(screen.getByText('Bookmaker A')).toBeTruthy();
    expect(screen.getByText('Bookmaker B')).toBeTruthy();
  });

  it('shows VALUE indicator on value cells', () => {
    render(<ValueBetTable market={market} />);

    const valueIndicators = screen.getAllByText('VALUE');
    expect(valueIndicators).toHaveLength(3);
  });

  it('does not show VALUE indicator on non-value cells', () => {
    render(<ValueBetTable market={market} />);

    expect(screen.getByText('1.80')).toBeTruthy();
    expect(screen.getAllByText('VALUE')).toHaveLength(3);
  });
});
