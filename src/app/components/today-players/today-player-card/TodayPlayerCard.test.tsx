import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TodayPlayerScore } from 'open-football-project-core';

import TodayPlayerCard from './TodayPlayerCard';

jest.mock('open-football-project-core', () => ({
  ...jest.requireActual('open-football-project-core'),
  translatePlayerPosition: (position: string) => position,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue ?? key,
  }),
}));

const defaultPlayerImage = require('../../../assets/images/player.png');

const playerScore: TodayPlayerScore = {
  player: {
    id: 154,
    name: 'L. Messi',
    age: 38,
    number: 10,
    position: 'Attacker',
    photo: 'https://example.com/messi.png',
  },
  score: 0.4812,
  signal: 'ODDS_IMPLIED',
  reason: { markets: ['Anytime Goal Scorer', 'Player Assists'] },
};

describe('TodayPlayerCard', () => {
  it("renders the player's photo, name, and team", () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-image')).toHaveProp('source', {
      uri: 'https://example.com/messi.png',
    });
    expect(screen.getByText('L. Messi')).toBeTruthy();
    expect(screen.getByText('Argentina')).toBeTruthy();
  });

  it('falls back to the placeholder image when the player has no photo', () => {
    render(
      <TodayPlayerCard
        playerScore={{ ...playerScore, player: { ...playerScore.player, photo: null } }}
        teamName="Argentina"
      />,
    );

    expect(screen.getByTestId('today-player-image')).toHaveProp('source', defaultPlayerImage);
  });

  it('omits the position line when the player has no position', () => {
    render(
      <TodayPlayerCard
        playerScore={{ ...playerScore, player: { ...playerScore.player, position: null } }}
        teamName="Argentina"
      />,
    );

    expect(screen.queryByTestId('today-player-position')).toBeNull();
  });

  it("shows the player's position when present", () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);
    expect(screen.getByTestId('today-player-position')).toHaveTextContent('Attacker');
  });

  it('shows an Odds signal badge, a labeled average-implied-probability row, and one reason row per matched market when the signal is ODDS_IMPLIED', () => {
    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-signal')).toHaveTextContent('Odds');
    expect(screen.getByTestId('today-player-markets-label')).toBeTruthy();
    expect(screen.getByTestId('today-player-reason-0')).toHaveTextContent(
      'Avg. implied probability: 48%',
    );
    expect(screen.getByTestId('today-player-reason-1')).toHaveTextContent('Anytime Goal Scorer');
    expect(screen.getByTestId('today-player-reason-2')).toHaveTextContent('Player Assists');
    expect(screen.queryByTestId('today-player-reason-3')).toBeNull();
  });

  it("truncates the markets list to 2 plus a '+N more' summary when there are more than 3 matched markets", () => {
    const manyMarketsScore: TodayPlayerScore = {
      ...playerScore,
      reason: {
        markets: [
          'Anytime Goal Scorer',
          'Player Assists',
          'Player Shots On Target',
          'Home Player Shots',
        ],
      },
    };

    render(<TodayPlayerCard playerScore={manyMarketsScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-reason-0')).toHaveTextContent(
      'Avg. implied probability: 48%',
    );
    expect(screen.getByTestId('today-player-reason-1')).toHaveTextContent('Anytime Goal Scorer');
    expect(screen.getByTestId('today-player-reason-2')).toHaveTextContent('Player Assists');
    expect(screen.getByTestId('today-player-reason-3')).toHaveTextContent('+2 more');
    expect(screen.queryByTestId('today-player-reason-4')).toBeNull();
  });

  it('shows a Season Form signal badge and one reason row per stat when the signal is SEASON_STAT, with no Matching Markets label', () => {
    const seasonStatScore: TodayPlayerScore = {
      ...playerScore,
      signal: 'SEASON_STAT',
      reason: { appearances: 20, goals: 6, assists: 2, rating: 6.893 },
    };

    render(<TodayPlayerCard playerScore={seasonStatScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-signal')).toHaveTextContent('Season Form');
    expect(screen.queryByTestId('today-player-markets-label')).toBeNull();
    expect(screen.getByTestId('today-player-reason-0')).toHaveTextContent('Appearences: 20');
    expect(screen.getByTestId('today-player-reason-1')).toHaveTextContent('Goals: 6');
    expect(screen.getByTestId('today-player-reason-2')).toHaveTextContent('Assists: 2');
    expect(screen.getByTestId('today-player-reason-3')).toHaveTextContent('Rating: 6.9');
    expect(screen.queryByTestId('today-player-reason-4')).toBeNull();
  });

  it('stacks the photo above the info column on phone-width screens', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 2 });

    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-card')).toHaveStyle({ flexDirection: 'column' });
  });

  it('lays out the photo beside the info column at tablet width and above', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 800, height: 1200, scale: 2, fontScale: 2 });

    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-card')).toHaveStyle({ flexDirection: 'row' });
  });

  it('does not stretch the info column to fill remaining vertical space on phone-width screens', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 2 });

    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-info-column')).not.toHaveStyle({ flex: 1 });
  });

  it('stretches the info column to fill remaining horizontal space at tablet width and above', () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 800, height: 1200, scale: 2, fontScale: 2 });

    render(<TodayPlayerCard playerScore={playerScore} teamName="Argentina" />);

    expect(screen.getByTestId('today-player-info-column')).toHaveStyle({ flex: 1 });
  });
});
