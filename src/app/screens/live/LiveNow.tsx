import React from 'react';
import RNEventSource from 'react-native-sse';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Logo from '../../components/general/logo/Logo';
import SubHeader from '../../components/general/sub-header/SubHeader';
import NoData from '../../components/general/no-data/NoData';
import { LiveMatches } from '../../components/live-matches/LiveMatches';
import Controls from '../../components/general/controls/Controls';
import { LiveIcon } from '../../icons/Icons';
import {
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
  useLiveNowStatus,
  MobileRoutes,
} from 'open-football-project-core';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../theme';

interface LiveNowProps {
  apiService: ApiService;
  apiHost: string;
  apiMock?: number;
}

type LiveRoute = RouteProp<RootStackParamList, typeof MobileRoutes.LIVE>;

const LiveNow = ({ apiService, apiHost, apiMock = 0 }: LiveNowProps) => {
  const { t } = useTranslation();
  const route = useRoute<LiveRoute>();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isWideScreen = width >= breakpoints.tablet;

  const containerPadding = isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;
  const gapSize = isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;

  const fixtureId = route.params?.fixtureId;

  const {
    selectedCountry,
    setSelectedCountry,
    selectedLeagueId,
    setSelectedLeagueId,
    countries,
    leagues,
    selectedLeague,
    selectedLeagueMatches,
  } = useLiveNowStatus(apiHost, apiMock, fixtureId, (url) => new RNEventSource(url) as unknown as EventSource);

  const wideContentStyle = isWideScreen ? styles.contentWide : undefined;

  if (leagues.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
       styles.contentContainer,
       {
        paddingTop: spacing.md,
        paddingBottom: containerPadding,
        paddingHorizontal: spacing.xs,
        gap: gapSize,
       },
]}
        testID="live-now-screen"
      >
        <View style={wideContentStyle}>
          <SubHeader title={t('livepage.subheadertitle')} />
          <NoData hideMessage={true} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
              style={styles.container}
        contentContainerStyle={[
       styles.contentContainer,
       {
        paddingTop: spacing.md,
        paddingBottom: containerPadding,
        paddingHorizontal: spacing.xs,
        gap: gapSize,
       },
      ]}
      testID="live-now-screen"
    >
      <View style={wideContentStyle}>
        <SubHeader title={t('livepage.subheadertitle')} />

        <Controls
          useDrop0={true}
          drop0Label={t('livepage.countrycontrol')}
          isDrop0LabelRow={false}
          drop0Options={countries.map((country) => ({
            id: country,
            value: t(`country.${country.toLowerCase()}`, {
              defaultValue: country,
            }),
          }))}
          selectedDrop0={selectedCountry ?? countries[0]}
          setDrop0={setSelectedCountry}
          useDrop1={true}
          drop1Label={t('livepage.leaguecontrol')}
          isDrop1LabelRow={false}
          drop1Options={leagues.map((league) => ({
            id: league.leagueId.toString(),
            value: cleanLeagueName(
              t(`league.${leagueTranslationKey(league.leagueName)}`, {
                defaultValue: league.leagueName,
              })
            ),
          }))}
          selectedDrop1={selectedLeagueId?.toString() ?? ''}
          setDrop1={(leagueId) => setSelectedLeagueId(Number(leagueId))}
        />

        {selectedLeague && (
          <View testID="league-info-card" style={[styles.leagueCard, { gap: spacing.sm }]}>
            <View style={styles.leagueCardRow}>
              <Logo src={selectedLeague.leagueLogo} size={35} />
              <View style={{ flex: 1 }}>
                <Text style={styles.leagueName}>
                  {cleanLeagueName(
                    t(
                      `league.${leagueTranslationKey(selectedLeague.leagueName)}`,
                      {
                        defaultValue: selectedLeague.leagueName,
                      }
                    )
                  )}
                </Text>
                <Text style={styles.leagueCountry}>
                  {t(`country.${selectedLeague.leagueCountry?.toLowerCase()}`, {
                    defaultValue: selectedLeague.leagueCountry,
                  })}
                </Text>
              </View>
              <LiveIcon size={14} testID="live-indicator" />
            </View>
          </View>
        )}

        {selectedLeague ? (
          <LiveMatches
            apiService={apiService}
            matches={selectedLeagueMatches}
            fixtureId={fixtureId ? Number(fixtureId) : undefined}
          />
        ) : (
          <Text style={styles.selectLeagueText}>
            {t('livepage.selectleague', { defaultValue: 'Select a league to view matches' })}
          </Text>
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
    backgroundColor: colors.overlay.royalblueo,
  },
  contentWide: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  leagueCard: {
  backgroundColor: colors.background.card,

  borderWidth: borders.thick,
  borderColor: colors.brand.aqualight,
  borderRadius: borderRadius.sm,

  marginHorizontal: spacing.xs,

  padding: spacing.md,
  },
  leagueCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leagueName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
    textTransform: 'uppercase',
  },
  leagueCountry: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  selectLeagueText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});

export default LiveNow;
