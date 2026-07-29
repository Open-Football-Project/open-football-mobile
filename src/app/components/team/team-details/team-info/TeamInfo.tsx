import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LeagueBasicInfo, TeamDetails } from '@matchinsights/core';

import Logo from '../../../general/logo/Logo';
import { LeaguesMenuGrid } from '../../../league/leagues-menu/leagues-menu-grid/LeaguesMenuGrid';
import { colors, spacing, fontSize, fontWeight, borderRadius, breakpoints } from '../../../../theme';

interface TeamDetailsComponentProps {
  teamDetails: TeamDetails;
  teamLeagues?: LeagueBasicInfo[];
  teamId?: number;
}

const useResponsiveStyles = () => {
  const { width } = useWindowDimensions();
  
  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  return useMemo(() => {
    if (isTV) {
      return {
        teamNameFontSize: fontSize.xxl,
        labelFontSize: fontSize.lg,
        detailFontSize: fontSize.base,
        cardPadding: spacing.xl,
        logoSize: 80,
        sectionGap: spacing.lg,
      };
    }
    if (isLargeScreen) {
      return {
        teamNameFontSize: fontSize.xl,
        labelFontSize: fontSize.base,
        detailFontSize: fontSize.sm,
        cardPadding: spacing.lg,
        logoSize: 64,
        sectionGap: spacing.md,
      };
    }
    if (isTablet) {
      return {
        teamNameFontSize: fontSize.lg,
        labelFontSize: fontSize.sm,
        detailFontSize: fontSize.sm,
        cardPadding: spacing.md,
        logoSize: 56,
        sectionGap: spacing.md,
      };
    }
    return {
      teamNameFontSize: fontSize.lg,
      labelFontSize: fontSize.sm,
      detailFontSize: fontSize.xs,
      cardPadding: spacing.md,
      logoSize: 48,
      sectionGap: spacing.sm,
    };
  }, [isTV, isLargeScreen, isTablet]);
};

const TeamInfo = ({
  teamDetails,
  teamLeagues,
}: TeamDetailsComponentProps) => {
  const { t } = useTranslation();
  const responsiveStyles = useResponsiveStyles();
  
  return (
    <View 
      style={styles.container}
      testID="team-info-container"
      accessible
      accessibilityLabel={t('accessibility.team_info')}
    >
      <View style={[styles.card, { padding: responsiveStyles.cardPadding }]}>
        <View style={styles.mainSection}>
          <View>
            <Logo src={teamDetails.teamLogo} size={responsiveStyles.logoSize} />
            <View style={[styles.teamInfo, { marginTop: responsiveStyles.sectionGap }]}>
              <Text
                style={[styles.teamName, { fontSize: responsiveStyles.teamNameFontSize }]}
                testID="team-name"
                numberOfLines={1}
              >
                {teamDetails.teamName}
              </Text>
              <Text style={[styles.countryText, { fontSize: responsiveStyles.detailFontSize }]} testID="country-founded">
                {t(`country.${teamDetails.teamCountry.toLowerCase()}`, {
                  defaultValue: teamDetails.teamCountry,
                })}{' '}
                • {t('common.founded')}
                <Text style={[styles.foundedYear, { fontSize: responsiveStyles.detailFontSize }]}>
                  {teamDetails.teamFounded > 0
                    ? ` ${teamDetails.teamFounded}`
                    : ` ${t('common.unknown')}`}
                </Text>
              </Text>
            </View>
            <View style={[styles.venueSection, { marginTop: responsiveStyles.sectionGap }]}>
              <Text style={[styles.venueLabel, { fontSize: responsiveStyles.labelFontSize }]} testID="venue-label">
                {t('common.venue')}
              </Text>
              <Text
                style={[styles.venueName, { fontSize: responsiveStyles.detailFontSize }]}
                testID="venue-name"
                numberOfLines={1}
              >
                {teamDetails.venueName}
              </Text>
              <Text
                style={[styles.venueCity, { fontSize: responsiveStyles.detailFontSize }]}
                testID="venue-city"
                numberOfLines={1}
              >
                {teamDetails.venueCity}
              </Text>
            </View>
          </View>
        </View>

        {teamLeagues && teamLeagues.length > 0 && (
          <View style={[styles.leaguesSection, { marginTop: responsiveStyles.sectionGap }]} testID="leagues-section">
            <Text style={[styles.leaguesTitle, { fontSize: responsiveStyles.labelFontSize }]} testID="leagues-title">
              {t('common.leagues')}
            </Text>
            <LeaguesMenuGrid leagues={teamLeagues ?? []} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {} as ViewStyle,
  card: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.md,
  } as ViewStyle,
  mainSection: {
    flexDirection: 'column',
  } as ViewStyle,
  teamInfo: {
    marginTop: spacing.md,
  } as ViewStyle,
  teamName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  } as TextStyle,
  countryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: 'uppercase',
  } as TextStyle,
  foundedYear: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  } as TextStyle,
  venueSection: {
    marginTop: spacing.md,
  } as ViewStyle,
  venueLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  } as TextStyle,
  venueName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.yellow,
    textTransform: 'uppercase',
  } as TextStyle,
  venueCity: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  } as TextStyle,
  leaguesSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.secondary.border,
  } as ViewStyle,
  leaguesTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  } as TextStyle,
});

export default TeamInfo;
