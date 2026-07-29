require('@testing-library/jest-native/extend-expect');

jest.mock('react-native-size-matters', () => ({
  moderateScale: (size) => size,
  scale: (size) => size,
  verticalScale: (size) => size,
  moderateVerticalScale: (size) => size,
}));
