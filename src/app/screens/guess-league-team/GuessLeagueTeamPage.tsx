import React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  MobileRoutes,
  anyMainLeagueId,
  useGuessTheTeam,
  useLeaguePage,
  leagueLinksToMobileRoutes,
} from 'open-football-project-core';
import { RootStackParamList, Routes } from '../../navigation/RootNavigator';
import type { RouteProp } from '@react-navigation/native';
import GuessTheTeam from '../../components/games/team/GuessTheTeam';
import SubHeader from '../../components/general/sub-header/SubHeader';
import NoData from '../../components/general/no-data/NoData';
import { colors, spacing, borderRadius, shadows, breakpoints } from '../../theme';

interface GuessLeagueTeamPageProps {
  apiService: ApiService;
}

type GuessLeagueTeamRoute = RouteProp<RootStackParamList, MobileRoutes.GUESS_LEAGUE_TEAM>;

export const GuessLeagueTeamPage = ({ apiService }: GuessLeagueTeamPageProps) => {
  const route = useRoute<GuessLeagueTeamRoute>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const leagueId = route.params?.leagueId;

  const isTv = width >= breakpoints.tv;
  const isDesktop = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isMobile = width < breakpoints.tablet;

  const containerPadding = isTv
    ? spacing.xxl
    : isDesktop
    ? spacing.xl
    : isTablet
    ? spacing.lg
    : spacing.md;

  const contentMaxWidth = isTv ? 1600 : isDesktop ? 1200 : '100%';

  const { leagueInfo, loadingLeagueInfo, leagueLinks } = useLeaguePage(
    apiService,
    Number(leagueId),
    t
  );


  const {
    isGuessTheTeamAvailable,
    guessTheTeam,
    loadingGuessTheTeam,
    getNewGame,
  } = useGuessTheTeam(apiService, Number(leagueId));

  const canDisplayGame =
    isGuessTheTeamAvailable && anyMainLeagueId([Number(leagueId)]);

  if (loadingGuessTheTeam || loadingLeagueInfo) {
    return <NoData loading={true} />;
  }

  if (!canDisplayGame) {
    return (
      <NoData
        isBigMessage={true}
        message={`${t('common.not_available_for')} ${leagueInfo?.name}`}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { padding: containerPadding }
      ]}
      testID="guess-league-team-scroll"
    >
      <View style={[
        styles.content,
        { maxWidth: contentMaxWidth as any },
        (isDesktop || isTv) && styles.contentCentered
      ]}>
        <SubHeader
          title={t('quiz.team_quiz')}
          subTitle={leagueInfo?.name || t('common.unknown')}
          logoUrl={leagueInfo?.logo}
          optionalLinks={leagueLinksToMobileRoutes(leagueLinks ?? [])}
        />

        {!loadingGuessTheTeam &&
          canDisplayGame &&
          isGuessTheTeamAvailable &&
          guessTheTeam && (
            <View style={[
              styles.gameSection,
              isTv && styles.gameSectionTv
            ]}>
              <GuessTheTeam
                game={guessTheTeam}
                newGame={getNewGame}
                leagueName={leagueInfo?.name || t('common.unknown')}
              />
            </View>
          )}

        {loadingGuessTheTeam && <NoData loading={true} />}
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
    backgroundColor: colors.overlay.royalblueo,
  },
  content: {
    width: '100%',
  },
  contentCentered: {
    alignSelf: 'center',
  },
  gameSection: {
    marginTop: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.brand.dona,
    ...shadows.md,
  },
  gameSectionTv: {
    marginTop: spacing.lg,
  },
});

export default GuessLeagueTeamPage;
