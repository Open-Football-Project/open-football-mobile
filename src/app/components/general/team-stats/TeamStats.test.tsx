import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TeamStats from './TeamStats';
import { TeamStatistic } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

jest.mock('../share-svg-button/ShareSvgButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ svgString }: { svgString: string }) =>
      React.createElement(View, { testID: `share-svg-button-${svgString}` }),
  };
});

jest.mock('@matchinsights/core', () => {
  const actual = jest.requireActual('@matchinsights/core') as object;
  return {
    ...actual,
    buildTeamStatsSvgString: jest.fn(() => '<svg>team-stats</svg>'),
  };
});

const sampleStats: TeamStatistic[] = [
  { name: 'Shots on Goal', value: 5, total: 10, isPositive: true },
  { name: 'Shots Off Goal', value: 3, total: 10, isPositive: false },
  { name: 'Shots InsideBox', value: 4, total: 10, isPositive: true },
  { name: 'Shots OutsideBox', value: 6, total: 10, isPositive: false },
  { name: 'Yellow Cards', value: 1, total: 5, isPositive: false },
  { name: 'Corner_Kicks', value: 5, total: 6, isPositive: true },
];

describe('team stats component', () => {
  it('renders title', () => {
    render(<TeamStats title="Test Stats" statistics={[]} />);
    const title = screen.getByTestId('team-stats-title');
    expect(title).toBeTruthy();
    expect(title.props.children).toBe('Test Stats');
  });

  it('displays stat names formatted correctly', () => {
    render(<TeamStats title="Stats" statistics={sampleStats} />);
    expect(screen.getByText('STATS.SHOTS_ON_GOAL')).toBeTruthy();
    expect(screen.getByText('STATS.SHOTS_OFF_GOAL')).toBeTruthy();
    expect(screen.getByText('STATS.CORNER_KICKS')).toBeTruthy();
  });

  it('renders stat values', () => {
    render(<TeamStats title="Stats" statistics={sampleStats} />);
    expect(screen.getByTestId('stat-value-0')).toBeTruthy();
    expect(screen.getByTestId('stat-value-0').props.children).toBe(5);
    expect(screen.getByTestId('stat-value-1').props.children).toBe(3);
  });

  it('renders bars with correct width for numeric value', () => {
    render(<TeamStats title="Stats" statistics={sampleStats} />);
    const bar0 = screen.getByTestId('stat-bar-0');
    const bar1 = screen.getByTestId('stat-bar-1');

    expect(bar0).toBeTruthy();
    expect(bar1).toBeTruthy();

    // stat 0: value 5, total 10 = 50%
    expect(bar0.props.style?.[1]?.width).toBe('50%');
    // stat 1: value 3, total 10 = 30%
    expect(bar1.props.style?.[1]?.width).toBe('30%');
  });

  it('applies correct bar colors based on positive/negative stat and percent', () => {
    render(<TeamStats title="Stats" statistics={sampleStats} />);
    const bar0 = screen.getByTestId('stat-bar-0'); // positive, 50% = success
    const bar1 = screen.getByTestId('stat-bar-1'); // negative, 30% = success
    const bar2 = screen.getByTestId('stat-bar-2'); // positive, 40% = orange

    expect(bar0.props.style?.[1]?.backgroundColor).toBeTruthy();
    expect(bar1.props.style?.[1]?.backgroundColor).toBeTruthy();
    expect(bar2.props.style?.[1]?.backgroundColor).toBeTruthy();
  });

  it('renders logo when provided', () => {
    render(
      <TeamStats
        title="Stats"
        statistics={sampleStats}
        logo="https://example.com/logo.png"
      />
    );
    const logo = screen.getByTestId('team-stats-logo');
    expect(logo).toBeTruthy();
    expect(logo.props.source.uri).toBe('https://example.com/logo.png');
  });

  it('does not render logo when not provided', () => {
    render(<TeamStats title="Stats" statistics={sampleStats} />);
    const logo = screen.queryByTestId('team-stats-logo');
    expect(logo).toBeNull();
  });

  describe('Share', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders ShareSvgButton with the built svgString', () => {
      render(<TeamStats title="Test" statistics={sampleStats} logo="logo.png" />);
      expect(screen.getByTestId('share-svg-button-<svg>team-stats</svg>')).toBeTruthy();
    });

    it('calls buildTeamStatsSvgString with title, statistics, and logo', () => {
      const { buildTeamStatsSvgString } = require('@matchinsights/core');
      render(<TeamStats title="Test" statistics={sampleStats} logo="logo.png" />);
      expect(buildTeamStatsSvgString).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test',
          statistics: sampleStats,
          logo: 'logo.png',
          statLabel: expect.any(Function),
        }),
      );
    });

    it('calls buildTeamStatsSvgString with undefined logo when not provided', () => {
      const { buildTeamStatsSvgString } = require('@matchinsights/core');
      render(<TeamStats title="Test" statistics={sampleStats} />);
      expect(buildTeamStatsSvgString).toHaveBeenCalledWith(
        expect.objectContaining({ logo: undefined }),
      );
    });

    it('passes statLabel that formats stat names using translation', () => {
      const { buildTeamStatsSvgString } = require('@matchinsights/core');
      render(<TeamStats title="Test" statistics={sampleStats} />);
      const { statLabel } = buildTeamStatsSvgString.mock.calls[0][0];
      expect(statLabel('Shots on Goal')).toBe('STATS.SHOTS_ON_GOAL');
      expect(statLabel('Corner_Kicks')).toBe('STATS.CORNER_KICKS');
    });
  });
});
