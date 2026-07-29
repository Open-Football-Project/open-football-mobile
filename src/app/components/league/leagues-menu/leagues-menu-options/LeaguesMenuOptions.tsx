import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '../../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, shadows, breakpoints } from '../../../../theme';

export interface LeagueMenuSelectionOption {
  id: number;
  country: string;
}

interface LeaguesMenuOptionsProps {
  items: LeagueMenuSelectionOption[];
  selectItem: (item: LeagueMenuSelectionOption) => void;
}

interface OptionItemProps {
  item: LeagueMenuSelectionOption;
  onPress: (item: LeagueMenuSelectionOption) => void;
  isTv?: boolean;
}

const OptionItem = ({
  item,
  onPress,
  isTv,
}: OptionItemProps) => {
  const { t } = useTranslation();

  const countryName = t(`country.${item.country.toLowerCase()}`, {
    defaultValue: item.country,
  });

  const iconSize = isTv ? fontSize.xl : fontSize.sm;

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.optionItem,
        isTv && styles.optionItemTv,
        pressed && styles.optionItemPressed,
      ]}
      testID={String(`${item.country}-${item.id}`)}
      accessibilityRole="button"
      accessibilityLabel={countryName}
    >
      <Text
        style={[
          styles.countryText,
          isTv && styles.countryTextTv,
        ]}
        numberOfLines={1}
      >
        {countryName}
      </Text>
      <ChevronRightIcon size={iconSize} />
    </Pressable>
  );
};

export const LeaguesMenuOptions = ({
  items,
  selectItem,
}: LeaguesMenuOptionsProps) => {
  const { width } = useWindowDimensions();

  const isTv = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const getItemWidth = () => {
    if (isTv) return '24%';
    if (isLargeScreen) return '31%';
    if (isTablet) return '31%';
    return '48%';
  };

  return (
    <View style={styles.container} testID="leagues-menu-options">
      <View style={styles.grid}>
        {items.map((item) => (
          <View 
            key={`${item.country}-${item.id}`} 
            style={[styles.itemWrapper, { width: getItemWidth() as any }]}
          >
            <OptionItem
              item={item}
              onPress={selectItem}
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
  },

  grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  },

  itemWrapper: {
  marginBottom: spacing.sm,
  },

  optionItem: {
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

  optionItemTv: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  optionItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  countryText: {
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.xs,
    flex: 1,
    textTransform: 'uppercase',
  },

  countryTextTv: {
    fontSize: fontSize.base,
  },
});


