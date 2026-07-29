import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ApiService, LiveMatch, useCharteableMatchNow, useTopGuysAvailable } from '@matchinsights/core';
import Logo from '../../general/logo/Logo';
import MatchButton from '../../general/match-button/MatchButton';
import ChartButton from '../../general/chart-button/ChartButton';
import TopGuysButton from '../../general/top-guys-button/TopGuysButton';
import { TimerIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../../theme';

interface LiveMatchCardProps {
  match: LiveMatch;
  isSelected: boolean;
  onPress: () => void;
  apiService: ApiService;
}

const LiveMatchCard = ({ match, isSelected, onPress, apiService }: LiveMatchCardProps) => {
  const { isCharteableMatchNow } = useCharteableMatchNow(apiService, match.id);
  const { isTopGuysAvailable } = useTopGuysAvailable(apiService, match.id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.matchCard,
        isSelected && styles.matchCardSelected,
        { opacity: pressed ? 0.85 : 1 },
      ]}
      testID={`match-card-${match.id}`}
    >
      {isSelected && <View testID="selected-accent" style={styles.selectedAccent} />}

      <View style={styles.teamsRow}>
        <View style={styles.teamSide}>
          <Logo src={match.homeTeamLogo ?? undefined} size={16} />
          <Text style={styles.teamName} numberOfLines={1}>
            {match.homeTeamName}
          </Text>
        </View>

        <View style={styles.scoreCenter}>
          <Text style={styles.score} testID={`score-${match.id}`}>
            {match.homeTeamScore} - {match.awayTeamScore}
          </Text>
        </View>

        <View style={[styles.teamSide, styles.teamSideRight]}>
          <Text style={[styles.teamName, { textAlign: 'right' }]} numberOfLines={1}>
            {match.awayTeamName}
          </Text>
          <Logo src={match.awayTeamLogo ?? undefined} size={16} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.timerBlock}>
          <TimerIcon size={10} color={colors.brand.success} testID={`timer-icon-${match.id}`} />
          <Text style={styles.elapsedTime} testID={`elapsed-time-${match.id}`}>
            {match.elapsedTime
              ? `${Math.floor(match.elapsedTime)}${match.extraTime ? `+${match.extraTime}` : ''}'`
              : '-'}
          </Text>
        </View>
        {match.statusShort ? (
          <Text style={styles.statusText} testID={`status-badge-${match.id}`}>
            {match.statusShort}
          </Text>
        ) : null}
        <MatchButton isLiveNow={false} fixtureId={match.id} />
      </View>

      {(isCharteableMatchNow || isTopGuysAvailable) && (
        <View style={styles.entryPointsRow}>
          {isCharteableMatchNow && <ChartButton fixtureId={match.id} />}
          {isTopGuysAvailable && <TopGuysButton fixtureId={match.id} />}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  matchCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.background.navbar,
    backgroundColor: colors.background.card,
    overflow: 'hidden',
  },
  matchCardSelected: {
    borderColor: colors.brand.cream,
    borderWidth: 1.5,
  },
  selectedAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.brand.rose,
    zIndex: 1,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  teamSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  teamSideRight: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  teamName: {
    flex: 1,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: 'uppercase',
  },
  scoreCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  score: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.brand.cream,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.overlay.white05,
  },
  timerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  elapsedTime: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.success,
  },
  statusText: {
    fontSize: 9,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: 'uppercase',
    flex: 1,
  },
  entryPointsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
});

export default LiveMatchCard;
