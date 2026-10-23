// Wraps app.json (still the single source of truth for a normal/production build).
// Only a designated staging build (STS_BUILD_TARGET=staging, set by the `staging` profile in eas.json)
// is altered: it must receive EXPO_PUBLIC_API_URL and may not resolve to the production host.
const { assertStagingApiUrl, isStagingBuild, assertKnownTarget } = require('./config/apiTarget');

module.exports = ({ config }) => {
  assertKnownTarget(process.env);
  if (!isStagingBuild(process.env)) return config; // unchanged: production/other builds behave as before
  const productionApiUrl = config.extra && config.extra.apiUrl;
  const apiUrl = assertStagingApiUrl(process.env.EXPO_PUBLIC_API_URL, productionApiUrl);
  return {
    ...config,
    extra: { ...config.extra, apiUrl, buildTarget: 'staging', productionApiUrl },
  };
};
