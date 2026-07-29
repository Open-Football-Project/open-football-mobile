import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildBracketSvgString,
  collectRounds,
  RoundLayout,
  SVG_W,
  HEADER_H,
  FOOTER_H,
  SLOT_H,
  BracketNode,
} from '@matchinsights/core';

export { SVG_W };

export const useLeagueKnockoutsSvg = (root: BracketNode | null, leagueName: string) => {
  const { t } = useTranslation();

  const { rounds, svgH, maxNodes } = useMemo(() => {
    if (!root) return { rounds: [] as RoundLayout[], svgH: 0, maxNodes: 0 };
    const rounds = collectRounds(root);
    const maxNodes = Math.max(...rounds.map((r) => r.nodes.length));
    return { rounds, svgH: HEADER_H + maxNodes * SLOT_H + FOOTER_H, maxNodes };
  }, [root]);

  const svgString = useMemo(
    () => (rounds.length ? buildBracketSvgString(rounds, maxNodes, svgH, leagueName, t) : ''),
    [rounds, maxNodes, svgH, leagueName, t],
  );

  return { svgString, rounds, svgH };
}
