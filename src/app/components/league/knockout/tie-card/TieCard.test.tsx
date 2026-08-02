import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Tie } from 'open-football-project-core';

import TieCard from './TieCard';

jest.mock('../../../general/logo/Logo', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ src }: { src?: string }) => <View testID={`logo-${src || 'fallback'}`} />,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

describe('TieCard', () => {
  // Real Libertadores 2025 semifinal, LDU de Quito vs Palmeiras.
  // Leg 1 (home LDU): LDU 3-0 Palmeiras. Leg 2 (home Palmeiras): Palmeiras 4-0 LDU.
  // Real aggregate: LDU 3, Palmeiras 4 (Palmeiras advances).
  const twoLeggedTie: Tie = {
    t1: 'LDU de Quito',
    t1logo: '/ldu.png',
    t2: 'Palmeiras',
    t2logo: '/palmeiras.png',
    legs: [
      { t1Score: 3, t2Score: 0, isFinished: true },
      { t1Score: 0, t2Score: 4, isFinished: true },
    ],
    aggregate: { t1Score: 3, t2Score: 4 },
  };

  const pendingTwoLeggedTie: Tie = {
    t1: 'Real Madrid',
    t1logo: '/rm.png',
    t2: 'Man City',
    t2logo: '/mc.png',
    legs: [
      { t1Score: 2, t2Score: 1, isFinished: true },
      { t1Score: null, t2Score: null, isFinished: false },
    ],
    aggregate: null,
  };

  const singleMatchTie: Tie = {
    t1: 'Palmeiras',
    t1logo: '/palmeiras.png',
    t2: 'Flamengo',
    t2logo: '/flamengo.png',
    legs: [{ t1Score: 0, t2Score: 1, isFinished: true }],
    aggregate: { t1Score: 0, t2Score: 1 },
  };

  const upcomingSingleMatchTie: Tie = {
    t1: 'Palmeiras',
    t1logo: '/palmeiras.png',
    t2: 'Flamengo',
    t2logo: '/flamengo.png',
    legs: [{ t1Score: null, t2Score: null, isFinished: false }],
    aggregate: null,
  };

  it('renders both team names', () => {
    render(<TieCard tie={twoLeggedTie} />);
    expect(screen.getByText('LDU de Quito')).toBeTruthy();
    expect(screen.getByText('Palmeiras')).toBeTruthy();
  });

  it('renders both team logos', () => {
    render(<TieCard tie={twoLeggedTie} />);
    expect(screen.getByTestId('logo-/ldu.png')).toBeTruthy();
    expect(screen.getByTestId('logo-/palmeiras.png')).toBeTruthy();
  });

  it('renders a single score and no leg/aggregate rows for a single-match tie', () => {
    render(<TieCard tie={singleMatchTie} />);
    expect(screen.getByTestId('tie-single-score')).toHaveTextContent('0 – 1');
    expect(screen.queryByTestId('tie-leg1-score')).toBeNull();
    expect(screen.queryByTestId('tie-leg2-score')).toBeNull();
    expect(screen.queryByTestId('tie-aggregate-score')).toBeNull();
  });

  it('renders a placeholder score for an unplayed single-match tie', () => {
    render(<TieCard tie={upcomingSingleMatchTie} />);
    expect(screen.getByTestId('tie-single-score')).toHaveTextContent('–');
  });

  it('renders leg 1, leg 2, and the correct aggregate for a decided two-legged tie (regression: aggregate must be 3-4, not 7-0)', () => {
    render(<TieCard tie={twoLeggedTie} />);
    expect(screen.getByTestId('tie-leg1-score')).toHaveTextContent('3 – 0');
    expect(screen.getByTestId('tie-leg2-score')).toHaveTextContent('0 – 4');
    expect(screen.getByTestId('tie-aggregate-score')).toHaveTextContent('3 – 4');
  });

  it('renders leg 2 and the aggregate as placeholders while a two-legged tie is still undecided', () => {
    render(<TieCard tie={pendingTwoLeggedTie} />);
    expect(screen.getByTestId('tie-leg1-score')).toHaveTextContent('2 – 1');
    expect(screen.getByTestId('tie-leg2-score')).toHaveTextContent('–');
    expect(screen.getByTestId('tie-aggregate-score')).toHaveTextContent('–');
  });
});
  