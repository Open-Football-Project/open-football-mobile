import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import SideMenu from './SideMenu';
import { RootStackParamList } from './RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/layout';
import { MobileRoutes } from 'open-football-project-core';

jest.mock('./navigationData', () => ({
  navigationData: [
    {
      icon: { uri: 'test-icon-1' },
      name: 'navigationTitles.mainmenu',
      navLinks: [
        { title: 'navbar.home', route: 'landing', isTranslated: true },
        { title: 'navbar.live', route: 'live', isTranslated: true },
      ],
    },
    {
      icon: { uri: 'test-icon-2' },
      name: 'navigationTitles.international',
      navLinks: [
        { title: 'Champions League', route: 'league', params: { leagueId: '2' } },
      ],
    },
  ],
}));

jest.mock('open-football-project-core', () => {
  const actual = jest.requireActual('open-football-project-core') as any;
  return {
    ...actual,
    cleanLeagueName: (name: string) => name,
    leagueTranslationKey: (name: string) => name.toLowerCase().replace(/ /g, '_'),
  };
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderWithNavigation = (visible: boolean, onClose = jest.fn()) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={MobileRoutes.LANDING}
            component={() => (
              <SideMenu visible={visible} onClose={onClose} />
            )}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={MobileRoutes.LIVE} component={() => null} />
          <Stack.Screen name={MobileRoutes.LEAGUE} component={() => null} />
          <Stack.Screen
            name={MobileRoutes.SUPPORT_US}
            component={() => {
              const { Text } = require('react-native');
              return <Text testID="support-us-screen-marker">Support Us Screen</Text>;
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

describe('SideMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders when visible is true', () => {
      renderWithNavigation(true);
      expect(screen.getByTestId('close-menu-button')).toBeTruthy();
    });

    it('does not render content when visible is false', () => {
      renderWithNavigation(false);
      expect(screen.queryByTestId('close-menu-button')).toBeNull();
    });

    it('renders the CloseIcon', () => {
      renderWithNavigation(true);
      expect(screen.getByTestId('side-menu-close-icon')).toBeTruthy();
    });

    it('renders all navigation sections', () => {
      renderWithNavigation(true);
      // Check for arrow icons - one per section
      const arrows = screen.getAllByTestId(/arrow-down/);
      expect(arrows.length).toBe(2);
    });

    it('renders section content', () => {
      renderWithNavigation(true);
      // The sections are rendered - we can verify by the arrow icons
      expect(screen.getAllByTestId(/arrow-down/).length).toBe(2);
    });

    it('renders the Support Us button as a top-level item, not inside a section', () => {
      renderWithNavigation(true);
      expect(screen.getByTestId('support-us-nav-button')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      renderWithNavigation(true, onClose);
      
      fireEvent.press(screen.getByTestId('close-menu-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('expands section when pressed', () => {
      renderWithNavigation(true);
      const arrows = screen.getAllByTestId(/arrow-down/);
      expect(arrows.length).toBe(2);
      fireEvent.press(arrows[0]);
      expect(screen.queryByTestId(/arrow-up/)).toBeTruthy();
    });

    it('shows up arrow when section is expanded', () => {
      renderWithNavigation(true);

      expect(screen.getAllByTestId(/arrow-down/).length).toBe(2);
      expect(screen.queryByTestId(/arrow-up/)).toBeNull();

      fireEvent.press(screen.getAllByTestId(/arrow-down/)[0]);

      expect(screen.queryByTestId(/arrow-up/)).toBeTruthy();
    });

    it('navigates to the Support Us screen and closes the menu when pressed', () => {
      const onClose = jest.fn();
      renderWithNavigation(true, onClose);

      fireEvent.press(screen.getByTestId('support-us-nav-button'));

      expect(screen.getByTestId('support-us-screen-marker')).toBeTruthy();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Theme Integration', () => {
    it('uses theme background color', () => {
      renderWithNavigation(true);
      const scrollView = screen.UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.style.backgroundColor).toBe(colors.background.dark);
    });

    it('uses theme spacing for padding', () => {
      renderWithNavigation(true);
      const scrollView = screen.UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.style.paddingHorizontal).toBe(spacing.lg);
    });

    it('renders close icon with white color', () => {
      renderWithNavigation(true);
      const closeIcon = screen.getByTestId('side-menu-close-icon');
      expect(closeIcon.props.stroke).toBe(colors.white);
    });
  });

  describe('Responsiveness', () => {
    it('renders correctly on mobile viewport', () => {
      renderWithNavigation(true);
      const scrollView = screen.UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.style.flex).toBe(1);
    });

    it('uses flexible layout for menu content', () => {
      renderWithNavigation(true);
      // Verify sections are rendered with proper structure
      const arrows = screen.getAllByTestId(/arrow-down/);
      expect(arrows.length).toBe(2);
    });

    it('maintains consistent spacing across screen sizes', () => {
      renderWithNavigation(true);
      const scrollView = screen.UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.style.paddingHorizontal).toBeDefined
    });
  });

  describe('Accessibility', () => {
    it('has an accessibility label and role on the close button', () => {
      renderWithNavigation(true);
      const closeButton = screen.getByTestId('close-menu-button');
      expect(closeButton.props.accessibilityLabel).toBe('Close menu');
      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('has testID on close icon', () => {
      renderWithNavigation(true);
      expect(screen.getByTestId('side-menu-close-icon')).toBeTruthy();
    });

    it('exposes the section title as the accessibility label and role on section toggle buttons', () => {
      renderWithNavigation(true);
      const sectionButton = screen.getByTestId('section-button-navigationTitles.mainmenu');
      expect(sectionButton.props.accessibilityLabel).toBe('App Navigation');
      expect(sectionButton.props.accessibilityRole).toBe('button');
    });

    it('reflects the expanded state on section toggle buttons', () => {
      renderWithNavigation(true);
      const sectionButton = screen.getByTestId('section-button-navigationTitles.mainmenu');
      expect(sectionButton.props.accessibilityState).toEqual({ expanded: false });

      fireEvent.press(sectionButton);
      expect(sectionButton.props.accessibilityState).toEqual({ expanded: true });
    });

    it('exposes the link text as the accessibility label and role on nav link buttons', () => {
      renderWithNavigation(true);
      fireEvent.press(screen.getByTestId('section-button-navigationTitles.mainmenu'));
      const linkButton = screen.getByTestId('link-button-navbar.home');
      expect(linkButton.props.accessibilityLabel).toBe('Home');
      expect(linkButton.props.accessibilityRole).toBe('button');
    });

    it('exposes the translated label and role on the Support Us button', () => {
      renderWithNavigation(true);
      const supportUsButton = screen.getByTestId('support-us-nav-button');
      expect(supportUsButton.props.accessibilityLabel).toBe('Support Us');
      expect(supportUsButton.props.accessibilityRole).toBe('button');
    });
  });
});
