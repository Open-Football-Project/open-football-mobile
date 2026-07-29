import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bet } from '@matchinsights/core';
import { useTranslation } from 'react-i18next';
import { ScreenSlider } from '../../../general/screen-slider/ScreenSlider';
import NoData from '../../../general/no-data/NoData';
import { colors, spacing, fontSize, fontWeight, borders, borderRadius, letterSpacing } from '../../../../theme';

interface MatchOddsProps {
  bets: Bet[];
  isLoading: boolean;
}

const MatchOdds = ({ bets }: MatchOddsProps) => {
  const { t } = useTranslation();

  const tKey = (text: string): string =>
    text
      .trim()
      .toLowerCase()
      .replace(/[\d.+\-:,]+/g, ' ')
      .replace(/\//g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s/g, '_');

  if (bets.length === 0) return <NoData />;

  const slides: React.ReactNode[] = bets.map((bet) => (
    <View style={styles.slide}>
      <Text style={styles.betTitle} numberOfLines={1}>
        {t(`odds.${tKey(bet.betName)}`, { defaultValue: bet.betName })}
      </Text>
      <View style={styles.gridContainer}>
        {bet.values.map((item, idx) => (
          <View key={idx} style={styles.oddCard}>
            <View style={styles.oddCardContent}>
              <Text style={styles.oddLabel} numberOfLines={1}>
                {t(`odds.${tKey(item.label)}`, { defaultValue: item.label })}
              </Text>
              <Text style={styles.oddValue}>{item.odd}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  ));

  return (
    <ScreenSlider
      items={slides}
      testIDPrefix="odds-slider"
      showPagination={false}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    width: '100%',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  betTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.orange,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.wide,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
    width: '100%',
  },
  oddCard: {
    minWidth: 64,
    flex: 1,
    padding: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.navbar,
    borderColor: colors.brand.royalblue,
    borderWidth: borders.thin,
    borderRadius: borderRadius.xs,
  },
  oddCardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  oddLabel: {
    fontSize: 9,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.sm,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  oddValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.brand.success,
  },
});

export default MatchOdds;
