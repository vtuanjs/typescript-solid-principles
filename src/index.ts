import { EventEmitter } from 'events';
import { MongoDB } from '@vtjs/mongoose';
import { RedisCache } from '@vtjs/cache';
import { Logger } from '@vtjs/common';
import { RabbitMQ } from '@vtjs/rabbitmq';

import './env';
import * as config from './configs';

import UserRepository from './repositories/user.repository';
import TaskRepository from './repositories/task.repository';
import ActivityRepository from './repositories/activity.repository';

import UserService from './services/user.service';
import AuthService from './services/auth.service';
import TaskService from './services/task.service';
import ActivityService from './services/activity.service';

import ActivityEvent from './events/activity.event';

import Application from './app';

const logger = new Logger({ service: config.appName });

const mongodb = new MongoDB(
  {
    connectionString: config.MONGODB_CONNECTION_STRING,
    user: config.MONGODB_USER,
    password: config.MONGODB_PASSWORD
  },
  logger
);

const redisCache = new RedisCache(
  {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD
  },
  logger
);

// Event, Queue
const eventEmitter = new EventEmitter();
const eventBus = new RabbitMQ({
  config: {
    consumer: config.appName,
    exchange: 'example.eventBus',
    hostname: config.RABBITMQ_HOST,
    port: config.RABBITMQ_PORT,
    username: config.RABBITMQ_USER,
    password: config.RABBITMQ_PASSWORD
  },
  logger,
  eventEmitter
});

// Repository
const userRepository = new UserRepository();
const taskRepository = new TaskRepository();
const activityRepository = new ActivityRepository();

// Service
const userService = new UserService({
  repo: userRepository,
  logger,
  serviceCache: {
    cache: redisCache,
    appName: config.appName,
    uniqueKey: 'user',
    second: config.SERVICE_CACHE_SECOND
  }
});
const authService = new AuthService({
  logger,
  userService
});
const taskService = new TaskService({
  repo: taskRepository,
  logger,
  serviceCache: {
    cache: redisCache,
    appName: config.appName,
    uniqueKey: 'task',
    second: config.SERVICE_CACHE_SECOND
  }
});
const activityService = new ActivityService({
  repo: activityRepository,
  logger
});

const activityEvent = new ActivityEvent(activityService, logger);

const app = new Application({
  authService,
  activityService,
  taskService,
  userService,
  eventBus,
  logger,
  appName: config.appName,
  appVersion: config.appVersion,
  debug: true
});

// MAIN CONTROLLER
async function main() {
  await mongodb.connect();
  await eventBus.connect();

  await eventBus.subscribe(config.ACTIVITY_CREATE_EVENT, activityEvent.handle);

  app.showInfo();
  app.start();
}

main().catch((e) => {
  logger.error('Running app error: ', e);
  process.exit(1);
});

process.on('beforeExit', async (code) => {
  logger.error(`Process beforeExit event with code ${code}`);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  logger.error(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.error(`Process ${process.pid} has been interrupted`);
  process.exit(0);
});
