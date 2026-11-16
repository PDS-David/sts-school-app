// Wraps app.json (still the single source of truth for a normal/production build).
// Only a designated staging build (STS_BUILD_TARGET=staging, set by the `staging` profile in eas.json)
// is altered: it must receive EXPO_PUBLIC_API_URL and may not resolve to the production host.
const { assertStagingApiUrl, isStagingBuild, assertKnownTarget } = require('./config/apiTarget');

const REQUIRED_CONFIG_PLUGINS = [
  'expo-asset',
  'expo-audio',
  'expo-font',
  'expo-secure-store',
  'expo-status-bar',
];

module.exports = ({ config }) => {
  assertKnownTarget(process.env);

  // Dynamic Expo config cannot be auto-edited by `expo install --fix`.
  // Keep the SDK-required config plugins explicit and merge them with app.json plugins.
  const plugins = Array.isArray(config.plugins) ? [...config.plugins] : [];
  for (const plugin of REQUIRED_CONFIG_PLUGINS) {
    const alreadyConfigured = plugins.some((entry) => (
      Array.isArray(entry) ? entry[0] === plugin : entry === plugin
    ));
    if (!alreadyConfigured) plugins.push(plugin);
  }
  const configWithPlugins = { ...config, plugins };

  if (!isStagingBuild(process.env)) return configWithPlugins;
  const productionApiUrl = configWithPlugins.extra && configWithPlugins.extra.apiUrl;
  const apiUrl = assertStagingApiUrl(process.env.EXPO_PUBLIC_API_URL, productionApiUrl);
  return {
    ...configWithPlugins,
    extra: { ...configWithPlugins.extra, apiUrl, buildTarget: 'staging', productionApiUrl },
  };
};
