import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { LeaguesMenuOptions, LeagueMenuSelectionOption } from './LeaguesMenuOptions';
import { fontSize } from '../../../../theme';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 1366, height: 768, scale: 1, fontScale: 1 }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, { defaultValue }: { defaultValue: string }) =>
      defaultValue,
  }),
}));

describe('LeaguesMenuOptions', () => {
  const mockItems: LeagueMenuSelectionOption[] = [
    { id: 0, country: 'England' },
    { id: 1, country: 'Spain' },
    { id: 2, country: 'Argentina' },
  ];

  const mockSelectItem = jest.fn();

  beforeEach(() => {
    mockSelectItem.mockClear();
  });

  const setup = (items = mockItems) =>
    render(<LeaguesMenuOptions items={items} selectItem={mockSelectItem} />);

  it('renders without crashing', () => {
    setup();
    const item = screen.getByText('England');
    expect(item).toBeOnTheScreen();
  });

  it('renders all items', () => {
    setup();
    mockItems.forEach((item) => {
      expect(
        screen.getByTestId(`${item.country}-${item.id}`)
      ).toBeOnTheScreen();
      expect(screen.getByText(item.country)).toBeOnTheScreen();
    });
  });

  it('calls selectItem when an item is pressed', () => {
    setup();
    const englandItem = screen.getByTestId('England-0');
    fireEvent.press(englandItem);
    expect(mockSelectItem).toHaveBeenCalledWith({
      id: 0,
      country: 'England',
    });
  });

  it('renders correctly when no items are passed', () => {
    setup([]);
    expect(screen.queryByText('England')).not.toBeOnTheScreen();
  });

  it('renders all items with chevron icon', () => {
    setup();
    const chevrons = screen.getAllByTestId('chevron-right-icon');
    expect(chevrons).toHaveLength(mockItems.length);
  });

  it('applies TV typography at width 1366 (breakpoints.tv = 1280)', () => {
    setup();
    expect(screen.getByText('England')).toHaveStyle({ fontSize: fontSize.base });
  });
});



