import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import KnockoutBracketImage from './KnockoutsImage';


const mockCapture = jest.fn();

jest.mock('react-native-view-shot', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockViewShot = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ capture: mockCapture }), []);
    return React.createElement(View, { testID: 'view-shot' }, props.children);
  });
  MockViewShot.displayName = 'MockViewShot';
  return { __esModule: true, default: MockViewShot };
});

jest.mock('react-native-svg', () => ({
  SvgXml: ({ xml, testID }: any) => {
    const ReactLocal = require('react');
    const { View, Text } = require('react-native');
    return ReactLocal.createElement(View, { testID: testID ?? 'svg-xml' },
      ReactLocal.createElement(Text, null, xml),
    );
  },
}));

jest.mock('open-football-project-core', () => ({
  useLeagueFixtureBinaryTree: jest.fn(() => ({ roundKey: 'final', tie: null, missingData: false })),
}));

jest.mock('./image-hooker/knockouts-image-hooker', () => ({
  useLeagueKnockoutsSvg: jest.fn(() => ({
    svgString: '<svg>bracket</svg>',
    svgH: 440,
    rounds: [{ key: 'final', nodes: [] }],
  })),
  SVG_W: 1200,
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: { open: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue ?? key,
  }),
}));

jest.mock('../../general/no-data/NoData', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'no-data' }),
  };
});

import RNShare from 'react-native-share';
import { useLeagueFixtureBinaryTree } from 'open-football-project-core';
import { useLeagueKnockoutsSvg } from './image-hooker/knockouts-image-hooker';

const mockOpen = RNShare.open as jest.Mock;

const mockFixtures: any = { rounds: [] };

describe('KnockoutBracketImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapture.mockResolvedValue('file:///test-bracket.png');
    (useLeagueKnockoutsSvg as jest.Mock).mockReturnValue({
      svgString: '<svg>bracket</svg>',
      svgH: 440,
      rounds: [{ key: 'final', nodes: [] }],
    });
  });

  it('renders NoData when svgString is empty', () => {
    (useLeagueKnockoutsSvg as jest.Mock).mockReturnValue({
      svgString: '',
      svgH: 0,
      rounds: [],
    });

    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Test Cup" />);
    expect(screen.getByTestId('no-data')).toBeTruthy();
  });

  it('renders the download button when svgString is available', () => {
    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Champions League" />);
    expect(screen.getByTestId('bracket-download-button')).toBeOnTheScreen();
  });

  it('renders the SVG content', () => {
    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Champions League" />);
    expect(screen.getByTestId('view-shot')).toBeOnTheScreen();
  });

  it('calls capture and RNShare.open when download button is pressed', async () => {
    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Europa League" />);

    fireEvent.press(screen.getByTestId('bracket-download-button'));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'file:///test-bracket.png', type: 'image/png' }),
      );
    });
  });

  it('disables the download button while downloading', async () => {
    // Make capture hang so we can check intermediate state
    let resolveFn!: () => void;
    mockCapture.mockReturnValue(new Promise<string>((resolve) => {
      resolveFn = () => resolve('file:///test.png');
    }));

    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Champions League" />);
    fireEvent.press(screen.getByTestId('bracket-download-button'));

    await waitFor(() => {
      expect(screen.getByTestId('bracket-download-button').props.accessibilityState?.disabled).toBe(true);
    });

    resolveFn();
    await waitFor(() => expect(screen.getByTestId('bracket-download-button').props.disabled).toBeFalsy());
  });

  it('re-enables button after download completes', async () => {

    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Champions League" />);

    fireEvent.press(screen.getByTestId('bracket-download-button'));

    await waitFor(() => {
      expect(screen.getByTestId('bracket-download-button').props.disabled).toBeFalsy();
    });
  });

  it('passes fixtures to useLeagueFixtureBinaryTree', () => {
    render(<KnockoutBracketImage fixtures={mockFixtures} leagueName="Test Cup" />);
    expect(useLeagueFixtureBinaryTree).toHaveBeenCalledWith(mockFixtures);
  });
});
