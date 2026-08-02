import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import SupportUsScreen from './SupportUsScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

describe('SupportUsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders heading and explanatory text', () => {
    render(<SupportUsScreen />);

    expect(screen.getByText('supportus.head')).toBeTruthy();
    expect(screen.getByText('supportus.text')).toBeTruthy();
  });

  it('renders the BTC address from config as selectable text', () => {
    render(<SupportUsScreen />);

    const address = screen.getByText('bc1qmocktestaddress0000000000000000000000');
    expect(address).toBeTruthy();
    expect(address.props.selectable).toBe(true);
  });

  it('copies the address to the clipboard when the copy button is pressed', () => {
    render(<SupportUsScreen />);

    fireEvent.press(screen.getByTestId('copy-btc-address-button'));

    expect(Clipboard.setString).toHaveBeenCalledWith('bc1qmocktestaddress0000000000000000000000');
  });

  it('shows a confirmation alert after copying', () => {
    render(<SupportUsScreen />);

    fireEvent.press(screen.getByTestId('copy-btc-address-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'supportus.copySuccessTitle',
      'supportus.copySuccessMessage'
    );
  });

  it('exposes an accessibility label and role on the copy button', () => {
    render(<SupportUsScreen />);

    const button = screen.getByTestId('copy-btc-address-button');
    expect(button.props.accessibilityLabel).toBe('supportus.copyButton');
    expect(button.props.accessibilityRole).toBe('button');
  });
});
