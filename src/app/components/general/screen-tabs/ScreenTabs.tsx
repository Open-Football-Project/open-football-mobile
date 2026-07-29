import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import NoData from '../no-data/NoData';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  letterSpacing,
  breakpoints,
} from '../../../theme';

export interface TabItem {
  component: React.ReactNode;
  titleTranslationKey: string;
  isLoading?: boolean;
  isAvailable?: boolean;
  testID?: string;
}

interface ScreenTabsProps {
  tabs: TabItem[];
  initialTabIndex?: number;
  testIDPrefix?: string;
}

export const ScreenTabs = ({
  tabs,
  initialTabIndex,
  testIDPrefix = 'screen-tabs',
}: ScreenTabsProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const availableTabs = useMemo(() => {
    return tabs.filter((tab) => tab.isAvailable !== false);
  }, [tabs]);

  const validInitialIndex = useMemo(() => {
    if (
      initialTabIndex !== undefined &&
      initialTabIndex >= 0 &&
      initialTabIndex < availableTabs.length
    ) {
      return initialTabIndex;
    }
    return 0;
  }, [initialTabIndex, availableTabs.length]);

  const [activeTabIndex, setActiveTabIndex] = useState(validInitialIndex);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [activeTabIndex]);

  const getResponsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        tabFontSize: fontSize.xl,
        tabPaddingHorizontal: spacing.xl,
        tabPaddingVertical: spacing.lg,
        containerPadding: spacing.lg,
        indicatorHeight: 4,
        minTabWidth: 180,
      };
    }
    if (isLargeScreen) {
      return {
        tabFontSize: fontSize.base,
        tabPaddingHorizontal: spacing.lg,
        tabPaddingVertical: spacing.md,
        containerPadding: spacing.md,
        indicatorHeight: 3,
        minTabWidth: 140,
      };
    }
    if (isTablet) {
      return {
        tabFontSize: fontSize.sm,
        tabPaddingHorizontal: spacing.md,
        tabPaddingVertical: spacing.sm,
        containerPadding: spacing.sm,
        indicatorHeight: 3,
        minTabWidth: 100,
      };
    }
    return {
      tabFontSize: fontSize.sm,
      tabPaddingHorizontal: 4,
      tabPaddingVertical: spacing.sm,
      containerPadding: spacing.xs,
      indicatorHeight: 2,
      minTabWidth: 80,
    };
  }, [isTV, isLargeScreen, isTablet]);

  if (availableTabs.length === 0) {
    return (
      <View testID={`${testIDPrefix}-no-data`}>
        <NoData />
      </View>
    );
  }

  const safeActiveIndex =
    activeTabIndex < availableTabs.length ? activeTabIndex : 0;
  const activeTab = availableTabs[safeActiveIndex];

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <View
      style={[styles.container, { padding: getResponsiveStyles.containerPadding }]}
      testID={testIDPrefix}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBarScrollView}
        contentContainerStyle={styles.tabBarContainer}
        testID={`${testIDPrefix}-scroll`}
      >
        {availableTabs.map((tab, index) => {
          const isActive = index === safeActiveIndex;
          const tabTestID = tab.testID || `${testIDPrefix}-tab-${index}`;

          return (
            <Pressable
              key={`tab-${index}-${tab.titleTranslationKey}`}
              onPress={() => handleTabPress(index)}
              style={({ pressed }) => [
                styles.tabButton,
                {
                  paddingHorizontal: getResponsiveStyles.tabPaddingHorizontal,
                  paddingVertical: getResponsiveStyles.tabPaddingVertical,
                  minWidth: getResponsiveStyles.minTabWidth,
                  opacity: pressed ? 0.7 : 1,
                },
                isActive && styles.tabButtonActive,
              ]}
              testID={tabTestID}
              accessible
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(tab.titleTranslationKey, { defaultValue: tab.titleTranslationKey })}
            >
              <View style={styles.tabLabelContainer}>
                <Text
                  style={[
                    styles.tabLabel,
                    { fontSize: getResponsiveStyles.tabFontSize },
                    isActive && styles.tabLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {t(tab.titleTranslationKey, { defaultValue: tab.titleTranslationKey })}
                </Text>
                {tab.isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={isActive ? colors.brand.orange : colors.text.secondary}
                    style={styles.loadingIndicator}
                    testID={`${tabTestID}-loading`}
                  />
                )}
              </View>

              
              <View
                style={[
                  styles.tabIndicator,
                  {
                    height: getResponsiveStyles.indicatorHeight,
                    backgroundColor: isActive
                      ? colors.brand.yellow
                      : colors.transparent,
                  },
                ]}
                testID={isActive ? `${tabTestID}-indicator-active` : undefined}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.divider} />

      <Animated.View
        style={[styles.contentContainer, { opacity: fadeAnim }]}
        testID={`${testIDPrefix}-content`}
        accessible
        accessibilityLabel="Tab content"
      >
        {activeTab.isLoading ? (
          <View style={styles.loadingContainer} testID={`${testIDPrefix}-content-loading`}>
            <NoData loading />
          </View>
        ) : (
          activeTab.component
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  } as ViewStyle,
  tabBarScrollView: {
    width: '100%',
    backgroundColor: colors.background.dark,
  } as ViewStyle,
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  } as ViewStyle,
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  } as ViewStyle,
  tabButtonActive: {
    
  } as ViewStyle,
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  } as ViewStyle,
  tabLabel: {
    fontWeight: fontWeight.semibold,
    color: colors.brand.dona,
    letterSpacing: letterSpacing.xs,
    textAlign: 'center',
  } as TextStyle,
  tabLabelActive: {
    color: colors.brand.cream,
    fontWeight: fontWeight.bold,
  } as TextStyle,
  loadingIndicator: {
    marginLeft: spacing.xs,
  } as ViewStyle,
  tabIndicator: {
    width: '100%',
    marginTop: spacing.xs,
    borderRadius: borderRadius.xs,
  } as ViewStyle,
  divider: {
    height: 1,
    backgroundColor: colors.text.secondary,
    opacity: 0.2,
    marginVertical: 1,
  } as ViewStyle,
  contentContainer: {
    width: '100%',
  } as ViewStyle,
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});

export default ScreenTabs;
