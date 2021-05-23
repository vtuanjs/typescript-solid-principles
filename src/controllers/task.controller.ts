import { Controller, Response, NextFunction, sendSuccessReponse } from '@vtjs/core';
import { ServerError, NotFoundError, ILogger } from '@vtjs/common';
import { IEventBus } from '@vtjs/rabbitmq';

import { ActivityAction } from '../entities/activity.entity';
import Task from '../entities/task.entity';
import User from '../entities/user.entity';

import { ITaskService } from '../services/definations';
import { ActivityCreateEvent } from '../events/definations';

import { RequestWithUser, IAuthController } from './definations';

export default class TaskController extends Controller {
  constructor(
    private taskService: ITaskService,
    private authController: IAuthController,
    private eventBus: IEventBus,
    private logger: ILogger
  ) {
    super();
    this.setupRouter();
  }

  setupRouter(): void {
    this.router.use('/tasks', this.authController.requiredAuth);
    this.router.post('/tasks', this.wrapTryCatch(this.create));
    this.router.get('/tasks', this.wrapTryCatch(this.getList));
    this.router.get('/tasks/:id', this.wrapTryCatch(this.get));
    this.router.delete('/tasks/:id', this.wrapTryCatch(this.delete));
    this.router.put('/tasks/:id', this.wrapTryCatch(this.update));
  }

  private async create(req: RequestWithUser, res: Response, next: NextFunction) {
    const task = req.body as Task;
    task.userId = req.user.id;

    const newTask = await this.taskService.create(task);
    this.publishEvent(req.user, ActivityAction.CREATE_TASK, task);
    sendSuccessReponse(newTask, res);
  }

  private async getList(req: RequestWithUser, res: Response, next: NextFunction) {
    const list = await this.taskService.findAll({ userId: req.user.id });
    sendSuccessReponse(list, res);
  }

  private async get(req: RequestWithUser, res: Response, next: NextFunction) {
    const id = req.params.id;
    const task = await this.taskService.findOne({ userId: req.user.id, id });

    if (!task) return next(new NotFoundError());
    sendSuccessReponse(task, res);
  }

  private async delete(req: RequestWithUser, res: Response, next: NextFunction) {
    const id = req.params.id;
    const raw = await this.taskService.deleteTask(req.user, { id });

    if (!raw) return next(new ServerError());
    this.publishEvent(req.user, ActivityAction.DELETE_TASK);
    sendSuccessReponse(raw, res);
  }

  private async update(req: RequestWithUser, res: Response, next: NextFunction) {
    const id = req.params.id;
    const task = await this.taskService.updateTask(req.user, { id }, req.body);

    if (!task) return next(new ServerError());
    this.publishEvent(req.user, ActivityAction.UPDATE_TASK, task);
    sendSuccessReponse(task, res);
  }

  private publishEvent(user: User, action: ActivityAction, task?: Task) {
    this.eventBus
      .publish(
        new ActivityCreateEvent({
          userId: user.id,
          action: action,
          refId: user.id,
          data: task || null
        })
      )
      .catch((e) => this.logger.error('Publish event error: ', e));
  }
}
