import { render, screen } from '@testing-library/react-native';
import ArrowStatusTile from './ArrowStatusTile';

describe('ArrowStatusTile', () => {
  it('renders upward arrow when isUp=true and isFlat=false', () => {
    render(
      <ArrowStatusTile isUp={true} isFlat={false} status="Good" />
    );

    const wrapper = screen.getByTestId('arrow-icon');
    expect(wrapper).toBeTruthy();
    expect(screen.getByText('GOOD')).toBeTruthy();
  });

  it('renders downward arrow when isUp=false and isFlat=false', () => {
    render(
      <ArrowStatusTile isUp={false} isFlat={false} status="Bad" />
    );

    const wrapper = screen.getByTestId('arrow-icon');
    expect(wrapper).toBeTruthy();
    expect(screen.getByText('BAD')).toBeTruthy();
  });

  it('renders flat arrow when isFlat=true', () => {
    render(
      <ArrowStatusTile isUp={false} isFlat={true} status="Neutral" />
    );

    const wrapper = screen.getByTestId('arrow-icon');
    expect(wrapper).toBeTruthy();
    expect(screen.getByText('NEUTRAL')).toBeTruthy();
  });
});

