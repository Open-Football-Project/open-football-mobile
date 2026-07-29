import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight } from '../../../theme';

interface StatusTileProps {
  isUp: boolean;
  isFlat: boolean;
  status: string;
}

const ArrowStatusTile = ({ isUp, isFlat, status }: StatusTileProps) => {
  const getArrowStyle = () => {
    if (isUp && !isFlat) {
      return { backgroundColor: colors.brand.success, color: colors.text.darker };
    }
    if (!isUp && !isFlat) {
      return { backgroundColor: colors.brand.danger, color: colors.text.darker };
    }
    return { backgroundColor: colors.brand.yellow, color: colors.text.darker };
  };

  const getArrowIcon = () => {
    if (isUp && !isFlat) {
      return <ArrowUpIcon size={10} color={colors.text.darker} />;
    }
    if (!isUp && !isFlat) {
      return <ArrowDownIcon size={10} color={colors.text.darker} />;
    }
    return <MinusIcon size={10} color={colors.text.darker} />;
  };

  const arrowStyle = getArrowStyle();

  return (
    <View style={styles.container}>
      <View
        testID="arrow-icon"
        style={[
          styles.iconWrapper,
          { backgroundColor: arrowStyle.backgroundColor },
        ]}
      >
        {getArrowIcon()}
      </View>
      <Text style={styles.status}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  status: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.cream,
  },
});

export default ArrowStatusTile;
