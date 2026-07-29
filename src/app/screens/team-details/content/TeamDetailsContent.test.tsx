import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TeamDetailsContent from './TeamDetailsContent';
import { ApiService, TeamDetails, TeamFixture, LeagueBasicInfo, TeamPlayer, SubheaderLink } from '@matchinsights/core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../components/general/sub-header/SubHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ title, logoUrl, subTitle }: any) => (
      <View testID="subheader">
        <Text testID="subheader-title">{title}</Text>
        {logoUrl && <Text testID="subheader-logo">{logoUrl}</Text>}
        {subTitle && <Text testID="subheader-subtitle">{subTitle}</Text>}
      </View>
    ),
  };
});

jest.mock('../../../components/team/team-details/team-info/TeamInfo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ teamDetails, teamLeagues }: any) => (
      <View testID="team-info">
        <Text testID="team-info-name">{teamDetails?.teamName}</Text>
        {teamLeagues && <Text testID="team-info-leagues-count">{teamLeagues.length}</Text>}
      </View>
    ),
  };
});

jest.mock('../../../components/team/team-details/team-squad/TeamSquad', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ players }: any) => (
      <View testID="team-squad">
        <Text testID="team-squad-count">{players?.length ?? 0}</Text>
      </View>
    ),
  };
});

jest.mock('../../../components/team/team-fixture/TeamMatchesList', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ matches, testID }: any) => (
      <View testID={testID || 'team-matches-list'}>
        <Text testID={`${testID}-count`}>{matches?.length ?? 0}</Text>
      </View>
    ),
  };
});

jest.mock('../../../components/general/screen-tabs/ScreenTabs', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    ScreenTabs: ({ tabs, testIDPrefix }: any) => {
      const [activeIndex, setActiveIndex] = React.useState(0);
      const availableTabs = tabs.filter((t: any) => t.isAvailable !== false);
      if (availableTabs.length === 0) {
        return <View testID={`${testIDPrefix}-no-data`} />;
      }
      return (
        <View testID={testIDPrefix || 'screen-tabs'}>
          <View testID={`${testIDPrefix}-tab-bar`}>
            {availableTabs.map((tab: any, index: number) => (
              <Pressable
                key={index}
                testID={tab.testID}
                onPress={() => setActiveIndex(index)}
              >
                <Text>{tab.titleTranslationKey}</Text>
              </Pressable>
            ))}
          </View>
          <View testID={`${testIDPrefix}-content`}>
            {availableTabs[activeIndex]?.component}
          </View>
        </View>
      );
    },
    TabItem: {},
  };
});

jest.mock('@matchinsights/core', () => ({
  teamLinksToMobileRoutes: jest.fn((links) => links),
}));

const createMockTeamDetails = (overrides: Partial<TeamDetails> = {}): TeamDetails => ({
  teamName: 'Barcelona',
  teamLogo: 'https://example.com/barca.png',
  teamCountry: 'Spain',
  teamFounded: 1899,
  venueName: 'Camp Nou',
  venueCity: 'Barcelona',
  venueCapacity: 99354,
  coachName: 'Xavi',
  coachAge: 44,
  ...overrides,
});

const createMockTeamFixture = (overrides: Partial<TeamFixture> = {}): TeamFixture => ({
  previous: [
    { date:'', statusLong: '', statusShort: '', isLiveNow: false, fixtureId: 1, homeTeamId: 1, homeTeamName: 'Barcelona', awayTeamId: 2, awayTeamName: 'Real Madrid', isFinished: true },
  ],
  upcoming: [
    { date:'', statusLong: '', statusShort: '', isLiveNow: false, fixtureId: 2, homeTeamId: 1, homeTeamName: 'Barcelona', awayTeamId: 3, awayTeamName: 'Atletico', isFinished: false },
  ],
  ...overrides,
});

const createMockMatch = (id: number) => ({
  fixtureId: id,
  date: '',
  statusLong: '',
  statusShort: '',
  isLiveNow: false,
  homeTeamId: 1,
  awayTeamId: 2,
  homeTeamName: 'Barcelona',
  awayTeamName: 'Real Madrid',
  isFinished: true,
});

const createMockPlayers = (): TeamPlayer[] => [
  { playerId: 1, name: 'Messi', position: 'Forward' },
  { playerId: 2, name: 'Pedri', position: 'Midfielder' },
];

