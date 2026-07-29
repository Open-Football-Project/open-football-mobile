import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  LeagueBasicInfo,
  leagueTranslationKey,
  cleanLeagueName,
} from 'open-football-project-core';
import Logo from '../../../../components/general/logo/Logo';
import { RootStackParamList, Routes } from '../../../../navigation/RootNavigator';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, shadows, breakpoints } from '../../../../theme';

interface LeaguesMenuGridProps {
  leagues: LeagueBasicInfo[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LeagueItemProps {
  league: LeagueBasicInfo;
  onPress: (leagueId: string) => void;
  isTv?: boolean;
}

const LeagueItem = ({ league, onPress, isTv }: LeagueItemProps) => {
  const { t } = useTranslation();

  const leagueName = cleanLeagueName(
    t(`league.${leagueTranslationKey(league.name)}`, {
      defaultValue: league.name,
    })
  );

  return (
    <Pressable
      onPress={() => onPress(`${league.id}`)}
      style={({ pressed }) => [
        styles.leagueItem,
        isTv && styles.leagueItemTv,
        pressed && styles.leagueItemPressed,
      ]}
      testID={String(league.id)}
      accessibilityRole="button"
      accessibilityLabel={leagueName}
    >
      <Logo src={league.logo} size={isTv ? 30 : 20} />
      <Text 
        style={[styles.leagueName, isTv && styles.leagueNameTv]} 
        numberOfLines={2}
      >
        {leagueName}
      </Text>
    </Pressable>
  );
};

export const LeaguesMenuGrid = ({ leagues }: LeaguesMenuGridProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const isTv = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const handleLeaguePress = (leagueId: string) => {
    navigation.navigate(Routes.LEAGUE, { leagueId });
  };

  const getItemWidth = () => {
    if (isTv) return '24%';
    if (isLargeScreen) return '31%';
    if (isTablet) return '31%';
    return '48%';
  };

  return (
    <View style={styles.container} testID="leagues-menu-grid">
      <View style={styles.grid}>
        {leagues.map((league, index) => (
          <View 
            key={`${league.id}-${index}`} 
            style={[styles.itemWrapper, { width: getItemWidth() as any }]}
          >
            <LeagueItem 
              league={league} 
              onPress={handleLeaguePress}
              isTv={isTv}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  } as ViewStyle,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'flex-start',
  } as ViewStyle,
  itemWrapper: {
    marginBottom: spacing.xs,
  } as ViewStyle,
  leagueItem: {
      backgroundColor: colors.background.dark,

    borderRadius: borderRadius.sm,

    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: borders.hairline,
    borderColor: colors.brand.purple,

    ...shadows.glow,
  },
  leagueItemTv: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  } as ViewStyle,
  leagueItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,
  leagueName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: 'uppercase',
    flex: 1,
  } as TextStyle,
  leagueNameTv: {
    fontSize: fontSize.base,
  } as TextStyle,
});
