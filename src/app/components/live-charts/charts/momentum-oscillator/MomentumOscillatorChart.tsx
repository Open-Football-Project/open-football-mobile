import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { Svg, Rect, Line, Path, Polyline, Defs, ClipPath, Text as SvgText } from 'react-native-svg';
import { LiveChartPoint, MomentumOscillatorBrandColor, spreadMinutesToX } from '@matchinsights/core';

const PADDING_X = 20;
const PADDING_Y = 30;
const PLOT_AREA_H = 220;
const TIME_AXIS_H = 30;
const SVG_H = PLOT_AREA_H + TIME_AXIS_H;
const MAX_MATCH_MINUTES = 130;
const MIN_PIXELS_PER_MINUTE = 15;
const MIN_SVG_W = PADDING_X * 2 + MAX_MATCH_MINUTES * MIN_PIXELS_PER_MINUTE;
const CENTER_Y = PLOT_AREA_H / 2;
const LATEST_LINE_LENGTH = 40;

interface MomentumOscillatorChartProps {
  points: LiveChartPoint[];
  brand: MomentumOscillatorBrandColor;
  homeTeamName: string;
  awayTeamName: string;
  testID?: string;
}

const valueToY = (value: number): number => {
  const usableHeight = PLOT_AREA_H - PADDING_Y * 2;
  return CENTER_Y - (value / 100) * (usableHeight / 2);
};

const uniqueMinutes = (points: LiveChartPoint[]): number[] => [
  ...new Set(points.map((point) => point.minute)),
];

const MomentumOscillatorChart = ({
  points,
  brand,
  homeTeamName,
  awayTeamName,
  testID,
}: MomentumOscillatorChartProps) => {
  const { width } = useWindowDimensions();
  const hasPoints = points.length > 0;
  const minutes = uniqueMinutes(points);

  const svgW = Math.max(MIN_SVG_W, width);
  const pixelsPerMinute = (svgW - PADDING_X * 2) / MAX_MATCH_MINUTES;
  const minuteToX = (minute: number): number => PADDING_X + minute * pixelsPerMinute;
  const toPathD = (chartPoints: LiveChartPoint[]): string =>
    spreadMinutesToX(chartPoints, pixelsPerMinute, PADDING_X)
      .map(
        ({ point, x }, index) =>
          `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${valueToY(point.value).toFixed(2)}`,
      )
      .join(' ');
  const pathD = toPathD(points);

  const positionedPoints = spreadMinutesToX(points, pixelsPerMinute, PADDING_X);
  const latest = positionedPoints.length > 0 ? positionedPoints[positionedPoints.length - 1] : undefined;
  const latestColor = latest && latest.point.value < 0 ? brand.negative : brand.positive;

  return (
    <ScrollView horizontal testID="momentum-oscillator-scroll" showsHorizontalScrollIndicator={false}>
      <Svg width={svgW} height={SVG_H} viewBox={`0 0 ${svgW} ${SVG_H}`} testID={testID ?? 'momentum-oscillator-chart'}>
        <Defs>
          <ClipPath id="momentum-positive-clip">
            <Rect x={0} y={0} width={svgW} height={CENTER_Y} />
          </ClipPath>
          <ClipPath id="momentum-negative-clip">
            <Rect x={0} y={CENTER_Y} width={svgW} height={PLOT_AREA_H - CENTER_Y} />
          </ClipPath>
        </Defs>
        <Rect testID="momentum-oscillator-background" width={svgW} height={SVG_H} fill={brand.darkBg} />
        <Line
          testID="momentum-oscillator-center-line"
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
            testID="momentum-oscillator-tick"
            x1={minuteToX(minute)}
            y1={PADDING_Y}
            x2={minuteToX(minute)}
            y2={PLOT_AREA_H - PADDING_Y}
            stroke={brand.divider}
            strokeWidth={1}
          />
        ))}
        {hasPoints && (
          <>
            <Path
              testID="momentum-oscillator-path-positive"
              d={pathD}
              fill="none"
              stroke={brand.positive}
              strokeWidth={2}
              clipPath="url(#momentum-positive-clip)"
            />
            <Path
              testID="momentum-oscillator-path-negative"
              d={pathD}
              fill="none"
              stroke={brand.negative}
              strokeWidth={2}
              clipPath="url(#momentum-negative-clip)"
            />
          </>
        )}
        <SvgText testID="momentum-oscillator-team-name-home" x={PADDING_X} y={20} fontSize={10} fill={brand.positive}>
          {homeTeamName}
        </SvgText>
        <SvgText
          testID="momentum-oscillator-team-name-away"
          x={PADDING_X}
          y={PLOT_AREA_H - 10}
          fontSize={10}
          fill={brand.negative}
        >
          {awayTeamName}
        </SvgText>
        {minutes.map((minute) => (
          <SvgText
            key={minute}
            testID="momentum-oscillator-tick-label"
            x={minuteToX(minute)}
            y={PLOT_AREA_H + 22}
            textAnchor="middle"
            fontSize={8}
            fill={brand.axisLabel ?? brand.divider}
          >
            {minute}&apos;
          </SvgText>
        ))}
        {latest && (
          <>
            <Polyline
              testID="momentum-oscillator-latest-line"
              points={`${latest.x.toFixed(2)},${valueToY(latest.point.value).toFixed(2)} ${(
                latest.x + LATEST_LINE_LENGTH
              ).toFixed(2)},${valueToY(latest.point.value).toFixed(2)}`}
              stroke={latestColor}
              strokeDasharray="4 2"
              fill="none"
            />
            <SvgText
              testID="momentum-oscillator-latest-label"
              x={(latest.x + LATEST_LINE_LENGTH + 4).toFixed(2)}
              y={valueToY(latest.point.value).toFixed(2)}
              fontSize={8}
              fill={latestColor}
            >
              {latest.point.value}
            </SvgText>
          </>
        )}
      </Svg>
    </ScrollView>
  );
};

export default MomentumOscillatorChart;
