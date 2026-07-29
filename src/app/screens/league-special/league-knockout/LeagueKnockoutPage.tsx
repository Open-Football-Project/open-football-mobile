import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SubHeader from '../../../components/general/sub-header/SubHeader';
import NoData from '../../../components/general/no-data/NoData';
import KnockoutStepper from '../../../components/league/knockout/stepper/KnockoutStepper';

import {
  ApiService,
  useLeaguePage,
  cleanLeagueName,
  leagueTranslationKey,
  leagueLinksToMobileRoutes,
} from '@matchinsights/core';
import { colors, spacing, breakpoints } from '../../../theme';

interface LeagueKnockoutPageProps {
  apiService: ApiService;
}

const LeagueKnockoutPage = ({ apiService }: LeagueKnockoutPageProps) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const getContainerPadding = () => {
    if (isTV) return spacing.xl;
    if (isLargeScreen) return spacing.lg;
    if (isTablet) return spacing.md;
    return spacing.sm;
  };

  const getContentMaxWidth = () => {
    if (isTV) return 1200;
    if (isLargeScreen) return 900;
    if (isTablet) return width * 0.95;
    return width;
  };

  const getGapSize = () => {
    if (isTV) return spacing.xl;
    if (isLargeScreen) return spacing.lg;
    return spacing.md;
  };

  const leagueId = (route.params as any)?.leagueId;
  const parsedLeagueId = Number(leagueId);

  const {
    fixtures,
    leagueInfo,
    leagueLinks,
    isLeaguefixturesAvailable,
    hasKnockoutPhase,
    loadingFixtures,
  } = useLeaguePage(apiService, parsedLeagueId, t);

  const leagueHeader = (): string => {
    if (!leagueInfo?.name || leagueInfo?.name === 'Unknown League') {
      return t('knockout.header');
    }
    return t(`league.${leagueTranslationKey(leagueInfo?.name)}`, {
      defaultValue: leagueInfo.name,
    });
  };

  const renderSubHeader = () => (
    <SubHeader
      title={cleanLeagueName(leagueHeader())}
      logoUrl={leagueInfo?.logo ?? ''}
      subTitle={
        leagueInfo?.country
          ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
              defaultValue: leagueInfo?.country,
            })
          : ''
      }
      optionalLinks={leagueLinksToMobileRoutes(leagueLinks ?? [])}
    />
  );

  if (!leagueId || Number.isNaN(parsedLeagueId)) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="knockout-screen"
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: getContainerPadding() }]}>
          {renderSubHeader()}
          <NoData />
        </View>
      </ScrollView>
    );
  }

  if (loadingFixtures) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="knockout-screen-loading"
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: getContainerPadding() }]}>
          {renderSubHeader()}
          <View style={styles.loadingContainer}>
            <NoData loading />
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!hasKnockoutPhase || !isLeaguefixturesAvailable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="knockout-screen-nodata"
      >
        <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: getContainerPadding() }]}>
          {renderSubHeader()}
          <NoData />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID="knockout-screen"
    >
      <View style={[styles.contentWrapper, { maxWidth: getContentMaxWidth(), padding: getContainerPadding(), gap: getGapSize() }]}>
        {renderSubHeader()}
        <KnockoutStepper fixtures={fixtures!} />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});

export default LeagueKnockoutPage;
