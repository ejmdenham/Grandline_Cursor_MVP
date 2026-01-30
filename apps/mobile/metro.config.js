const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const rootNodeModules = path.resolve(monorepoRoot, 'node_modules');
const config = getDefaultConfig(projectRoot);
config.projectRoot = projectRoot;
config.watchFolders = [monorepoRoot];
config.resolver.extraNodeModules = {
  '@react-navigation/native': path.join(rootNodeModules, '@react-navigation', 'native'),
  '@react-navigation/native-stack': path.join(rootNodeModules, '@react-navigation', 'native-stack'),
  '@react-navigation/core': path.join(rootNodeModules, '@react-navigation', 'core'),
  '@react-navigation/elements': path.join(rootNodeModules, '@react-navigation', 'elements'),
  '@react-navigation/routers': path.join(rootNodeModules, '@react-navigation', 'routers'),
  '@react-navigation/drawer': path.join(rootNodeModules, '@react-navigation', 'drawer'),
  // Single copy for entire bundle: root has 2.20.2 via overrides; avoids duplicate RNGestureHandlerButton
  'react-native-gesture-handler': path.join(rootNodeModules, 'react-native-gesture-handler'),
};

module.exports = config;
