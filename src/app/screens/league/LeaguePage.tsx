import React, { useMemo } from 'react';
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
  useLeaguePage,
  cleanLeagueName,
  leagueTranslationKey,
  MobileRoutes,
  leagueLinksToMobileRoutes,
} from 'open-football-project-core';
import SubHeader from '../../components/general/sub-header/SubHeader';
import { LeagueFixtureComponent } from '../../components/league/league-fixture/LeagueFixtureComponent';
import LeagueStanding from '../../components/league/league-standing/LeagueStanding';
import NoData from '../../components/general/no-data/NoData';
import LeagueRankingTabs from '../../components/league/league-rankings/league-ranking-tabs/LeagueRankingTab';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, borderRadius, borders, breakpoints } from '../../theme';
import { ScreenTabs, TabItem } from '../../components/general/screen-tabs/ScreenTabs';

interface LeaguePageProps {
  apiService: ApiService;
}

type LeagueRoute = RouteProp<RootStackParamList, MobileRoutes.LEAGUE>;

export default function LeaguePage({
  apiService,
}: LeaguePageProps) {
  const route = useRoute<LeagueRoute>();
  const leagueId = route.params?.leagueId;
  const { t } = useTranslation();
  const { width } = useWindowDimensions();


  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTabletOrLarger = width >= breakpoints.tablet;

  const {
    fixtures,
    leagueInfo,
    loadingFixtures,
    loadingLeagueInfo,
    isLeagueInfoAvailable,
    isLeaguefixturesAvailable,
    isAssistsAvailable,
    assists,
    isRedCardsAvailable,
    redCards,
    isYellowCardsAvailable,
    yellowCards,
    isTopScorersAvailable,
    topScorers,
    leagueLinks,
  } = useLeaguePage(apiService, Number(leagueId), t);

  const isLoading = loadingFixtures || loadingLeagueInfo;

  const leagueHeader = (): string => {
    if (!leagueInfo?.name || leagueInfo?.name === "Unknown League") {
      return t("leagues.details");
    }
    return t(`league.${leagueTranslationKey(leagueInfo?.name)}`, {
      defaultValue: leagueInfo.name,
    });
  };

  const getContentMaxWidth = () => {
    if (isTV) {
      return 900;
    }
    if (isLargeScreen) {
      return 700;
    }
    if (isTabletOrLarger) {
      return width * 0.9;
    }
    return width;
  };

  const hasAnyRankings =
    isAssistsAvailable ||
    isTopScorersAvailable ||
    isYellowCardsAvailable ||
    isRedCardsAvailable;

  const isRankingsLoading =
    isLoading &&
    !isAssistsAvailable &&
    !isTopScorersAvailable &&
    !isYellowCardsAvailable &&
    !isRedCardsAvailable;

  const screenTabs: TabItem[] = useMemo(
    () => [
      {
        component: (
          <LeagueStanding
            key={`standing-${leagueId}`}
            leagueInfo={leagueInfo}
            loading={loadingLeagueInfo}
          />
        ),
        titleTranslationKey: 'leagues.standing',
        isLoading: loadingLeagueInfo,
        isAvailable: isLeagueInfoAvailable,
        testID: 'league-tab-standing',
      },
      {
        component: (
          <LeagueFixtureComponent
            key={`fixtures-${leagueId}`}
            fixture={fixtures}
            loading={loadingFixtures}
            leagueName={cleanLeagueName(leagueHeader())}
            leagueLogo={leagueInfo?.logo}
            apiService={apiService}
          />
        ),
        titleTranslationKey: 'leagues.fixtures',
        isLoading: loadingFixtures,
        isAvailable: isLeaguefixturesAvailable,
        testID: 'league-tab-fixtures',
      },
      {
        component: (
          <LeagueRankingTabs
            topScorers={topScorers}
            assists={assists}
            yellowCards={yellowCards}
            redCards={redCards}
          />
        ),
        titleTranslationKey: 'leagues.rankings',
        isLoading: isRankingsLoading,
        isAvailable: hasAnyRankings,
        testID: 'league-tab-rankings',
      },
    ],
    [
      leagueId,
      leagueInfo,
      loadingLeagueInfo,
      isLeagueInfoAvailable,
      fixtures,
      loadingFixtures,
      isLeaguefixturesAvailable,
      topScorers,
      assists,
      yellowCards,
      redCards,
      isRankingsLoading,
      isLoading,
      hasAnyRankings,
    ]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), alignSelf: 'center' }]}>
        <SubHeader
          title={cleanLeagueName(leagueHeader())}
          logoUrl={leagueInfo?.logo ?? ""}
          subTitle={
            leagueInfo?.country
              ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
                defaultValue: leagueInfo?.country,
              })
              : ""
          }
          optionalLinks={leagueLinksToMobileRoutes(leagueLinks ?? [])}
        />

    
        {isLoading && (
          <View style={styles.loadingContainer} testID="league-page-loading">
            <NoData loading={isLoading} />
          </View>
        )}

        <View style={styles.tabsContainer}>
          <ScreenTabs
            tabs={screenTabs}
            testIDPrefix="league-screen-tabs"
          />
        </View>
       </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
  flexGrow: 1,
  paddingVertical: spacing.lg,
  alignItems: 'center',
  marginHorizontal: spacing.xs,
  backgroundColor: colors.overlay.royalblueo,
  },
  contentWrapper: {
    width: '100%',

  },
  tabsContainer: {
   marginTop: spacing.lg,
   width: '100%',

   backgroundColor: colors.background.card,

   borderWidth: borders.thin,
   borderColor: colors.brand.dona,

   borderRadius: borderRadius.md,
  },
  loadingContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    width: '100%',
  },
});

