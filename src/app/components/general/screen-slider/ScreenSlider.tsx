import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../icons/Icons';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
  breakpoints,
} from '../../../theme';

export interface ScreenSliderProps {
  items: React.ReactNode[];
  initialIndex?: number;
  showArrows?: boolean;
  showPagination?: boolean;
  testIDPrefix?: string;
  onSlideChange?: (index: number) => void;
}

export const ScreenSlider = ({
  items,
  initialIndex = 0,
  showArrows = true,
  showPagination = true,
  testIDPrefix = 'screen-slider',
  onSlideChange,
}: ScreenSliderProps) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const validInitialIndex = useMemo(() => {
    if (initialIndex >= 0 && initialIndex < items.length) {
      return initialIndex;
    }
    return 0;
  }, [initialIndex, items.length]);

  const [currentIndex, setCurrentIndex] = useState(validInitialIndex);

  const isTV = screenWidth >= breakpoints.tv;
  const isLargeScreen = screenWidth >= breakpoints.desktop;
  const isTablet = screenWidth >= breakpoints.tablet;

  const responsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        arrowSize: fontSize.xxxl,
        arrowButtonWidth: 60,
        dotSize: 14,
        dotSpacing: spacing.md,
        containerPadding: spacing.lg,
      };
    }
    if (isLargeScreen) {
      return {
        arrowSize: fontSize.xxl,
        arrowButtonWidth: 52,
        dotSize: 12,
        dotSpacing: spacing.sm,
        containerPadding: spacing.md,
      };
    }
    if (isTablet) {
      return {
        arrowSize: fontSize.xl,
        arrowButtonWidth: 48,
        dotSize: 10,
        dotSpacing: spacing.sm,
        containerPadding: spacing.sm,
      };
    }
    return {
      arrowSize: fontSize.lg,
      arrowButtonWidth: 36,
      dotSize: 8,
      dotSpacing: spacing.xs,
      containerPadding: spacing.xs,
    };
  }, [isTV, isLargeScreen, isTablet]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      onSlideChange?.(index);
    }
  }, [items.length, onSlideChange]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    goToIndex(newIndex);
  }, [currentIndex, items.length, goToIndex]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    goToIndex(newIndex);
  }, [currentIndex, items.length, goToIndex]);

  if (!items || items.length === 0) {
    return null;
  }

  const canNavigate = items.length > 1;

  return (
    <View
      style={[styles.container, { padding: responsiveStyles.containerPadding }]}
      testID={testIDPrefix}
    >
      <View style={styles.sliderContainer}>
        {showArrows && canNavigate && (
          <Pressable
            onPress={handlePrevious}
            style={({ pressed }) => [
              styles.arrowButton,
              { 
                width: responsiveStyles.arrowButtonWidth,
                height: responsiveStyles.arrowButtonWidth,
              },
              pressed && styles.arrowButtonPressed,
            ]}
            testID={`${testIDPrefix}-prev`}
            accessibilityLabel={t('accessibility.previous_slide')}
            accessibilityRole="button"
          >
            <ChevronLeftIcon
              size={responsiveStyles.arrowSize}
              color={colors.text.primary}
            />
          </Pressable>
        )}

        <View style={styles.slideContainer} testID={`${testIDPrefix}-slide-${currentIndex}`}>
          {items[currentIndex]}
        </View>

  
        {showArrows && canNavigate && (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.arrowButton,
              { 
                width: responsiveStyles.arrowButtonWidth,
                height: responsiveStyles.arrowButtonWidth,
              },
              pressed && styles.arrowButtonPressed,
            ]}
            testID={`${testIDPrefix}-next`}
            accessibilityLabel={t('accessibility.next_slide')}
            accessibilityRole="button"
          >
            <ChevronRightIcon
              size={responsiveStyles.arrowSize}
              color={colors.text.primary}
            />
          </Pressable>
        )}
      </View>

      {showPagination && canNavigate && (
        <View style={styles.paginationContainer} testID={`${testIDPrefix}-pagination`}>
          {items.map((_, index) => (
            <Pressable
              key={`dot-${index}`}
              onPress={() => goToIndex(index)}
              style={[
                styles.paginationDot,
                {
                  width: responsiveStyles.dotSize,
                  height: responsiveStyles.dotSize,
                  marginHorizontal: responsiveStyles.dotSpacing,
                },
                index === currentIndex && styles.paginationDotActive,
              ]}
              testID={`${testIDPrefix}-dot-${index}`}
              accessibilityLabel={t('accessibility.go_to_slide', { number: index + 1 })}
              accessibilityRole="button"
              accessibilityState={{ selected: index === currentIndex }}
            />
          ))}
        </View>
      )}

      {canNavigate && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText} testID={`${testIDPrefix}-counter`}>
            {currentIndex + 1} / {items.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  } as ViewStyle,
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  } as ViewStyle,
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.overlay,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  } as ViewStyle,
  arrowButtonPressed: {
    opacity: 0.7,
  } as ViewStyle,
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  } as ViewStyle,
  paginationDot: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.secondary,
  } as ViewStyle,
  paginationDotActive: {
    backgroundColor: colors.brand.yellow,
  } as ViewStyle,
  counterContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  } as ViewStyle,
  counterText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  } as TextStyle,
});

export default ScreenSlider;
