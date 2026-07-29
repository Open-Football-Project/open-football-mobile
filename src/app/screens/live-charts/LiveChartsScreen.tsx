import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import RNEventSource from 'react-native-sse';
import { useTranslation } from 'react-i18next';
import {
  ApiService,
  ChartPanel,
  ChartPanelType,
  MobileRoutes,
  useChartsPageStatus,
  useCharteableOddsStatus,
  useBetMarkets,
} from '@matchinsights/core';

import { RootStackParamList } from '../../navigation/RootNavigator';
import Controls from '../../components/general/controls/Controls';
import NoData from '../../components/general/no-data/NoData';
import SubHeader from '../../components/general/sub-header/SubHeader';
import Panels from '../../components/live-charts/panels/Panels';
import { marketToPanel } from '../../components/live-charts/panels/odds/market-to-panel';
import OddsMarketMenu from '../../components/live-charts/panels/odds/OddsMarketMenu';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';

enum ChartsScreenMode {
  Odds = 'odds',
  Indicators = 'indicators',
}

const DEFAULT_ODDS_MARKET_NAMES = ['fulltime_result', 'both_teams_to_score', 'draw_no_bet'];

interface LiveChartsScreenProps {
  apiService: ApiService;
  apiHost: string;
  apiMock?: number;
}

type LiveChartsRoute = RouteProp<RootStackParamList, typeof MobileRoutes.CHARTS>;

const eventSourceFactory = (url: string) => new RNEventSource(url) as unknown as EventSource;

