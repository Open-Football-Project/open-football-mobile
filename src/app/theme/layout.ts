import { moderateScale } from 'react-native-size-matters';

// Smaller gaps barely grow (micro-spacing stays tight).
// Larger section gaps grow more (pages need more breathing room on big screens).
export const spacing = {
  xxs:   moderateScale(2,  0),
  xs:    moderateScale(4,  0.05),
  sm:    moderateScale(8,  0.08),
  md:    moderateScale(12, 0.1),
  lg:    moderateScale(16, 0.12),
  xl:    moderateScale(24, 0.15),
  xxl:   moderateScale(32, 0.15),
  xxxl:  moderateScale(48, 0.12),
  xxxxl: moderateScale(64, 0.1),
};

// Border radius: barely scales — corner shapes are visual details
export const borderRadius = {
  none: 0,
  xs:   moderateScale(4,  0.05),
  sm:   moderateScale(8,  0.05),
  md:   moderateScale(12, 0.05),
  lg:   moderateScale(16, 0.05),
  xl:   moderateScale(24, 0.05),
  full: 9999,
};

export const shadows = {
  glow: {
    shadowColor: '#6FDFEE',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
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
};

export const sizes = {
  fullWidth: '100%' as const,
  fullHeight: '100%' as const,
  touchableHeight:     moderateScale(44, 0.2),
  matchButtonMinWidth: moderateScale(50, 0.1),
  iconSmall:  moderateScale(16, 0.15),
  iconMedium: moderateScale(24, 0.12),
  iconLarge:  moderateScale(32, 0.08),
  iconXLarge: moderateScale(40, 0.06),
  containerSmall: 300,
  containerMedium: 400,
  containerLarge: 500,
};

export const borders = {
  hairline: 0.5,
  thin: 1,
  thick: 2,
};

export const zIndex = {
  base: 0,
  dropdown: 10,
  overlay: 100,
  modal: 1000,
  toast: 10000,
};


export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};


export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  focus: 0.9,
  normal: 1,
};

export const breakpoints = {
  tablet:  768,
  desktop: 1024,
  tv:      1280,
};
