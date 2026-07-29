import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { H2HDetails, getFormattedDate } from '@matchinsights/core';
import NoData from '../../../general/no-data/NoData';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../../theme';

interface HeadToHeadProps {
  h2hDetails: H2HDetails | null;
  loading: boolean;
}

export const HeadToHead = ({ h2hDetails, loading }: HeadToHeadProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  // Determine device type based on screen width
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  if (loading) {
    return <NoData loading={loading} />;
  }

  if (!loading && !h2hDetails) {
    return <NoData />;
  }

  const cardTitleFontSize = isLargeScreen ? fontSize.base : fontSize.sm;
  const labelFontSize = isLargeScreen ? fontSize.xs : fontSize.xs;
  const valueFontSize = isLargeScreen ? fontSize.sm : fontSize.xs;

  return (
    <View testID="h2h-container">
      <View
        style={[
          styles.container,
          isLargeScreen
            ? styles.containerLarge
            : isTablet
            ? styles.containerTablet
            : styles.containerMobile,
        ]}
      >
        {/* Main Info Card */}
        <View
          style={styles.card}
          testID="h2h-main-info-card"
        >
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            {t('common.main_info')}
          </Text>
          <View style={styles.cardContent}>
            {/* Date */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.date')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-date"
              >
                {getFormattedDate(h2hDetails?.date ?? '')}
              </Text>
            </View>

            {/* Winner */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.winner')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-winner"
              >
                {h2hDetails?.winner}
              </Text>
            </View>
          </View>
        </View>

        {/* League Info Card */}
        <View
          style={styles.card}
          testID="h2h-league-info-card"
        >
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            {t('common.league_info')}
          </Text>
          <View style={styles.cardContent}>
            {/* Venue */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.venue')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-venue"
              >
                {h2hDetails?.venue.name}
              </Text>
            </View>

            {/* League */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.league')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-league"
              >
                {h2hDetails?.leagueName}
              </Text>
            </View>

            {/* Season */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.season')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-season"
              >
                {h2hDetails?.season}
              </Text>
            </View>

            {/* Round (conditional) */}
            {h2hDetails?.round && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { fontSize: labelFontSize }]}>
                  {t('common.round')}:
                </Text>
                <Text
                  style={[styles.value, { fontSize: valueFontSize }]}
                  testID="h2h-round"
                >
                  {h2hDetails.round}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Score Info Card */}
        <View
          style={styles.card}
          testID="h2h-score-info-card"
        >
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            {t('common.score_info')}
          </Text>
          <View style={styles.cardContent}>
            {/* Halftime */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.half_time')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-halftime"
              >
                {h2hDetails?.homeHalfTimeGoal} - {h2hDetails?.awayHalfTimeGoal}
              </Text>
            </View>

            {/* Fulltime */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.full_time')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-fulltime"
              >
                {h2hDetails?.homeFullTimeGoal} - {h2hDetails?.awayFullTimeGoal}
              </Text>
            </View>

            {/* Extra Time */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.extra_time')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-extratime"
              >
                {h2hDetails?.homeExtraTimeGoal} -{' '}
                {h2hDetails?.awayExtraTimeGoal}
              </Text>
            </View>

            {/* Penalties */}
            <View style={styles.infoRow}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                {t('common.penalties')}:
              </Text>
              <Text
                style={[styles.value, { fontSize: valueFontSize }]}
                testID="h2h-penalties"
              >
                {h2hDetails?.homePenalty} - {h2hDetails?.awayPenalty}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Responsive containers
  container: {
    width: '100%',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  containerLarge: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  containerTablet: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  containerMobile: {
    flexDirection: 'column',
  },

  // Card styling
  card: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    gap: spacing.md,
  },

  cardTitle: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  cardContent: {
    gap: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.border,
  },

  label: {
    color: colors.brand.yellow,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    flex: 1,
  },

  value: {
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
    textAlign: 'right',
    flex: 1,
  },
});

export default HeadToHead;
