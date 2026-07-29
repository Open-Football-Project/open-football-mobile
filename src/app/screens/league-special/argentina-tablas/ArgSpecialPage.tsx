import React, { useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SubHeader from '../../../components/general/sub-header/SubHeader';
import NoData from '../../../components/general/no-data/NoData';
import ArgSpecialTable from '../../../components/league/arg-special/ArgSpecialTable';
import { ScreenTabs, TabItem } from '../../../components/general/screen-tabs/ScreenTabs';
import { ApiService, useLeaguePage, leagueLinksToMobileRoutes, MobileRoutes, ArgSpecial } from 'open-football-project-core';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors, spacing, borderRadius, breakpoints } from '../../../theme';

interface ArgSpecialPageProps {
  apiService: ApiService;
}

type ArgSpecialRoute = RouteProp<RootStackParamList, MobileRoutes.LEAGUE_SPECIAL_ARG>;

const ArgSpecialPage = ({ apiService }: ArgSpecialPageProps) => {
  const { t } = useTranslation();
  const route = useRoute<ArgSpecialRoute>();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTabletOrLarger = width >= breakpoints.tablet;

  const getContainerPadding = () => {
    if (isTV) return spacing.xl;
    if (isLargeScreen) return spacing.lg;
    if (isTabletOrLarger) return spacing.md;
    return spacing.sm;
  };

  const getContentMaxWidth = () => {
    if (isTV) return 1200;
    if (isLargeScreen) return 900;
    if (isTabletOrLarger) return width * 0.95;
    return width;
  };

  const leagueId = route.params?.leagueId;
  const parsedLeagueId = Number(leagueId);

  const {
    leagueInfo,
    leagueLinks,
    loadingArgSpecial,
    loadingLeagueInfo,
    argSpecial,
    isArgSpecialAvailable,
  } = useLeaguePage(apiService, parsedLeagueId, t);

  const isInitialLoading = (loadingArgSpecial || loadingLeagueInfo) && !argSpecial;

  const screenTabs: TabItem[] = useMemo(() => [
    {
      component: (
        <ArgSpecialTable
          teams={argSpecial?.promediosTable}
          mode="promedios"
        />
      ),
      titleTranslationKey: 'argspecial.promedios',
      isLoading: false,
      isAvailable: (argSpecial?.promediosTable?.length ?? 0) > 0,
      testID: 'arg-special-tab-promedios',
    },
    {
      component: (
        <ArgSpecialTable
          teams={argSpecial?.annualTable}
          mode="annual"
        />
      ),
      titleTranslationKey: 'argspecial.anual',
      isLoading: false,
      isAvailable: (argSpecial?.annualTable?.length ?? 0) > 0,
      testID: 'arg-special-tab-annual',
    },
  ], [argSpecial]);

  const renderSubHeader = () => (
    <SubHeader
      title={t('argspecial.title')}
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
        testID="arg-special-screen"
      >
        <View
          style={[
            styles.contentWrapper,
            { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
          ]}
        >
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
      testID={
        isInitialLoading
          ? 'arg-special-screen-loading'
          : 'arg-special-screen'
      }
    >
      <View
        style={[
          styles.contentWrapper,
          { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
        ]}
      >
        {isInitialLoading && (
          <View style={styles.loadingContainer}>
            <NoData loading />
          </View>
        )}

        {!isInitialLoading && !isArgSpecialAvailable && (
          <View style={styles.loadingContainer}>
            <NoData />
          </View>
        )}

        {!isInitialLoading && leagueInfo && renderSubHeader()}

        {isArgSpecialAvailable && argSpecial && (
          <View style={styles.tabsContainer}>
            <ScreenTabs
              tabs={screenTabs}
              testIDPrefix="arg-special-tabs"
            />
          </View>
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
  tabsContainer: {
    marginTop: spacing.lg,
    width: '100%',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.brand.dona,
  },
  loadingContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    width: '100%',
  },
});

export default ArgSpecialPage;
