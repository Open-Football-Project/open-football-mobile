import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';


jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe('AppHeader', () => {
  const onMenuPress = jest.fn();
  const changeLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: { language: 'en', changeLanguage },
    });
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 0, left: 0, right: 0, bottom: 0 });
  });

  it('renders the menu button with hamburger icon', () => {
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('header-menu-button')).toBeTruthy();
    expect(screen.getByTestId('hamburger-icon')).toBeTruthy();
  });

  it('calls onMenuPress when menu button is pressed', () => {
    render(<AppHeader onMenuPress={onMenuPress} />);
    fireEvent.press(screen.getByTestId('header-menu-button'));
    expect(onMenuPress).toHaveBeenCalled();
  });

  it('renders language buttons and highlights the active one', () => {
    render(<AppHeader onMenuPress={onMenuPress} />);
    const enBtn = screen.getByTestId('lang-en');
    const esBtn = screen.getByTestId('lang-es');
    expect(enBtn).toBeTruthy();
    expect(esBtn).toBeTruthy();
    expect(enBtn.props.style).toEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('calls changeLanguage when EN or ES is pressed', () => {
    render(<AppHeader onMenuPress={onMenuPress} />);
    fireEvent.press(screen.getByTestId('lang-es'));
    expect(changeLanguage).toHaveBeenCalledWith('es');
    fireEvent.press(screen.getByTestId('lang-en'));
    expect(changeLanguage).toHaveBeenCalledWith('en');
  });

  it('renders correctly on small, tablet, and TV screens', () => {
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 2 });
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('header-menu-button')).toBeTruthy();
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 900, height: 1200, scale: 2, fontScale: 2 });
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('header-menu-button')).toBeTruthy();
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 1920, height: 1080, scale: 2, fontScale: 2 });
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('header-menu-button')).toBeTruthy();
  });

  it('applies the device safe-area top inset as the header padding', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 47, left: 0, right: 0, bottom: 0 });
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('app-header-container').props.style).toEqual(
      expect.objectContaining({ paddingTop: 47 })
    );
  });

  it('applies zero padding when there is no safe-area inset', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 0, left: 0, right: 0, bottom: 0 });
    render(<AppHeader onMenuPress={onMenuPress} />);
    expect(screen.getByTestId('app-header-container').props.style).toEqual(
      expect.objectContaining({ paddingTop: 0 })
    );
  });
});
