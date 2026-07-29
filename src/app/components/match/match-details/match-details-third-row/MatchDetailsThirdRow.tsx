import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenSlider from '../../../general/screen-slider/ScreenSlider';
import HeadToHead from '../h2h/HeadToHead';
import { H2HDetails } from 'open-football-project-core';
import { colors, spacing, fontSize, fontWeight } from '../../../../theme';

interface MatchDetailsThirdRowProps {
  h2hDetails: H2HDetails[];
  isLoading: boolean;
  homeTeamName: string;
  awayTeamName: string;
}

const MatchDetailsThirdRow = ({
  h2hDetails,
  isLoading,
  homeTeamName,
  awayTeamName,
}: MatchDetailsThirdRowProps) => {
  const items = h2hDetails.map((it, idx) => (
    <HeadToHead key={idx} h2hDetails={it} loading={isLoading} />
  ));

  return (
    <View>
      <Text style={styles.title}>
        {homeTeamName} vs {awayTeamName}
      </Text>
      <ScreenSlider
        key={`h2h-row-slider-${homeTeamName}-${awayTeamName}`}
        items={items}
        testIDPrefix="h2h-slider"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.orange,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    textTransform: 'uppercase',
  },
});

export default MatchDetailsThirdRow;
