import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ApiService } from '@matchinsights/core';
import AppHeader from '../header/AppHeader';
import AppFooter from '../footer/AppFooter';
import { RootNavigator } from '../navigation/RootNavigator';
import SideMenu from '../navigation/SideMenu';
import { colors } from '../theme/colors';

interface AppLayoutProps {
  apiService: ApiService;
  apiHost: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ apiService, apiHost }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container} testID="app-layout">
      <AppHeader onMenuPress={() => setMenuOpen(true)} />

      <View style={styles.body} testID="app-body">
        <RootNavigator apiService={apiService} apiHost={apiHost} />
      </View>

      <AppFooter />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  body: {
    flex: 1,
  },
});

export default AppLayout;