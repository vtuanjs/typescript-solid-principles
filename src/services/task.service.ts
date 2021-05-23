import {
  BaseService,
  ILogger,
  ServiceCache,
  NotFoundError,
  PermissionDeniedError
} from '@vtjs/common';

import { ITaskService } from './definations';

import User from '../entities/user.entity';
import Task from '../entities/task.entity';

import { ITaskRepository } from '../repositories/definations';

type TaskServiceProp = {
  repo: ITaskRepository;
  logger: ILogger;
  serviceCache: ServiceCache;
};

export default class TaskService extends BaseService<Task> implements ITaskService {
  repo: ITaskRepository;
  constructor({ repo, logger, serviceCache }: TaskServiceProp) {
    super(repo, serviceCache, logger);
  }

  async deleteTask(user: User, cond: Partial<Task>): Promise<boolean> {
    const findTask = await this.findOne(cond);
    if (!findTask) throw new NotFoundError();

    if (findTask.userId !== user.id) throw new PermissionDeniedError();
    return this.deleteById(findTask.id);
  }

  async updateTask(user: User, cond: Partial<Task>, task: Partial<Task>): Promise<Task> {
    const findTask = await this.findOne(cond);
    if (!findTask) throw new NotFoundError();

    if (findTask.userId !== user.id) throw new PermissionDeniedError();

    delete task.userId;
    return this.findOneAndUpdate({ id: findTask.id }, task);
  }
}
