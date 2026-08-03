import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ApiService, OnDayMatch } from 'open-football-project-core';

import { RootStackParamList, Routes } from '../../../../../navigation/RootNavigator';
import MatchRow from '../../../match-row/MatchRow';

import { colors, spacing, sizes, borderRadius, borders } from '../../../../../theme';
import { ms } from '../../../../../theme/scale';

interface Props {
  match: OnDayMatch;
  apiService: ApiService;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DayMatchRow = ({ match, apiService }: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    if (match.isLiveNow) {
      navigation.navigate(Routes.LIVE, {
        fixtureId: String(match.fixtureId),
      });
    } else {
      navigation.navigate(Routes.MATCH_DETAILS, {
        matchId: String(match.fixtureId),
      });
    }
  }, [match]);

  return (
    <MatchRow
      match={match}
      testID={`match-row-${match.fixtureId}`}
      apiService={apiService}
      onPress={handlePress}
      cardStyle={[styles.row, match.isLiveNow && styles.liveRow]}
      sizing={{ scoreWidth: ms(60) }}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    minHeight: sizes.touchableHeight,
    paddingVertical: 3,

    marginHorizontal: spacing.xs,
    marginVertical: 1,

    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.dark,
  },
  liveRow: {
    borderWidth: borders.thin,
    borderColor: colors.semantic.live,
    borderBottomWidth: borders.thin,

    borderLeftWidth: borders.thick,
    borderRightWidth: borders.thick,

    borderRadius: borderRadius.sm,
    paddingLeft: spacing.xs,
  },
});

export default DayMatchRow;
