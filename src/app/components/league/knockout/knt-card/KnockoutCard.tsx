import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { LeagueFixturesMatch, getFormattedDate } from "@matchinsights/core";
import Logo from "../../../general/logo/Logo";
import MatchButton from "../../../general/match-button/MatchButton";
import { LiveIcon, TrophyIcon } from '../../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, shadows, breakpoints } from '../../../../theme';

interface KnockoutCardProps {
  match: LeagueFixturesMatch;
}

const KnockoutCard = ({ match }: KnockoutCardProps) => {
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const responsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        padding: spacing.lg,
        scoreSize: fontSize.lg,
        dateSize: fontSize.sm,
        teamNameSize: fontSize.sm,
        logoSize: 32,
        minHeight: 140,
      };
    }
    if (isLargeScreen) {
      return {
        padding: spacing.md,
        scoreSize: fontSize.base,
        dateSize: fontSize.sm,
        teamNameSize: fontSize.sm,
        logoSize: 28,
        minHeight: 120,
      };
    }
    if (isTablet) {
      return {
        padding: spacing.md,
        scoreSize: fontSize.sm,
        dateSize: fontSize.xs,
        teamNameSize: fontSize.xs,
        logoSize: 24,
        minHeight: 110,
      };
    }
    return {
      padding: spacing.md,
      scoreSize: fontSize.sm,
      dateSize: fontSize.xs,
      teamNameSize: fontSize.xs,
      logoSize: 20,
      minHeight: 104,
    };
  }, [isTV, isLargeScreen, isTablet]);

  const scoreLabel = match.isFinished
    ? `${match.homeTeamScore} – ${match.awayTeamScore}`
    : "–";

  // Determine winner for highlighting
  const homeWon = match.isFinished && (match.homeTeamScore ?? 0) > (match.awayTeamScore ?? 0);
  const awayWon = match.isFinished && (match.awayTeamScore ?? 0) > (match.homeTeamScore ?? 0);

  return (
    <View 
      style={[
        styles.container, 
        { padding: responsiveStyles.padding, minHeight: responsiveStyles.minHeight }
      ]} 
      testID="knockout-card"
    >
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          {match.isLiveNow && (
            <LiveIcon size={responsiveStyles.scoreSize} testID="card-live-icon" />
          )}
          <Text
            style={[
              styles.score,
              { fontSize: responsiveStyles.scoreSize },
              match.isLiveNow 
                ? styles.scoreLive 
                : match.isFinished 
                  ? styles.scoreFinished 
                  : styles.scoreUpcoming,
            ]}
            testID="match-score"
          >
            {scoreLabel}
          </Text>
        </View>

        <Text style={[styles.date, { fontSize: responsiveStyles.dateSize }]} testID="match-date">
          {getFormattedDate(match.date, "dd MMM")}
        </Text>

        <MatchButton fixtureId={match.fixtureId} isLiveNow={match.isLiveNow} />
      </View>

      <View style={styles.teamsSection}>
        <View style={[styles.team, homeWon && styles.winnerTeam]}>
          <Logo src={match.homeTeamLogo} size={responsiveStyles.logoSize} />
          <Text 
            style={[
              styles.teamName, 
              { fontSize: responsiveStyles.teamNameSize },
              homeWon && styles.winnerTeamName
            ]} 
            numberOfLines={1} 
            testID="home-team-name"
          >
            {match.homeTeamName}
          </Text>
          {homeWon && <TrophyIcon size={responsiveStyles.teamNameSize} testID="home-winner-icon" />}
        </View>

        <View style={[styles.team, awayWon && styles.winnerTeam]}>
          <Logo src={match.awayTeamLogo} size={responsiveStyles.logoSize} />
          <Text 
            style={[
              styles.teamName, 
              { fontSize: responsiveStyles.teamNameSize },
              awayWon && styles.winnerTeamName
            ]} 
            numberOfLines={1} 
            testID="away-team-name"
          >
            {match.awayTeamName}
          </Text>
          {awayWon && <TrophyIcon size={responsiveStyles.teamNameSize} testID="away-winner-icon" />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    width: '100%',
    justifyContent: 'space-between',
    borderWidth: borders.thin,
    borderColor: colors.brand.green,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  } as ViewStyle,
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  } as ViewStyle,
  score: {
    fontWeight: fontWeight.bold,
  } as TextStyle,
  scoreFinished: {
    color: colors.brand.yellow,
  } as TextStyle,
  scoreLive: {
    color: colors.brand.red,
  } as TextStyle,
  scoreUpcoming: {
    color: colors.text.secondary,
  } as TextStyle,
  date: {
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
    flex: 1,
  } as TextStyle,
  teamsSection: {
    marginTop: spacing.md,
    gap: spacing.sm,
  } as ViewStyle,
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,
  winnerTeam: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginHorizontal: -spacing.xs,
  } as ViewStyle,
  teamName: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.text.primary,
    flex: 1,
  } as TextStyle,
  winnerTeamName: {
    color: colors.brand.yellow,
  } as TextStyle,
});

export default KnockoutCard;
