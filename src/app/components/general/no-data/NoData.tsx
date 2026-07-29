import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, fontWeight, sizes } from '../../../theme';
import { FootballIcon } from '../../../icons/Icons';

interface NoDataProps {
  message?: string;
  isBigMessage?: boolean;
  loading?: boolean;
  hideMessage?: boolean;
}

const NoData = ({ message, isBigMessage = false, loading = false, hideMessage = false }: NoDataProps) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={styles.container} testID="no-data-loading">
        <ActivityIndicator size="large" color={colors.brand.green} />
        <Text style={styles.loadingText}>{t('nodata.loading')}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container} testID="no-data">
      <View style={styles.icon}>
        <FootballIcon size={sizes.iconXLarge} color={colors.brand.green} testID="no-data-football-icon" />
      </View>
      {!hideMessage && (
        <Text style={[styles.text, isBigMessage && styles.bigText]}>
          {message || t('nodata.default')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    width: '100%',
  },
  icon: {
    marginBottom: spacing.md,
  },
  text: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  bigText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
});

export default NoData;
