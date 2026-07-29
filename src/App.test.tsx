import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useApiService } from '@matchinsights/core';
import App from './App';

jest.mock('@matchinsights/core', () => ({
  useApiService: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@tanstack/react-query', () => {
  const React = require('react');
  return {
    QueryClient: jest.fn().mockImplementation(() => ({})),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('./app/i18n', () => ({}));

jest.mock('./app/layout/AppLayout', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ apiService, apiHost }: { apiService: unknown; apiHost?: string }) => (
      <View testID="app-layout">
        <Text testID="app-layout-api-service">{apiService ? 'has-api-service' : 'no-api-service'}</Text>
        <Text testID="app-layout-api-host">{apiHost}</Text>
      </View>
    ),
  };
});

const mockUseApiService = useApiService as jest.MockedFunction<typeof useApiService>;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiService.mockReturnValue({} as any);
  });

  it('constructs apiService via useApiService with the production API host', () => {
    render(<App />);
    expect(mockUseApiService).toHaveBeenCalledWith('https://futballero.com', false);
  });

  it('passes apiService and the production apiHost down to AppLayout', () => {
    render(<App />);
    expect(screen.getByTestId('app-layout-api-service')).toHaveTextContent('has-api-service');
    expect(screen.getByTestId('app-layout-api-host')).toHaveTextContent('https://futballero.com');
  });
});
