import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { buildRoundsInOrder, flatKnockoutMatches } from '../utils/utils';
import NoData from '../../../general/no-data/NoData';
import StepsHeader from '../stepsheader/StepsHeader';
import { normalizeLeagueRound, LeagueFixture } from 'open-football-project-core';
import KnockoutCard from '../knt-card/KnockoutCard';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../../theme';

interface KnockoutStepperProps {
  fixtures: LeagueFixture;
}

const KnockoutStepper = ({ fixtures }: KnockoutStepperProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const getResponsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        containerPadding: spacing.xl,
        gap: spacing.xl,
        cardGap: spacing.lg,
        titleSize: fontSize.lg,
        columns: 3,
      };
    }
    if (isLargeScreen) {
      return {
        containerPadding: spacing.lg,
        gap: spacing.lg,
        cardGap: spacing.md,
        titleSize: fontSize.base,
        columns: 2,
      };
    }
    if (isTablet) {
      return {
        containerPadding: spacing.md,
        gap: spacing.md,
        cardGap: spacing.md,
        titleSize: fontSize.sm,
        columns: 2,
      };
    }
    return {
      containerPadding: spacing.md,
      gap: spacing.md,
      cardGap: spacing.sm,
      titleSize: fontSize.sm,
      columns: 1,
    };
  }, [isTV, isLargeScreen, isTablet]);

  const rounds = useMemo(() => {
    if (!fixtures?.rounds?.length) return [];
    return buildRoundsInOrder(fixtures.rounds).filter(
      (r) => flatKnockoutMatches(r).length > 0
    );
  }, [fixtures]);

  const currentRoundIndex = useMemo(() => {
    return rounds.findIndex((round) =>
      flatKnockoutMatches(round).some((m) => !m.isFinished)
    );
  }, [rounds]);

  const [activeIndex, setActiveIndex] = useState(
    currentRoundIndex !== -1 ? currentRoundIndex : rounds.length - 1
  );

  if (rounds.length === 0) return <NoData />;

  const activeRound = rounds[activeIndex];
  const matches = flatKnockoutMatches(activeRound);

 
  const cardWidth = getResponsiveStyles.columns > 1 
    ? `${Math.floor(100 / getResponsiveStyles.columns) - 1}%` as const
    : '100%' as const;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingHorizontal: getResponsiveStyles.containerPadding, paddingVertical: getResponsiveStyles.containerPadding, gap: getResponsiveStyles.gap }
      ]}
      showsVerticalScrollIndicator={false}
      testID="knockout-stepper-container"
    >
      <StepsHeader
        rounds={rounds}
        activeIndex={activeIndex}
        currentRoundIndex={currentRoundIndex}
        onSelect={setActiveIndex}
        t={t}
      />

      <View style={[styles.cardsContainer, { padding: getResponsiveStyles.containerPadding, gap: getResponsiveStyles.cardGap }]}>
        <Text style={[styles.roundTitle, { fontSize: getResponsiveStyles.titleSize }]} testID="round-title">
          {t(`fixtures.${normalizeLeagueRound(activeRound.name)}`, {
            defaultValue: activeRound.name,
          })}
        </Text>

        <View style={[styles.grid, { gap: getResponsiveStyles.cardGap }]}>
          {matches.map((match) => (
            <View key={match.fixtureId} style={[styles.cardWrapper, { width: cardWidth }]}>
              <KnockoutCard match={match} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: borders.thin,
    borderColor: colors.brand.dona,
  } as ViewStyle,
  contentContainer: {
    flexGrow: 1,
  } as ViewStyle,
  cardsContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
  } as ViewStyle,
  roundTitle: {
    color: colors.brand.yellow,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  } as TextStyle,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  } as ViewStyle,
  cardWrapper: {
    flexShrink: 0,
  } as ViewStyle,
});

export default KnockoutStepper;
