import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../../navigation/RootNavigator';
import Logo from '../logo/Logo';
import { ChevronLeftIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../theme';
import { SubheaderRouteMobile } from '@matchinsights/core';


interface SubHeaderProps {
  logoUrl?: string;
  subTitle?: string;
  optionalLinks?: SubheaderRouteMobile[];
  title?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SubHeader = ({
  title,
  logoUrl,
  subTitle,
  optionalLinks = [],
}: SubHeaderProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.LANDING }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.leftSection}>
          {logoUrl && <Logo src={logoUrl} />}
          <View style={styles.textContainer}>
            {title && (
              <Text
                style={styles.title}
                numberOfLines={1}
                testID="sub-header-title"
              >
                {title}
              </Text>
            )}
            {subTitle && (
              <Text
                style={styles.subTitle}
                numberOfLines={1}
                testID="sub-header-subtitle"
              >
                {subTitle}
              </Text>
            )}
          </View>
        </View>

        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          testID="sub-header-back-button"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeftIcon size={fontSize.xl} color={colors.text.primary} />
        </Pressable>
      </View>

      {optionalLinks.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.linksContainer}
          testID="sub-header-optional-links"
        >
          {optionalLinks.map((link, index) => (
            <Pressable
              key={index}
              onPress={() => {
                (navigation.navigate as (screen: string, params?: any) => void)(
                  link.routeName,
                  link.param || {}
                );
              }}
              style={styles.linkButton}
              testID={`optional-link-${index}`}
            >
              <Text style={styles.linkText}>{link.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  width: '100%',
  backgroundColor: colors.background.dark,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,

  borderWidth: borders.thin,
  borderColor: colors.brand.aqualight,
  borderRadius: borderRadius.sm,
  overflow: 'hidden',

  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  subTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.yellow,
    marginTop: spacing.xs,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.brand.dona,
  },
  linksContainer: {
    marginTop: spacing.md,
  },
  linkButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    borderWidth: borders.thin,
    borderColor: colors.brand.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.cream,
  },

});

export default SubHeader;
