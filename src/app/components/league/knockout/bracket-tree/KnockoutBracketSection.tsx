import React from 'react';
import { LeagueFixture, useLeagueFixtureBinaryTree } from 'open-football-project-core';
import KnockoutBracketTree from './KnockoutBracketTree';

interface KnockoutBracketSectionProps {
  fixtures: LeagueFixture;
}

const KnockoutBracketSection = ({ fixtures }: KnockoutBracketSectionProps) => {
  const root = useLeagueFixtureBinaryTree(fixtures);

  return <KnockoutBracketTree root={root} />;
};

export default KnockoutBracketSection;
