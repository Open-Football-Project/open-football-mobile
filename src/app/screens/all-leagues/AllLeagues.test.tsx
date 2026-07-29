import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import AllLeagues from './AllLeagues';
import { LeaguesGroups, useAllLeagues, ApiService } from 'open-football-project-core';
import { spacing } from '../../theme';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

jest.mock('../../components/league/leagues-menu/LeaguesMenu', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    LeaguesMenu: ({
      leaguesGroups,
      loading,
      isAnyLeagueAvailable,
    }: {
      leaguesGroups?: LeaguesGroups;
      loading: boolean;
      isAnyLeagueAvailable: boolean;
    }) =>
      React.createElement(
        View,
        { testID: 'leagues-menu' },
        React.createElement(
          Text,
          { testID: 'leagues-menu-loading' },
          `loading: ${loading}`
        ),
        React.createElement(
          Text,
          { testID: 'leagues-menu-groups' },
          `groups: ${leaguesGroups ? 'present' : 'null'}`
        ),
        React.createElement(
          Text,
          { testID: 'leagues-menu-available' },
          `available: ${isAnyLeagueAvailable}`
        )
      ),
  };
});

jest.mock('../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title }: { title?: string }) =>
      React.createElement(
        View,
        { testID: 'subheader' },
        React.createElement(Text, { testID: 'subheader-title' }, title || '')
      ),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('open-football-project-core', () => ({
  ...jest.requireActual('open-football-project-core') as any,
  useAllLeagues: jest.fn(),
}));

describe('AllLeagues Screen', () => {
  const mockLeaguesGroups: LeaguesGroups = {
    internationals: [{ id: 1, name: 'World Cup', type: 'cup' }],
    others: [],
    countryLeagues: [
      {
        country: 'England',
        leagues: [{ id: 2, name: 'Premier League', type: 'league' }],
      },
    ],
  };

  const mockApiService = {} as ApiService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with loading state', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: null,
      isAnyLeagueAvailable: false,
      loadingLeagues: true,
    });

    render(<AllLeagues apiService={mockApiService} />);

    expect(screen.getByTestId('leagues-menu-loading')).toBeTruthy();
    const loadingText = screen.getByTestId('leagues-menu-loading');
    expect(loadingText.props.children).toContain('loading: true');
  });

  it('renders with leagues groups when loaded', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const groupsText = screen.getByTestId('leagues-menu-groups');
    expect(groupsText.props.children).toContain('groups: present');
  });

  it('renders with no leagues when unavailable', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: null,
      isAnyLeagueAvailable: false,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const availableText = screen.getByTestId('leagues-menu-available');
    expect(availableText.props.children).toContain('available: false');
  });

  it('renders SubHeader component', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const subheader = screen.getByTestId('subheader');
    expect(subheader).toBeTruthy();
  });

  it('passes correct title to SubHeader', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const titleText = screen.getByTestId('subheader-title');
    expect(titleText.props.children).toBe('leaguespage.title');
  });

  it('passes leaguesGroups to LeaguesMenu', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const groupsText = screen.getByTestId('leagues-menu-groups');
    expect(groupsText.props.children).toBe('groups: present');
  });

  it('renders with testID for screen identification', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    expect(screen.getByTestId('all-leagues-screen')).toBeTruthy();
  });

  it('applies TV padding at width 1366 (breakpoints.tv = 1280)', () => {
    (useAllLeagues as jest.Mock).mockReturnValue({
      leaguesGroups: mockLeaguesGroups,
      isAnyLeagueAvailable: true,
      loadingLeagues: false,
    });

    render(<AllLeagues apiService={mockApiService} />);

    const scroll = screen.getByTestId('all-leagues-screen');
    expect(scroll.props.contentContainerStyle).toEqual(
      expect.objectContaining({ paddingVertical: spacing.xxxl })
    );
  });
});
