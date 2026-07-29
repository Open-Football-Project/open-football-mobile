import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LeagueTeamInfo } from '@matchinsights/core';
import NoData from '../../general/no-data/NoData';
import Logo from '../../general/logo/Logo';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, sizes, breakpoints } from '../../../theme';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { Routes } from '../../../navigation/RootNavigator';
import { ms } from '../../../theme/scale';

interface LeagueTableProps {
  teams: LeagueTeamInfo[];
}

const formColor = (result: string): string => {
  switch (result) {
    case 'W':
      return colors.brand.green;
    case 'D':
      return colors.brand.yellow;
    default:
      return colors.brand.red;
  }
};

const TableHeader = ({ t, isWide }: { t: (key: string) => string; isWide: boolean }) => (
  <View style={styles.headerRow}>
    <Text style={[styles.headerCell, styles.cellRank]}>#</Text>
    <Text style={[styles.headerCell, isWide ? styles.cellTeamWide : styles.cellTeam]}>
      {t('leaguestanding.team')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.pts')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.p')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.w')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.d')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.l')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.gf')}
    </Text>
    <Text style={[styles.headerCell, styles.cellCenter]}>
      {t('leaguestanding.ga')}
    </Text>
    <Text style={[styles.headerCell, styles.cellForm]}>
      {t('leaguestanding.form')}
    </Text>
  </View>
);

interface TeamRowProps {
  team: LeagueTeamInfo;
  isEven: boolean;
  isWide: boolean;
  t: (key: string) => string;
}

const TeamRow = ({ team, isEven, isWide, t }: TeamRowProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleTeamPress = () => {
    navigation.navigate(Routes.TEAM_DETAILS, { teamId: String(team.teamId) });
  };

  return (
    <View style={[styles.row, isEven ? styles.rowEven : styles.rowOdd, isWide && styles.rowWide]}>
      <Text style={[styles.cell, styles.cellRank, styles.cellText]}>
        {team.rank}
      </Text>
      <Pressable
        style={[styles.cell, isWide ? styles.cellTeamWide : styles.cellTeam]}
        onPress={handleTeamPress}
      >
        <View style={styles.teamContent}>
          <Logo src={team.logo} size={sizes.iconSmall}/>
          <Text
            style={[styles.cellText, styles.teamName]}
            numberOfLines={1}
          >
            {team.teamName}
          </Text>
        </View>
      </Pressable>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.points}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.played}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.won}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.draw}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.lost}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.goalsFor}
      </Text>
      <Text style={[styles.cell, styles.cellCenter, styles.cellText]}>
        {team.goalsAgainst}
      </Text>
      <View style={[styles.cell, styles.cellForm]}>
        <View style={styles.formContainer}>
          {team.form.split('').map((result, index) => (
            <View
              key={index}
              style={[
                styles.formBadge,
                { backgroundColor: formColor(result) },
              ]}
              testID={`form-badge-${team.rank}-${index}`}
            >
              <Text style={styles.formText}>
                {t(`common.${result}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export const LeagueTable = ({ teams }: LeagueTableProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoints.tablet;

  if (teams.length === 0) return <NoData />;

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={isWide ? styles.scrollContentWide : undefined}
    >
      <View style={isWide ? styles.tableContentWide : undefined}>
        <TableHeader t={t} isWide={isWide} />
        <FlatList
          data={teams}
          renderItem={({ item, index }) => (
            <TeamRow
              team={item}
              isEven={index % 2 === 0}
              isWide={isWide}
              t={t}
            />
          )}
          keyExtractor={(team) => `team-${team.rank}`}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
  } as ViewStyle,
  scrollContentWide: {
    flexGrow: 1,
  } as ViewStyle,
  tableContentWide: {
    flex: 1,
  } as ViewStyle,
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.brand.blueintense,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.text.secondary,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  headerCell: {
    color: colors.brand.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xs,
  } as TextStyle,
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.overlay.white10,
  } as ViewStyle,
  rowWide: {
    flex: 1,
  } as ViewStyle,
  rowEven: {
    backgroundColor: colors.background.card,
  } as ViewStyle,
  rowOdd: {
    backgroundColor: colors.background.dark,
  } as ViewStyle,
  cell: {
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
  } as ViewStyle,
  cellText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
  } as TextStyle,
  cellRank: {
    width: ms(29),
    textAlign: 'center',
    fontWeight: fontWeight.bold,
    fontSize: fontSize.xxs,
  } as TextStyle,
  cellTeam: {
    width: ms(140),
    minWidth: ms(140),
  } as ViewStyle,
  cellTeamWide: {
    flex: 1,
    minWidth: ms(140),
  } as ViewStyle,
  cellCenter: {
    width: ms(38),
    textAlign: 'center',
  } as ViewStyle,
  cellForm: {
    width: ms(130),
    textAlign: 'center',
  } as ViewStyle,
  teamContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  } as ViewStyle,
  teamName: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.xxs,
    flex: 1,
    textTransform: "uppercase",
  } as TextStyle,
  formContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  } as ViewStyle,
  formBadge: {
    width: ms(20),
    height: ms(20),
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  formText: {
    color: colors.background.dark,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  } as TextStyle,
});
