import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Tie } from 'open-football-project-core';
import { useTranslation } from 'react-i18next';
import Logo from '../../../general/logo/Logo';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../../../theme';

interface TieCardProps {
  tie: Tie;
}

const legScoreLabel = (t1Score: number | null, t2Score: number | null, isFinished: boolean) =>
  isFinished ? `${t1Score} – ${t2Score}` : '–';

const TieCard = ({ tie }: TieCardProps) => {
  const { t } = useTranslation();
  const { t1, t1logo, t2, t2logo, legs, aggregate } = tie;
  const isTwoLegged = legs.length > 1;

  return (
    <View style={styles.container} testID="tie-card">
      <View style={styles.teamsSection}>
        <View style={styles.team}>
          <Logo src={t1logo} size={20} />
          <Text style={styles.teamName} numberOfLines={1} testID="tie-team1-name">
            {t1}
          </Text>
        </View>
        <View style={styles.team}>
          <Logo src={t2logo} size={20} />
          <Text style={styles.teamName} numberOfLines={1} testID="tie-team2-name">
            {t2}
          </Text>
        </View>
      </View>

      {isTwoLegged ? (
        <View style={styles.legsSection}>
          <View style={styles.legRow}>
            <Text style={styles.legLabel}>{t('knockout.leg1', { defaultValue: 'Leg 1' })}</Text>
            <Text style={styles.legScore} testID="tie-leg1-score">
              {legScoreLabel(legs[0].t1Score, legs[0].t2Score, legs[0].isFinished)}
            </Text>
          </View>
          <View style={styles.legRow}>
            <Text style={styles.legLabel}>{t('knockout.leg2', { defaultValue: 'Leg 2' })}</Text>
            <Text style={styles.legScore} testID="tie-leg2-score">
              {legScoreLabel(legs[1].t1Score, legs[1].t2Score, legs[1].isFinished)}
            </Text>
          </View>
          <View style={styles.aggregateRow}>
            <Text style={styles.aggregateLabel}>
              {t('knockout.aggregate', { defaultValue: 'Aggregate' })}
            </Text>
            <Text style={styles.aggregateScore} testID="tie-aggregate-score">
              {aggregate ? `${aggregate.t1Score} – ${aggregate.t2Score}` : '–'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.singleScoreSection}>
          <Text style={styles.aggregateScore} testID="tie-single-score">
            {legScoreLabel(legs[0].t1Score, legs[0].t2Score, legs[0].isFinished)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    width: '100%',
    padding: spacing.md,
    gap: spacing.sm,
  } as ViewStyle,
  teamsSection: {
    gap: spacing.xs,
  } as ViewStyle,
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,
  teamName: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.text.primary,
    fontSize: fontSize.xs,
    flex: 1,
  } as TextStyle,
  legsSection: {
    gap: spacing.xs,
  } as ViewStyle,
  legRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  } as ViewStyle,
  legLabel: {
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    fontSize: fontSize.xs,
  } as TextStyle,
  legScore: {
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    fontSize: fontSize.sm,
  } as TextStyle,
  aggregateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.text.secondary,
  } as ViewStyle,
  aggregateLabel: {
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    fontSize: fontSize.xs,
  } as TextStyle,
  aggregateScore: {
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
    fontSize: fontSize.sm,
  } as TextStyle,
  singleScoreSection: {
    alignItems: 'center',
  } as ViewStyle,
});

export default TieCard;
