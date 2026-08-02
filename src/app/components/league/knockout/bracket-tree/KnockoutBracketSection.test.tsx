import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { useLeagueFixtureBinaryTree, BracketNode, LeagueFixture } from 'open-football-project-core';

import KnockoutBracketSection from './KnockoutBracketSection';

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core') as any;
  return {
    ...actual,
    useLeagueFixtureBinaryTree: jest.fn(),
  };
});

jest.mock('./KnockoutBracketTree', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ root }: { root: BracketNode | null }) => (
      <View testID="bracket-tree">
        <Text>{root ? 'tree' : 'empty'}</Text>
      </View>
    ),
  };
});

const fixtures = { rounds: [] } as unknown as LeagueFixture;
const fakeRoot = { roundKey: 'final', tie: null, missingData: false } as BracketNode;

describe('KnockoutBracketSection', () => {
  it('computes the bracket tree from fixtures via useLeagueFixtureBinaryTree', () => {
    (useLeagueFixtureBinaryTree as jest.Mock).mockReturnValue(fakeRoot);

    render(<KnockoutBracketSection fixtures={fixtures} />);

    expect(useLeagueFixtureBinaryTree).toHaveBeenCalledWith(fixtures);
    expect(screen.getByTestId('bracket-tree')).toHaveTextContent('tree');
  });

  it('still renders KnockoutBracketTree when there is no tree yet', () => {
    (useLeagueFixtureBinaryTree as jest.Mock).mockReturnValue(null);

    render(<KnockoutBracketSection fixtures={fixtures} />);

    expect(screen.getByTestId('bracket-tree')).toHaveTextContent('empty');
  });
});
