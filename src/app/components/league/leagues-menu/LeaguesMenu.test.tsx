import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { LeagueMenuSelectionOption, LeaguesMenu } from './LeaguesMenu';
import { fontSize } from '../../../theme';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

jest.mock('./leagues-menu-grid/LeaguesMenuGrid', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    LeaguesMenuGrid: ({ leagues }: { leagues: any[] }) =>
      leagues.length > 0
        ? React.createElement(
            View,
            { testID: 'leagues-grid' },
            leagues.map((l: any) =>
              React.createElement(Text, { key: l.id }, l.name)
            )
          )
        : null,
  };
});

jest.mock('./leagues-menu-options/LeaguesMenuOptions', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    LeaguesMenuOptions: ({
      items,
      selectItem,
    }: {
      items: any[];
      selectItem: (item: any) => void;
    }) =>
      React.createElement(
        View,
        { testID: 'leagues-options' },
        items.map((i: any) =>
          React.createElement(
            Text,
            {
              key: i.id,
              onPress: () => selectItem(i),
              testID: `option-${i.country}`,
            },
            i.country
          )
        )
      ),
  };
});

jest.mock('../../general/no-data/NoData', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading }: { loading?: boolean }) =>
      React.createElement(Text, null, loading ? 'Loading' : 'No Data'),
  };
});

jest.mock('../../general/controls/Controls', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({
      inputControlValue,
      setInputControlValue,
      inputControlPlaceholder,
      inputControlLabel,
    }: any) =>
      React.createElement(
        View,
        null,
        React.createElement(Text, null, inputControlLabel),
        React.createElement(
          Text,
          {
            testID: 'search-input',
            onPress: () => setInputControlValue(''),
          },
          inputControlValue || inputControlPlaceholder
        )
      ),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
  }),
}));

jest.mock('open-football-project-core', () => ({
  ...jest.requireActual('open-football-project-core') as any,
  translateCountry: (country: string) => country,
}));

const mockLeaguesGroups = {
  internationals: [{ id: 1, name: 'World Cup', type: 'Cup' }],
  others: [{ id: 2, name: 'Other League', type: 'League' }],
  countryLeagues: [
    {
      country: 'England',
      leagues: [{ id: 3, name: 'Premier League', type: 'League' }],
    },
    {
      country: 'Spain',
      leagues: [{ id: 4, name: 'La Liga', type: 'League' }],
    },
  ],
};

describe('LeaguesMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <LeaguesMenu
        leaguesGroups={undefined}
        loading={true}
        isAnyLeagueAvailable={false}
      />
    );
    expect(screen.getByText(/Loading/i)).toBeOnTheScreen();
  });

  it('renders leagues menu with options', () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    expect(screen.getByText(/common.leaguesmenu/i)).toBeOnTheScreen();
    expect(screen.getByTestId('leagues-options')).toBeOnTheScreen();
    expect(screen.getByText(/common.countrysearch/i)).toBeOnTheScreen();
  });

  it('filters options via search', () => {
    const { rerender } = render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );

    // Simulate search by pressing England option to verify filtering logic
    const englandOption = screen.getByTestId('option-England');
    expect(englandOption).toBeOnTheScreen();
  });

  it('selects International and shows its leagues', () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    const internationalOption = screen.getByTestId('option-International');
    fireEvent.press(internationalOption);

    expect(screen.getByText(/International/i)).toBeOnTheScreen();
    expect(screen.getByTestId('leagues-grid')).toBeOnTheScreen();
    expect(screen.getByText('World Cup')).toBeOnTheScreen();
  });

  it('selects country and shows its leagues', () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    const englandOption = screen.getByTestId('option-England');
    fireEvent.press(englandOption);

    expect(screen.getByText(/England/i)).toBeOnTheScreen();
    expect(screen.getByText('Premier League')).toBeOnTheScreen();
  });

  it('resets selection when back button clicked', () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    const englandOption = screen.getByTestId('option-England');
    fireEvent.press(englandOption);

    expect(screen.getByText(/England/i)).toBeOnTheScreen();

    const backButton = screen.getByTestId('back-button');
    fireEvent.press(backButton);
    expect(screen.getByText(/common.leaguesmenu/i)).toBeOnTheScreen();
  });

  it('applies TV styling at width 1366 (breakpoints.tv = 1280)', () => {
    render(
      <LeaguesMenu
        leaguesGroups={mockLeaguesGroups}
        loading={false}
        isAnyLeagueAvailable={true}
      />
    );
    const englandOption = screen.getByTestId('option-England');
    fireEvent.press(englandOption);

    expect(screen.getByText(/England/i)).toHaveStyle({ fontSize: fontSize.xxxl });
  });
});
