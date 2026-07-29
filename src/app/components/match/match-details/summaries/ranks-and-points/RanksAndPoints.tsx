import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PositionAndPoints } from 'open-football-project-core';
import NoData from '../../../../general/no-data/NoData';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../../../theme';

interface RanksAndPointsProps {
  positionAndPoints: PositionAndPoints[];
  loading: boolean;
}

export const RanksAndPoints = ({
  positionAndPoints,
  loading,
}: RanksAndPointsProps) => {
  const { t } = useTranslation();

  if (loading) return <NoData loading={loading} />;
  if (!loading && (!positionAndPoints || positionAndPoints.length === 0))
    return <NoData />;

  return (
    <View style={styles.container}>
      {positionAndPoints.map((result, idx) => (
        <View
          key={idx}
          style={styles.card}
          testID={`${result.description}-${idx}`}
        >

          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('common.pos')}:</Text>
              <Text style={styles.value}>{result.position}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('common.pts')}:</Text>
              <Text style={styles.value}>{result.points}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
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
