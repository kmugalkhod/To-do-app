const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native Remote Control App
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
