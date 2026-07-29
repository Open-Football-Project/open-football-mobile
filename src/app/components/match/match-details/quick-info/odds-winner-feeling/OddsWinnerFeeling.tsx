import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OddsWinnerFeeling } from 'open-football-project-core';
import NoData from '../../../../general/no-data/NoData';
import ArrowStatusTile from '../../../../general/status-tile/ArrowStatusTile';
import { spacing } from '../../../../../theme';

interface OddsWinnerFeelingProps {
  loading: boolean;
  winnerFeeling: OddsWinnerFeeling | null;
  homeTeam: string;
  awayTeam: string;
}

const OddsWinnerFeelingComponent = ({
  loading,
  winnerFeeling,
  homeTeam,
  awayTeam,
}: OddsWinnerFeelingProps) => {
  const { t } = useTranslation();

  const isUp = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('strong')) return true;
    return false;
  };

  const isFlat = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('data') || s.length === 0) return true;
    return false;
  };

  if (loading) return <NoData loading={loading} />;
  if (!loading && !winnerFeeling) return <NoData />;

  return (
    <View style={styles.container}>
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.home)}
        status={homeTeam}
        isFlat={isFlat(winnerFeeling?.home ?? '')}
      />
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.away)}
        status={awayTeam}
        isFlat={isFlat(winnerFeeling?.away)}
      />
      <ArrowStatusTile
        isUp={isUp(winnerFeeling?.draw)}
        status={t('common.draw')}
        isFlat={isFlat(winnerFeeling?.draw)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});

export default OddsWinnerFeelingComponent;
