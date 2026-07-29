import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  OddsWinnerFeeling,
  TeamForm,
  TeamsRestStatus,
  TeamsScorePerformance,
  IndicatorResult,
} from 'open-football-project-core';
import LastFiveMatches from '../../quick-info/last-five-matches/LastFiveMatches';
import TeamsScorePerformanceComponent from '../../quick-info/teams-score-performance/TeamsScorePerformance';
import TeamsRestStatusComponent from '../../quick-info/teams-rest-status/TeamRestStatus';
import OddsWinnerFeelingComponent from '../../quick-info/odds-winner-feeling/OddsWinnerFeeling';
import LiveMatchPieChart from '../../../../live-indicators/pie-chart/LiveMatchPieChart';
import TinyCard from '../../../../general/tiny-card/TinyCard';
import ScreenSlider from '../../../../general/screen-slider/ScreenSlider';
import { spacing } from '../../../../../theme';

interface MatchIndicatorsSliderProps {
  lastFiveLoading: boolean;
  lastFiveResults?: TeamForm;
  isLastFiveAvailable?: boolean;
  loadingPerformance: boolean;
  performance?: TeamsScorePerformance;
  isPerformanceAvailable?: boolean;
  loadingRestStatus: boolean;
  restStatus?: TeamsRestStatus;
  isRestStatusAvailable?: boolean;
  homeTeam: string;
  awayTeam: string;
  loadingOddsFeeling?: boolean;
  oddsFeeling?: OddsWinnerFeeling | null;
  isOddsFeelingAvailable?: boolean;
  h2hIndicator?: IndicatorResult;
  isH2HAvailable?: boolean;
  loadingH2hDetail?: boolean;
}

export const MatchIndicatorsSlider = ({
  lastFiveLoading,
  lastFiveResults,
  isLastFiveAvailable,
  loadingPerformance,
  performance,
  isPerformanceAvailable,
  loadingRestStatus,
  restStatus,
  isRestStatusAvailable,
  homeTeam,
  awayTeam,
  loadingOddsFeeling = false,
  oddsFeeling,
  isOddsFeelingAvailable,
  h2hIndicator,
  isH2HAvailable,
}: MatchIndicatorsSliderProps) => {
  const { t } = useTranslation();

  const slides: (React.ReactNode | null)[] = [
    isLastFiveAvailable ? (
      <View key="slide-last-five" style={styles.cardWrapper} testID="slide-last-five">
        <TinyCard
          title={t('common.last_five_results')}
          cardId="last-five-card"
          sections={[
            {
              label: homeTeam,
              component: (
                <LastFiveMatches isHome loading={lastFiveLoading} lastFiveResults={lastFiveResults} />
              ),
            },
            {
              label: awayTeam,
              component: (
                <LastFiveMatches isHome={false} loading={lastFiveLoading} lastFiveResults={lastFiveResults} />
              ),
            },
          ]}
        />
      </View>
    ) : null,

    isPerformanceAvailable ? (
      <View key="slide-performance" style={styles.cardWrapper} testID="slide-performance">
        <TinyCard
          title={t('common.performance')}
          cardId="performance-card"
          sections={[
            {
              label: homeTeam,
              component: (
                <TeamsScorePerformanceComponent isHome loading={loadingPerformance} performance={performance} />
              ),
            },
            {
              label: awayTeam,
              component: (
                <TeamsScorePerformanceComponent isHome={false} loading={loadingPerformance} performance={performance} />
              ),
            },
          ]}
        />
      </View>
    ) : null,

    isRestStatusAvailable ? (
      <View key="slide-rest-status" style={styles.cardWrapper} testID="slide-rest-status">
        <TinyCard
          title={t('common.rest_status')}
          cardId="rest-card"
          sections={[
            {
              label: homeTeam,
              component: (
                <TeamsRestStatusComponent loading={loadingRestStatus} isHome restStatus={restStatus} />
              ),
            },
            {
              label: awayTeam,
              component: (
                <TeamsRestStatusComponent loading={loadingRestStatus} isHome={false} restStatus={restStatus} />
              ),
            },
          ]}
        />
      </View>
    ) : null,

    isOddsFeelingAvailable ? (
      <View key="slide-winner-feeling" style={styles.cardWrapper} testID="slide-winner-feeling">
        <TinyCard
          title={t('common.winner_feeling')}
          cardId="winner-feeling"
          sections={[
            {
              component: (
                <OddsWinnerFeelingComponent
                  loading={loadingOddsFeeling}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  winnerFeeling={oddsFeeling ?? null}
                />
              ),
            },
          ]}
        />
      </View>
    ) : null,

    isH2HAvailable && h2hIndicator ? (
      <View key="slide-h2h" style={styles.cardWrapper} testID="slide-h2h">
        <TinyCard
          cardId="h2h-history"
          sections={[
            {
              component: (
                <LiveMatchPieChart
                  indicator={h2hIndicator}
                  homeTeamName={homeTeam}
                  awayTeamName={awayTeam}
                  hasData={true}
                />
              ),
            },
          ]}
        />
      </View>
    ) : null,

  ];

  const availableSlides = slides.filter(Boolean) as React.ReactNode[];

  if (availableSlides.length === 0) return null;

  return (
    <ScreenSlider
      items={availableSlides}
      testIDPrefix="match-indicators-slider"
      showPagination={availableSlides.length > 1}
    />
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
