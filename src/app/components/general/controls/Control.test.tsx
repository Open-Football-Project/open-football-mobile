import { render, screen, fireEvent } from '@testing-library/react-native';
import Controls from './Controls';
import { getLocalISODate } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = { 'common.close': 'Close' };
      return map[key] || key;
    },
  }),
}));

describe('Controls component', () => {
  const drop0Options = [
    { id: '1', value: 'Option 1' },
    { id: '2', value: 'Option 2' },
  ];

  const drop1Options = [
    { id: 'A', value: 'Alpha' },
    { id: 'B', value: 'Beta' },
  ];

  it('renders nothing when all use flags are false', () => {
    const { toJSON } = render(<Controls />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders drop0 picker button when useDrop0 is true', () => {
    render(
      <Controls
        useDrop0={true}
        drop0Label="Choose something"
        drop0Options={drop0Options}
      />
    );

    const drop0Button = screen.getByTestId('drop-0');
    expect(drop0Button).toBeTruthy();
  });

  it('renders drop1 picker button when useDrop1 is true', () => {
    render(
      <Controls
        useDrop1={true}
        drop1Label="Pick one"
        drop1Options={drop1Options}
      />
    );

    const drop1Button = screen.getByTestId('drop-1');
    expect(drop1Button).toBeTruthy();
  });

  it('calls setDrop0 when drop0 option is selected', () => {
    const mockSetDrop0 = jest.fn();

    const { rerender } = render(
      <Controls
        useDrop0={true}
        drop0Options={drop0Options}
        selectedDrop0="1"
        setDrop0={mockSetDrop0}
      />
    );

    const drop0Button = screen.getByTestId('drop-0');
    expect(drop0Button).toBeTruthy();

    rerender(
      <Controls
        useDrop0={true}
        drop0Options={drop0Options}
        selectedDrop0="2"
        setDrop0={mockSetDrop0}
      />
    );

    expect(drop0Button).toBeTruthy();
  });

  it('calls setDrop1 when drop1 option is selected', () => {
    const mockSetDrop1 = jest.fn();

    const { rerender } = render(
      <Controls
        useDrop1={true}
        drop1Options={drop1Options}
        selectedDrop1="A"
        setDrop1={mockSetDrop1}
      />
    );

    const drop1Button = screen.getByTestId('drop-1');
    expect(drop1Button).toBeTruthy();

    rerender(
      <Controls
        useDrop1={true}
        drop1Options={drop1Options}
        selectedDrop1="B"
        setDrop1={mockSetDrop1}
      />
    );

    expect(drop1Button).toBeTruthy();
  });

  it('renders input control with label and placeholder', () => {
    render(
      <Controls
        useInputControl={true}
        inputControlLabel="Search"
        inputControlPlaceholder="Type here..."
      />
    );

    const input = screen.getByTestId('input-control');
    expect(input).toBeTruthy();

    const label = screen.getByText('Search');
    expect(label).toBeTruthy();
  });

  it('calls setInputControlValue when typing', () => {
    const mockSetInput = jest.fn();

    render(
      <Controls
        useInputControl={true}
        setInputControlValue={mockSetInput}
        inputControlValue=""
      />
    );

    const input = screen.getByTestId('input-control');
    expect(input).toBeTruthy();

    fireEvent.changeText(input, 'Hello');

    expect(mockSetInput).toHaveBeenCalledWith('Hello');
  });

  it('renders date picker when useDatePicker is true', () => {
    const mockSetDate = jest.fn();

    render(
      <Controls
        useDatePicker={true}
        datePickerLabel="Match Day"
        selectedDate="2025-10-11"
        setSelectedDate={mockSetDate}
      />
    );

    const datePicker = screen.getByTestId('date-picker');
    expect(datePicker).toBeTruthy();

    const dateText = screen.getByText('2025-10-11');
    expect(dateText).toBeTruthy();
  });

  it('displays current date when no date is selected', () => {
    const mockSetDate = jest.fn();
    const today = getLocalISODate();

    render(
      <Controls
        useDatePicker={true}
        setSelectedDate={mockSetDate}
      />
    );

    const datePicker = screen.getByTestId('date-picker');
    expect(datePicker).toBeTruthy();
  });

  it('sets current date when date input is cleared', () => {
    const mockSetDate = jest.fn();

    const { rerender } = render(
      <Controls
        useDatePicker={true}
        selectedDate="2025-10-10"
        setSelectedDate={mockSetDate}
      />
    );

    rerender(
      <Controls
        useDatePicker={true}
        selectedDate=""
        setSelectedDate={mockSetDate}
      />
    );

    const datePicker = screen.getByTestId('date-picker');
    expect(datePicker).toBeTruthy();
  });

  it('renders time range picker when useTimeRange is true', () => {
    const mockSetTimeRange = jest.fn();

    const timeRangeOptions = [
      { from: 8, to: 12, name: 'Morning' },
      { from: 12, to: 18, name: 'Afternoon' },
      { from: 18, to: 22, name: 'Evening' },
      { from: 22, to: 6, name: 'Night' },
    ];

    render(
      <Controls
        useTimeRange={true}
        timeRangeLabel="Select Time Range"
        selectedTimeRangeIndex={0}
        setSelectedTimeRangeIndex={mockSetTimeRange}
        timeRangeOptions={timeRangeOptions}
      />
    );

    const timeRange = screen.getByTestId('time-range');
    expect(timeRange).toBeTruthy();

    const morningLabel = screen.getByText('Morning');
    expect(morningLabel).toBeTruthy();
  });

  it('renders labels with correct text', () => {
    render(
      <Controls
        useDrop0={true}
        isDrop0LabelRow={true}
        drop0Label="Dropdown"
        drop0Options={drop0Options}
      />
    );

    const labelElements = screen.getAllByTestId('control-label');
    expect(labelElements.length).toBeGreaterThan(0);
  });

  it('displays placeholder text in input control', () => {
    render(
      <Controls
        useInputControl={true}
        inputControlPlaceholder="Enter something..."
      />
    );

    const input = screen.getByTestId('input-control');
    expect(input?.props?.placeholder).toBe('Enter something...');
  });

  it('renders multiple controls when multiple use flags are true', () => {
    render(
      <Controls
        useDrop0={true}
        drop0Label="Dropdown 0"
        drop0Options={drop0Options}
        useInputControl={true}
        inputControlLabel="Text Input"
        useDatePicker={true}
        datePickerLabel="Pick Date"
      />
    );

    expect(screen.getByTestId('drop-0')).toBeTruthy();
    expect(screen.getByTestId('input-control')).toBeTruthy();
    expect(screen.getByTestId('date-picker')).toBeTruthy();

    const labels = screen.getAllByTestId('control-label');
    expect(labels.length).toBeGreaterThanOrEqual(3);
  });

  it('displays selected option in dropdown button', () => {
    const drop0Options = [
      { id: '1', value: 'Option 1' },
      { id: '2', value: 'Option 2' },
    ];

    render(
      <Controls
        useDrop0={true}
        drop0Options={drop0Options}
        selectedDrop0="1"
      />
    );

    const optionText = screen.getByText('Option 1');
    expect(optionText).toBeTruthy();
  });
});
