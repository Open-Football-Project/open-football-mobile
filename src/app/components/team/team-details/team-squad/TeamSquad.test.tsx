import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import TeamSquad from './TeamSquad';
import { mockPlayers } from '@matchinsights/core';

jest.mock('./player/PlayerCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ player }: any) =>
    React.createElement(View, { testID: `player-card-${player.playerId}` }, 
      React.createElement(Text, { testID: `player-name-${player.playerId}` }, player.name)
    );
});


jest.mock('../../../general/screen-slider/ScreenSlider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ScreenSlider: ({ items, testIDPrefix }: any) =>
      React.createElement(View, { testID: testIDPrefix || 'screen-slider' }, 
        items?.map((item: any, index: number) => 
          React.createElement(View, { key: index, testID: `slider-item-${index}` }, item)
        )
      ),
  };
});

describe('TeamSquad', () => {
  it('renders null when players array is empty', () => {
    render(<TeamSquad players={[]} />);
    expect(screen.queryByTestId('team-squad-container')).not.toBeOnTheScreen();
  });

  it('renders the container with testID', () => {
    render(<TeamSquad players={mockPlayers} />);
    expect(screen.getByTestId('team-squad-container')).toBeOnTheScreen();
  });

  it('renders the slider with correct testIDPrefix', () => {
    render(<TeamSquad players={mockPlayers} />);
    expect(screen.getByTestId('squad-slider')).toBeOnTheScreen();
  });

  it('renders the correct number of player cards in slider', () => {
    render(<TeamSquad players={mockPlayers} />);
    
    mockPlayers.forEach((player) => {
      expect(screen.getByTestId(`player-card-${player.playerId}`)).toBeOnTheScreen();
    });
  });

  it('renders each player name in the card', () => {
    render(<TeamSquad players={mockPlayers} />);

    mockPlayers.forEach((player) => {
      expect(screen.getByText(player.name)).toBeOnTheScreen();
    });
  });

  it('creates a slider item for each player', () => {
    render(<TeamSquad players={mockPlayers} />);

    mockPlayers.forEach((_, index) => {
      expect(screen.getByTestId(`slider-item-${index}`)).toBeOnTheScreen();
    });
  });
});
