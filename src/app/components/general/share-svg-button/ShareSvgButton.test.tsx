import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RNShare from 'react-native-share';

const mockCapture = jest.fn();

jest.mock('react-native-view-shot', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  const MockViewShot = ReactLocal.forwardRef((props: any, ref: any) => {
    ReactLocal.useImperativeHandle(ref, () => ({ capture: mockCapture }), []);
    return ReactLocal.createElement(View, { testID: 'view-shot' }, props.children);
  });
  MockViewShot.displayName = 'MockViewShot';
  return { __esModule: true, default: MockViewShot };
});

jest.mock('react-native-svg', () => ({
  SvgXml: () => null,
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: { open: (jest.fn() as any).mockResolvedValue(undefined) },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

import ShareSvgButton from './ShareSvgButton';

const SVG = '<svg><rect width="100" height="100"/></svg>';

describe('ShareSvgButton', () => {
  const mockOpen = RNShare.open as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockCapture as any).mockResolvedValue('file:///mock.png');
  });

  it('renders share button', () => {
    render(<ShareSvgButton svgString={SVG} />);

    expect(screen.getByTestId('share-button')).toBeTruthy();
  });

  it('displays Compartir label', () => {
    render(<ShareSvgButton svgString={SVG} />);

    expect(screen.getByText('Compartir')).toBeTruthy();
  });

  it('calls capture and RNShare.open with the captured URI on press', async () => {
    render(<ShareSvgButton svgString={SVG} />);

    fireEvent.press(screen.getByTestId('share-button'));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'file:///mock.png', type: 'image/png' }),
      );
    });
  });

  it('disables button while sharing is in progress', async () => {
    let resolve!: () => void;
    (mockCapture as any).mockReturnValue(
      new Promise<string>((res) => { resolve = () => res('file:///mock.png'); }),
    );
    render(<ShareSvgButton svgString={SVG} />);

    fireEvent.press(screen.getByTestId('share-button'));

    await waitFor(() => {
      expect(screen.getByTestId('share-button').props.accessibilityState?.disabled).toBe(true);
    });

    resolve();

    await waitFor(() => {
      expect(screen.getByTestId('share-button').props.disabled).toBeFalsy();
    });
  });

  it('does not call capture again if already sharing', async () => {
    let resolve!: () => void;
    (mockCapture as any).mockReturnValue(
      new Promise<string>((res) => { resolve = () => res('file:///mock.png'); }),
    );
    render(<ShareSvgButton svgString={SVG} />);

    fireEvent.press(screen.getByTestId('share-button'));
    fireEvent.press(screen.getByTestId('share-button'));

    resolve();

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render hidden ViewShot on initial mount (lazy)', () => {
    render(<ShareSvgButton svgString={SVG} />);

    expect(screen.queryByTestId('view-shot')).toBeNull();
  });

  it('renders hidden ViewShot after pressing share', async () => {
    render(<ShareSvgButton svgString={SVG} />);

    expect(screen.queryByTestId('view-shot')).toBeNull();

    fireEvent.press(screen.getByTestId('share-button'));

    await waitFor(() => {
      expect(screen.getByTestId('view-shot')).toBeTruthy();
    });
  });

  it('displays custom label when provided', () => {
    render(<ShareSvgButton svgString={SVG} label="Trivia" />);

    expect(screen.getByText('Trivia')).toBeTruthy();
  });

  it('applies custom backgroundColor when provided', () => {
    render(<ShareSvgButton svgString={SVG} backgroundColor="#ff00ff" />);

    const button = screen.getByTestId('share-button');
    const flatStyle = Array.isArray(button.props.style)
      ? Object.assign({}, ...button.props.style.filter(Boolean))
      : button.props.style;
    expect(flatStyle.backgroundColor).toBe('#ff00ff');
  });

  it('applies custom textColor when provided', () => {
    render(<ShareSvgButton svgString={SVG} textColor="#ffffff" />);

    const text = screen.getByText('Compartir');
    const flatStyle = Array.isArray(text.props.style)
      ? Object.assign({}, ...text.props.style.filter(Boolean))
      : text.props.style;
    expect(flatStyle.color).toBe('#ffffff');
  });

  it('calls onPress prop when share button is pressed', async () => {
    const onPress = jest.fn();
    render(<ShareSvgButton svgString={SVG} onPress={onPress} />);

    fireEvent.press(screen.getByTestId('share-button'));

    expect(onPress).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
    });
  });
});