const createMockLeagues = (): LeagueBasicInfo[] => [
  { id: 1, name: 'La Liga', logo: 'laliga.png', type: 'league' },
  { id: 2, name: 'Champions League', logo: 'ucl.png', type: 'league' },
];

const createMockTeamLinks = (): SubheaderLink[] => [
  { label: 'Stats', url: '/stats' },
];

describe('TeamDetailsContent', () => {
  const defaultProps = {
    teamDetails: createMockTeamDetails(),
    teamPlayers: createMockPlayers(),
    teamlinks: createMockTeamLinks(),
    teamFixture: createMockTeamFixture(),
    teamLeagues: createMockLeagues(),
    apiService: {} as ApiService,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SubHeader', () => {
    it('renders SubHeader with team details', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('subheader')).toBeTruthy();
      expect(screen.getByTestId('subheader-title')).toHaveTextContent('teampage.title');
      expect(screen.getByTestId('subheader-logo')).toHaveTextContent('https://example.com/barca.png');
      expect(screen.getByTestId('subheader-subtitle')).toHaveTextContent('Barcelona');
    });
  });

  describe('TeamInfo section', () => {
    it('renders TeamInfo with team details and leagues', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('team-info-section')).toBeTruthy();
      expect(screen.getByTestId('team-info')).toBeTruthy();
      expect(screen.getByTestId('team-info-name')).toHaveTextContent('Barcelona');
      expect(screen.getByTestId('team-info-leagues-count')).toHaveTextContent('2');
    });

    it('renders TeamInfo without leagues when teamLeagues is undefined', () => {
      render(<TeamDetailsContent {...defaultProps} teamLeagues={undefined} />);

      expect(screen.getByTestId('team-info')).toBeTruthy();
      expect(screen.queryByTestId('team-info-leagues-count')).toBeNull();
    });
  });

  describe('ScreenTabs', () => {
    it('renders ScreenTabs when fixture or players data exists', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
    });

    it('renders previous matches tab', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('team-tab-previous')).toBeTruthy();
    });

    it('renders upcoming matches tab', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('team-tab-upcoming')).toBeTruthy();
    });

    it('renders squad tab', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('team-tab-squad')).toBeTruthy();
    });

    it('does not render tabs container when no data is available', () => {
      render(
        <TeamDetailsContent
          {...defaultProps}
          teamFixture={{ previous: [], upcoming: [] }}
          teamPlayers={[]}
        />
      );

      expect(screen.queryByTestId('team-tabs-container')).toBeNull();
    });

    it('renders tabs when only previous matches exist', () => {
      render(
        <TeamDetailsContent
          {...defaultProps}
          teamFixture={{ previous: [createMockMatch(1)], upcoming: [] }}
          teamPlayers={[]}
        />
      );

      expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
    });

    it('renders tabs when only upcoming matches exist', () => {
      render(
        <TeamDetailsContent
          {...defaultProps}
          teamFixture={{ previous: [], upcoming: [createMockMatch(2)] }}
          teamPlayers={[]}
        />
      );

      expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
    });

    it('renders tabs when only players exist', () => {
      render(
        <TeamDetailsContent
          {...defaultProps}
          teamFixture={{ previous: [], upcoming: [] }}
          teamPlayers={createMockPlayers()}
        />
      );

      expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
    });
  });

  describe('Tab content', () => {
    it('shows previous matches list in active tab by default', () => {
      render(<TeamDetailsContent {...defaultProps} />);

      expect(screen.getByTestId('previous-matches-list')).toBeTruthy();
      expect(screen.getByTestId('previous-matches-list-count')).toHaveTextContent('1');
    });
  });

  describe('Edge cases', () => {
    it('handles empty teamlinks array', () => {
      render(<TeamDetailsContent {...defaultProps} teamlinks={[]} />);

      expect(screen.getByTestId('subheader')).toBeTruthy();
    });

    it('handles undefined previous and upcoming in fixture', () => {
      render(
        <TeamDetailsContent
          {...defaultProps}
          teamFixture={{} as TeamFixture}
          teamPlayers={createMockPlayers()}
        />
      );

      expect(screen.getByTestId('team-screen-tabs')).toBeTruthy();
    });
  });
});
