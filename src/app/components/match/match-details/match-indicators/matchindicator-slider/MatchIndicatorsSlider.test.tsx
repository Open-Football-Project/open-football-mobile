import React from 'react';
import { render } from '@testing-library/react-native';
import { MatchIndicatorsSlider } from './MatchIndicatorsSlider';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../../../general/screen-slider/ScreenSlider', () => ({
  __esModule: true,
  default: ({ items }: { items: React.ReactNode[] }) => <>{items}</>,
}));

jest.mock('../../../../general/tiny-card/TinyCard', () => ({
  __esModule: true,
  default: ({ cardId }: { cardId?: string }) => {
    const { View } = require('react-native');
    return <View testID={cardId} />;
  },
}));

jest.mock('../../quick-info/last-five-matches/LastFiveMatches', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../quick-info/teams-score-performance/TeamsScorePerformance', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../quick-info/teams-rest-status/TeamRestStatus', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../quick-info/odds-winner-feeling/OddsWinnerFeeling', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../../live-indicators/pie-chart/LiveMatchPieChart', () => ({
  __esModule: true,
  default: () => null,
}));

const baseProps = {
  lastFiveLoading: false,
  loadingPerformance: false,
  loadingRestStatus: false,
  homeTeam: 'Home FC',
  awayTeam: 'Away FC',
};

describe('MatchIndicatorsSlider', () => {
  it('renders nothing when no slides are available', () => {
    const { toJSON } = render(<MatchIndicatorsSlider {...baseProps} />);
    expect(toJSON()).toBeNull();
  });

  it('renders last five results slide when available', () => {
    const { getByTestId, queryByTestId } = render(
      <MatchIndicatorsSlider {...baseProps} isLastFiveAvailable />
    );
    expect(getByTestId('last-five-card')).toBeTruthy();
    expect(queryByTestId('performance-card')).toBeNull();
  });

  it('renders performance slide when available', () => {
    const { getByTestId, queryByTestId } = render(
      <MatchIndicatorsSlider {...baseProps} isPerformanceAvailable />
    );
    expect(getByTestId('performance-card')).toBeTruthy();
    expect(queryByTestId('last-five-card')).toBeNull();
  });

  it('renders rest status slide when available', () => {
    const { getByTestId } = render(
      <MatchIndicatorsSlider {...baseProps} isRestStatusAvailable />
    );
    expect(getByTestId('rest-card')).toBeTruthy();
  });

  it('renders winner feeling slide when available', () => {
    const { getByTestId } = render(
      <MatchIndicatorsSlider {...baseProps} isOddsFeelingAvailable />
    );
    expect(getByTestId('winner-feeling')).toBeTruthy();
  });

  it('renders multiple slides when multiple data sets are available', () => {
    const { getByTestId } = render(
      <MatchIndicatorsSlider
        {...baseProps}
        isLastFiveAvailable
        isPerformanceAvailable
        isRestStatusAvailable
      />
    );
    expect(getByTestId('last-five-card')).toBeTruthy();
    expect(getByTestId('performance-card')).toBeTruthy();
    expect(getByTestId('rest-card')).toBeTruthy();
  });

  it('does not render slides whose availability flag is false', () => {
    const { queryByTestId } = render(
      <MatchIndicatorsSlider
        {...baseProps}
        isLastFiveAvailable={false}
        isPerformanceAvailable={false}
        isRestStatusAvailable={false}
        isOddsFeelingAvailable={false}
      />
    );
    expect(queryByTestId('last-five-card')).toBeNull();
    expect(queryByTestId('performance-card')).toBeNull();
    expect(queryByTestId('rest-card')).toBeNull();
    expect(queryByTestId('winner-feeling')).toBeNull();
  });

  it('renders all slides when all data sets are available', () => {
    const { getByTestId } = render(
      <MatchIndicatorsSlider
        {...baseProps}
        isLastFiveAvailable
        isPerformanceAvailable
        isRestStatusAvailable
        isOddsFeelingAvailable
        isH2HAvailable
        h2hIndicator={{ emoji: '⚔️', label: 'indicators.h2h_history', homePercent: 60, awayPercent: 40 }}
      />
    );
    expect(getByTestId('last-five-card')).toBeTruthy();
    expect(getByTestId('performance-card')).toBeTruthy();
    expect(getByTestId('rest-card')).toBeTruthy();
    expect(getByTestId('winner-feeling')).toBeTruthy();
    expect(getByTestId('h2h-history')).toBeTruthy();
  });

  it('renders h2h slide when isH2HAvailable and h2hIndicator are provided', () => {
    const { getByTestId } = render(
      <MatchIndicatorsSlider
        {...baseProps}
        isH2HAvailable
        h2hIndicator={{ emoji: '⚔️', label: 'indicators.h2h_history', homePercent: 60, awayPercent: 40 }}
      />
    );
    expect(getByTestId('h2h-history')).toBeTruthy();
  });

  it('does not render h2h slide when isH2HAvailable is false', () => {
    const { queryByTestId } = render(
      <MatchIndicatorsSlider
        {...baseProps}
        isH2HAvailable={false}
        h2hIndicator={{ emoji: '⚔️', label: 'indicators.h2h_history', homePercent: 60, awayPercent: 40 }}
      />
    );
    expect(queryByTestId('h2h-history')).toBeNull();
  });

  it('does not render h2h slide when h2hIndicator is not provided', () => {
    const { queryByTestId } = render(
      <MatchIndicatorsSlider {...baseProps} isH2HAvailable />
    );
    expect(queryByTestId('h2h-history')).toBeNull();
  });
});
