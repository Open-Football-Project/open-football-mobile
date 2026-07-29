import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LeaguesGroups, translateCountry } from '@matchinsights/core';
import { LeaguesMenuGrid } from './leagues-menu-grid/LeaguesMenuGrid';
import { LeaguesMenuOptions } from './leagues-menu-options/LeaguesMenuOptions';
import NoData from '../../general/no-data/NoData';
import Controls from '../../general/controls/Controls';
import { ChevronLeftIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows, breakpoints } from '../../../theme';

export interface LeagueMenuSelectionOption {
  id: number;
  country: string;
}

interface LeaguesMenuProps {
  leaguesGroups?: LeaguesGroups;
  loading: boolean;
  isAnyLeagueAvailable: boolean;
}

export const LeaguesMenu = ({
  leaguesGroups,
  loading,
  isAnyLeagueAvailable,
}: LeaguesMenuProps) => {
  const [selectedOption, setSelectedOption] =
    useState<LeagueMenuSelectionOption | null>(null);
  const [selectionOptionSearch, setSelectionOptionSearch] = useState('');

  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTv = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const selectOption = (option: LeagueMenuSelectionOption) => {
    setSelectedOption(option);
  };

  const selectionOptions: LeagueMenuSelectionOption[] = [
    { id: -1, country: 'International' },
    ...(leaguesGroups?.countryLeagues.map((it, idx) => ({
      id: idx,
      country: it.country,
    })) ?? []),
  ];

  const filteredSelectionOptions = selectionOptions.filter((it) =>
    translateCountry(it.country, t)
      .toLowerCase()
      .includes(selectionOptionSearch.toLowerCase())
  );

  const leagues = () => {
    if (selectedOption?.id === -1) {
      return leaguesGroups?.internationals || [];
    }
    return (
      leaguesGroups?.countryLeagues[selectedOption?.id ?? 0]?.leagues || []
    );
  };

  const cleanUpSelection = () => {
    setSelectedOption(null);
    setSelectionOptionSearch('');
  };

  const iconSize = isTv ? fontSize.xxxl : isLargeScreen ? fontSize.xxl : fontSize.xl;

  if (loading) return <NoData loading={loading} />;

  if (!loading && !isAnyLeagueAvailable) {
    return <NoData />;
  }

  return (
    <View style={styles.container} testID="leagues-menu-container">
      <View style={[styles.header, isTv && styles.headerTv]}>
        {selectedOption && (
          <Text 
            style={[styles.title, isTv && styles.titleTv]}
            accessibilityRole="header"
          >
            {translateCountry(selectedOption.country, t)}
          </Text>
        )}
        {!selectedOption && (
          <Controls
            useInputControl={true}
            inputControlLabel={t('common.leaguesmenu')}
            inputControlValue={selectionOptionSearch}
            setInputControlValue={setSelectionOptionSearch}
            inputControlPlaceholder={t('common.countrysearch')}
          />
        )}

        {selectedOption && (
          <Pressable
            onPress={() => cleanUpSelection()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            testID="back-button"
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <ChevronLeftIcon size={iconSize} />
          </Pressable>
        )}
      </View>

      {isAnyLeagueAvailable && !selectedOption && (
        <LeaguesMenuOptions
          items={filteredSelectionOptions}
          selectItem={selectOption}
        />
      )}

      {isAnyLeagueAvailable && selectedOption && (
        <LeaguesMenuGrid leagues={leagues()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    minHeight: 50,
  },
  headerTv: {
    minHeight: 70,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.text.primary,
    flex: 1,
  },
  titleTv: {
    fontSize: fontSize.xxxl,
  },
  backButton: {
  padding: spacing.sm,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: spacing.sm,
  marginRight: spacing.sm,
  backgroundColor: `${colors.brand.aqualight}33`,
  borderRadius: borderRadius.full,
  ...shadows.sm,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
} as const);
