import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../../navigation/RootNavigator', () => ({
  Routes: {
    CHARTS: 'charts',
  },
}));

import ChartButton from './ChartButton';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../navigation/RootNavigator';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

describe('ChartButton', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('renders the chart button', () => {
    render(<ChartButton fixtureId={123} />);

    expect(screen.getByTestId('chart-link')).toBeTruthy();
    expect(screen.getByText('matchbtn.chart')).toBeTruthy();
  });

  it('navigates to the Charts screen with the fixtureId when pressed', () => {
    render(<ChartButton fixtureId={123} />);

    fireEvent.press(screen.getByTestId('chart-link'));

    expect(mockNavigate).toHaveBeenCalledWith(Routes.CHARTS, { fixtureId: '123' });
  });
});
