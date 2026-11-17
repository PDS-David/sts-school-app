// Backward-compatible exports for route modules not yet migrated to the new filename.
export {
  createPostgresRateLimitStore as createRedisRateLimitStore,
  consumePostgresQuota as consumeRedisQuota,
  assertRateLimitPostgresConfigured as assertRateLimitRedisConfigured,
  disconnectPostgresRateLimitStore as disconnectRedisRateLimitStore,
  RateLimitStoreUnavailableError as RedisRateLimitStoreError,
} from './postgresRateLimitStore.js';
