import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChartPanel } from 'open-football-project-core';
import IndicatorsPanel from './indicators-panel/IndicatorsPanel';
import { spacing } from '../../../theme';

interface Props {
  panels: ChartPanel[];
}

const Panels = ({ panels }: Props) => (
  <View style={styles.container} testID="panels">
    {panels.map((panel) => (
      <IndicatorsPanel key={panel.id ?? panel.type} panel={panel} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: spacing.md,
  },
});

export default Panels;
