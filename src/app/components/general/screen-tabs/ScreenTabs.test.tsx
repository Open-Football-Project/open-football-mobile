import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { ScreenTabs, TabItem } from './ScreenTabs';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../no-data/NoData', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ loading, testID }: { loading?: boolean; testID?: string }) => (
      <View testID={testID || 'no-data'}>
        <Text>{loading ? 'Loading' : 'No Data'}</Text>
      </View>
    ),
  };
});

const createMockTab = (overrides: Partial<TabItem> = {}): TabItem => ({
  component: <Text testID="tab-content">Tab Content</Text>,
  titleTranslationKey: 'test.tab',
  isLoading: false,
  isAvailable: true,
  ...overrides,
});

describe('ScreenTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with default testID', () => {
      const tabs = [createMockTab()];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('screen-tabs')).toBeTruthy();
    });

    it('renders with custom testIDPrefix', () => {
      const tabs = [createMockTab()];
      render(<ScreenTabs tabs={tabs} testIDPrefix="custom-tabs" />);

      expect(screen.getByTestId('custom-tabs')).toBeTruthy();
    });

    it('renders tab buttons for each available tab', () => {
      const tabs = [
        createMockTab({ titleTranslationKey: 'tab.one', testID: 'tab-one' }),
        createMockTab({ titleTranslationKey: 'tab.two', testID: 'tab-two' }),
        createMockTab({ titleTranslationKey: 'tab.three', testID: 'tab-three' }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('tab-one')).toBeTruthy();
      expect(screen.getByTestId('tab-two')).toBeTruthy();
      expect(screen.getByTestId('tab-three')).toBeTruthy();
    });

    it('renders translated tab titles', () => {
      const tabs = [
        createMockTab({ titleTranslationKey: 'leagues.standing' }),
        createMockTab({ titleTranslationKey: 'leagues.fixtures' }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByText('leagues.standing')).toBeTruthy();
      expect(screen.getByText('leagues.fixtures')).toBeTruthy();
    });

    it('renders the first tab content by default', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="first-content">First</Text>,
        }),
        createMockTab({
          component: <Text testID="second-content">Second</Text>,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('first-content')).toBeTruthy();
      expect(screen.queryByTestId('second-content')).toBeFalsy();
    });

    it('renders content area with testID', () => {
      const tabs = [createMockTab()];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('screen-tabs-content')).toBeTruthy();
    });
  });

  describe('Tab Availability', () => {
    it('hides tabs with isAvailable=false', () => {
      const tabs = [
        createMockTab({
          titleTranslationKey: 'visible.tab',
          testID: 'visible-tab',
          isAvailable: true,
        }),
        createMockTab({
          titleTranslationKey: 'hidden.tab',
          testID: 'hidden-tab',
          isAvailable: false,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('visible-tab')).toBeTruthy();
      expect(screen.queryByTestId('hidden-tab')).toBeFalsy();
    });

    it('renders NoData when no tabs are available', () => {
      const tabs = [
        createMockTab({ isAvailable: false }),
        createMockTab({ isAvailable: false }),
      ];
      render(<ScreenTabs tabs={tabs} testIDPrefix="empty-tabs" />);

      expect(screen.getByTestId('empty-tabs-no-data')).toBeTruthy();
    });

    it('shows only available tabs in the tab bar', () => {
      const tabs = [
        createMockTab({ testID: 'tab-1', isAvailable: true }),
        createMockTab({ testID: 'tab-2', isAvailable: false }),
        createMockTab({ testID: 'tab-3', isAvailable: true }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('tab-1')).toBeTruthy();
      expect(screen.queryByTestId('tab-2')).toBeFalsy();
      expect(screen.getByTestId('tab-3')).toBeTruthy();
    });
  });

  describe('Tab Switching', () => {
    it('switches content when a different tab is pressed', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="content-one">Content One</Text>,
          testID: 'tab-one',
        }),
        createMockTab({
          component: <Text testID="content-two">Content Two</Text>,
          testID: 'tab-two',
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('content-one')).toBeTruthy();
      expect(screen.queryByTestId('content-two')).toBeFalsy();

      fireEvent.press(screen.getByTestId('tab-two'));

      expect(screen.queryByTestId('content-one')).toBeFalsy();
      expect(screen.getByTestId('content-two')).toBeTruthy();
    });

    it('maintains active state after switching tabs', () => {
      const tabs = [
        createMockTab({ testID: 'tab-one' }),
        createMockTab({ testID: 'tab-two' }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      fireEvent.press(screen.getByTestId('tab-two'));

   
      expect(screen.getByTestId('tab-two-indicator-active')).toBeTruthy();
    });

    it('respects initialTabIndex prop', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="content-one">One</Text>,
          testID: 'tab-one',
        }),
        createMockTab({
          component: <Text testID="content-two">Two</Text>,
          testID: 'tab-two',
        }),
      ];
      render(<ScreenTabs tabs={tabs} initialTabIndex={1} />);

      expect(screen.queryByTestId('content-one')).toBeFalsy();
      expect(screen.getByTestId('content-two')).toBeTruthy();
    });

    it('defaults to first tab when initialTabIndex is out of bounds', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="content-one">One</Text>,
        }),
      ];
      render(<ScreenTabs tabs={tabs} initialTabIndex={999} />);

      expect(screen.getByTestId('content-one')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator on tab button when tab isLoading', () => {
      const tabs = [
        createMockTab({
          testID: 'loading-tab',
          isLoading: true,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('loading-tab-loading')).toBeTruthy();
    });

    it('shows loading container in content area when active tab is loading', () => {
      const tabs = [
        createMockTab({
          isLoading: true,
          component: <Text>Should not show</Text>,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('screen-tabs-content-loading')).toBeTruthy();
    });

    it('does not show loading indicator when tab is not loading', () => {
      const tabs = [
        createMockTab({
          testID: 'normal-tab',
          isLoading: false,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.queryByTestId('normal-tab-loading')).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('applies tab accessibilityRole to tab buttons', () => {
      const tabs = [createMockTab({ testID: 'accessible-tab' })];
      render(<ScreenTabs tabs={tabs} />);

      const tabButton = screen.getByTestId('accessible-tab');
      expect(tabButton.props.accessibilityRole).toBe('tab');
    });

    it('marks active tab with selected state', () => {
      const tabs = [
        createMockTab({ testID: 'active-tab' }),
        createMockTab({ testID: 'inactive-tab' }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      const activeTab = screen.getByTestId('active-tab');
      const inactiveTab = screen.getByTestId('inactive-tab');

      expect(activeTab.props.accessibilityState.selected).toBe(true);
      expect(inactiveTab.props.accessibilityState.selected).toBe(false);
    });

    it('applies accessible label to content area', () => {
      const tabs = [createMockTab()];
      render(<ScreenTabs tabs={tabs} />);

      const content = screen.getByTestId('screen-tabs-content');
      expect(content.props.accessibilityLabel).toBe('Tab content');
    });

    it('provides accessibilityLabel from translation key', () => {
      const tabs = [
        createMockTab({
          testID: 'labeled-tab',
          titleTranslationKey: 'leagues.standing',
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      const tab = screen.getByTestId('labeled-tab');
      expect(tab.props.accessibilityLabel).toBe('leagues.standing');
    });
  });

  describe('Multiple Tabs Behavior', () => {
    it('handles switching between multiple tabs correctly', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="content-a">A</Text>,
          testID: 'tab-a',
        }),
        createMockTab({
          component: <Text testID="content-b">B</Text>,
          testID: 'tab-b',
        }),
        createMockTab({
          component: <Text testID="content-c">C</Text>,
          testID: 'tab-c',
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('content-a')).toBeTruthy();

      fireEvent.press(screen.getByTestId('tab-c'));
      expect(screen.getByTestId('content-c')).toBeTruthy();
      expect(screen.queryByTestId('content-a')).toBeFalsy();

      fireEvent.press(screen.getByTestId('tab-b'));
      expect(screen.getByTestId('content-b')).toBeTruthy();
      expect(screen.queryByTestId('content-c')).toBeFalsy();

      fireEvent.press(screen.getByTestId('tab-a'));
      expect(screen.getByTestId('content-a')).toBeTruthy();
    });

    it('correctly indexes tabs when some are unavailable', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="content-first">First</Text>,
          testID: 'tab-first',
          isAvailable: true,
        }),
        createMockTab({
          component: <Text testID="content-hidden">Hidden</Text>,
          testID: 'tab-hidden',
          isAvailable: false,
        }),
        createMockTab({
          component: <Text testID="content-third">Third</Text>,
          testID: 'tab-third',
          isAvailable: true,
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

   
      fireEvent.press(screen.getByTestId('tab-third'));

      expect(screen.getByTestId('content-third')).toBeTruthy();
      expect(screen.queryByTestId('content-first')).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tabs array', () => {
      render(<ScreenTabs tabs={[]} testIDPrefix="empty" />);

      expect(screen.getByTestId('empty-no-data')).toBeTruthy();
    });

    it('handles single tab', () => {
      const tabs = [
        createMockTab({
          component: <Text testID="single-content">Single</Text>,
          testID: 'single-tab',
        }),
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('single-tab')).toBeTruthy();
      expect(screen.getByTestId('single-content')).toBeTruthy();
    });

    it('handles tabs with undefined isAvailable (defaults to available)', () => {
      const tabs = [
        {
          component: <Text testID="default-available">Content</Text>,
          titleTranslationKey: 'test.tab',
          testID: 'default-tab',
        } as TabItem,
      ];
      render(<ScreenTabs tabs={tabs} />);

      expect(screen.getByTestId('default-tab')).toBeTruthy();
      expect(screen.getByTestId('default-available')).toBeTruthy();
    });
  });
});
