module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((@react-navigation|@react-native|@react-native-async-storage|react-native-safe-area-context|react-native-screens|react-native-gesture-handler)/)?[^/]+)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/webold/',
    '<rootDir>/oldwebapp/',
    '<rootDir>/node_modules/',
    '<rootDir>/match-insights-ui-core/',
    '<rootDir>/ui-audit/',
    '<rootDir>/ui-core-audit/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/ui-audit/',
    '<rootDir>/ui-core-audit/',
  ],
  moduleNameMapper: {
    'react-native-view-shot': '<rootDir>/__mocks__/react-native-view-shot.js',
    'react-native-share': '<rootDir>/__mocks__/react-native-share.js',
    'react-native-config': '<rootDir>/__mocks__/react-native-config.js',
    '@react-native-clipboard/clipboard': '<rootDir>/node_modules/@react-native-clipboard/clipboard/jest/clipboard-mock.js',
  },
};
