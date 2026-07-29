import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getFormattedDate, getFormattedTime } from '@matchinsights/core';
import { colors, fontSize, fontWeight, spacing } from '../../../theme';

interface StatusOrTimeProps {
  isFinished: boolean;
  statusShort: string;
  utcDate: string;
}

const StatusOrTime = ({
  isFinished,
  statusShort,
  utcDate,
}: StatusOrTimeProps) => {
  const { t } = useTranslation();

  if (isFinished) {
    return (
      <View style={styles.container} testID="status-finished">
        <Text style={styles.finishedText}>
          {t(`matchstatus.${statusShort}`)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="status-time">
      <Text style={styles.dateText} testID="match-day">
        {getFormattedDate(utcDate, 'dd/MM')}
      </Text>
      <Text style={styles.timeText} testID="match-time">
        {getFormattedTime(utcDate)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  } as ViewStyle,
  finishedText: {
    fontSize: fontSize.xxs,
    color: colors.brand.yellow,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    textTransform: 'uppercase',
  } as TextStyle,
  timeText: {
    fontSize: fontSize.xxs,
    color: colors.brand.yellow,
    fontWeight: fontWeight.normal,
    textAlign: 'center',
  } as TextStyle,
  dateText: {
    fontSize: fontSize.xxs,
    color: colors.brand.success,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginTop: spacing.xs,
  } as TextStyle,
});

export default StatusOrTime;
