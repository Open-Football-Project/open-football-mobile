import React, { Fragment, useState } from 'react';
import { View, Pressable, Text, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { Svg, Rect, Line, Path, Text as SvgText } from 'react-native-svg';
import { LiveChartPoint, spreadMinutesToX, resolveLabelOverlap } from '@matchinsights/core';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../theme';

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const CENTER_Y = PLOT_AREA_H / 2;
const MIN_LABEL_GAP = 10;
const LATEST_LINE_LENGTH = 40;

export interface PercentageChartBrandColor {
  home: string;
  away: string;
  darkBg: string;
  divider: string;
  axisLabel?: string;
}

interface PercentageChartProps {
  points: LiveChartPoint[];
  brand: PercentageChartBrandColor;
  homeTeamName: string;
  awayTeamName: string;
  testID?: string;
}


interface TogglePillProps {
  label: string;
  color: string;
  selected: boolean;
  onToggle: () => void;
  testID: string;
}

const TogglePill = ({ label, color, selected, onToggle, testID }: TogglePillProps) => (
  <Pressable
    testID={testID}
    onPress={onToggle}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    style={[styles.pill, { backgroundColor: color, opacity: selected ? 1 : 0.4 }]}
  >
    <Text style={styles.pillLabel} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const valueToY = (value: number): number => {
  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  return CENTER_Y - ((value - 50) / 50) * (usableHeight / 2);
};

const uniqueMinutes = (points: LiveChartPoint[]): number[] => [
  ...new Set(points.map((point) => point.minute)),
];

const PercentageChart = ({
  points,
  brand,
  homeTeamName,
  awayTeamName,
  testID,
}: PercentageChartProps) => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState({ home: true, away: true });
  const axisLabelColor = brand.axisLabel ?? brand.divider;
  const hasPoints = points.length > 0;
  const minutes = uniqueMinutes(points);

  const svgW = Math.max(MIN_SVG_W, width);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;
  const toPathD = (chartPoints: LiveChartPoint[], toValue: (value: number) => number): string =>
    spreadMinutesToX(chartPoints, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${valueToY(toValue(point.value)).toFixed(2)}`,
      )
      .join(' ');

  const positionedPoints = spreadMinutesToX(points, pixelsPerMinute, PADDING_X);
  const latest = positionedPoints.length > 0 ? positionedPoints[positionedPoints.length - 1] : undefined;

  const latestLabels = latest
    ? resolveLabelOverlap(
        [
          ...(visible.home
            ? [
                {
                  key: 'home',
                  x: latest.x,
                  y: valueToY(latest.point.value),
                  value: latest.point.value,
                  color: brand.home,
                },
              ]
            : []),
          ...(visible.away
            ? [
                {
                  key: 'away',
                  x: latest.x,
                  y: valueToY(100 - latest.point.value),
                  value: 100 - latest.point.value,
                  color: brand.away,
                },
              ]
            : []),
        ],
        MIN_LABEL_GAP,
      )
    : [];

  return (
    <View>
      <ScrollView
        horizontal
        testID="percentage-chart-scroll"
        showsHorizontalScrollIndicator={false}
      >
        <Svg
          width={svgW}
          height={SVG_H}
          viewBox={`0 0 ${svgW} ${SVG_H}`}
          testID={testID ?? 'percentage-chart'}
        >
          <Rect testID="percentage-chart-background" width={svgW} height={SVG_H} fill={brand.darkBg} />
          <Line
            testID="percentage-chart-center-line"
            x1={PADDING_X}
            y1={CENTER_Y}
            x2={svgW - PADDING_X}
            y2={CENTER_Y}
            stroke={brand.divider}
            strokeWidth={1}
          />
          {minutes.map((minute) => (
            <Line
              key={minute}
              testID="percentage-chart-tick"
              x1={minuteToX(minute)}
              y1={PADDING_Y}
              x2={minuteToX(minute)}
              y2={PLOT_AREA_H - PADDING_Y}
              stroke={brand.divider}
              strokeWidth={1}
            />
          ))}
          {hasPoints && visible.home && (
            <Path
              testID="percentage-chart-path-home"
              d={toPathD(points, (value) => value)}
              fill="none"
              stroke={brand.home}
              strokeWidth={2}
            />
          )}
          {hasPoints && visible.away && (
            <Path
              testID="percentage-chart-path-away"
              d={toPathD(points, (value) => 100 - value)}
              fill="none"
              stroke={brand.away}
              strokeWidth={2}
            />
          )}
          <SvgText
            testID="percentage-chart-team-name-home"
            x={PADDING_X}
            y={20}
            fontSize={10}
            fill={brand.home}
          >
            {homeTeamName}
          </SvgText>
          <SvgText
            testID="percentage-chart-team-name-away"
            x={PADDING_X}
            y={PLOT_AREA_H - 10}
            fontSize={10}
            fill={brand.away}
          >
            {awayTeamName}
          </SvgText>
          {minutes.map((minute) => (
            <SvgText
              key={minute}
              testID="percentage-chart-tick-label"
              x={minuteToX(minute)}
              y={PLOT_AREA_H + 22}
              textAnchor="middle"
              fontSize={8}
              fill={axisLabelColor}
            >
              {minute}&apos;
            </SvgText>
          ))}
          {latestLabels.map((label) => (
            <Fragment key={label.key}>
              <Line
                testID={`percentage-chart-latest-line-${label.key}`}
                x1={label.x}
                y1={label.y}
                x2={label.x + LATEST_LINE_LENGTH}
                y2={label.y}
                stroke={label.color}
                strokeDasharray="4 2"
              />
              <SvgText
                testID={`percentage-chart-latest-label-${label.key}`}
                x={label.x + LATEST_LINE_LENGTH + 4}
                y={label.y}
                fontSize={8}
                fill={label.color}
              >
                {label.value.toFixed(0)}
              </SvgText>
            </Fragment>
          ))}
        </Svg>
      </ScrollView>
      <View style={styles.pillsRow}>
        <TogglePill
          testID="percentage-chart-toggle-home"
          label={homeTeamName}
          color={brand.home}
          selected={visible.home}
          onToggle={() => setVisible((current) => ({ ...current, home: !current.home }))}
        />
        <TogglePill
          testID="percentage-chart-toggle-away"
          label={awayTeamName}
          color={brand.away}
          selected={visible.away}
          onToggle={() => setVisible((current) => ({ ...current, away: !current.away }))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  pillLabel: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});

export default PercentageChart;
