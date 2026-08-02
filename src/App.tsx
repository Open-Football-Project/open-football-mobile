import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Config from 'react-native-config';
import AppLayout from './app/layout/AppLayout';
import './app/i18n';
import { useApiService } from 'open-football-project-core';

const queryClient = new QueryClient();

const API_HOST = Config.API_HOST ?? 'https://footballproject.org';

export default function App() {
  const apiService = useApiService(API_HOST, false);
    return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppLayout apiService={apiService} apiHost={API_HOST} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}