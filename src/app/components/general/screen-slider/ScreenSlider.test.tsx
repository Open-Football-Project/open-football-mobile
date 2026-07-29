import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenSlider } from './ScreenSlider';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'accessibility.previous_slide': 'Go to previous slide',
        'accessibility.next_slide': 'Go to next slide',
        'accessibility.go_to_slide': `Go to slide ${params?.number || ''}`,
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../theme', () => ({
  colors: {
    background: {
      card: '#1E1E1E',
      overlay: 'rgba(0,0,0,0.7)',
      dark: '#121212',
    },
    brand: {
      yellow: '#ffc61a',
      royalblue: '#0d2769ff',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  borderRadius: {
    md: 12,
    lg: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  breakpoints: { tablet: 768, desktop: 1024, tv: 1280 },
}));

jest.mock('../../../icons/Icons', () => ({
  ChevronLeftIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID }, '‹');
  },
  ChevronRightIcon: ({ testID }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID }, '›');
  },
}));

describe('ScreenSlider', () => {
  const MockSlide = ({ label }: { label: string }) => (
    <Text testID={`slide-${label}`}>{label}</Text>
  );

  const mockItems = [
    <MockSlide key="1" label="Slide 1" />,
    <MockSlide key="2" label="Slide 2" />,
    <MockSlide key="3" label="Slide 3" />,
  ];

  describe('Rendering', () => {
    it('renders null when items array is empty', () => {
      render(<ScreenSlider items={[]} />);
      expect(screen.queryByTestId('screen-slider')).not.toBeOnTheScreen();
    });

    it('renders the slider container', () => {
      render(<ScreenSlider items={mockItems} />);
      expect(screen.getByTestId('screen-slider')).toBeOnTheScreen();
    });

    it('renders current slide', () => {
      render(<ScreenSlider items={mockItems} />);
      expect(screen.getByTestId('screen-slider-slide-0')).toBeOnTheScreen();
    });

    it('renders navigation arrows when showArrows is true', () => {
      render(<ScreenSlider items={mockItems} showArrows={true} />);
      expect(screen.getByTestId('screen-slider-prev')).toBeOnTheScreen();
      expect(screen.getByTestId('screen-slider-next')).toBeOnTheScreen();
    });

    it('hides navigation arrows when showArrows is false', () => {
      render(<ScreenSlider items={mockItems} showArrows={false} />);
      expect(screen.queryByTestId('screen-slider-prev')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('screen-slider-next')).not.toBeOnTheScreen();
    });

    it('does not show arrows for single item', () => {
      render(<ScreenSlider items={[<MockSlide key="1" label="Single" />]} />);
      expect(screen.queryByTestId('screen-slider-prev')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('screen-slider-next')).not.toBeOnTheScreen();
    });

    it('renders pagination dots when showPagination is true', () => {
      render(<ScreenSlider items={mockItems} showPagination={true} />);
      expect(screen.getByTestId('screen-slider-pagination')).toBeOnTheScreen();
      expect(screen.getByTestId('screen-slider-dot-0')).toBeOnTheScreen();
      expect(screen.getByTestId('screen-slider-dot-1')).toBeOnTheScreen();
      expect(screen.getByTestId('screen-slider-dot-2')).toBeOnTheScreen();
    });

    it('hides pagination when showPagination is false', () => {
      render(<ScreenSlider items={mockItems} showPagination={false} />);
      expect(screen.queryByTestId('screen-slider-pagination')).not.toBeOnTheScreen();
    });

    it('does not show pagination for single item', () => {
      render(<ScreenSlider items={[<MockSlide key="1" label="Single" />]} showPagination={true} />);
      expect(screen.queryByTestId('screen-slider-pagination')).not.toBeOnTheScreen();
    });

    it('renders the slide counter', () => {
      render(<ScreenSlider items={mockItems} />);
      expect(screen.getByTestId('screen-slider-counter')).toBeOnTheScreen();
      expect(screen.getByText('1 / 3')).toBeOnTheScreen();
    });
  });

  describe('Navigation', () => {
    it('navigates to next slide when next arrow is pressed', () => {
      const onSlideChange = jest.fn();
      render(<ScreenSlider items={mockItems} onSlideChange={onSlideChange} />);
      
      fireEvent.press(screen.getByTestId('screen-slider-next'));
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });

    it('navigates to previous slide when prev arrow is pressed', () => {
      const onSlideChange = jest.fn();
      render(<ScreenSlider items={mockItems} initialIndex={1} onSlideChange={onSlideChange} />);
      
      fireEvent.press(screen.getByTestId('screen-slider-prev'));
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('wraps to last slide when pressing prev on first slide', () => {
      const onSlideChange = jest.fn();
      render(<ScreenSlider items={mockItems} initialIndex={0} onSlideChange={onSlideChange} />);
      
      fireEvent.press(screen.getByTestId('screen-slider-prev'));
      expect(onSlideChange).toHaveBeenCalledWith(2);
    });

    it('wraps to first slide when pressing next on last slide', () => {
      const onSlideChange = jest.fn();
      render(<ScreenSlider items={mockItems} initialIndex={2} onSlideChange={onSlideChange} />);
      
      fireEvent.press(screen.getByTestId('screen-slider-next'));
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('navigates to specific slide when pagination dot is pressed', () => {
      const onSlideChange = jest.fn();
      render(<ScreenSlider items={mockItems} onSlideChange={onSlideChange} />);
      
      fireEvent.press(screen.getByTestId('screen-slider-dot-2'));
      expect(onSlideChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Initial Index', () => {
    it('starts at specified initial index', () => {
      render(<ScreenSlider items={mockItems} initialIndex={1} />);
      expect(screen.getByText('2 / 3')).toBeOnTheScreen();
    });

    it('uses index 0 when initial index is out of bounds', () => {
      render(<ScreenSlider items={mockItems} initialIndex={10} />);
      expect(screen.getByText('1 / 3')).toBeOnTheScreen();
    });

    it('uses index 0 when initial index is negative', () => {
      render(<ScreenSlider items={mockItems} initialIndex={-1} />);
      expect(screen.getByText('1 / 3')).toBeOnTheScreen();
    });
  });

  describe('Custom Test ID Prefix', () => {
    it('uses custom testIDPrefix', () => {
      render(<ScreenSlider items={mockItems} testIDPrefix="player-slider" />);
      expect(screen.getByTestId('player-slider')).toBeOnTheScreen();
      expect(screen.getByTestId('player-slider-prev')).toBeOnTheScreen();
      expect(screen.getByTestId('player-slider-next')).toBeOnTheScreen();
      expect(screen.getByTestId('player-slider-slide-0')).toBeOnTheScreen();
    });
  });

  describe('Accessibility', () => {
    it('provides accessibility labels for navigation arrows', () => {
      render(<ScreenSlider items={mockItems} />);
      
      const prevButton = screen.getByTestId('screen-slider-prev');
      const nextButton = screen.getByTestId('screen-slider-next');
      
      expect(prevButton.props.accessibilityLabel).toBe('Go to previous slide');
      expect(nextButton.props.accessibilityLabel).toBe('Go to next slide');
    });

    it('provides accessibility role for navigation elements', () => {
      render(<ScreenSlider items={mockItems} />);
      
      const prevButton = screen.getByTestId('screen-slider-prev');
      const nextButton = screen.getByTestId('screen-slider-next');
      
      expect(prevButton.props.accessibilityRole).toBe('button');
      expect(nextButton.props.accessibilityRole).toBe('button');
    });

    it('indicates selected state on active pagination dot', () => {
      render(<ScreenSlider items={mockItems} />);
      
      const activeDot = screen.getByTestId('screen-slider-dot-0');
      const inactiveDot = screen.getByTestId('screen-slider-dot-1');
      
      expect(activeDot.props.accessibilityState?.selected).toBe(true);
      expect(inactiveDot.props.accessibilityState?.selected).toBe(false);
    });
  });
});
