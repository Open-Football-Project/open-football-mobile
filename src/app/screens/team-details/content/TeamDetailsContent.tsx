import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  TeamDetails,
  TeamFixture,
  LeagueBasicInfo,
  TeamPlayer,
  teamLinksToMobileRoutes,
  SubheaderLink,
} from 'open-football-project-core';
import SubHeader from '../../../components/general/sub-header/SubHeader';
import TeamInfo from '../../../components/team/team-details/team-info/TeamInfo';
import TeamSquad from '../../../components/team/team-details/team-squad/TeamSquad';
import TeamMatchesList from '../../../components/team/team-fixture/TeamMatchesList';
import { ScreenTabs, TabItem } from '../../../components/general/screen-tabs/ScreenTabs';
import { colors, spacing, borderRadius, borders } from '../../../theme';

interface TeamDetailsContentProps {
  teamDetails: TeamDetails;
  teamPlayers: TeamPlayer[];
  teamlinks: SubheaderLink[];
  teamFixture: TeamFixture;
  teamLeagues?: LeagueBasicInfo[];
  apiService: ApiService;
}

const TeamDetailsContent = ({
  teamDetails,
  teamPlayers,
  teamLeagues,
  teamlinks,
  teamFixture,
  apiService,
}: TeamDetailsContentProps) => {
  const { t } = useTranslation();

  const hasPreviousMatches = (teamFixture.previous?.length ?? 0) > 0;
  const hasUpcomingMatches = (teamFixture.upcoming?.length ?? 0) > 0;
  const hasPlayers = teamPlayers.length > 0;

  const screenTabs: TabItem[] = [
    {
      component: (
        <TeamMatchesList
          matches={teamFixture.previous ?? []}
          teamName={teamDetails.teamName}
          teamLogo={teamDetails.teamLogo}
          label={t('common.prev_matches')}
          apiService={apiService}
          loading={false}
          testID="previous-matches-list"
        />
      ),
      titleTranslationKey: 'common.prev_matches',
      isLoading: false,
      isAvailable: hasPreviousMatches,
      testID: 'team-tab-previous',
    },
    {
      component: (
        <TeamMatchesList
          matches={teamFixture.upcoming ?? []}
          teamName={teamDetails.teamName}
          teamLogo={teamDetails.teamLogo}
          label={t('common.next_matches')}
          apiService={apiService}
          loading={false}
          testID="upcoming-matches-list"
        />
      ),
      titleTranslationKey: 'common.next_matches',
      isLoading: false,
      isAvailable: hasUpcomingMatches,
      testID: 'team-tab-upcoming',
    },
    {
      component: <TeamSquad players={teamPlayers} />,
      titleTranslationKey: 'common.squad',
      isLoading: false,
      isAvailable: hasPlayers,
      testID: 'team-tab-squad',
    },
  ];

  const hasTabsData = hasPreviousMatches || hasUpcomingMatches || hasPlayers;

  return (
    <>
      <SubHeader
        title={t('teampage.title')}
        logoUrl={teamDetails.teamLogo}
        subTitle={teamDetails.teamName}
        optionalLinks={teamLinksToMobileRoutes(teamlinks)}
      />

      <View style={styles.section} testID="team-info-section">
        <TeamInfo
          teamDetails={teamDetails}
          teamLeagues={teamLeagues}
        />
      </View>

      {hasTabsData && (
        <View style={styles.tabsContainer} testID="team-tabs-container">
          <ScreenTabs tabs={screenTabs} testIDPrefix="team-screen-tabs" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    overflow: 'hidden' as const,
    padding: spacing.md,
    borderWidth: borders.thin,
    borderColor: colors.brand.dona,
  },
  tabsContainer: {
  width: '100%',

  borderWidth: borders.thin,
  borderColor: colors.brand.dona,
  borderRadius: borderRadius.md,

  backgroundColor: colors.background.card,
  },
});

export default TeamDetailsContent;
