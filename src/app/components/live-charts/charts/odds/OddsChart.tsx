import React, { Fragment, useState } from 'react';
import { View, Pressable, Text, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { Svg, Rect, Line, Path, Text as SvgText } from 'react-native-svg';
import { BetOddsPoint, spreadMinutesToX, resolveLabelOverlap } from 'open-football-project-core';
import { colors as themeColors, spacing, borderRadius, fontSize, fontWeight } from '../../../../theme';

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const BASELINE_Y = PLOT_AREA_H / 2;
const RANGE_PADDING_RATIO = 0.1;
const FLAT_RANGE_PADDING = 0.05;
const MIN_LABEL_GAP = 10;
const LATEST_LINE_LENGTH = 40;
const MAX_DEFAULT_VISIBLE_LINES = 4;

export interface OddsChartLine {
  label: string;
  points: BetOddsPoint[];
}

export interface OddsChartBrandColor {
  darkBg: string;
  divider: string;
  axisLabel?: string;
}

interface OddsChartProps {
  lines: OddsChartLine[];
  colors: string[];
  brand: OddsChartBrandColor;
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

const uniqueMinutes = (lines: OddsChartLine[]): number[] => [
  ...new Set(lines.flatMap((line) => line.points.map((point) => point.minute))),
];

const yDomain = (logValues: number[]): [number, number] => {
  const min = Math.min(...logValues);
  const max = Math.max(...logValues);
  const range = max - min;
  const pad = range === 0 ? FLAT_RANGE_PADDING : range * RANGE_PADDING_RATIO;
  return [min - pad, max + pad];
};

const OddsChart = ({ lines, colors, brand, testID }: OddsChartProps) => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(lines.map((_, index) => [index, index < MAX_DEFAULT_VISIBLE_LINES])),
  );
  const axisLabelColor = brand.axisLabel ?? brand.divider;
  const minutes = uniqueMinutes(lines);

  const svgW = Math.max(MIN_SVG_W, width);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;

  const allLogValues = lines.flatMap((line) =>
    line.points.map((point) => Math.log(parseFloat(point.odd))),
  );
  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  const [yMin, yMax] = allLogValues.length > 0 ? yDomain(allLogValues) : [0, 1];

  const valueToY = (odd: string): number => {
    const value = Math.log(parseFloat(odd));
    return PADDING_Y + ((yMax - value) / (yMax - yMin)) * usableHeight;
  };

  const toPathD = (points: BetOddsPoint[]): string =>
    spreadMinutesToX(points, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${valueToY(point.odd).toFixed(2)}`,
      )
      .join(' ');

  const latestLabels = resolveLabelOverlap(
    lines.flatMap((line, index) => {
      if (line.points.length === 0 || !visible[index]) return [];
      const positioned = spreadMinutesToX(line.points, pixelsPerMinute, PADDING_X);
      const last = positioned[positioned.length - 1];
      const y = valueToY(last.point.odd);
      return [
        {
          index,
          x: last.x,
          y,
          value: last.point.odd,
          color: colors[index % colors.length],
        },
      ];
    }),
    MIN_LABEL_GAP,
  );

  return (
    <View>
      <ScrollView horizontal testID="odds-chart-scroll" showsHorizontalScrollIndicator={false}>
        <Svg width={svgW} height={SVG_H} viewBox={`0 0 ${svgW} ${SVG_H}`} testID={testID ?? 'odds-chart'}>
          <Rect testID="odds-chart-background" width={svgW} height={SVG_H} fill={brand.darkBg} />
          <Line
            testID="odds-chart-baseline"
            x1={PADDING_X}
            y1={BASELINE_Y}
            x2={svgW - PADDING_X}
            y2={BASELINE_Y}
            stroke={brand.divider}
            strokeWidth={1}
          />
          {minutes.map((minute) => (
            <Line
              key={minute}
              testID="odds-chart-tick"
              x1={minuteToX(minute)}
              y1={PADDING_Y}
              x2={minuteToX(minute)}
              y2={PLOT_AREA_H - PADDING_Y}
              stroke={brand.divider}
              strokeWidth={1}
            />
          ))}
          {lines.map((line, index) => {
            if (line.points.length === 0 || !visible[index]) return null;
            return (
              <Path
                key={line.label}
                testID={`odds-chart-path-${index}`}
                d={toPathD(line.points)}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            );
          })}
          {minutes.map((minute) => (
            <SvgText
              key={minute}
              testID="odds-chart-tick-label"
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
            <Fragment key={label.index}>
              <Line
                testID={`odds-chart-latest-line-${label.index}`}
                x1={label.x}
                y1={label.y}
                x2={label.x + LATEST_LINE_LENGTH}
                y2={label.y}
                stroke={label.color}
                strokeDasharray="4 2"
              />
              <SvgText
                testID={`odds-chart-latest-label-${label.index}`}
                x={label.x + LATEST_LINE_LENGTH + 4}
                y={label.y}
                fontSize={8}
                fill={label.color}
              >
                {label.value}
              </SvgText>
            </Fragment>
          ))}
        </Svg>
      </ScrollView>
      <View style={styles.pillsRow}>
        {lines.map((line, index) => (
          <TogglePill
            key={line.label}
            testID={`odds-chart-toggle-${index}`}
            label={line.label}
            color={colors[index % colors.length]}
            selected={visible[index]}
            onToggle={() => setVisible((current) => ({ ...current, [index]: !current[index] }))}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  pillLabel: {
    color: themeColors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});

export default OddsChart;
