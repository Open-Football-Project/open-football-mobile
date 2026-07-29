import React from 'react';
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BetMarketInfo } from 'open-football-project-core';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../../theme';

interface OddsMarketMenuProps {
  markets: BetMarketInfo[];
  enabledMarketNames: string[];
  onToggleMarket: (marketName: string) => void;
  onClose: () => void;
}

const OddsMarketMenu = ({ markets, enabledMarketNames, onToggleMarket, onClose }: OddsMarketMenuProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible transparent={false} animationType="slide" testID="odds-market-menu" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('charts.oddsMarketMenu.title', { defaultValue: 'Markets' })}</Text>
          <Pressable testID="odds-market-menu-close" onPress={onClose}>
            <Text style={styles.closeLabel}>{'✕'}</Text>
          </Pressable>
        </View>
        <FlatList
          data={markets}
          keyExtractor={(market) => String(market.id)}
          renderItem={({ item: market }) => {
            const enabled = enabledMarketNames.includes(market.name);
            return (
              <Pressable
                testID={`odds-market-toggle-${market.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: enabled }}
                onPress={() => onToggleMarket(market.name)}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>
                  {t(`charts.markets.${market.name}`, { defaultValue: market.name })}
                </Text>
                <Text style={[styles.checkbox, enabled && styles.checkboxEnabled]}>
                  {enabled ? '✓' : ''}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: borders.hairline,
    borderBottomColor: colors.secondary.border,
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  closeLabel: {
    color: colors.text.primary,
    fontSize: fontSize.base,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: borders.hairline,
    borderBottomColor: colors.secondary.border,
  },
  rowLabel: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
  },
  checkbox: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    minWidth: borderRadius.md,
    textAlign: 'center',
  },
  checkboxEnabled: {
    color: colors.brand.orange,
    fontWeight: fontWeight.semibold,
  },
});

export default OddsMarketMenu;
