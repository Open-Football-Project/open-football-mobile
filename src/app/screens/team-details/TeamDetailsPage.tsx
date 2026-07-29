import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  useTeamDetail,
  useTeamFixture,
  MobileRoutes,
} from 'open-football-project-core';
import NoData from '../../components/general/no-data/NoData';
import TeamDetailsContent from './content/TeamDetailsContent';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, borderRadius, breakpoints } from '../../theme';

interface TeamDetailsPageProps {
  apiService: ApiService;
}

type TeamDetailsRoute = RouteProp<RootStackParamList, MobileRoutes.TEAM_DETAILS>;

const TeamDetailsPage = ({ apiService }: TeamDetailsPageProps) => {
  const route = useRoute<TeamDetailsRoute>();
  const teamId = route.params?.teamId;
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTabletOrLarger = width >= breakpoints.tablet;

  const {
    loadingTeamDetails,
    isTeamLeaguesAvailable,
    isTeamDetailsAvailable,
    teamDetails,
    teamPlayers,
    teamLeagues,
    teamlinks,
  } = useTeamDetail(apiService, Number(teamId), t);

  const { teamFixture } = useTeamFixture(apiService, Number(teamId));

  const getContentMaxWidth = () => {
    if (isTV) return 900;
    if (isLargeScreen) return 700;
    if (isTabletOrLarger) return width * 0.9;
    return width;
  };

  const isLoading = loadingTeamDetails || teamFixture === undefined;
  const hasAllRequiredData = isTeamDetailsAvailable && teamDetails && teamFixture;

  const renderContent = () => {
    if (isLoading && !hasAllRequiredData) {
      return (
        <View style={styles.loadingContainer} testID="team-details-loading">
          <NoData loading={true} />
        </View>
      );
    }

    if (!isTeamDetailsAvailable || !teamDetails) {
      return (
        <View style={styles.noDataContainer} testID="team-details-no-data">
          <NoData />
        </View>
      );
    }

    return (
      <TeamDetailsContent
        teamDetails={teamDetails}
        teamPlayers={teamPlayers ?? []}
        teamLeagues={teamLeagues}
        teamlinks={teamlinks ?? []}
        teamFixture={teamFixture ?? { previous: [], upcoming: [] }}
        apiService={apiService}
      />
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID="team-details-scroll"
    >
      <View
        style={[
          styles.contentWrapper,
          { maxWidth: getContentMaxWidth(), alignSelf: 'center' },
        ]}
        testID="team-details-content"
      >
        {renderContent()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: 0,
    alignItems: 'center',
    backgroundColor: colors.overlay.royalblueo,
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  loadingContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  noDataContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
});

export default TeamDetailsPage;
