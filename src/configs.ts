import { name as appName, version as appVersion } from '../package.json';
export { name as appName, version as appVersion } from '../package.json';

export const BCRYPT_HASH_SALT = 10;

export const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/typescriptSOLIDArchitecture';
export const MONGODB_USER = process.env.MONGODB_USER;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT && +process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const SERVICE_CACHE_SECOND = 60 * 60 * 2; //2H

// head -n 4096 /dev/urandom | openssl sha1
export const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || 't8#58bd54647e37585902db6b6b1c1b9e4ef31357d6';
// Use JWt_EXPIRES_DAYS to calculate token's expiration time
// When the token had expired, the user will be automatically logged out
export const JWt_EXPIRES_DAYS = process.env.JWt_EXPIRES_DAYS ? +process.env.JWt_EXPIRES_DAYS : 1;
export const JWt_EXPIRES_IN = `${JWt_EXPIRES_DAYS}d`;

export const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT && +process.env.RABBITMQ_PORT;
export const RABBITMQ_USER = process.env.RABBITMQ_USER;
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;

export const ACTIVITY_CREATE_EVENT = `${appName}|activity.create`;
