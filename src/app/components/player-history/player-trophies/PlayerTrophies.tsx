import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  translateCountry,
  translateLeague,
  PlayerTrophyInfo,
} from '@matchinsights/core';
import NoData from '../../general/no-data/NoData';
import { TrophyIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, breakpoints } from '../../../theme';

interface PlayerTrophiesProps {
  trophies: PlayerTrophyInfo[];
}

const PlayerTrophies = ({ trophies }: PlayerTrophiesProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const gridColumns = isTV ? 4 : isLargeScreen ? 3 : isTablet ? 2 : 1;
  const cardPadding = isTV ? spacing.lg : isLargeScreen ? spacing.md : isTablet ? spacing.sm : spacing.sm;
  const gapSize = isTV ? spacing.lg : isLargeScreen ? spacing.md : isTablet ? spacing.sm : spacing.sm;
  const leagueFontSize = isTV ? fontSize.base : isLargeScreen ? fontSize.sm : isTablet ? fontSize.xs : fontSize.xs;
  const placeFontSize = isTV ? fontSize.base : isLargeScreen ? fontSize.sm : isTablet ? fontSize.xs : fontSize.xs;
  const seasonFontSize = isTV ? fontSize.sm : isLargeScreen ? fontSize.xs : isTablet ? fontSize.xs : fontSize.xs;
  const countryFontSize = isTV ? fontSize.sm : isLargeScreen ? fontSize.xs : isTablet ? fontSize.xs : fontSize.xs;
  const trophyIconSize = isTV ? fontSize.xl : isLargeScreen ? fontSize.lg : fontSize.base;

  const filteredAndSortedTrophies = useMemo(() => {
    const validTrophies = trophies.filter(
      (trophy) => trophy.league && trophy.season && trophy.place
    );

    return validTrophies.sort((a, b) => {
      if (!a.season) return 1;
      if (!b.season) return -1;
      return b.season.localeCompare(a.season);
    });
  }, [trophies]);

  if (!filteredAndSortedTrophies.length) {
    return <NoData message={t('nodata.notrophies')} />;
  }

  const renderTrophyCard = (trophy: PlayerTrophyInfo, index: number) => {
    // Calculate card width - adjust for mobile vs grid layouts
    const cardWidthPercent = 100 / gridColumns;
    const cardWidthStyle = gridColumns > 1 
      ? { flexBasis: `${cardWidthPercent - 1}%` as const, maxWidth: `${cardWidthPercent - 1}%` as const }
      : { width: '100%' as const };

    return (
      <View
        key={`trophy-${index}`}
        style={[
          styles.trophyCard,
          {
            padding: cardPadding,
            marginBottom: gapSize,
            ...cardWidthStyle,
          },
        ]}
        testID={`trophy-card-${index}`}
        accessibilityLabel={`${trophy.league} ${trophy.place} ${trophy.season}`}
      >
        <View style={styles.trophyHeader}>
          <TrophyIcon size={trophyIconSize} color={colors.brand.yellow} testID="trophy-icon" />
          <Text
            style={[
              styles.leagueText,
              {
                fontSize: leagueFontSize,
                color: colors.brand.yellow,
                marginLeft: spacing.xs,
                flex: 1,
              },
            ]}
            numberOfLines={2}
          >
            {translateLeague(trophy.league!, t)}
          </Text>
        </View>

        {trophy.place && (
          <Text
            style={[
              styles.placeText,
              {
                fontSize: placeFontSize,
                color: colors.brand.orange,
                marginTop: spacing.xs,
              },
            ]}
          >
            {trophy.place}
          </Text>
        )}

        {trophy.season && (
          <Text
            style={[
              styles.seasonText,
              {
                fontSize: seasonFontSize,
                color: colors.text.secondary,
                marginTop: spacing.xs,
              },
            ]}
          >
            {trophy.season}
          </Text>
        )}

        {trophy.country && (
          <Text
            style={[
              styles.countryText,
              {
                fontSize: countryFontSize,
                color: colors.text.secondary,
                marginTop: spacing.sm,
              },
            ]}
          >
            {translateCountry(trophy.country, t)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container} testID="player-trophies-container">
      <View style={[styles.gridContainer, { gap: gapSize }]}>
        {filteredAndSortedTrophies.map((trophy, index) => renderTrophyCard(trophy, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  trophyCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.navbar,
  },
  trophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueText: {
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  placeText: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
  },
  seasonText: {
    fontWeight: fontWeight.semibold,
  },
  countryText: {
    fontWeight: fontWeight.normal,
  },
});

export default PlayerTrophies;
