import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ValueBetMarket } from '@matchinsights/core';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, letterSpacing } from '../../../../theme';

interface ValueBetTableProps {
  market: ValueBetMarket;
}

const tKey = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\d.+\-:,]+/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, '_');

const ValueBetTable = ({ market }: ValueBetTableProps) => {
  const { t } = useTranslation();
  const outcomeLabels = market.fairOdds.map((f) => f.label);

  return (
    <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={styles.nameCell}>
            <Text style={styles.headerLabel}>
              {t('odds.fair_odds', { defaultValue: 'Fair Odds' })}
            </Text>
          </View>
          {market.fairOdds.map((fairOdd) => (
            <View key={fairOdd.label} style={styles.oddCell}>
              <Text style={styles.outcomeLabel}>
                {t(`odds.${tKey(fairOdd.label)}`, { defaultValue: fairOdd.label })}
              </Text>
              <Text style={styles.fairOddValue}>{fairOdd.odd.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {market.bookmakers.map((bookmaker, idx) => (
          <View
            key={bookmaker.name}
            style={[styles.row, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
          >
            <View style={styles.nameCell}>
              <Text style={styles.bookmakerName} numberOfLines={1}>
                {bookmaker.name}
              </Text>
            </View>
            {outcomeLabels.map((label) => {
              const outcome = bookmaker.outcomes.find((o) => o.label === label);
              return (
                <View key={label} style={styles.oddCell}>
                  {outcome ? (
                    <>
                      <Text
                        style={[
                          styles.oddValue,
                          outcome.isValue && styles.oddValueHighlight,
                        ]}
                      >
                        {outcome.odd.toFixed(2)}
                      </Text>
                      {outcome.isValue && (
                        <View style={styles.valuePill}>
                          <Text style={styles.valuePillText}>
                            {t('odds.value', { defaultValue: 'VALUE' })}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: borders.thin,
    borderColor: colors.brand.success,
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.brand.success,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderTopWidth: borders.thin,
    borderTopColor: colors.background.dark,
  },
  rowEven: {
    backgroundColor: colors.background.card,
  },
  rowOdd: {
    backgroundColor: colors.background.navbar,
  },
  nameCell: {
    width: 100,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  oddCell: {
    flex: 1,
    minWidth: 72,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  headerLabel: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.background.dark,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.wide,
  },
  outcomeLabel: {
    fontSize: 9,
    color: colors.background.dark,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.sm,
    textAlign: 'center',
  },
  fairOddValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.background.dark,
    textAlign: 'center',
  },
  bookmakerName: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  oddValue: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  oddValueHighlight: {
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  valuePill: {
    backgroundColor: colors.brand.yellow,
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
  },
  valuePillText: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    color: colors.text.darker,
  },
});

export default ValueBetTable;
