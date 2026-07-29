import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { ApiService, useCharteableMatchNow, useTopGuysAvailable } from '@matchinsights/core';

import Logo from '../../general/logo/Logo';
import MatchButton from '../../general/match-button/MatchButton';
import ChartButton from '../../general/chart-button/ChartButton';
import TopGuysButton from '../../general/top-guys-button/TopGuysButton';
import StatusOrTime from '../../general/status-or-time/StatusOrTime';
import { colors, spacing, fontSize, fontWeight } from '../../../theme';

export interface MatchRowData {
  fixtureId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  isFinished: boolean;
  isLiveNow: boolean;
  statusShort: string;
  date: string;
}

export interface MatchRowSizing {
  teamNameFontSize?: number;
  scoreFontSize?: number;
  logoSize?: number;
  teamGap?: number;
  statusWidth?: number;
  scoreWidth?: number;
}

export interface MatchRowProps {
  match: MatchRowData;
  testID: string;
  apiService: ApiService;
  onPress?: (event: GestureResponderEvent) => void;
  sizing?: MatchRowSizing;
  logoOuter?: boolean;
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_SIZING: Required<Pick<
  MatchRowSizing,
  'teamNameFontSize' | 'scoreFontSize' | 'logoSize' | 'teamGap'
>> = {
  teamNameFontSize: fontSize.xxs,
  scoreFontSize: fontSize.xs,
  logoSize: 16,
  teamGap: spacing.xs,
};

const MatchRow = ({
  match,
  testID,
  apiService,
  onPress,
  sizing,
  logoOuter = true,
  style,
  cardStyle,
}: MatchRowProps) => {
  const resolvedSizing = { ...DEFAULT_SIZING, ...sizing };
  const { isCharteableMatchNow } = useCharteableMatchNow(apiService, match.fixtureId);
  const { isTopGuysAvailable } = useTopGuysAvailable(apiService, match.fixtureId);

  const Container = onPress ? Pressable : View;

  const homeLogo = (
    <Logo key="home-logo" src={match.homeTeamLogo ?? undefined} size={resolvedSizing.logoSize} />
  );
  const homeName = (
    <Text
      key="home-name"
      style={[styles.teamName, { fontSize: resolvedSizing.teamNameFontSize }]}
      numberOfLines={1}
    >
      {match.homeTeamName}
    </Text>
  );
  const awayLogo = (
    <Logo key="away-logo" src={match.awayTeamLogo ?? undefined} size={resolvedSizing.logoSize} />
  );
  const awayName = (
    <Text
      key="away-name"
      style={[styles.teamName, { fontSize: resolvedSizing.teamNameFontSize }]}
      numberOfLines={1}
    >
      {match.awayTeamName}
    </Text>
  );

  return (
    <View style={cardStyle} testID={`${testID}-card`}>
      <Container
        onPress={onPress}
        style={[styles.row, style]}
        testID={testID}
        accessibilityLabel={`${match.homeTeamName} vs ${match.awayTeamName}`}
      >
        <View style={[styles.status, { width: resolvedSizing.statusWidth }]}>
          <StatusOrTime
            isFinished={match.isFinished}
            statusShort={match.statusShort}
            utcDate={match.date}
          />
        </View>

        <View style={[styles.team, styles.homeTeam, { gap: resolvedSizing.teamGap }]}>
          {logoOuter ? [homeLogo, homeName] : [homeName, homeLogo]}
        </View>

        <Text
          style={[styles.score, { width: resolvedSizing.scoreWidth, fontSize: resolvedSizing.scoreFontSize }]}
        >
          {match.isFinished ? `${match.homeTeamScore} - ${match.awayTeamScore}` : '-'}
        </Text>

        <View style={[styles.team, styles.awayTeam, { gap: resolvedSizing.teamGap }]}>
          {logoOuter ? [awayName, awayLogo] : [awayLogo, awayName]}
        </View>

        <View style={styles.buttonWrapper}>
          <MatchButton isLiveNow={match.isLiveNow} fixtureId={match.fixtureId} />
        </View>
      </Container>

      {(isCharteableMatchNow || isTopGuysAvailable) && (
        <View style={styles.entryPointsRow}>
          {isCharteableMatchNow && <ChartButton fixtureId={match.fixtureId} />}
          {isTopGuysAvailable && <TopGuysButton fixtureId={match.fixtureId} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryPointsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  status: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  team: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeTeam: {
    justifyContent: 'flex-end',
  },
  awayTeam: {
    justifyContent: 'flex-start',
  },
  teamName: {
    flexShrink: 1,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.text.primary,
  },
  score: {
    textAlign: 'center',
    color: colors.brand.yellow,
    fontWeight: fontWeight.bold,
  },
  buttonWrapper: {
    marginLeft: spacing.xs,
    marginRight: spacing.xxs,
  },
});

export default MatchRow;
