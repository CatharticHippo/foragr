module.exports = {
  extends: ['./base.js'],
  plugins: ['react', 'react-native', 'react-hooks'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
  },
};
