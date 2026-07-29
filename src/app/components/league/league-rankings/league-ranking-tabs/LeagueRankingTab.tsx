import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LeagueRankingPlayer } from 'open-football-project-core';
import { useTranslation } from 'react-i18next';
import NoData from '../../../general/no-data/NoData';
import LeagueRanking from '../LeagueRanking';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, sizes, opacity } from '../../../../theme';

interface LeagueRankingTabsProps {
  topScorers: LeagueRankingPlayer[];
  yellowCards: LeagueRankingPlayer[];
  redCards: LeagueRankingPlayer[];
  assists: LeagueRankingPlayer[];
}

interface Tab {
  id: string;
  label: string;
}

const LeagueRankingTabs = ({
  topScorers,
  yellowCards,
  redCards,
  assists,
}: LeagueRankingTabsProps) => {
  const { t } = useTranslation();

  const hasTopScorers = topScorers.length > 0;
  const hasYellowCards = yellowCards.length > 0;
  const hasRedCard = redCards.length > 0;
  const hasAssists = assists.length > 0;

  const availableTabs: Tab[] = [
    ...(hasTopScorers
      ? [{ id: 'scorers', label: t('common.top_scorers') }]
      : []),
    ...(hasYellowCards
      ? [{ id: 'yCards', label: t('common.top_y_cards') }]
      : []),
    ...(hasRedCard ? [{ id: 'rCards', label: t('common.top_r_cards') }] : []),
    ...(hasAssists ? [{ id: 'assists', label: t('common.top_assists') }] : []),
  ];

  if (availableTabs.length === 0) return <NoData />;

  const [activeTab, setActiveTab] = useState(availableTabs[0].id);

  const getRankingData = () => {
    switch (activeTab) {
      case 'scorers':
        return topScorers;
      case 'yCards':
        return yellowCards;
      case 'rCards':
        return redCards;
      case 'assists':
        return assists;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container} testID="league-ranking-tabs">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.tabActive,
                pressed && styles.tabPressed,
              ]}
              testID={`ranking-tab-${tab.id}`}
              accessible
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.contentContainer} testID="ranking-content">
        <LeagueRanking players={getRankingData()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  tabsScrollView: {
    maxHeight: sizes.touchableHeight + spacing.md,
  } as ViewStyle,
  tabsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.background.overlay,
  } as ViewStyle,
  tab: {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,

  backgroundColor: colors.background.dark,

  borderRadius: borderRadius.xs,

  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  } as ViewStyle,
  tabActive: {
    borderBottomColor: colors.brand.yellow,
  } as ViewStyle,
  tabPressed: {
    opacity: opacity.hover,
  } as ViewStyle,
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.dona,
    textAlign: 'center',
  } as TextStyle,
  tabLabelActive: {
    color: colors.brand.cream,
  } as TextStyle,
  contentContainer: {
    paddingVertical: spacing.sm,
  } as ViewStyle,
});

export default LeagueRankingTabs;
