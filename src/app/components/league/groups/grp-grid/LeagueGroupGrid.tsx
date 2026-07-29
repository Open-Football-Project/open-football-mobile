import React from 'react';
import { View, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { LeagueGroup } from 'open-football-project-core';
import LeagueGroupCard from '../grp-card/LeagueGroupCard';
import { spacing } from '../../../../theme';

interface LeagueGroupGridProps {
  groups: LeagueGroup[];
}

const LeagueGroupGrid = ({ groups }: LeagueGroupGridProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={({ item }) => <LeagueGroupCard group={item} />}
        keyExtractor={(item, index) => item.label ?? `group-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  } as ViewStyle,
  columnWrapper: {
    gap: spacing.md,
    marginBottom: spacing.md,
  } as ViewStyle,
});

export default LeagueGroupGrid;
