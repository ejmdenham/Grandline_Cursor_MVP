module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // must be last; Reanimated 3 (we pin to 3.x for old-arch compatibility)
  };
};
