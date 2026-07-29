import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  usePlayerHistory,
  usePlayerInfo,
  PlayerHistoryInfo,
  PlayerMainInfo,
} from '@matchinsights/core';
import SubHeader from '../../components/general/sub-header/SubHeader';
import NoData from '../../components/general/no-data/NoData';
import PlayerHeader from '../../components/player-history/player-header/PlayerHistoryHeader';
import PlayerHistoryTabs from '../../components/player-history/player-history-tabs/PlayerHistoryTabs';
import PlayerHistoryShare from '../../components/player-history/player-history-share/PlayerHistoryShare';

const PLAYER_FALLBACK_PHOTO = Image.resolveAssetSource(
  require('../../assets/images/player.png'),
).uri;
import { MobileRoutes } from '@matchinsights/core';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, borderRadius, breakpoints } from '../../theme';

interface PlayerHistoryPageProps {
  apiService: ApiService;
}

type PlayerHistoryRoute = RouteProp<RootStackParamList, typeof MobileRoutes.PLAYER_HISTORY>;

const PlayerHistoryPage = ({ apiService }: PlayerHistoryPageProps) => {
  const { t } = useTranslation();
  const route = useRoute<PlayerHistoryRoute>();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const containerPadding = isTV
    ? spacing.xl
    : isLargeScreen
    ? spacing.lg
    : isTablet
    ? spacing.md
    : spacing.md;

  const gapSize = isTV
    ? spacing.xl
    : isLargeScreen
    ? spacing.lg
    : isTablet
    ? spacing.md
    : spacing.md;

  const getContentMaxWidth = () => {
    if (isTV) return 900;
    if (isLargeScreen) return 700;
    if (isTablet) return width * 0.9;
    return width;
  };

  const playerId = route.params?.playerId;
  const parsedPlayerId = Number(playerId);

  const { isPlayerInfoAvailable, loadingPlayerInfo, playerInfo } = usePlayerInfo(
    apiService,
    parsedPlayerId
  );

  const { isPlayerHistoryAvailable, loadingPlayerHistory, playerHistory } =
    usePlayerHistory(apiService, parsedPlayerId);

  const emergencyPlayer = (
    playerHistory?: PlayerHistoryInfo | null | undefined
  ): PlayerMainInfo => {
    return {
      playerId: parsedPlayerId,
      name: playerHistory?.name || 'Unknown',
      age: -1,
      position: 'Unknown',
      height: 'Unknown',
      weight: 'Unknown',
      teamId: -1,
      teamName: 'Unknown',
      teamLogo: null,
      photo: playerHistory?.photo || undefined,
      injured: false,
      nationality: 'Unknown',
    };
  };

  if (Number.isNaN(parsedPlayerId) || !playerId) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        testID="player-history-screen-invalid"
        accessibilityLabel={t('playerhistory.title')}
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: containerPadding }]}>
          <SubHeader title={t('playerhistory.title')} />
          <View style={styles.loadingContainer}>
            {(loadingPlayerInfo || loadingPlayerHistory) && <NoData loading={true} />}
            {!loadingPlayerInfo && !loadingPlayerHistory && <NoData message={t('playerhistory.invalidmsg')} isBigMessage={true} />}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (loadingPlayerInfo || loadingPlayerHistory) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        testID="player-history-screen-loading"
        accessibilityLabel={t('playerhistory.title')}
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: containerPadding }]}>
          <SubHeader title={t('playerhistory.title')} />
          <View style={styles.loadingContainer}>
            <NoData loading={true} />
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!isPlayerInfoAvailable && !isPlayerHistoryAvailable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        testID="player-history-screen-nodata"
        accessibilityLabel={t('playerhistory.title')}
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: containerPadding }]}>
          <SubHeader title={t('playerhistory.title')} />
          <View style={styles.loadingContainer}>
            <NoData message={t('playerhistory.nodatamsg')} isBigMessage={true} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID="player-history-screen"
      accessibilityLabel={t('playerhistory.title')}
    >
      <View
        style={[
          styles.contentWrapper,
          { maxWidth: getContentMaxWidth(), padding: containerPadding, gap: gapSize },
        ]}
      >
        <SubHeader title={t('playerhistory.title')} />

        {isPlayerInfoAvailable && playerInfo && (
          <PlayerHeader player={playerInfo} />
        )}

        {!isPlayerInfoAvailable &&
          isPlayerHistoryAvailable &&
          playerHistory && (
            <PlayerHeader player={emergencyPlayer(playerHistory.player)} />
          )}

        {isPlayerHistoryAvailable && playerHistory && (
          <>
            <PlayerHistoryShare
              playerName={playerInfo?.name ?? playerHistory.player?.name ?? 'Unknown'}
              playerPhoto={playerInfo?.photo ?? playerHistory.player?.photo ?? PLAYER_FALLBACK_PHOTO}
              transfers={playerHistory.transfers}
              trophies={playerHistory.trophies}
            />
            <PlayerHistoryTabs
              transfers={playerHistory.transfers}
              trophies={playerHistory.trophies}
            />
          </>
        )}
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
    alignItems: 'center',
    backgroundColor: colors.overlay.royalblueo,
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
});

export default PlayerHistoryPage;
