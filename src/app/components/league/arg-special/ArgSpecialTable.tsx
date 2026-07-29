import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArgLeagueEntry } from '@matchinsights/core';
import NoData from '../../general/no-data/NoData';
import Logo from '../../general/logo/Logo';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../theme';
import { ms } from '../../../theme/scale';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { Routes } from '../../../navigation/RootNavigator';

interface ArgSpecialTableProps {
  teams?: ArgLeagueEntry[];
  mode: 'annual' | 'promedios';
}

interface ResponsiveStyles {
  rankWidth: number;
  teamMinWidth: number;
  statWidth: number;
  rowPadding: number;
  cellFontSize: number;
  headerFontSize: number;
}

const useResponsiveStyles = (): ResponsiveStyles => {
  const { width } = useWindowDimensions();
  
  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  if (isTV) {
    return {
      rankWidth: ms(50),
      teamMinWidth: 200,
      statWidth: ms(60),
      rowPadding: spacing.md,
      cellFontSize: fontSize.base,
      headerFontSize: fontSize.sm,
    };
  }
  if (isLargeScreen) {
    return {
      rankWidth: ms(40),
      teamMinWidth: 160,
      statWidth: ms(50),
      rowPadding: spacing.sm,
      cellFontSize: fontSize.sm,
      headerFontSize: fontSize.xs,
    };
  }
  if (isTablet) {
    return {
      rankWidth: ms(35),
      teamMinWidth: 130,
      statWidth: ms(45),
      rowPadding: spacing.sm,
      cellFontSize: fontSize.xs,
      headerFontSize: fontSize.xs,
    };
  }
  // Mobile
  return {
    rankWidth: ms(50),
    teamMinWidth: 100,
    statWidth: ms(40),
    rowPadding: spacing.xs,
    cellFontSize: fontSize.xs,
    headerFontSize: fontSize.xs,
  };
};

interface TableHeaderProps {
  t: (key: string) => string;
  mode: 'annual' | 'promedios';
  responsiveStyles: ResponsiveStyles;
}

