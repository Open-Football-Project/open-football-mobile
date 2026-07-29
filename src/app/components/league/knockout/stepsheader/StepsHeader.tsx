import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { LeagueFixtureRound } from "@matchinsights/core";
import { normalizeLeagueRound } from "@matchinsights/core";
import { LiveIcon } from '../../../../icons/Icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, breakpoints } from '../../../../theme';

interface StepsHeaderProps {
  rounds: LeagueFixtureRound[];
  activeIndex: number;
  currentRoundIndex?: number;
  onSelect: (index: number) => void;
  t: (key: string, options?: any) => string;
}

const StepsHeader = ({
  rounds,
  activeIndex,
  currentRoundIndex,
  onSelect,
  t,
}: StepsHeaderProps) => {
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const responsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        fontSize: fontSize.base,
        paddingH: spacing.xl,
        paddingV: spacing.md,
        gap: spacing.xl,
        indicatorSize: fontSize.sm,
      };
    }
    if (isLargeScreen) {
      return {
        fontSize: fontSize.sm,
        paddingH: spacing.lg,
        paddingV: spacing.sm,
        gap: spacing.lg,
        indicatorSize: fontSize.xs,
      };
    }
    if (isTablet) {
      return {
        fontSize: fontSize.sm,
        paddingH: spacing.md,
        paddingV: spacing.sm,
        gap: spacing.md,
        indicatorSize: fontSize.xs,
      };
    }
    return {
      fontSize: fontSize.xs,
      paddingH: spacing.md,
      paddingV: spacing.sm,
      gap: spacing.md,
      indicatorSize: 10,
    };
  }, [isTV, isLargeScreen, isTablet]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, { gap: responsiveStyles.gap }]}
      testID="steps-header-scroll"
    >
      {rounds.map((round, idx) => {
        const isActive = idx === activeIndex;
       
        return (
          <Pressable
            key={round.name}
            onPress={() => onSelect(idx)}
            style={({ pressed }) => [
              styles.button,
              { paddingHorizontal: responsiveStyles.paddingH, paddingVertical: responsiveStyles.paddingV },
              isActive ? styles.buttonActive : styles.buttonInactive,
              pressed && styles.buttonPressed,
            ]}
            testID={`step-button-${idx}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.buttonText,
                  { fontSize: responsiveStyles.fontSize },
                  isActive ? styles.buttonTextActive : styles.buttonTextInactive,
                ]}
              >
                {t(`fixtures.${normalizeLeagueRound(round.name)}`, {
                  defaultValue: round.name,
                })}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  } as ViewStyle,
  buttonActive: {
    backgroundColor: colors.brand.yellow,
  } as ViewStyle,
  buttonInactive: {
    backgroundColor: colors.background.card,
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.7,
  } as ViewStyle,
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  } as ViewStyle,
  buttonText: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
  } as TextStyle,
  buttonTextActive: {
    color: colors.background.dark,
  } as TextStyle,
  buttonTextInactive: {
    color: colors.text.secondary,
  } as TextStyle,
});

export default StepsHeader;
