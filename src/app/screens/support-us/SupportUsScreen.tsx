import React, { useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import Clipboard from '@react-native-clipboard/clipboard';
import { CopyIcon } from '../../icons/Icons';
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  fontSize,
  opacity,
} from '../../theme';

const SupportUsScreen = () => {
  const { t } = useTranslation();
  const btcAddress = Config.BTC_ADDRESS ?? '';

  const handleCopy = useCallback(() => {
    Clipboard.setString(btcAddress);
    Alert.alert(
      t('supportus.copySuccessTitle'),
      t('supportus.copySuccessMessage')
    );
  }, [btcAddress, t]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('supportus.head')}</Text>
      <Text style={styles.body}>{t('supportus.text')}</Text>

      <Text style={styles.addressLabel}>{t('supportus.addressLabel')}</Text>
      <Text selectable style={styles.address}>
        {btcAddress}
      </Text>

      <Pressable
        testID="copy-btc-address-button"
        onPress={handleCopy}
        accessibilityLabel={t('supportus.copyButton')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
      >
        <CopyIcon size={fontSize.lg} color={colors.text.primary} />
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  heading: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  addressLabel: {
    ...textStyles.label,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  address: {
    ...textStyles.bodyBold,
    color: colors.text.primary,
    backgroundColor: colors.brand.gridblue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  copyButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.brand.gridblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonPressed: {
    opacity: opacity.hover,
  },
});

export default SupportUsScreen;
