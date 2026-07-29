import React from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { ApiService, useMatchesStatus } from 'open-football-project-core';
import { useTranslation } from 'react-i18next';

import SubHeader from '../../components/general/sub-header/SubHeader';
import Controls from '../../components/general/controls/Controls';
import MatchesGrid from '../../components/match/matches-grid/MatchesGrid';
import NoData from '../../components/general/no-data/NoData';

import { colors, spacing, breakpoints } from '../../theme';

interface MatchesProps {
  apiService: ApiService;
}

const Matches = ({ apiService }: MatchesProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= breakpoints.tablet;

  const {
    loadingMatches,
    selectedCountry,
    setSelectedCountry,
    selectedDate,
    setSelectedDate,
    countries,
    leagueMatches,
    isLeagueMatchesAvailable,
    setSelectedTimeRange,
    timeRangeOptions,
    selectedTimeRangeIndex,
    setSelectedTimeRangeIndex,
  } = useMatchesStatus(apiService);

  const renderControls = () => (
    <View style={styles.header}>
      <SubHeader title={t('common.matches')} />

      <Controls
        useDatePicker
        datePickerLabel={t('common.matchdate')}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}

        useDrop0
        drop0Label={t('common.countrycontrol')}
        drop0Options={countries.map((country) => ({
          id: country,
          value: country,
        }))}
        selectedDrop0={selectedCountry ?? countries[0]}
        setDrop0={setSelectedCountry}

        useTimeRange
        timeRangeLabel={t('common.timerangelabel')}
        selectedTimeRangeIndex={selectedTimeRangeIndex}
        setSelectedTimeRangeIndex={(i) => {
          setSelectedTimeRange(timeRangeOptions[i]);
          setSelectedTimeRangeIndex(i);
        }}
        timeRangeOptions={timeRangeOptions}
      />
    </View>
  );

  const contentStyle = [
    styles.content,
    isWideScreen && styles.contentWide,
  ];

  if (loadingMatches) {
    return (
      <View style={styles.screen} testID="matches-screen">
        <View style={contentStyle}>
          {renderControls()}
          <NoData loading />
        </View>
      </View>
    );
  }

  if (!isLeagueMatchesAvailable) {
    return (
      <View style={styles.screen} testID="matches-screen">
        <View style={contentStyle}>
          {renderControls()}
          <NoData message={t('matches.nodatamsg')} isBigMessage />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen} testID="matches-screen">
      <FlatList
        data={leagueMatches}
        keyExtractor={(item) => String(item.leagueId)}
        renderItem={({ item }) => <MatchesGrid league={item} apiService={apiService} />}
        ListHeaderComponent={renderControls}
        contentContainerStyle={[styles.list, isWideScreen && styles.listWide]}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
  flex: 1,
  paddingVertical: spacing.md,
  backgroundColor: colors.overlay.royalblueo,
  },
  contentWide: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  list: {
  paddingTop: spacing.md,
  paddingBottom: spacing.xs,
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.background.dark,
  },
  listWide: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: spacing.lg,
  },
});

export default Matches;
