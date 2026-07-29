import React from 'react';
import {
  ApiService,
  useLastFiveResults,
  useTeamsScorePerformance,
  useRestStatus,
  useTeamLeaguesStats,
  useOddsFeeling,
  useHeadToHead,
  h2hToIndicator,
} from 'open-football-project-core';
import { MatchIndicatorsSlider } from './matchindicator-slider/MatchIndicatorsSlider';

interface MatchIndicatorProps {
  apiService: ApiService;
  homeTeamId: number;
  homeTeam: string;
  awayTeamId: number;
  awayTeam: string;
  leagueId: number;
  fixtureDate: string;
  matchId: number;
}

export const MatchIndicators = ({
  apiService,
  homeTeamId,
  homeTeam,
  awayTeamId,
  awayTeam,
  leagueId,
  fixtureDate,
  matchId,
}: MatchIndicatorProps) => {
  const { lastFiveResults, loadingLastFiveResults, isLastFiveResultsAvailable } =
    useLastFiveResults(apiService, homeTeamId, awayTeamId);

  const { loadingTeamsPerformance, teamsPerformance, isPerformanceAvailable } =
    useTeamsScorePerformance(apiService, homeTeamId, awayTeamId, leagueId);

  const { loadingRestStatus, restStatus, isRestStatusAvailable } =
    useRestStatus(apiService, homeTeamId, awayTeamId, fixtureDate);

  const { loadingRanksAndPoints, ranksAndPoints, isRankingAndPointsAvailable } =
    useTeamLeaguesStats(apiService, homeTeamId, awayTeamId, leagueId);

  const { loadingOddsFeeling, oddsFeeling, isOddsFeelingAvailable } =
    useOddsFeeling(apiService, matchId);

  const { loadingH2hDetail, h2hDetails, isHead2HeadAvailable } =
    useHeadToHead(apiService, homeTeamId, awayTeamId);


  return (
    <MatchIndicatorsSlider
      lastFiveLoading={loadingLastFiveResults}
      lastFiveResults={lastFiveResults}
      isLastFiveAvailable={isLastFiveResultsAvailable}
      loadingPerformance={loadingTeamsPerformance}
      performance={teamsPerformance}
      isPerformanceAvailable={isPerformanceAvailable}
      loadingRestStatus={loadingRestStatus}
      restStatus={restStatus}
      isRestStatusAvailable={isRestStatusAvailable}
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      loadingRanksAndPoints={loadingRanksAndPoints}
      ranksAndPoints={ranksAndPoints}
      isRankAndPointsAvailable={isRankingAndPointsAvailable}
      loadingOddsFeeling={loadingOddsFeeling}
      oddsFeeling={oddsFeeling}
      isOddsFeelingAvailable={isOddsFeelingAvailable}
      h2hIndicator={h2hToIndicator(h2hDetails, homeTeam, awayTeam)}
      isH2HAvailable={isHead2HeadAvailable}
      loadingH2hDetail={loadingH2hDetail}
    />
  );
};
