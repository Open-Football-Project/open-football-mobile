import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ValueBetsResponse, ValueBetMarket } from '@matchinsights/core';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, letterSpacing } from '../../../../../theme';
import ValueBetTable from '../ValueBetTable';

interface BettingToolWrapperProps {
  data: ValueBetsResponse;
  isLoading: boolean;
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

const BettingToolWrapper = ({ data, isLoading }: BettingToolWrapperProps) => {
  const { t } = useTranslation();
  const [selectedMarket, setSelectedMarket] = useState<ValueBetMarket>(data.markets[0]);

  if (isLoading) {
    return <View style={styles.skeleton} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {data.markets.map((market) => (
            <TouchableOpacity
              key={market.betName}
              onPress={() => setSelectedMarket(market)}
              style={[
                styles.tab,
                selectedMarket.betName === market.betName && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedMarket.betName === market.betName && styles.tabTextActive,
                ]}
              >
                {t(`odds.${tKey(market.betName)}`, { defaultValue: market.betName })}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <ValueBetTable market={selectedMarket} />

      <Text style={styles.gambleAware}>
        {t('odds.gamble_aware', { defaultValue: '+18 | Gamble Aware' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  gap: spacing.sm,

  borderWidth: borders.thin,
  borderColor: colors.brand.dona,
  borderRadius: borderRadius.md,

  padding: spacing.sm,
  backgroundColor: colors.background.card,
  },
  skeleton: {
    height: 160,
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.xs,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.xs,
  },
  tabActive: {
    backgroundColor: colors.brand.aqua,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.cream,
    letterSpacing: letterSpacing.sm,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  gambleAware: {
    fontSize: 10,
    color: colors.text.primary,
    opacity: 0.5,
    textAlign: 'right',
  },
});

export default BettingToolWrapper;
