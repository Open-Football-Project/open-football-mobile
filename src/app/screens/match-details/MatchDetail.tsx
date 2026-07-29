import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  MatchDetails,
  isUTCDateInFutureLocal,
  isUTCDateTodayLocal,
  useMatchDetail,
  useHeadToHead,
  useValueBets,
} from '@matchinsights/core';
import NoData from '../../components/general/no-data/NoData';
import SubHeader from '../../components/general/sub-header/SubHeader';
import {DetailsMainInfo} from '../../components/match/match-details/details-main-info/DetailsMainInfo';
import MatchDetailsTabs from '../../components/match/match-detail-tabs/MatchDetailsTabs';
import {MatchIndicators} from '../../components/match/match-details/match-indicators/MatchIndicators';
import BettingToolWrapper from '../../components/match/match-details/value-bets/wrapper/BettingToolWrapper';
import {MatchDetailsSecondRow} from '../../components/match/match-details/match-details-second-row/MatchDetailsSecondRow';
import MatchDetailsThirdRow from '../../components/match/match-details/match-details-third-row/MatchDetailsThirdRow';
import { MobileRoutes } from '@matchinsights/core';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, borderRadius, borders, breakpoints } from '../../theme';


interface MatchDetailProps {
  apiService: ApiService;
}

type MatchDetailRoute = RouteProp<RootStackParamList, typeof MobileRoutes.MATCH_DETAILS>;

const MatchDetail = ({ apiService }: MatchDetailProps) => {
  const { t } = useTranslation();
  const route = useRoute<MatchDetailRoute>();
  
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const containerPadding = isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;
  const gapSize = isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;

  const matchId = route.params?.matchId;

  const {
    loadingMatchDetail,
    matchDetail,
    isMatcheDetailAvalable,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    events,
    isEventsAvailable,
  } = useMatchDetail(apiService, Number(matchId));

  const { valueBets, loadingValueBets, isValueBetsAvailable } = useValueBets(apiService, Number(matchId));

  const { h2hDetails, loadingH2hDetail, isHead2HeadAvailable } = useHeadToHead(
    apiService,
    matchDetail?.homeTeam?.id ?? -1,
    matchDetail?.awayTeam?.id ?? -1
  );

  if (loadingMatchDetail) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { padding: containerPadding }]}
        testID="match-detail-screen"
      >
        <SubHeader title={t('matchdetails.title')} />
        <NoData loading={true} />
      </ScrollView>
    );
  }

  if (!isMatcheDetailAvalable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { padding: containerPadding }]}
        testID="match-detail-screen"
      >
        <SubHeader title={t('matchdetails.title')} />
        <NoData message={t('matchdetails.nodatamsg')} isBigMessage={true} />
      </ScrollView>
    );
  }

  const {
    homeTeam,
    awayTeam,
    date,
    venue,
    league,
    goals,
    score,
    statusLong,
    isLiveNow,
  } = matchDetail as MatchDetails;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { padding: containerPadding, gap: gapSize },
      ]}
      testID="match-detail-screen"
    >
      <SubHeader title={t('matchdetails.title')} />

      <View style={[styles.card, styles.mainInfoCard]}>
        <DetailsMainInfo
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={date}
          venue={venue}
          league={league}
          score={score}
          goals={goals}
          statusLong={statusLong}
          isLiveNow={isLiveNow}
          fixtureId={Number(matchId)}
          apiService={apiService}
        />
      </View>

      {!isLiveNow &&
        (isStatsAvailable || isEventsAvailable || isLineupsAvailable) && (
          <View style={styles.secondaryCard} testID="match-details-tabs-container">
            <MatchDetailsTabs
              liveStats={matchStats}
              matchEvents={events}
              homeTeamName={homeTeam.name}
              homeTeamLogo={homeTeam.logo ?? ''}
              awayTeamName={awayTeam.name}
              awayTeamLogo={awayTeam.logo ?? ''}
              liveLineups={matchLineups}
            />
          </View>
        )}

      {isUTCDateTodayLocal(date) && (
        <View style={styles.card} testID="match-indicators-container">
          <MatchIndicators
            apiService={apiService}
            homeTeam={homeTeam.name}
            homeTeamId={homeTeam.id}
            awayTeam={awayTeam.name}
            awayTeamId={awayTeam.id}
            leagueId={league.id}
            fixtureDate={date}
            matchId={Number(matchId)}
          />
        </View>
      )}

      {isValueBetsAvailable && isUTCDateInFutureLocal(date) && (
        <View style={styles.card} testID="betting-tool-container">
          <BettingToolWrapper data={valueBets} isLoading={loadingValueBets} />
        </View>
      )}

      <View style={styles.card} testID="match-details-second-row">
        <MatchDetailsSecondRow
          apiService={apiService}
          homeTeam={homeTeam.name}
          homeTeamId={homeTeam.id}
          awayTeam={awayTeam.name}
          awayTeamId={awayTeam.id}
          leagueId={league.id}
        />
      </View>

      {isMatcheDetailAvalable && isHead2HeadAvailable && (
        <View style={styles.card} testID="match-details-third-row">
          <MatchDetailsThirdRow
            h2hDetails={h2hDetails}
            isLoading={loadingH2hDetail}
            homeTeamName={homeTeam.name}
            awayTeamName={awayTeam.name}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    paddingBottom: spacing.lg,
    backgroundColor: colors.overlay.royalblueo,
  },
  card: {
  backgroundColor: colors.background.card,
  borderRadius: borderRadius.md,
  borderWidth: borders.thin,
  borderColor: colors.brand.dona,
  },
  secondaryCard: {
  backgroundColor: colors.background.dark,
  borderRadius: borderRadius.sm,
  paddingVertical: spacing.xs,
  },
  mainInfoCard: {
    padding: spacing.lg,
  },
});

export default MatchDetail;
