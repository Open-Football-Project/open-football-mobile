import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  MarketOddsReason,
  SeasonFormReason,
  TodayPlayerScore,
  translatePlayerPosition,
} from 'open-football-project-core';

import { colors, spacing, fontSize, fontWeight, borderRadius, breakpoints } from '../../../theme';

interface TodayPlayerCardProps {
  playerScore: TodayPlayerScore;
  teamName: string;
}

const MAX_MARKETS_SHOWN = 2;

const defaultPlayerImage = require('../../../assets/images/player.png');

const tKey = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\d.+\-:,]+/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, '_');

const TodayPlayerCard = ({ playerScore, teamName }: TodayPlayerCardProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isTablet = width >= breakpoints.tablet;
  const [imageError, setImageError] = useState(false);
  const { player, score, signal, reason } = playerScore;

  const isOddsImplied = signal === 'ODDS_IMPLIED';

  const oddsReasonItems = (marketOdds: MarketOddsReason) => {
    const probabilityItem = `${t('todayplayers.avg_implied_probability', {
      defaultValue: 'Avg. implied probability',
    })}: ${Math.round(score * 100)}%`;

    const { markets } = marketOdds;
    const hiddenCount = markets.length - MAX_MARKETS_SHOWN;
    const marketItems =
      hiddenCount > 1
        ? [
            ...markets
              .slice(0, MAX_MARKETS_SHOWN)
              .map((market) => t(`todayplayers.markets.${tKey(market)}`, { defaultValue: market })),
            t('todayplayers.more_markets', { defaultValue: `+${hiddenCount} more`, count: hiddenCount }),
          ]
        : markets.map((market) => t(`todayplayers.markets.${tKey(market)}`, { defaultValue: market }));

    return [probabilityItem, ...marketItems];
  };

  const seasonFormReasonItems = (seasonForm: SeasonFormReason) => [
    `${t('common.appearences', { defaultValue: 'Appearences' })}: ${seasonForm.appearances}`,
    `${t('common.goals', { defaultValue: 'Goals' })}: ${seasonForm.goals}`,
    `${t('common.assists', { defaultValue: 'Assists' })}: ${seasonForm.assists}`,
    `${t('common.rating', { defaultValue: 'Rating' })}: ${seasonForm.rating.toFixed(1)}`,
  ];

  const signalLabel = isOddsImplied
    ? t('todayplayers.signal_odds', { defaultValue: 'Odds' })
    : t('todayplayers.signal_season_stat', { defaultValue: 'Season Form' });

  const reasonItems = isOddsImplied
    ? oddsReasonItems(reason as MarketOddsReason)
    : seasonFormReasonItems(reason as SeasonFormReason);

  const playerImage = !player.photo || imageError ? defaultPlayerImage : { uri: player.photo };

  return (
    <View
      testID="today-player-card"
      style={[
        styles.card,
        { flexDirection: isTablet ? 'row' : 'column', alignItems: isTablet ? 'flex-start' : 'center' },
      ]}
    >
      <View style={styles.photoColumn}>
        <Image
          testID="today-player-image"
          source={playerImage}
          style={styles.photo}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
        <Text style={styles.name}>{player.name}</Text>
        {player.position && (
          <Text testID="today-player-position" style={styles.position}>
            {translatePlayerPosition(player.position, t)}
          </Text>
        )}
      </View>

      <View
        testID="today-player-info-column"
        style={[
          isTablet ? styles.infoColumn : null,
          { alignItems: isTablet ? 'flex-start' : 'center' },
        ]}
      >
        <Text style={[styles.teamName, { textAlign: isTablet ? 'left' : 'center' }]}>{teamName}</Text>
        <Text
          testID="today-player-signal"
          style={[
            styles.signalBadge,
            { alignSelf: isTablet ? 'flex-start' : 'center' },
            isOddsImplied ? styles.signalBadgeOdds : styles.signalBadgeSeason,
          ]}
        >
          {signalLabel}
        </Text>
        {isOddsImplied && (
          <Text
            testID="today-player-markets-label"
            style={[styles.marketsLabel, { textAlign: isTablet ? 'left' : 'center' }]}
          >
            {t('todayplayers.markets_used_label', { defaultValue: 'Matching Markets?' })}
          </Text>
        )}
        <View testID="today-player-reasons">
          {reasonItems.map((item, index) => (
            <Text
              key={index}
              testID={`today-player-reason-${index}`}
              style={[styles.reasonItem, { textAlign: isTablet ? 'left' : 'center' }]}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  photoColumn: {
    alignItems: 'center',
    width: 80,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
  },
  name: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.brand.yellow,
    textAlign: 'center',
  },
  position: {
    fontSize: fontSize.xs,
    color: colors.text.primary,
    textAlign: 'center',
  },
  infoColumn: {
    flex: 1,
  },
  teamName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  signalBadge: {
    marginTop: spacing.xs,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  signalBadgeOdds: {
    backgroundColor: colors.brand.orange,
    color: colors.white,
  },
  signalBadgeSeason: {
    backgroundColor: colors.background.dark,
    color: colors.brand.aqualight,
  },
  marketsLabel: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  reasonItem: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.text.primary,
  },
});

export default TodayPlayerCard;
