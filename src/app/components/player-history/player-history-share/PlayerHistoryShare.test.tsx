import React from 'react';
import { render, screen } from '@testing-library/react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native') as any;
  RN.Image.resolveAssetSource = jest.fn(() => ({ uri: 'file:///player-fallback.png' }));
  return RN;
});

jest.mock('../../general/share-svg-button/ShareSvgButton', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ svgString, label }: { svgString: string; label?: string }) =>
      React.createElement(View, { testID: `share-svg-button-${label ?? 'default'}-${svgString}` }),
  };
});

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core') as any;
  return {
    ...actual,
    buildPlayerHistorySvgString: jest.fn()
      .mockReturnValueOnce('<svg>transfers</svg>')
      .mockReturnValueOnce('<svg>trophies</svg>')
      .mockReturnValueOnce('<svg>quiz</svg>'),
    getFormattedDate: jest.fn((date: string) => date),
    translateCountry: jest.fn((c: string) => c),
    translateLeague: jest.fn((l: string) => l),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'playerhistory.downloadTransfers': 'Transfers',
        'playerhistory.downloadTrophies': 'Trophies',
        'playerhistory.downloadQuiz': 'Generate Quiz',
        'playerhistory.downloadTransfersTitle': 'Player Transfers',
        'playerhistory.downloadTrophiesTitle': 'Player Trophies',
        'playerhistory.downloadQuizTitle': 'Guess the Player',
        'quiz.transfer': 'Transfer',
        'quiz.trophy': 'Trophy',
      };
      return map[key] || key;
    },
  }),
}));

import PlayerHistoryShare from './PlayerHistoryShare';
import { PlayerTransferInfo, PlayerTrophyInfo } from 'open-football-project-core';

const mockTransfers: PlayerTransferInfo[] = [
  {
    fromTeamName: 'Barcelona',
    toTeamName: 'PSG',
    fromTeamLogo: 'barca.png',
    toTeamLogo: 'psg.png',
    date: '2021-08-10',
  },
];

const mockTrophies: PlayerTrophyInfo[] = [
  {
    league: 'La Liga',
    country: 'Spain',
    season: '2018-2019',
    place: 'Winner',
  },
];

describe('PlayerHistoryShare', () => {
  beforeEach(() => {
    const { buildPlayerHistorySvgString } = require('open-football-project-core');
    jest.clearAllMocks();
    buildPlayerHistorySvgString
      .mockReturnValueOnce('<svg>transfers</svg>')
      .mockReturnValueOnce('<svg>trophies</svg>')
      .mockReturnValueOnce('<svg>quiz</svg>');
  });

  it('renders ShareSvgButton for transfers with correct label and svgString', () => {
    render(
      <PlayerHistoryShare
        playerName="Lionel Messi"
        playerPhoto="messi.png"
        transfers={mockTransfers}
        trophies={mockTrophies}
      />,
    );
    expect(screen.getByTestId('share-svg-button-Transfers-<svg>transfers</svg>')).toBeTruthy();
  });

  it('renders ShareSvgButton for trophies with correct label and svgString', () => {
    render(
      <PlayerHistoryShare
        playerName="Lionel Messi"
        playerPhoto="messi.png"
        transfers={mockTransfers}
        trophies={mockTrophies}
      />,
    );
    expect(screen.getByTestId('share-svg-button-Trophies-<svg>trophies</svg>')).toBeTruthy();
  });

  it('renders ShareSvgButton for quiz with correct label and svgString', () => {
    render(
      <PlayerHistoryShare
        playerName="Lionel Messi"
        playerPhoto="messi.png"
        transfers={mockTransfers}
        trophies={mockTrophies}
      />,
    );
    expect(screen.getByTestId('share-svg-button-Generate Quiz-<svg>quiz</svg>')).toBeTruthy();
  });

  it('calls buildPlayerHistorySvgString 3 times with the player name', () => {
    const { buildPlayerHistorySvgString } = require('open-football-project-core');
    render(
      <PlayerHistoryShare
        playerName="Lionel Messi"
        playerPhoto="messi.png"
        transfers={mockTransfers}
        trophies={mockTrophies}
      />,
    );
    expect(buildPlayerHistorySvgString).toHaveBeenCalledTimes(3);
    expect(buildPlayerHistorySvgString).toHaveBeenNthCalledWith(
      1, expect.anything(), expect.anything(), 'Lionel Messi',
    );
    expect(buildPlayerHistorySvgString).toHaveBeenNthCalledWith(
      2, expect.anything(), expect.anything(), 'Lionel Messi',
    );
    expect(buildPlayerHistorySvgString).toHaveBeenNthCalledWith(
      3, expect.anything(), expect.anything(), 'Lionel Messi',
    );
  });

  it('calls buildPlayerHistorySvgString once per strategy', () => {
    const { buildPlayerHistorySvgString } = require('open-football-project-core');
    render(
      <PlayerHistoryShare
        playerName="Lionel Messi"
        playerPhoto="messi.png"
        transfers={mockTransfers}
        trophies={mockTrophies}
      />,
    );
    expect(buildPlayerHistorySvgString).toHaveBeenCalledTimes(3);
  });
});
