import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Landing from '../screens/landing/Landing';
import { AllLeagues } from '../screens/all-leagues/AllLeagues';
import { GuessLeagueTeamPage } from '../screens/guess-league-team/GuessLeagueTeamPage';
import { GuessTeamPlayerPage } from '../screens/guess-team-player/GuessTeamPlayerPage';
import LeaguePage from '../screens/league/LeaguePage';
import ArgSpecialPage from '../screens/league-special/argentina-tablas/ArgSpecialPage';
import LeagueGroupsPage from '../screens/league-special/groups/LeagueGroupsPage';
import LeagueKnockoutPage from '../screens/league-special/league-knockout/LeagueKnockoutPage';
import LiveChartsScreen from '../screens/live-charts/LiveChartsScreen';
import LiveNow from '../screens/live/LiveNow';
import MatchDetail from '../screens/match-details/MatchDetail';
import Matches from '../screens/matches/Matches';
import PlayerHistoryPage from '../screens/player-history/PlayerHistoryPage';
import TeamDetailsPage from '../screens/team-details/TeamDetailsPage';
import TodayPlayersScreen from '../screens/today-players/TodayPlayersScreen';
import { ApiService, MobileRoutes } from 'open-football-project-core';

export const Routes = MobileRoutes

export type RootStackParamList = {
  [MobileRoutes.LANDING]: undefined;
  [MobileRoutes.ALL_LEAGUES]: undefined;
  [MobileRoutes.CHARTS]: { fixtureId?: string };
  [MobileRoutes.GUESS_LEAGUE_TEAM]: { leagueId: string };
  [MobileRoutes.GUESS_TEAM_PLAYER]: { teamId: string };
  [MobileRoutes.LEAGUE]: { leagueId: string };
  [MobileRoutes.LEAGUE_SPECIAL_ARG]: { leagueId: string };
  [MobileRoutes.LEAGUE_SPECIAL_GROUPS]: { leagueId: string };
  [MobileRoutes.LEAGUE_SPECIAL_KNOCKOUT]: { leagueId: string };
  [MobileRoutes.LIVE]: { fixtureId?: string } | undefined;
  [MobileRoutes.MATCH_DETAILS]: { matchId: string };
  [MobileRoutes.MATCHES]: undefined;
  [MobileRoutes.PLAYER_HISTORY]: { playerId: string };
  [MobileRoutes.TEAM_DETAILS]: { teamId: string };
  [MobileRoutes.TODAY_PLAYERS]: { fixtureId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export interface RootNavigatorProps {
  apiService: ApiService;
  apiHost: string;
}

export function RootNavigator({ apiService, apiHost }: RootNavigatorProps) {
  const AllLeaguesComponent = React.useMemo(
    () => (props: any) => <AllLeagues {...props} apiService={apiService} />,
    [apiService]
  );
  const GuessLeagueTeamComponent = React.useMemo(
    () => (props: any) => <GuessLeagueTeamPage {...props} apiService={apiService} />,
    [apiService]
  );
  const GuessTeamPlayerComponent = React.useMemo(
    () => (props: any) => <GuessTeamPlayerPage {...props} apiService={apiService} />,
    [apiService]
  );
  const LeaguePageComponent = React.useMemo(
    () => (props: any) => <LeaguePage {...props} apiService={apiService} />,
    [apiService]
  );
  const ArgSpecialPageComponent = React.useMemo(
    () => (props: any) => <ArgSpecialPage {...props} apiService={apiService} />,
    [apiService]
  );
  const LeagueGroupsPageComponent = React.useMemo(
    () => (props: any) => <LeagueGroupsPage {...props} apiService={apiService} />,
    [apiService]
  );
  const LeagueKnockoutPageComponent = React.useMemo(
    () => (props: any) => <LeagueKnockoutPage {...props} apiService={apiService} />,
    [apiService]
  );
  const LiveChartsScreenComponent = React.useMemo(
    () => (props: any) => <LiveChartsScreen {...props} apiService={apiService} apiHost={apiHost} />,
    [apiService, apiHost]
  );
  const LiveNowComponent = React.useMemo(
    () => (props: any) => <LiveNow {...props} apiService={apiService} apiHost={apiHost} />,
    [apiService, apiHost]
  );
  const MatchDetailComponent = React.useMemo(
    () => (props: any) => <MatchDetail {...props} apiService={apiService} />,
    [apiService]
  );
  const MatchesComponent = React.useMemo(
    () => (props: any) => <Matches {...props} apiService={apiService} />,
    [apiService]
  );
  const PlayerHistoryPageComponent = React.useMemo(
    () => (props: any) => <PlayerHistoryPage {...props} apiService={apiService} />,
    [apiService]
  );
  const TeamDetailsPageComponent = React.useMemo(
    () => (props: any) => <TeamDetailsPage {...props} apiService={apiService} />,
    [apiService]
  );
  const TodayPlayersScreenComponent = React.useMemo(
    () => (props: any) => <TodayPlayersScreen {...props} apiService={apiService} />,
    [apiService]
  );
  const LandingComponent = React.useMemo(
    () => (props: any) => <Landing {...props} apiService={apiService} />,
    [apiService]
  );

  return (
    <Stack.Navigator
      initialRouteName={Routes.LANDING}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name={Routes.LANDING} 
        component={LandingComponent}
      />

      <Stack.Screen
        name={Routes.ALL_LEAGUES}
        component={AllLeaguesComponent}
      />

      <Stack.Screen
        name={Routes.GUESS_LEAGUE_TEAM}
        component={GuessLeagueTeamComponent}
      />

      <Stack.Screen
        name={Routes.GUESS_TEAM_PLAYER}
        component={GuessTeamPlayerComponent}
      />

      <Stack.Screen
        name={Routes.LEAGUE}
        component={LeaguePageComponent}
      />

      <Stack.Screen
        name={Routes.LEAGUE_SPECIAL_ARG}
        component={ArgSpecialPageComponent}
      />
      
      <Stack.Screen
        name={Routes.LEAGUE_SPECIAL_GROUPS}
        component={LeagueGroupsPageComponent}
      />

      <Stack.Screen
        name={Routes.LEAGUE_SPECIAL_KNOCKOUT}
        component={LeagueKnockoutPageComponent}
      />

      <Stack.Screen
        name={Routes.CHARTS}
        component={LiveChartsScreenComponent}
      />

      <Stack.Screen
        name={Routes.LIVE}
        component={LiveNowComponent}
      />

      <Stack.Screen
        name={Routes.MATCHES}
        component={MatchesComponent}
      />

      <Stack.Screen
        name={Routes.MATCH_DETAILS}
        component={MatchDetailComponent}
      />

      <Stack.Screen
        name={Routes.PLAYER_HISTORY}
        component={PlayerHistoryPageComponent}
      />

      <Stack.Screen
        name={Routes.TEAM_DETAILS}
        component={TeamDetailsPageComponent}
      />

      <Stack.Screen
        name={Routes.TODAY_PLAYERS}
        component={TodayPlayersScreenComponent}
      />
    </Stack.Navigator>
  );
}