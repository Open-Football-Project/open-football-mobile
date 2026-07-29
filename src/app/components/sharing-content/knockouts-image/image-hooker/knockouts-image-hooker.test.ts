import { renderHook } from '@testing-library/react-native';
import { useLeagueKnockoutsSvg } from './knockouts-image-hooker';
import { BracketNode } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue ?? key,
  }),
}));

const mockRounds = [
  { key: 'final', nodes: [{ roundKey: 'final', tie: null, missingData: false }] },
  {
    key: 'semi_finals',
    nodes: [
      { roundKey: 'semi_finals', tie: null, missingData: false },
      { roundKey: 'semi_finals', tie: null, missingData: false },
    ],
  },
];

jest.mock('open-football-project-core', () => ({
  collectRounds: jest.fn(() => mockRounds),
  buildBracketSvgString: jest.fn(() => '<svg>mock</svg>'),
  SVG_W: 1200,
  HEADER_H: 90,
  FOOTER_H: 50,
  SLOT_H: 75,
}));

import { collectRounds, buildBracketSvgString, HEADER_H, FOOTER_H, SLOT_H } from 'open-football-project-core';

const mockRoot: BracketNode = {
  roundKey: 'final',
  tie: null,
  missingData: false,
};

describe('useLeagueKnockoutsSvg', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty string and zero svgH when root is null', () => {
    const { result } = renderHook(() => useLeagueKnockoutsSvg(null, 'Champions League'));
    expect(result.current.svgString).toBe('');
    expect(result.current.svgH).toBe(0);
    expect(result.current.rounds).toHaveLength(0);
  });

  it('calls collectRounds and buildBracketSvgString when root is provided', () => {
    renderHook(() => useLeagueKnockoutsSvg(mockRoot, 'Champions League'));
    expect(collectRounds).toHaveBeenCalledWith(mockRoot);
    expect(buildBracketSvgString).toHaveBeenCalled();
  });

  it('returns svgString from buildBracketSvgString', () => {
    const { result } = renderHook(() => useLeagueKnockoutsSvg(mockRoot, 'Champions League'));
    expect(result.current.svgString).toBe('<svg>mock</svg>');
  });

  it('computes svgH as HEADER_H + maxNodes * SLOT_H + FOOTER_H', () => {
    // mockRounds has max 2 nodes (semi_finals)
    const expectedSvgH = HEADER_H + 2 * SLOT_H + FOOTER_H;
    const { result } = renderHook(() => useLeagueKnockoutsSvg(mockRoot, 'Test League'));
    expect(result.current.svgH).toBe(expectedSvgH);
  });

  it('passes leagueName and t to buildBracketSvgString', () => {
    renderHook(() => useLeagueKnockoutsSvg(mockRoot, 'Europa League'));
    const [, , , passedLeagueName] = (buildBracketSvgString as jest.Mock).mock.calls[0];
    expect(passedLeagueName).toBe('Europa League');
  });
});
