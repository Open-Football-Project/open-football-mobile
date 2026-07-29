import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AppFooter from './AppFooter';

describe('AppFooter', () => {
  it('renders the current year and copyright', () => {
    render(<AppFooter />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} futballero.com`)).toBeTruthy();
  });

  it('has correct styles for text and container', () => {
    render(<AppFooter />);
    const text = screen.getByText(/futballero.com/);
    expect(text.props.style).toEqual(
      expect.objectContaining({
        fontSize: 12,
        color: '#C8C8C8',
        textAlign: 'center',
      })
    );
  });

  it('renders correctly on small (mobile) screens', () => {
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 2 });
    render(<AppFooter />);
    expect(screen.getByText(/futballero.com/)).toBeTruthy();
  });

  it('renders correctly on tablet screens', () => {
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 900, height: 1200, scale: 2, fontScale: 2 });
    render(<AppFooter />);
    expect(screen.getByText(/futballero.com/)).toBeTruthy();
  });

  it('renders correctly on TV screens', () => {
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 1920, height: 1080, scale: 2, fontScale: 2 });
    render(<AppFooter />);
    expect(screen.getByText(/futballero.com/)).toBeTruthy();
  });
});