const TableHeader = ({ t, mode, responsiveStyles }: TableHeaderProps) => (
  <View style={styles.headerRow}>
    <Text style={[
      styles.headerCell,
      { width: responsiveStyles.rankWidth, fontSize: responsiveStyles.headerFontSize }
    ]}>
      #
    </Text>
    <Text style={[
      styles.headerCell,
      styles.cellTeam,
      { minWidth: responsiveStyles.teamMinWidth, fontSize: responsiveStyles.headerFontSize }
    ]}>
      {t('leaguestanding.team')}
    </Text>
    <Text style={[
      styles.headerCell,
      styles.cellCenter,
      { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
    ]}>
      {t('leaguestanding.pts')}
    </Text>
    <Text style={[
      styles.headerCell,
      styles.cellCenter,
      { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
    ]}>
      {t('leaguestanding.p')}
    </Text>

    {mode === 'annual' && (
      <>
        <Text style={[
          styles.headerCell,
          styles.cellCenter,
          { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
        ]}>
          {t('leaguestanding.w')}
        </Text>
        <Text style={[
          styles.headerCell,
          styles.cellCenter,
          { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
        ]}>
          {t('leaguestanding.d')}
        </Text>
        <Text style={[
          styles.headerCell,
          styles.cellCenter,
          { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
        ]}>
          {t('leaguestanding.l')}
        </Text>
        <Text style={[
          styles.headerCell,
          styles.cellCenter,
          { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
        ]}>
          {t('leaguestanding.gf')}
        </Text>
        <Text style={[
          styles.headerCell,
          styles.cellCenter,
          { width: responsiveStyles.statWidth, fontSize: responsiveStyles.headerFontSize }
        ]}>
          {t('leaguestanding.ga')}
        </Text>
      </>
    )}

    {mode === 'promedios' && (
      <Text style={[
        styles.headerCell,
        styles.cellCenter,
        styles.cellAvg,
        { fontSize: responsiveStyles.headerFontSize }
      ]}>
        {t('leaguestanding.avg')}
      </Text>
    )}
  </View>
);

interface TeamRowProps {
  team: ArgLeagueEntry;
  index: number;
  mode: 'annual' | 'promedios';
  t: (key: string) => string;
  responsiveStyles: ResponsiveStyles;
}

const TeamRow = ({ team, index, mode, t, responsiveStyles }: TeamRowProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleTeamPress = () => {
    navigation.navigate(Routes.TEAM_DETAILS, { teamId: String(team.teamId) });
  };

  return (
    <View 
      style={[
        styles.row, 
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
        { paddingVertical: responsiveStyles.rowPadding }
      ]}
      accessible
      accessibilityLabel={`${t('leaguestanding.team')}: ${team.teamName}, ${t('leaguestanding.pts')}: ${team.points}`}
    >
      <Text style={[
        styles.cell,
        styles.cellRank,
        styles.cellText,
        { width: responsiveStyles.rankWidth, fontSize: responsiveStyles.cellFontSize }
      ]}>
        {index + 1}
      </Text>
      <Pressable
        style={[
          styles.cell,
          styles.cellTeam,
          { minWidth: responsiveStyles.teamMinWidth }
        ]}
        onPress={handleTeamPress}
        accessibilityRole="button"
        accessibilityLabel={`${t('leaguestanding.team')}: ${team.teamName}`}
        accessibilityHint="Navigate to team details"
      >
        <View style={styles.teamContent}>
          {team.teamLogo && <Logo src={team.teamLogo} />}
          <Text
            style={[styles.cellText, styles.teamName, { fontSize: responsiveStyles.cellFontSize }]}
            numberOfLines={1}
          >
            {team.teamName}
          </Text>
        </View>
      </Pressable>
      <Text style={[
        styles.cell,
        styles.cellCenter,
        styles.cellText,
        styles.bold,
        { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
      ]}>
        {team.points}
      </Text>
      <Text style={[
        styles.cell,
        styles.cellCenter,
        styles.cellText,
        { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
      ]}>
        {team.played}
      </Text>

      {mode === 'annual' && (
        <>
          <Text style={[
            styles.cell,
            styles.cellCenter,
            styles.cellText,
            { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
          ]}>
            {team.wins}
          </Text>
          <Text style={[
            styles.cell,
            styles.cellCenter,
            styles.cellText,
            { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
          ]}>
            {team.draws}
          </Text>
          <Text style={[
            styles.cell,
            styles.cellCenter,
            styles.cellText,
            { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
          ]}>
            {team.losses}
          </Text>
          <Text style={[
            styles.cell,
            styles.cellCenter,
            styles.cellText,
            { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
          ]}>
            {team.goalsFor}
          </Text>
          <Text style={[
            styles.cell,
            styles.cellCenter,
            styles.cellText,
            { width: responsiveStyles.statWidth, fontSize: responsiveStyles.cellFontSize }
          ]}>
            {team.goalsAgainst}
          </Text>
        </>
      )}

      {mode === 'promedios' && (
        <Text style={[
          styles.cell,
          styles.cellCenter,
          styles.cellText,
          styles.cellAvg,
          { fontSize: responsiveStyles.cellFontSize }
        ]}>
          {team.promedio?.toFixed(3)}
        </Text>
      )}
    </View>
  );
};

const ArgSpecialTable = ({ teams, mode }: ArgSpecialTableProps) => {
  const { t } = useTranslation();
  const responsiveStyles = useResponsiveStyles();
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoints.tablet;

  if (!teams || teams.length === 0) return <NoData />;

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={isWide ? styles.scrollContent : undefined}
      testID={`arg-special-table-${mode}`}
    >
      <View style={[styles.tableWrapper, isWide ? styles.tableWrapperWide : undefined]}>
        <TableHeader t={t} mode={mode} responsiveStyles={responsiveStyles} />
        <FlatList
          data={teams}
          renderItem={({ item, index }) => (
            <TeamRow
              team={item}
              index={index}
              mode={mode}
              t={t}
              responsiveStyles={responsiveStyles}
            />
          )}
          keyExtractor={(team) => `team-${team.teamId}`}
          scrollEnabled={false}
          testID={`arg-special-table-${mode}-list`}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  backgroundColor: colors.background.card,
  borderRadius: borderRadius.none,
  },
  tableWrapper: {
    flexShrink: 0,
  } as ViewStyle,
  tableWrapperWide: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
  } as ViewStyle,
  headerRow: {
  flexDirection: 'row',
  backgroundColor: colors.brand.blueintense,
  borderBottomWidth: borders.thin,
  borderBottomColor: colors.brand.aqualight,
  paddingVertical: spacing.sm,
  } as ViewStyle,
  headerCell: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  } as TextStyle,
  row: {
    flexDirection: 'row',
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.text.secondary,
    alignItems: 'center',
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
    alignItems: 'center',
  } as ViewStyle,
  cellText: {
    color: colors.text.primary,
  } as TextStyle,
  cellRank: {
    textAlign: 'center',
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
  } as TextStyle,
  cellTeam: {
    flex: 1,
    justifyContent: 'flex-start',
  } as ViewStyle,
  cellCenter: {
    textAlign: 'center',
  } as TextStyle,
  cellAvg: {
    minWidth: 60,
    fontWeight: fontWeight.semibold,
    color: colors.brand.yellow,
  } as TextStyle,
  teamContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  } as ViewStyle,
  teamName: {
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.xxs,
    flex: 1,
    textTransform: "uppercase",
  } as TextStyle,
  bold: {
    fontWeight: fontWeight.bold,
    color: colors.brand.bluelight,
  } as TextStyle,
});

export default ArgSpecialTable;
