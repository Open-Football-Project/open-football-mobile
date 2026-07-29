import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TeamForm } from 'open-football-project-core';
import NoData from '../../../../general/no-data/NoData';
import { colors, spacing, fontSize, fontWeight } from '../../../../../theme';

interface LastFiveMatchesProps {
  loading: boolean;
  lastFiveResults?: TeamForm;
  isHome: boolean;
}

const LastFiveMatches = ({
  isHome,
  loading,
  lastFiveResults,
}: LastFiveMatchesProps) => {
  const { t } = useTranslation();

  const colorMap: Record<string, string> = {
    W: colors.brand.success,
    D: colors.brand.yellow,
    L: colors.brand.danger,
  };

  if (loading) return <NoData loading={loading} />;
  if (!loading && !lastFiveResults) return <NoData />;

  const results = isHome
    ? lastFiveResults?.homeTeamLastFive ?? []
    : lastFiveResults?.awayTeamLastFive ?? [];

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('common.no_data')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {results.map((item, index) => (
          <View
            key={index}
            style={[
              styles.resultBox,
              { backgroundColor: colorMap[item as keyof typeof colorMap] || colors.brand.yellow },
            ]}
            testID={`result-${index}`}
          >
            <Text style={styles.resultText}>{t(`common.${item}`)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  resultText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.text.darker,
  },
  emptyContainer: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});

export default LastFiveMatches;