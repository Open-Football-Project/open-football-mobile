import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

jest.mock('../../../navigation/RootNavigator', () => ({
  Routes: {
    TODAY_PLAYERS: 'today-players',
  },
}));

import TopGuysButton from './TopGuysButton';
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

describe('TopGuysButton', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('renders the top guys button', () => {
    render(<TopGuysButton fixtureId={123} />);

    expect(screen.getByTestId('top-guys-link')).toBeTruthy();
    expect(screen.getByText('matchbtn.top_guys')).toBeTruthy();
  });

  it('navigates to the Today Players screen with the fixtureId when pressed', () => {
    render(<TopGuysButton fixtureId={123} />);

    fireEvent.press(screen.getByTestId('top-guys-link'));

    expect(mockNavigate).toHaveBeenCalledWith(Routes.TODAY_PLAYERS, { fixtureId: '123' });
  });
});
