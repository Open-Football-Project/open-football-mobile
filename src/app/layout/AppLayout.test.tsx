import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AppLayout from './AppLayout';
import { ApiService } from '@matchinsights/core';

jest.mock('../header/AppHeader', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ onMenuPress }: { onMenuPress: () => void }) => (
      <View testID="app-header">
        <Pressable testID="menu-button" onPress={onMenuPress}>
          <Text>Menu</Text>
        </Pressable>
      </View>
    ),
  };
});

jest.mock('../footer/AppFooter', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => (
      <View testID="app-footer">
        <Text>Footer</Text>
      </View>
    ),
  };
});

jest.mock('../navigation/RootNavigator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    RootNavigator: ({ apiService, apiHost }: { apiService: any; apiHost?: string }) => (
      <View testID="root-navigator">
        <Text>Navigator</Text>
        <Text testID="root-navigator-api-host">{apiHost}</Text>
      </View>
    ),
  };
});

jest.mock('../navigation/SideMenu', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible, onClose }: { visible: boolean; onClose: () => void }) =>
      visible ? (
        <View testID="side-menu">
          <Pressable testID="close-menu" onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        </View>
      ) : null,
  };
});

describe('AppLayout', () => {
  const mockApiService = {} as ApiService;
  const testApiHost = 'https://test-api.example';

  it('renders the layout container', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('app-layout')).toBeTruthy();
  });

  it('renders the header', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('app-header')).toBeTruthy();
  });

  it('renders the body with navigator', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('app-body')).toBeTruthy();
    expect(screen.getByTestId('root-navigator')).toBeTruthy();
  });

  it('renders the footer', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('app-footer')).toBeTruthy();
  });

  it('opens side menu when menu button is pressed', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.queryByTestId('side-menu')).toBeNull();

    fireEvent.press(screen.getByTestId('menu-button'));
    expect(screen.getByTestId('side-menu')).toBeTruthy();
  });

  it('closes side menu when close button is pressed', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    fireEvent.press(screen.getByTestId('menu-button'));
    expect(screen.getByTestId('side-menu')).toBeTruthy();

    fireEvent.press(screen.getByTestId('close-menu'));
    expect(screen.queryByTestId('side-menu')).toBeNull();
  });

  describe('Responsiveness', () => {
    it('renders correctly on mobile screens', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 375,
        height: 667,
        scale: 2,
        fontScale: 2,
      });
      render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
      expect(screen.getByTestId('app-layout')).toBeTruthy();
      expect(screen.getByTestId('app-header')).toBeTruthy();
      expect(screen.getByTestId('app-footer')).toBeTruthy();
    });

    it('renders correctly on tablet screens', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 900,
        height: 1200,
        scale: 2,
        fontScale: 2,
      });
      render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
      expect(screen.getByTestId('app-layout')).toBeTruthy();
      expect(screen.getByTestId('app-header')).toBeTruthy();
      expect(screen.getByTestId('app-footer')).toBeTruthy();
    });

    it('renders correctly on TV screens', () => {
      jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
        width: 1920,
        height: 1080,
        scale: 2,
        fontScale: 2,
      });
      render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
      expect(screen.getByTestId('app-layout')).toBeTruthy();
      expect(screen.getByTestId('app-header')).toBeTruthy();
      expect(screen.getByTestId('app-footer')).toBeTruthy();
    });
  });

  it('applies correct background color from theme', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    const layout = screen.getByTestId('app-layout');
    expect(layout.props.style).toEqual(
      expect.objectContaining({
        flex: 1,
        backgroundColor: '#121212',
      })
    );
  });

  it('body container has flex: 1 for proper layout', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    const body = screen.getByTestId('app-body');
    expect(body.props.style).toEqual(
      expect.objectContaining({
        flex: 1,
      })
    );
  });

  it('passes apiHost through to RootNavigator', () => {
    render(<AppLayout apiService={mockApiService} apiHost={testApiHost} />);
    expect(screen.getByTestId('root-navigator-api-host')).toHaveTextContent(testApiHost);
  });
});
