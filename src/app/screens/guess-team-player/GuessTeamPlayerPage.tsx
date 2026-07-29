import React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  useTeamDetail,
  useGuessThePlayer,
  teamLinksToMobileRoutes,
  MobileRoutes,
} from 'open-football-project-core';
import { RootStackParamList, Routes } from '../../navigation/RootNavigator';
import type { RouteProp } from '@react-navigation/native';
import GuessThePlayer from '../../components/games/player/GuessThePlayer';
import SubHeader from '../../components/general/sub-header/SubHeader';
import NoData from '../../components/general/no-data/NoData';
import { colors, spacing, borderRadius, shadows, breakpoints } from '../../theme';

interface GuessTeamPlayerPageProps {
  apiService: ApiService;
}

type GuessTeamPlayerRoute = RouteProp<RootStackParamList, MobileRoutes.GUESS_TEAM_PLAYER>;

export const GuessTeamPlayerPage = ({ apiService }: GuessTeamPlayerPageProps) => {
  const route = useRoute<GuessTeamPlayerRoute>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const teamId = (route.params?.teamId) as string | undefined;

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

  const {
    loadingTeamDetails,
    teamDetails,
    loadingTeamLeagues,
    canDisplayTeamPlayerGame,
    teamlinks,
  } = useTeamDetail(apiService, Number(teamId), t);

  const {
    isGuessThePlayerAvailable,
    guessThePlayer,
    loadingGuessThePlayer,
    getNewGame,
  } = useGuessThePlayer(apiService, Number(teamId));

  if (loadingTeamDetails || loadingGuessThePlayer || loadingTeamLeagues) {
    return <NoData loading={true} />;
  }

  if (!canDisplayTeamPlayerGame) {
    return (
      <NoData
        isBigMessage={true}
        message={`${t('common.not_available_for')} ${teamDetails?.teamName}`}
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
      testID="guess-team-player-scroll"
    >
      <View style={[
        styles.content,
        { maxWidth: contentMaxWidth as any },
        (isDesktop || isTv) && styles.contentCentered
      ]}>
        <SubHeader
          title={t('quiz.player_quiz')}
          subTitle={teamDetails?.teamName || t('common.unknown')}
          logoUrl={teamDetails?.teamLogo}
          optionalLinks={teamLinksToMobileRoutes(teamlinks ?? [])}
        />

        {!loadingGuessThePlayer &&
          canDisplayTeamPlayerGame &&
          isGuessThePlayerAvailable &&
          guessThePlayer && (
            <View style={[
              styles.gameSection,
              isTv && styles.gameSectionTv
            ]}>
              <GuessThePlayer
                game={guessThePlayer}
                newGame={getNewGame}
                teamName={teamDetails?.teamName || t('common.unknown')}
              />
            </View>
          )}

        {loadingGuessThePlayer && <NoData loading={true} />}
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
    ...shadows.md,
  },
  gameSectionTv: {
    marginTop: spacing.lg,
  },
});

export default GuessTeamPlayerPage;
