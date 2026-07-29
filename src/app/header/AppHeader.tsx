import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HamburgerIcon } from '../icons/Icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius, borders } from '../theme/layout';
import { fontSize, fontWeight } from '../theme/typography';
import { useTranslation } from 'react-i18next';

interface AppHeaderProps {
  onMenuPress: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuPress }) => {
  const { i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={StyleSheet.flatten([styles.container, { paddingTop: insets.top }])}
      testID="app-header-container"
    >
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        accessibilityLabel="Open navigation menu"
        accessibilityRole="button"
        testID="header-menu-button"
      >
        <HamburgerIcon color={colors.text.primary} />
      </TouchableOpacity>

      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[styles.langButton, i18n.language === 'en' && styles.langButtonActive]}
          onPress={() => i18n.changeLanguage('en')}
          accessibilityLabel="EN"
          accessibilityRole="button"
          testID="lang-en"
        >
          <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>EN</Text>
        </TouchableOpacity>
        <View style={styles.langDivider} />
        <TouchableOpacity
          style={[styles.langButton, i18n.language === 'es' && styles.langButtonActive]}
          onPress={() => i18n.changeLanguage('es')}
          accessibilityLabel="ES"
          accessibilityRole="button"
          testID="lang-es"
        >
          <Text style={[styles.langText, i18n.language === 'es' && styles.langTextActive]}>ES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.border,
  },
  menuButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: fontSize.xxl,
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.sm,
    padding: 2,
  },
  langButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 1,
  },
  langButtonActive: {
    backgroundColor: colors.brand.yellow,
    borderColor: colors.brand.yellow,
  },
  langText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  langTextActive: {
    color: colors.text.darker,
  },
  langDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.secondary.border,
    marginHorizontal: spacing.xs,
  },
});

export default AppHeader;