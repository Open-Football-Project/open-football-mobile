import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlayerTransferInfo, PlayerTrophyInfo } from 'open-football-project-core';
import PlayerTransfers from '../player-transfers/PlayerTransfers';
import PlayerTrophies from '../player-trophies/PlayerTrophies';
import { TransferArrowIcon, TrophyIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../theme';

interface PlayerHistoryTabsProps {
  transfers: PlayerTransferInfo[];
  trophies: PlayerTrophyInfo[];
}

type TabType = 'transfers' | 'trophies';

const PlayerHistoryTabs = ({ transfers, trophies }: PlayerHistoryTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('transfers');
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const tabFontSize = isTV ? fontSize.base : isLargeScreen ? fontSize.sm : isTablet ? fontSize.xs : fontSize.xs;
  const contentPadding = isTV ? spacing.xl : isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;
  const tabPadding = isTV ? spacing.lg : isLargeScreen ? spacing.md : isTablet ? spacing.sm : spacing.sm;
  const iconSize = isTV ? fontSize.lg : isLargeScreen ? fontSize.base : fontSize.sm;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'transfers', 
      label: t('common.transfers'),
      icon: <TransferArrowIcon size={iconSize} color={activeTab === 'transfers' ? colors.brand.orange : colors.text.secondary} />,
    },
    { 
      id: 'trophies', 
      label: t('common.trophies'),
      icon: <TrophyIcon size={iconSize} color={activeTab === 'trophies' ? colors.brand.yellow : colors.text.secondary} />,
    },
  ];

  return (
    <View style={styles.container} testID="player-history-tabs">
      <View style={styles.tabButtonsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
            accessibilityLabel={tab.label}
            style={({ pressed }) => [
              styles.tabButton,
              {
                flex: 1,
                paddingVertical: tabPadding,
                backgroundColor: activeTab === tab.id ? colors.background.card : 'transparent',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            testID={`tab-button-${tab.id}`}
          >
            <View style={styles.tabButtonContent}>
              {tab.icon}
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    fontSize: tabFontSize,
                    color: activeTab === tab.id ? colors.brand.orange : colors.text.secondary,
                  },
                ]}
              >
                {tab.label.toUpperCase()}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={[styles.contentContainer, { padding: contentPadding }]}>
        {activeTab === 'transfers' && (
          <View testID="transfers-content">
            <PlayerTransfers transfers={transfers} />
          </View>
        )}
        {activeTab === 'trophies' && (
          <View testID="trophies-content">
            <PlayerTrophies trophies={trophies} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    width: '100%',
    overflow: 'hidden',
    borderWidth: borders.thin,
    borderColor: colors.brand.dona,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.background.navbar,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabButtonText: {
    fontWeight: fontWeight.semibold,
  },
  contentContainer: {
    width: '100%',
  },
});

export default PlayerHistoryTabs;
