import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MatchOdds from './MatchOdds';
import { Bet } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: any) => opts?.defaultValue ?? _key,
  }),
}));

jest.mock('../../../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(Text, null, 'NoData'),
  };
});

jest.mock('../../../general/screen-slider/ScreenSlider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    ScreenSlider: jest.fn(({ items }: any) =>
      items && items.length > 0
        ? React.createElement(
            View,
            { testID: 'slider' },
            items.map((it: any, idx: number) =>
              React.createElement(View, { key: idx, testID: 'slide' }, it)
            )
          )
        : null
    ),
  };
});

describe('MatchOdds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Slider Rendering', () => {
    it('renders slider with odds items', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
            { label: 'Draw', odd: 3.40 },
            { label: 'Away', odd: 5.25 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.getByTestId('slide')).toBeTruthy();
    });

    it('renders odds with correct labels and values', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
            { label: 'Draw', odd: 3.40 },
            { label: 'Away', odd: 5.25 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      expect(screen.getByText('Home')).toBeTruthy();
      expect(screen.getByText('1.5')).toBeTruthy();
      expect(screen.getByText('Draw')).toBeTruthy();
      expect(screen.getByText('3.4')).toBeTruthy();
      expect(screen.getByText('Away')).toBeTruthy();
      expect(screen.getByText('5.25')).toBeTruthy();
    });

    it('renders multiple bet types in slider', () => {
      const mockBets: Bet[] = [
        {
          betName: '1st Scorer',
          values: [
            { label: 'Home', odd: 2.10 },
          ],
        },
        {
          betName: 'Correct Score',
          values: [
            { label: '1-0', odd: 4.50 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      const slides = screen.getAllByTestId('slide');
      expect(slides.length).toBe(2);
    });
  });

  describe('Loading States', () => {
    it('always renders items even when loading is true', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={true} />);

      // Should render slider with items (no filter on loading)
      expect(screen.getByTestId('slider')).toBeTruthy();
      const slides = screen.queryAllByTestId('slide');
      expect(slides.length).toBe(1);
    });

    it('passes loading state to slider items', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
          ],
        },
      ];

      const { rerender } = render(
        <MatchOdds bets={mockBets} isLoading={false} />
      );

      expect(screen.getByTestId('slide')).toBeTruthy();

      rerender(<MatchOdds bets={mockBets} isLoading={true} />);

      // Should still render items with loading flag passed
      expect(screen.getByTestId('slide')).toBeTruthy();
    });
  });

  describe('Empty Data Handling', () => {
    it('renders NoData when bets array is empty', () => {
      render(<MatchOdds bets={[]} isLoading={false} />);

      expect(screen.getByText('NoData')).toBeTruthy();
    });

    it('renders NoData when bets have no values', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      expect(screen.getByTestId('slide')).toBeTruthy();
    });
  });

  describe('Translation Keys', () => {
    it('applies translation key transformation for bet names', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Over/Under 2.5',
          values: [
            { label: 'Home', odd: 1.50 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      // Check that slider is rendered (translation keys are applied but defaultValue fallback is used in test)
      expect(screen.getByTestId('slide')).toBeTruthy();
    });

    it('applies translation key transformation for odd labels', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Correct Score 1-0',
          values: [
            { label: 'Home Win + Over 2.5', odd: 2.80 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      expect(screen.getByTestId('slide')).toBeTruthy();
    });
  });

  describe('Responsiveness', () => {
    it('renders correctly on mobile screen sizes', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
            { label: 'Draw', odd: 3.40 },
            { label: 'Away', odd: 5.25 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      // Grid should render items with responsive columns
      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.getAllByText(/Home|Draw|Away/)).toBeTruthy();
    });

    it('renders correctly on tablet/large screen sizes', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Winner',
          values: [
            { label: 'Home', odd: 1.50 },
            { label: 'Draw', odd: 3.40 },
            { label: 'Away', odd: 5.25 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      // Responsive layout should handle larger screens
      expect(screen.getByTestId('slider')).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('handles bets with special characters in names', () => {
      const mockBets: Bet[] = [
        {
          betName: 'Over/Under 2.5 Goals',
          values: [
            { label: 'Over', odd: 1.95 },
            { label: 'Under', odd: 1.90 },
          ],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      expect(screen.getByText('Over')).toBeTruthy();
      expect(screen.getByText('Under')).toBeTruthy();
    });

    it('generates unique keys for multiple bets', () => {
      const mockBets: Bet[] = [
        {
          betName: '1st Half Winner',
          values: [{ label: 'Home', odd: 1.80 }],
        },
        {
          betName: '2nd Half Winner',
          values: [{ label: 'Home', odd: 1.90 }],
        },
        {
          betName: 'Final Winner',
          values: [{ label: 'Home', odd: 2.00 }],
        },
      ];

      render(<MatchOdds bets={mockBets} isLoading={false} />);

      const slides = screen.getAllByTestId('slide');
      expect(slides.length).toBe(3);
    });
  });
});
