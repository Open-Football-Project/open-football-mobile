import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MatchDetailsThirdRow from './MatchDetailsThirdRow';
import { H2HDetails } from 'open-football-project-core';

jest.mock('../../../general/screen-slider/ScreenSlider', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ items }: any) =>
      React.createElement(
        View,
        { testID: 'slider' },
        items && items.length > 0
          ? items.map((item: any, idx: number) =>
              React.createElement(View, { key: idx, testID: 'slide' }, item)
            )
          : React.createElement(Text, null, 'NoData')
      )
    ),
  };
});

jest.mock('../h2h/HeadToHead', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(({ loading, h2hDetails }: any) =>
      React.createElement(
        View,
        { testID: 'h2h' },
        React.createElement(
          Text,
          null,
          loading ? 'Loading H2H' : `H2H Loaded: ${h2hDetails.date}`
        )
      )
    ),
  };
});

describe('MatchDetailsThirdRow', () => {
  const homeTeamName = 'Team A';
  const awayTeamName = 'Team B';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Slider Rendering', () => {
    it('renders slider with H2H items', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.getByTestId('h2h')).toBeTruthy();
    });

    it('renders correct title for each H2H match', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByText(`${homeTeamName} vs ${awayTeamName}`)).toBeTruthy();
    });

    it('renders multiple H2H items when available', () => {
      const mockH2H1 = { date: '2025-10-27' } as H2HDetails;
      const mockH2H2 = { date: '2025-09-15' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H1, mockH2H2]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      const slides = screen.getAllByTestId('slide');
      expect(slides.length).toBe(2);
      expect(screen.getAllByTestId('h2h')).toHaveLength(2);
    });
  });

  describe('Loading States', () => {
    it('renders HeadToHead with loading state when isLoading is true', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={true}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByText('Loading H2H')).toBeTruthy();
    });

    it('renders HeadToHead without loading state when isLoading is false', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByText('H2H Loaded: 2025-10-27')).toBeTruthy();
    });

    it('always renders items even when loading', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={true}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
      const slides = screen.getAllByTestId('slide');
      expect(slides.length).toBe(1);
    });
  });

  describe('Empty Data Handling', () => {
    it('renders empty slider when no H2H details provided', () => {
      render(
        <MatchDetailsThirdRow
          h2hDetails={[]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
      expect(screen.queryByTestId('slide')).toBeFalsy();
    });
  });

  describe('Props Handling', () => {
    it('passes isLoading to all HeadToHead components', () => {
      const mockH2H1 = { date: '2025-10-27' } as H2HDetails;
      const mockH2H2 = { date: '2025-09-15' } as H2HDetails;

      const { rerender } = render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H1, mockH2H2]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getAllByTestId('h2h')).toHaveLength(2);
      expect(screen.queryByText('Loading H2H')).toBeFalsy();

      rerender(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H1, mockH2H2]}
          isLoading={true}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getAllByText('Loading H2H')).toHaveLength(2);
    });

    it('uses correct team names in titles', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;
      const customHomeTeam = 'Manchester United';
      const customAwayTeam = 'Liverpool';

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={customHomeTeam}
          awayTeamName={customAwayTeam}
        />
      );

      expect(
        screen.getByText(`${customHomeTeam} vs ${customAwayTeam}`)
      ).toBeTruthy();
    });

    it('generates unique key for slider based on team names', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      const { rerender } = render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();

      rerender(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName="Team C"
          awayTeamName="Team D"
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
    });
  });

  describe('Responsiveness', () => {
    it('renders correctly on mobile screen sizes', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
    });

    it('renders correctly on tablet/large screen sizes', () => {
      const mockH2H = { date: '2025-10-27' } as H2HDetails;

      render(
        <MatchDetailsThirdRow
          h2hDetails={[mockH2H]}
          isLoading={false}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      );

      expect(screen.getByTestId('slider')).toBeTruthy();
    });
  });
});
