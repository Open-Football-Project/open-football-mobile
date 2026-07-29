import { render, screen } from '@testing-library/react-native';
import NoData from './NoData';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'nodata.loading') return 'Loading...';
      if (key === 'nodata.default') return 'No data available';
      return key;
    },
  }),
}));

describe('NoData component', () => {

  it('renders the loading message', () => {
    render(<NoData loading={true} />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });


  it('renders not available message', () => {
    render(<NoData />);
    expect(screen.getByText('No data available')).toBeTruthy();
  });

  it('renders custom message when provided', () => {
    render(<NoData message="Custom message" />);
    expect(screen.getByText('Custom message')).toBeTruthy();
  });

  it('renders big message when isBigMessage is true', () => {
    render(<NoData isBigMessage={true} message="Big message" />);
    const text = screen.getByText('Big message');
    expect(text).toBeTruthy();
  });


  it('renders default message when no message prop is provided', () => {
    render(<NoData loading={false} />);
    expect(screen.getByText('No data available')).toBeTruthy();
  });
});
