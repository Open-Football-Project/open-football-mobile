import { moderateScale } from 'react-native-size-matters';

export const fontFamily = {
  default: 'System',

};

// Smaller text scales more aggressively (barely readable as-is on small screens).
// Larger display text scales conservatively (already prominent, shouldn't balloon).
export const fontSize = {
  xxs: moderateScale(10, 0.25),
  xs:  moderateScale(12, 0.2),
  sm:  moderateScale(14, 0.15),
  base: moderateScale(16, 0.15),
  lg:  moderateScale(18, 0.12),
  xl:  moderateScale(20, 0.1),
  xxl: moderateScale(24, 0.08),
  xxxl: moderateScale(28, 0.06),
  xxxxl: moderateScale(32, 0.05),
};


export const fontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};


export const textStyles = {
  h1: {
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.bold,
    lineHeight: moderateScale(40, 0.05),
  },
  h2: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: moderateScale(32, 0.06),
  },
  h3: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    lineHeight: moderateScale(28, 0.08),
  },
  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: moderateScale(24, 0.1),
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: moderateScale(24, 0.12),
  },
  bodyBold: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: moderateScale(24, 0.12),
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: moderateScale(20, 0.15),
  },
  captionBold: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: moderateScale(20, 0.15),
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: moderateScale(16, 0.2),
  },
};


export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  xs: 0.1,
  sm: 0.3,
  wide: 0.5,
};
