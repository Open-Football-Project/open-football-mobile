import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Routes } from '../../../navigation/RootNavigator';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows, sizes } from '../../../theme';

interface ChartButtonProps {
  fixtureId: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChartButton = ({ fixtureId }: ChartButtonProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate(Routes.CHARTS, { fixtureId: String(fixtureId) });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      testID="chart-link"
    >
      <Text style={styles.buttonText}>{t('matchbtn.chart', { defaultValue: 'Charts' })}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: sizes.matchButtonMinWidth,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brand.blueintense,
    ...shadows.md,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
});

export default ChartButton;
