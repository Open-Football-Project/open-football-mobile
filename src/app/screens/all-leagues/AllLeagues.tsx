import React from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  LeaguesGroups,
  useAllLeagues,
} from 'open-football-project-core';
import { LeaguesMenu } from '../../components/league/leagues-menu/LeaguesMenu';
import SubHeader from '../../components/general/sub-header/SubHeader';
import { colors, spacing, breakpoints } from '../../theme';

interface AllLeaguesProps {
  apiService: ApiService;
}

export const AllLeagues = ({ apiService }: AllLeaguesProps) => {
  const { leaguesGroups, isAnyLeagueAvailable, loadingLeagues } =
    useAllLeagues(apiService);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTv = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isMobile = width < breakpoints.tablet;

  const containerPadding = isTv
    ? spacing.xxxl
    : isLargeScreen
    ? spacing.xl
    : isTablet
    ? spacing.lg
    : spacing.md;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{
      paddingVertical: containerPadding,
      paddingHorizontal: spacing.xs,
      }}
      testID="all-leagues-screen"
      accessibilityLabel={t('leaguespage.title')}
    >
      <View style={[styles.content, isTv && styles.contentTv]}>
        <SubHeader
          title={t('leaguespage.title')}
        />
        <LeaguesMenu
          leaguesGroups={leaguesGroups as LeaguesGroups}
          loading={loadingLeagues}
          isAnyLeagueAvailable={isAnyLeagueAvailable}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    width: '100%',
    maxWidth: 1400,
    alignSelf: 'center',
    backgroundColor: colors.overlay.royalblueo,
  },
  contentTv: {
    maxWidth: 1800,
  },
});

export default AllLeagues;
