import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChartPanel, ChartPanelType } from 'open-football-project-core';
import MomentumOscillatorChart from '../../charts/momentum-oscillator/MomentumOscillatorChart';
import PercentageChart from '../../charts/percentage-chart/PercentageChart';
import OddsChart from '../../charts/odds/OddsChart';
import { MOMENTUM_OSCILLATOR_BRAND, PERCENTAGE_CHART_COLORS, ODDS_CHART_COLORS } from '../constants';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../../theme';

interface Props {
  panel: ChartPanel;
}

const PanelCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

const IndicatorsPanel = ({ panel }: Props) => {
  const { t } = useTranslation();

  const percentageChart = () => (
    <PercentageChart
      points={panel.points}
      brand={{
        ...PERCENTAGE_CHART_COLORS,
        darkBg: MOMENTUM_OSCILLATOR_BRAND.darkBg,
        divider: MOMENTUM_OSCILLATOR_BRAND.divider,
        axisLabel: MOMENTUM_OSCILLATOR_BRAND.axisLabel,
      }}
      homeTeamName={panel.homeTeamName}
      awayTeamName={panel.awayTeamName}
    />
  );

  switch (panel.type) {
    case ChartPanelType.Momentum: {
      const title = t('charts.momentum_caption', { defaultValue: 'Live Momentum' });
      return (
        <PanelCard title={title}>
          <MomentumOscillatorChart
            points={panel.points}
            brand={MOMENTUM_OSCILLATOR_BRAND}
            homeTeamName={panel.homeTeamName}
            awayTeamName={panel.awayTeamName}
          />
        </PanelCard>
      );
    }
    case ChartPanelType.Control: {
      const title = t('charts.control_caption', { defaultValue: 'Live Control' });
      return <PanelCard title={title}>{percentageChart()}</PanelCard>;
    }
    case ChartPanelType.GoalThreat: {
      const title = t('charts.goal_threat_caption', { defaultValue: 'Live Goal Threat' });
      return <PanelCard title={title}>{percentageChart()}</PanelCard>;
    }
    case ChartPanelType.Odds: {
      const title = t(`charts.markets.${panel.title}`, { defaultValue: panel.title });
      return (
        <PanelCard title={title}>
          <OddsChart
            lines={panel.lines ?? []}
            colors={ODDS_CHART_COLORS}
            brand={{
              darkBg: MOMENTUM_OSCILLATOR_BRAND.darkBg,
              divider: MOMENTUM_OSCILLATOR_BRAND.divider,
              axisLabel: MOMENTUM_OSCILLATOR_BRAND.axisLabel,
            }}
          />
        </PanelCard>
      );
    }
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: borders.hairline,
    borderColor: colors.secondary.border,
    padding: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
});

export default IndicatorsPanel;
