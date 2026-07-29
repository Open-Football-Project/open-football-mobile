import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SubHeader from './SubHeader';
import { useNavigation } from '@react-navigation/native';
import { SubheaderRouteMobile } from 'open-football-project-core';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
  };
});

describe('SubHeader component', () => {
  const mockGoBack = jest.fn();
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      goBack: mockGoBack,
      canGoBack: jest.fn(() => true),
      navigate: mockNavigate,
      reset: mockReset,
    });
  });

  it('renders the title', () => {
    render(
      <SubHeader
        title="Test Title"
      />
    );

    const title = screen.getByTestId('sub-header-title');
    expect(title).toBeTruthy();
    expect(title.props.children).toBe('Test Title');
  });

  it('renders the subtitle when provided', () => {
    render(
      <SubHeader
        title="Test Title"
        subTitle="Test Subtitle"
      />
    );

    const subtitle = screen.getByTestId('sub-header-subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.props.children).toBe('Test Subtitle');
  });

  it('does not render subtitle when not provided', () => {
    render(
      <SubHeader
        title="Test Title"
      />
    );

    const subtitle = screen.queryByTestId('sub-header-subtitle');
    expect(subtitle).toBeNull();
  });

  it('renders the back button', () => {
    render(
      <SubHeader
        title="Test Title"
      />
    );

    const backButton = screen.getByTestId('sub-header-back-button');
    expect(backButton).toBeTruthy();
  });

  it('calls goBack when back button is pressed', () => {
    render(
      <SubHeader
        title="Test Title"
      />
    );

    const backButton = screen.getByTestId('sub-header-back-button');
    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('calls reset to Landing when back button is pressed and goBack is not available', () => {
    (useNavigation as any).mockReturnValue({
      goBack: mockGoBack,
      canGoBack: jest.fn(() => false),
      navigate: mockNavigate,
      reset: mockReset,
    });

    render(
      <SubHeader
        title="Test Title"
      />
    );

    const backButton = screen.getByTestId('sub-header-back-button');
    fireEvent.press(backButton);

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'landing' }],
    });
  });

  it('renders optional links when provided', () => {
    const optionalLinks = [
      { label: 'Link 1', routeName: 'MatchDetail' as const },
      { label: 'Link 2', routeName: 'Live' as const },
    ];

    render(
      <SubHeader
        title="Test Title"
        optionalLinks={optionalLinks}
      />
    );

    const linksContainer = screen.getByTestId('sub-header-optional-links');
    expect(linksContainer).toBeTruthy();

    const link1 = screen.getByTestId('optional-link-0');
    const link2 = screen.getByTestId('optional-link-1');

    expect(link1).toBeTruthy();
    expect(link2).toBeTruthy();
  });

  it('does not render links container when no optional links provided', () => {
    render(
      <SubHeader
        title="Test Title"
        optionalLinks={[]}
      />
    );

    const linksContainer = screen.queryByTestId('sub-header-optional-links');
    expect(linksContainer).toBeNull();
  });

  it('navigates to correct route when optional link is pressed', () => {
    const optionalLinks = [
      { 
        label: 'Match Detail', 
        routeName: 'MatchDetail' as const,
        param: { id: '123' }
      },
    ];

    render(
      <SubHeader
        title="Test Title"
        optionalLinks={optionalLinks}
      />
    );

    const link = screen.getByTestId('optional-link-0');
    fireEvent.press(link);

    expect(mockNavigate).toHaveBeenCalledWith('MatchDetail', { id: '123' });
  });

  it('navigates without params when optional link has no params', () => {
    const optionalLinks: SubheaderRouteMobile[] = [
      { 
        label: 'Players', 
        routeName: 'Players' as const,
      },
    ];

    render(
      <SubHeader
        title="Test Title"
        optionalLinks={optionalLinks}
      />
    );

    const link = screen.getByTestId('optional-link-0');
    fireEvent.press(link);

    expect(mockNavigate).toHaveBeenCalledWith('Players', {});
  });
});
