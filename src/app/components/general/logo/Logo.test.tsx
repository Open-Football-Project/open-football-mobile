import { render, screen, fireEvent } from '@testing-library/react-native';
import Logo from './Logo';

describe('Logo', () => {
  it('renders shield icon when no src is provided', () => {
    render(<Logo />);
    expect(screen.getByTestId('shield-fallback')).toBeTruthy();
  });

  it('renders image when src is provided', () => {
    render(<Logo src="https://example.com/logo.png" />);
    const img = screen.getByTestId('team-logo');
    expect(img).toBeTruthy();
    expect(img.props.source.uri).toBe('https://example.com/logo.png');
  });

  it('renders shield icon when image fails to load', () => {
    render(<Logo src="https://example.com/logo.png" />);
    const img = screen.getByTestId('team-logo');
    expect(img).toBeTruthy();

    fireEvent(img, 'onError');
    expect(screen.getByTestId('shield-fallback')).toBeTruthy();
  });
});
