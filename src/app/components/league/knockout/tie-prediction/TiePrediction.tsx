import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Logo from '../../../general/logo/Logo';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../../theme';

interface TiePredictionProps {
  t1: string;
  t1logo?: string;
  t2: string;
  t2logo?: string;
  onPredict: (winner: string | null) => void;
}

const parseScore = (value: string): number | null => (value === '' ? null : Number(value));

const resolveWinner = (
  t1: string,
  t2: string,
  t1Score: number | null,
  t2Score: number | null,
): string | null => {
  if (t1Score === null || t2Score === null) return null;
  if (t1Score > t2Score) return t1;
  if (t2Score > t1Score) return t2;
  return null;
};

const TiePrediction = ({ t1, t1logo, t2, t2logo, onPredict }: TiePredictionProps) => {
  const { t } = useTranslation();
  const [t1Value, setT1Value] = useState('');
  const [t2Value, setT2Value] = useState('');

  const winner = resolveWinner(t1, t2, parseScore(t1Value), parseScore(t2Value));

  const handleChange = (side: 't1' | 't2', raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    const nextT1Value = side === 't1' ? digitsOnly : t1Value;
    const nextT2Value = side === 't2' ? digitsOnly : t2Value;

    if (side === 't1') setT1Value(digitsOnly);
    else setT2Value(digitsOnly);

    onPredict(resolveWinner(t1, t2, parseScore(nextT1Value), parseScore(nextT2Value)));
  };

  const teamRow = (name: string, logo: string | undefined, value: string, side: 't1' | 't2') => (
    <View style={styles.teamRow}>
      <View style={styles.teamInfo}>
        <Logo src={logo} size={16} />
        <Text
          style={[styles.teamName, winner === name && styles.teamNameWinner]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      <TextInput
        testID={`tie-prediction-input-${side}`}
        keyboardType="numeric"
        maxLength={2}
        value={value}
        onChangeText={(text) => handleChange(side, text)}
        style={styles.input}
        placeholderTextColor={colors.text.secondary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {teamRow(t1, t1logo, t1Value, 't1')}
      {teamRow(t2, t2logo, t2Value, 't2')}

      {winner && (
        <Text style={styles.winnerLabel} testID="tie-prediction-winner">
          {t('knockout.predictedWinner', { defaultValue: 'Predicted winner' })}: {winner}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.lg,
    width: '100%',
    padding: spacing.md,
    gap: spacing.xs,
  } as ViewStyle,
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  } as ViewStyle,
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  } as ViewStyle,
  teamName: {
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.text.primary,
    fontSize: fontSize.xs,
    flex: 1,
  } as TextStyle,
  teamNameWinner: {
    color: colors.brand.yellow,
  } as TextStyle,
  input: {
    width: 32,
    textAlign: 'center',
    borderWidth: borders.thin,
    borderColor: colors.brand.yellow,
    borderRadius: borderRadius.sm,
    color: colors.brand.yellow,
    fontWeight: fontWeight.bold,
    paddingVertical: spacing.xs,
  } as TextStyle,
  winnerLabel: {
    color: colors.text.secondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  } as TextStyle,
});

export default TiePrediction;
