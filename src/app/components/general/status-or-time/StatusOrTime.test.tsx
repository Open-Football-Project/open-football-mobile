import { render, screen } from '@testing-library/react-native';
import StatusOrTime from './StatusOrTime';
import { getFormattedDate, getFormattedTime } from '@matchinsights/core';

jest.mock('@matchinsights/core', () => {
  const actualCore = jest.requireActual('@matchinsights/core');
  return {
    ...actualCore,
    getFormattedTime: jest.fn(),
    getFormattedDate: jest.fn(),
  };
});

jest.mock('../../../theme', () => ({
  colors: {
    brand: {
      yellow: '#ffc61a',
    },
    text: {
      secondary: '#B0B0B0',
    },
  },
  fontSize: {
    xs: 12,
    sm: 14,
  },
  fontWeight: {
    normal: '400',
    semibold: '600',
    bold: '700',
  },
  spacing: {
    xs: 4,
  },
}));

describe('StatusOrTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when match is not finished', () => {
    it('renders time and date with correct testIDs', () => {
      (getFormattedTime as jest.Mock).mockReturnValue('12:30');
      (getFormattedDate as jest.Mock).mockReturnValue('30/10');

      render(
        <StatusOrTime
          isFinished={false}
          statusShort="NS"
          utcDate="2025-10-30T12:30:00Z"
        />
      );

      expect(screen.getByTestId('status-time')).toBeTruthy();
      expect(screen.getByTestId('match-time')).toBeTruthy();
      expect(screen.getByTestId('match-day')).toBeTruthy();
    });

    it('displays time above date', () => {
      (getFormattedTime as jest.Mock).mockReturnValue('15:00');
      (getFormattedDate as jest.Mock).mockReturnValue('25/12');

      render(
        <StatusOrTime
          isFinished={false}
          statusShort="NS"
          utcDate="2025-12-25T15:00:00Z"
        />
      );

      expect(screen.getByText('15:00')).toBeTruthy();
      expect(screen.getByText('25/12')).toBeTruthy();
    });

    it('calls getFormattedTime and getFormattedDate with correct params', () => {
      (getFormattedTime as jest.Mock).mockReturnValue('12:30');
      (getFormattedDate as jest.Mock).mockReturnValue('30/10');

      const utcDate = '2025-10-30T12:30:00Z';
      render(
        <StatusOrTime
          isFinished={false}
          statusShort="NS"
          utcDate={utcDate}
        />
      );

      expect(getFormattedTime).toHaveBeenCalledWith(utcDate);
      expect(getFormattedDate).toHaveBeenCalledWith(utcDate, 'dd/MM');
    });
  });

  describe('when match is finished', () => {
    it('renders status text with correct testID', () => {
      render(
        <StatusOrTime
          isFinished={true}
          statusShort="FT"
          utcDate="2025-10-30T12:30:00Z"
        />
      );

      expect(screen.getByTestId('status-finished')).toBeTruthy();
      expect(screen.getByText('matchstatus.FT')).toBeTruthy();
    });

    it('does not display time or date when finished', () => {
      render(
        <StatusOrTime
          isFinished={true}
          statusShort="FT"
          utcDate="2025-10-30T12:30:00Z"
        />
      );

      expect(screen.queryByTestId('match-time')).toBeNull();
      expect(screen.queryByTestId('match-day')).toBeNull();
    });

    it('renders different status texts correctly', () => {
      const { rerender } = render(
        <StatusOrTime
          isFinished={true}
          statusShort="AET"
          utcDate="2025-10-30T12:30:00Z"
        />
      );

      expect(screen.getByText('matchstatus.AET')).toBeTruthy();

      rerender(
        <StatusOrTime
          isFinished={true}
          statusShort="PEN"
          utcDate="2025-10-30T12:30:00Z"
        />
      );

      expect(screen.getByText('matchstatus.PEN')).toBeTruthy();
    });
  });
});