const LiveChartsScreen = ({
  apiService,
  apiHost,
  apiMock = 0,
}: LiveChartsScreenProps) => {
  const { t } = useTranslation();
  const route = useRoute<LiveChartsRoute>();
  const fixtureId = route.params?.fixtureId;

  const {
    chartMatches,
    effectiveFixtureId,
    setEffectiveFixtureId,
    loadingChartMatches,
    isChartNotAvailable,
    homeTeamName,
    awayTeamName,
    momentumPoints,
    controlPoints,
    goalThreatPoints,
  } = useChartsPageStatus(apiHost, apiMock, fixtureId, eventSourceFactory);

  const {
    oddsMatches,
    effectiveFixtureId: oddsEffectiveFixtureId,
    setEffectiveFixtureId: setOddsEffectiveFixtureId,
    isOddsNotAvailable,
    homeTeamName: oddsHomeTeamName,
    awayTeamName: oddsAwayTeamName,
    oddsEventReceivedAt,
  } = useCharteableOddsStatus(apiHost, apiMock, fixtureId, eventSourceFactory);

  const { betMarketGroups } = useBetMarkets(apiService, oddsEffectiveFixtureId, oddsEventReceivedAt);

  const [mode, setMode] = useState<ChartsScreenMode>(ChartsScreenMode.Odds);
  const [enabledMarketNames, setEnabledMarketNames] = useState<string[]>(DEFAULT_ODDS_MARKET_NAMES);
  const [isMarketMenuOpen, setIsMarketMenuOpen] = useState(false);
  const hasResolvedModeRef = useRef(false);

  useEffect(() => {
    setEnabledMarketNames(DEFAULT_ODDS_MARKET_NAMES);
  }, [oddsEffectiveFixtureId]);

  const toggleMarket = (name: string) => {
    setEnabledMarketNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  useEffect(() => {
    hasResolvedModeRef.current = false;
  }, [fixtureId]);

  useEffect(() => {
    if (hasResolvedModeRef.current) return;

    const routeId = fixtureId ? Number(fixtureId) : undefined;

    const oddsReady =
      routeId !== undefined
        ? oddsMatches.some((match) => match.fixtureId === routeId)
        : oddsMatches.length > 0;

    const indicatorsReady =
      routeId !== undefined
        ? chartMatches.some((match) => match.fixtureId === routeId)
        : chartMatches.length > 0;

    if (oddsReady) {
      setMode(ChartsScreenMode.Odds);
      hasResolvedModeRef.current = true;
      return;
    }

    if (indicatorsReady) {
      setMode(ChartsScreenMode.Indicators);
      hasResolvedModeRef.current = true;
    }
  }, [fixtureId, oddsMatches, chartMatches]);

  const subHeaderTitle = t('charts.subheadertitle', { defaultValue: 'Live Football Charts' });

  if (loadingChartMatches) {
    return (
      <View style={styles.screen} testID="live-charts-screen">
        <SubHeader title={subHeaderTitle} />
        <NoData loading />
      </View>
    );
  }

  const noMatchesMessage = t('charts.no_live_matches', {
    defaultValue: 'No matches available right now',
  });

  if (isChartNotAvailable && isOddsNotAvailable) {
    return (
      <View style={styles.screen} testID="live-charts-screen">
        <SubHeader title={subHeaderTitle} />
        <NoData message={noMatchesMessage} />
      </View>
    );
  }

  const toMatchDropOption = (match: { fixtureId: number; homeTeamName: string; awayTeamName: string }) => ({
    id: String(match.fixtureId),
    value: `${match.homeTeamName} vs ${match.awayTeamName}`,
  });

  const matchDropOptions =
    mode === ChartsScreenMode.Odds ? oddsMatches.map(toMatchDropOption) : chartMatches.map(toMatchDropOption);

  const selectedDrop0 = String(
    mode === ChartsScreenMode.Odds ? oddsEffectiveFixtureId : effectiveFixtureId,
  );

  const setDrop0 = (id: string) => {
    if (mode === ChartsScreenMode.Odds) {
      setOddsEffectiveFixtureId(Number(id));
    } else {
      setEffectiveFixtureId(Number(id));
    }
  };

  const availableMarkets = betMarketGroups.flat();

  const renderContent = () => {
    if (mode === ChartsScreenMode.Odds) {
      if (!oddsHomeTeamName || !oddsAwayTeamName) {
        return <NoData message={noMatchesMessage} />;
      }

      const oddsPanels = enabledMarketNames
        .map((name) => availableMarkets.find((market) => market.name === name))
        .filter((market): market is (typeof availableMarkets)[number] => market !== undefined)
        .map((market) => marketToPanel(market, oddsHomeTeamName, oddsAwayTeamName, t));

      return <Panels panels={oddsPanels} />;
    }

    if (!homeTeamName || !awayTeamName) {
      return <NoData message={noMatchesMessage} />;
    }

    const momentumPanel: ChartPanel = {
      type: ChartPanelType.Momentum,
      points: momentumPoints,
      homeTeamName,
      awayTeamName,
    };

    const controlPanel: ChartPanel = {
      type: ChartPanelType.Control,
      points: controlPoints,
      homeTeamName,
      awayTeamName,
    };

    const goalThreatPanel: ChartPanel = {
      type: ChartPanelType.GoalThreat,
      points: goalThreatPoints,
      homeTeamName,
      awayTeamName,
    };

    return <Panels panels={[momentumPanel, controlPanel, goalThreatPanel]} />;
  };

  return (
    <View style={styles.screen} testID="live-charts-screen">
      <ScrollView testID="live-charts-scroll" contentContainerStyle={styles.scrollContent}>
        <SubHeader title={subHeaderTitle} />
        <View style={styles.modeToggleRow}>
          <Pressable
            testID="mode-toggle-odds"
            accessibilityRole="button"
            accessibilityState={{ selected: mode === ChartsScreenMode.Odds }}
            onPress={() => setMode(ChartsScreenMode.Odds)}
            style={[styles.modeToggle, mode === ChartsScreenMode.Odds && styles.modeToggleActive]}
          >
            <Text style={styles.modeToggleLabel}>{t('charts.mode_odds', { defaultValue: 'Odds' })}</Text>
          </Pressable>
          <Pressable
            testID="mode-toggle-indicators"
            accessibilityRole="button"
            accessibilityState={{ selected: mode === ChartsScreenMode.Indicators }}
            onPress={() => setMode(ChartsScreenMode.Indicators)}
            style={[styles.modeToggle, mode === ChartsScreenMode.Indicators && styles.modeToggleActive]}
          >
            <Text style={styles.modeToggleLabel}>
              {t('charts.mode_indicators', { defaultValue: 'Indicators' })}
            </Text>
          </Pressable>
          {mode === ChartsScreenMode.Odds && (
            <Pressable
              testID="odds-market-menu-toggle"
              accessibilityRole="button"
              onPress={() => setIsMarketMenuOpen(true)}
              style={styles.marketMenuToggle}
            >
              <Text style={styles.modeToggleLabel}>
                {t('charts.oddsMarketMenu.title', { defaultValue: 'Markets' })}
              </Text>
            </Pressable>
          )}
        </View>
        <Controls
          useDrop0
          drop0Label={t('charts.pick_match', { defaultValue: 'Select match' })}
          selectedDrop0={selectedDrop0}
          setDrop0={setDrop0}
          drop0Options={matchDropOptions}
        />
        {renderContent()}
      </ScrollView>
      {mode === ChartsScreenMode.Odds && isMarketMenuOpen && (
        <OddsMarketMenu
          markets={availableMarkets}
          enabledMarketNames={enabledMarketNames}
          onToggleMarket={toggleMarket}
          onClose={() => setIsMarketMenuOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  modeToggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
  },
  modeToggleActive: {
    backgroundColor: colors.brand.orange,
  },
  marketMenuToggle: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
  },
  modeToggleLabel: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});

export default LiveChartsScreen;
