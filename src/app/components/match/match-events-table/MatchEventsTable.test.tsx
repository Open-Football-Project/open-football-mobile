import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MatchEventsTable from './MatchEventsTable';
import { MatchEvent, buildMatchEventsSvgString } from 'open-football-project-core';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('../../general/share-svg-button/ShareSvgButton', () => {
  return function MockShareSvgButton(props: any) {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, {
      testID: 'share-svg-button',
      'data-svg-string': props.svgString,
    });
  };
});

jest.mock('open-football-project-core', () => ({
  ...jest.requireActual('open-football-project-core'),
  buildMatchEventsSvgString: jest.fn((data) => `<svg>${data.homeTeamName}</svg>`),
}));

describe('MatchEventsTable', () => {
  const baseProps = {
    homeTeamName: 'Home FC',
    homeTeamLogo: 'home-logo.png',
    awayTeamName: 'Away FC',
    awayTeamLogo: 'away-logo.png',
  };

  const mockEvents: MatchEvent[] = [
    {
      eventType: 'Goal',
      eventDetails: 'goal',
      playerName: 'John Smith',
      teamName: 'Home FC',
      timeElapsed: 12,
    },
    {
      eventType: 'Yellow Card',
      eventDetails: 'yellow card',
      playerName: 'Player B',
      teamName: 'Away FC',
      timeElapsed: 45,
    },
    {
      eventType: 'Red Card',
      eventDetails: 'red card',
      playerName: 'Player C',
      teamName: 'Home FC',
      timeElapsed: 67,
    },
    {
      eventType: 'VAR',
      eventDetails: 'No goal',
      playerName: '',
      teamName: 'Home FC',
      timeElapsed: 70,
    },
  ];

  it('renders team names and logos', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByText('Home FC')).toBeTruthy();
    expect(screen.getByText('Away FC')).toBeTruthy();
    expect(screen.getByTestId('homeTeamLogo')).toBeTruthy();
    expect(screen.getByTestId('awayTeamLogo')).toBeTruthy();
  });

  it('renders all events in descending time order', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByTestId('event-row-0')).toBeTruthy();
    expect(screen.getByTestId('event-row-1')).toBeTruthy();
    expect(screen.getByTestId('event-row-2')).toBeTruthy();
    expect(screen.getByTestId('event-row-3')).toBeTruthy();
  });

  it('sorts events by elapsed time descending (70, 67, 45, 12)', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const eventTimes = screen.getAllByTestId(/event-time-/).map((node) => {
      const text = node.props.children;
      return parseInt(String(text).replace("'", '').split(' ')[0] || '0');
    });

    expect(eventTimes).toEqual([70, 67, 45, 12]);
  });

  it('displays player names abbreviated for card/goal events', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByText('J. Smith')).toBeTruthy();
    expect(screen.getByText('P. B')).toBeTruthy();
    expect(screen.getByText('P. C')).toBeTruthy();
  });

  it('displays event details for VAR/non-player events', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    expect(screen.getByText('liveevents.var')).toBeTruthy();
  });

  it('formats time correctly with and without extra time', () => {
    const eventsWithExtra: MatchEvent[] = [
      {
        eventType: 'Goal',
        eventDetails: 'goal',
        playerName: 'Player X',
        teamName: 'Home FC',
        timeElapsed: 45,
        timeExtra: 3,
      },
    ];

    render(
      <MatchEventsTable
        {...baseProps}
        events={eventsWithExtra}
      />
    );

    expect(screen.getByText("45' +3")).toBeTruthy();
  });

  it('renders missing player names as dash', () => {
    const eventsNoTime: MatchEvent[] = [
      {
        eventType: 'Goal',
        eventDetails: 'goal',
        playerName: 'Player A',
        teamName: 'Home FC',
        timeElapsed: undefined as unknown as number,
      },
    ];

    render(
      <MatchEventsTable
        {...baseProps}
        events={eventsNoTime}
      />
    );

    expect(screen.getByText('-')).toBeTruthy();
  });

  it('displays home team events on left side and away team events on right', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);
    
    expect(screen.getAllByTestId('homePlayer').length).toBeGreaterThan(0);
    expect(screen.getByTestId('awayPlayer')).toBeTruthy();
  });

  it('handles empty events array', () => {
    render(<MatchEventsTable {...baseProps} events={[]} />);

    expect(screen.getByText('Home FC')).toBeTruthy();
    expect(screen.getByText('Away FC')).toBeTruthy();
  });

  it('renders ShareSvgButton component', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(screen.getByTestId('share-svg-button')).toBeTruthy();
  });

  it('calls buildMatchEventsSvgString with correct parameters', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    expect(buildMatchEventsSvgString).toHaveBeenCalledWith(
      expect.objectContaining({
        homeTeamName: 'Home FC',
        homeTeamLogo: 'home-logo.png',
        awayTeamName: 'Away FC',
        awayTeamLogo: 'away-logo.png',
        events: expect.any(Array),
        timeLabel: expect.any(String),
        eventLabel: expect.any(Function),
      })
    );
  });

  it('passes sorted events to buildMatchEventsSvgString in descending time order', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const callArgs = (buildMatchEventsSvgString as jest.Mock).mock.calls[0][0];
    const eventTimes = callArgs.events.map((e: MatchEvent) => e.timeElapsed);
    expect(eventTimes).toEqual([70, 67, 45, 12]);
  });

  it('ShareSvgButton receives svgString from buildMatchEventsSvgString', () => {
    const mockSvgString = '<svg>test</svg>';
    (buildMatchEventsSvgString as jest.Mock).mockReturnValue(mockSvgString);

    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const shareSvgButton = screen.getByTestId('share-svg-button');
    expect(shareSvgButton.props['data-svg-string']).toBe(mockSvgString);
  });

  it('eventLabel callback formats player names for card/goal events', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const callArgs = (buildMatchEventsSvgString as jest.Mock).mock.calls[0][0];
    const eventLabel = callArgs.eventLabel;

    const goalEvent: MatchEvent = {
      eventType: 'Goal',
      eventDetails: 'goal',
      playerName: 'John Smith',
      teamName: 'Home FC',
      timeElapsed: 12,
    };

    expect(eventLabel(goalEvent)).toBe('J. Smith');
  });

  it('eventLabel callback returns event details for non-player events', () => {
    render(<MatchEventsTable {...baseProps} events={mockEvents} />);

    const callArgs = (buildMatchEventsSvgString as jest.Mock).mock.calls[0][0];
    const eventLabel = callArgs.eventLabel;

    const varEvent: MatchEvent = {
      eventType: 'VAR',
      eventDetails: 'No goal',
      playerName: '',
      teamName: 'Home FC',
      timeElapsed: 70,
    };

    expect(eventLabel(varEvent)).toBe('liveevents.var');
  });
});

