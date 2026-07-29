import { render, screen } from '@testing-library/react-native';
import TeamInfo from './TeamInfo';
import type { TeamDetails } from '@matchinsights/core';
import { LeagueBasicInfo } from '@matchinsights/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{ headerShown: false }}
        children={() => children as any}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('TeamInfo', () => {
  const baseTeam: TeamDetails = {
    teamName: 'Newcastle',
    teamLogo: 'https://example.com/logo.png',
    teamCountry: 'England',
    teamFounded: 1892,
    venueName: "St. James' Park",
    venueCity: 'Newcastle upon Tyne',
    venueCapacity: 52758,
    coachName: 'E. Howe',
    coachAge: 48,
  };

  const teamLeagues: LeagueBasicInfo[] = [
    {
      id: 1,
      name: 'Premier League',
      logo: 'https://example.com/premier-league-logo.png',
      type: 'League',
    },
  ];

  it('renders the team name', () => {
    render(
      <TeamInfo
        teamDetails={baseTeam}
        teamLeagues={[]}
      />
    );
    expect(screen.getByTestId('team-name')).toHaveTextContent('Newcastle');
  });

  it('renders the country and founded year', () => {
    render(
      <TeamInfo
        teamDetails={baseTeam}
        teamLeagues={[]}
      />
    );
    expect(screen.getByTestId('country-founded')).toHaveTextContent('England');
    expect(screen.getByTestId('country-founded')).toHaveTextContent('1892');
  });

  it("renders 'Unknown' if founded year is invalid", () => {
    const team = { ...baseTeam, teamFounded: -1 };
    render(
      <TeamInfo
        teamDetails={team}
        teamLeagues={[]}
      />
    );
    const countryText = screen.getByTestId('country-founded');
    expect(countryText).toBeTruthy();
  });

  it('renders venue name and city', () => {
    render(
      <TeamInfo
        teamDetails={baseTeam}
        teamLeagues={[]}
      />
    );
    expect(screen.getByTestId('venue-name')).toHaveTextContent(
      "St. James' Park"
    );
    expect(screen.getByTestId('venue-city')).toHaveTextContent(
      'Newcastle upon Tyne'
    );
  });

  it('renders venue label', () => {
    render(
      <TeamInfo
        teamDetails={baseTeam}
        teamLeagues={[]}
      />
    );
    expect(screen.getByTestId('venue-label')).toBeTruthy();
  });

  it('does not render leagues section when teamLeagues is empty', () => {
    render(
      <TeamInfo
        teamDetails={baseTeam}
        teamLeagues={[]}
      />
    );
    expect(screen.queryByTestId('leagues-section')).toBeNull();
  });

  it('renders leagues section and title when teamLeagues has data', () => {
    render(
      <NavigationWrapper>
        <TeamInfo
          teamDetails={baseTeam}
          teamLeagues={teamLeagues}
        />
      </NavigationWrapper>
    );
    expect(screen.getByTestId('leagues-section')).toBeTruthy();
    expect(screen.getByTestId('leagues-title')).toBeTruthy();
  });

  it('renders leagues grid when leagues data is provided', () => {
    render(
      <NavigationWrapper>
        <TeamInfo
          teamDetails={baseTeam}
          teamLeagues={teamLeagues}
        />
      </NavigationWrapper>
    );
    expect(screen.getByTestId('leagues-section')).toBeTruthy();
  });

  it('falls back to shield icon when no team logo provided', () => {
    const team = { ...baseTeam, teamLogo: '' };
    render(
      <TeamInfo
        teamDetails={team}
        teamLeagues={[]}
      />
    );
    expect(screen.getByTestId('shield-fallback')).toBeTruthy();
  });
});
