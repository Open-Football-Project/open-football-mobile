import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { CopyIcon, GridIcon } from '../../icons/Icons';
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  fontSize,
  opacity,
} from '../../theme';

const QR_CODE_SIZE = 180;

const SupportUsScreen = () => {
  const { t } = useTranslation();
  const btcAddress = Config.BTC_ADDRESS ?? '';
  const btcUri = `bitcoin:${btcAddress}?message=Open%20Football%20Project`;
  const [showQrCode, setShowQrCode] = useState(true);

  const handleCopy = useCallback(() => {
    Clipboard.setString(btcAddress);
    Alert.alert(
      t('supportus.copySuccessTitle'),
      t('supportus.copySuccessMessage')
    );
  }, [btcAddress, t]);

  const handleToggleQrCode = useCallback(() => {
    setShowQrCode((current) => !current);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('supportus.head')}</Text>
      <Text style={styles.body}>{t('supportus.text')}</Text>

      {showQrCode && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={btcUri} size={QR_CODE_SIZE} />
        </View>
      )}

      <Text style={styles.addressLabel}>{t('supportus.addressLabel')}</Text>
      <Text selectable style={styles.address}>
        {btcAddress}
      </Text>

      <View style={styles.actionsRow}>
        <Pressable
          testID="copy-btc-address-button"
          onPress={handleCopy}
          accessibilityLabel={t('supportus.copyButton')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        >
          <CopyIcon size={fontSize.lg} color={colors.text.primary} />
        </Pressable>

        <Pressable
          testID="toggle-qr-code-button"
          onPress={handleToggleQrCode}
          accessibilityLabel={t(
            showQrCode ? 'supportus.hideQrCode' : 'supportus.showQrCode'
          )}
          accessibilityRole="button"
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        >
          <GridIcon size={fontSize.lg} color={colors.text.primary} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background.dark,
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
  qrCodeContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.brand.gridblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: opacity.hover,
  },
});

export default SupportUsScreen;
