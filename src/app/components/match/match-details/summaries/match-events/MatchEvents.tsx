import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LastFiveMatchesEvents } from 'open-football-project-core';
import NoData from '../../../../general/no-data/NoData';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../../../theme';

interface MatchEventsProps {
  loading: boolean;
  events: LastFiveMatchesEvents | undefined;
}

const MatchEvents = ({ loading, events }: MatchEventsProps) => {
  const { t } = useTranslation();

  if (loading) return <NoData loading={loading} />;
  if (!loading && !events) return <NoData />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('common.goals')}</Text>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.first_half')}:</Text>
            <Text style={styles.value}>{events?.firstHalfGoals}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.second_half')}:</Text>
            <Text style={styles.value}>{events?.secondHalfGoals}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.extra_time')}:</Text>
            <Text style={styles.value}>{events?.extraTimeGoals}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.penalties')}:</Text>
            <Text style={styles.value}>{events?.penalties}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('common.yellow_cards')}</Text>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.first_half')}:</Text>
            <Text style={styles.value}>{events?.firstHalfYellowCards}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.second_half')}:</Text>
            <Text style={styles.value}>{events?.secondHalfYellowCards}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.extra_time')}:</Text>
            <Text style={styles.value}>{events?.extraTimeYellowCards}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('common.red_cards')}</Text>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.first_half')}:</Text>
            <Text style={styles.value}>{events?.firstHalfRedCards}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.second_half')}:</Text>
            <Text style={styles.value}>{events?.secondHalfRedCards}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.extra_time')}:</Text>
            <Text style={styles.value}>{events?.extraTimeRedCards}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    flex: 1,
    minWidth: 160,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  cardContent: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: fontSize.xs,
    color: colors.brand.yellow,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
});

export default MatchEvents;
