import { MainApplication } from '@vtjs/core';
import { IEventBus } from '@vtjs/rabbitmq';
import { ILogger } from '@vtjs/common';

import { IActivityService, IAuthService, ITaskService, IUserService } from './services/definations';

import AuthController from './controllers/auth.controller';
import ActivityController from './controllers/activity.controller';
import TaskController from './controllers/task.controller';
import UserController from './controllers/user.controller';

type ApplicationProp = {
  authService: IAuthService;
  activityService: IActivityService;
  taskService: ITaskService;
  userService: IUserService;
  eventBus: IEventBus;
  logger: ILogger;
  appName: string;
  appVersion: string;
  debug: boolean;
};

export default class Application extends MainApplication {
  constructor({
    authService,
    activityService,
    taskService,
    userService,
    eventBus,
    logger,
    appName,
    appVersion,
    debug
  }: ApplicationProp) {
    super(logger, { name: appName, version: appVersion, debug });

    const authController = new AuthController(authService, eventBus, logger);
    const activityController = new ActivityController(activityService, authController);
    const taskController = new TaskController(taskService, authController, eventBus, logger);
    const userController = new UserController(userService);

    this.setupControllers(authController, activityController, taskController, userController);
  }
}
