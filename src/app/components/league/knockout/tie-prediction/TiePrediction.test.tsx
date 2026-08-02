import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';

import TiePrediction from './TiePrediction';

jest.mock('../../../general/logo/Logo', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ src }: { src?: string }) => <View testID={`logo-${src || 'fallback'}`} />,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

describe('TiePrediction', () => {
  const renderPrediction = (onPredict = jest.fn()) => {
    render(
      <TiePrediction
        t1="Palmeiras"
        t1logo="/palmeiras.png"
        t2="Flamengo"
        t2logo="/flamengo.png"
        onPredict={onPredict}
      />,
    );
    return onPredict;
  };

  it('renders both team names and logos', () => {
    renderPrediction();
    expect(screen.getByText('Palmeiras')).toBeTruthy();
    expect(screen.getByText('Flamengo')).toBeTruthy();
    expect(screen.getByTestId('logo-/palmeiras.png')).toBeTruthy();
    expect(screen.getByTestId('logo-/flamengo.png')).toBeTruthy();
  });

  it('renders a score input for each team', () => {
    renderPrediction();
    expect(screen.getByTestId('tie-prediction-input-t1')).toBeTruthy();
    expect(screen.getByTestId('tie-prediction-input-t2')).toBeTruthy();
  });

  it('does not report a winner while only one score has been entered', () => {
    const onPredict = renderPrediction();
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t1'), '2');
    expect(onPredict).toHaveBeenLastCalledWith(null);
  });

  it('reports team 1 as the winner once both scores are entered and team 1 scored more', () => {
    const onPredict = renderPrediction();
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t1'), '3');
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t2'), '1');
    expect(onPredict).toHaveBeenLastCalledWith('Palmeiras');
    expect(screen.getByTestId('tie-prediction-winner')).toHaveTextContent('Palmeiras');
  });

  it('reports team 2 as the winner once both scores are entered and team 2 scored more', () => {
    const onPredict = renderPrediction();
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t1'), '0');
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t2'), '2');
    expect(onPredict).toHaveBeenLastCalledWith('Flamengo');
    expect(screen.getByTestId('tie-prediction-winner')).toHaveTextContent('Flamengo');
  });

  it('reports no winner when the predicted scores are level, since a knockout tie cannot end in a draw', () => {
    const onPredict = renderPrediction();
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t1'), '1');
    fireEvent.changeText(screen.getByTestId('tie-prediction-input-t2'), '1');
    expect(onPredict).toHaveBeenLastCalledWith(null);
    expect(screen.queryByTestId('tie-prediction-winner')).toBeNull();
  });

  it('withdraws the winner when a previously decisive score is cleared', () => {
    const onPredict = renderPrediction();
    const t1Input = screen.getByTestId('tie-prediction-input-t1');
    const t2Input = screen.getByTestId('tie-prediction-input-t2');
    fireEvent.changeText(t1Input, '3');
    fireEvent.changeText(t2Input, '1');
    fireEvent.changeText(t1Input, '');
    expect(onPredict).toHaveBeenLastCalledWith(null);
    expect(screen.queryByTestId('tie-prediction-winner')).toBeNull();
  });
});
