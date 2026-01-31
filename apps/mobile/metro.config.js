const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const rootNodeModules = path.resolve(monorepoRoot, 'node_modules');
const config = getDefaultConfig(projectRoot);
config.projectRoot = projectRoot;
config.watchFolders = [monorepoRoot];
// Ensure monorepo root node_modules is searched
config.resolver.nodeModulesPaths = [
  rootNodeModules,
  ...(config.resolver.nodeModulesPaths || []),
];
config.resolver.extraNodeModules = {
  'pretty-format': path.join(rootNodeModules, 'pretty-format'),
  '@react-navigation/native': path.join(rootNodeModules, '@react-navigation', 'native'),
  '@react-navigation/native-stack': path.join(rootNodeModules, '@react-navigation', 'native-stack'),
  '@react-navigation/core': path.join(rootNodeModules, '@react-navigation', 'core'),
  '@react-navigation/elements': path.join(rootNodeModules, '@react-navigation', 'elements'),
  '@react-navigation/routers': path.join(rootNodeModules, '@react-navigation', 'routers'),
  '@react-navigation/drawer': path.join(rootNodeModules, '@react-navigation', 'drawer'),
  // Single copy for entire bundle: root has 2.20.2 via overrides; avoids duplicate RNGestureHandlerButton
  'react-native-gesture-handler': path.join(rootNodeModules, 'react-native-gesture-handler'),
};

// Custom resolver: force "pretty-format" to monorepo root (Metro hierarchical lookup misses it from RN HMRClient).
// Metro's _getFileResolvedModule expects the inner resolution (type "sourceFile"), not the { type: "resolved", resolution } wrapper.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'pretty-format') {
    const prettyFormatMain = path.join(rootNodeModules, 'pretty-format', 'build', 'index.js');
    return { type: 'sourceFile', filePath: prettyFormatMain };
  }
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
