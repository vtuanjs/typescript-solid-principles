import { Controller, Response, NextFunction, sendSuccessReponse } from '@vtjs/core';
import { NotFoundError } from '@vtjs/common';

import { IActivityService } from '../services/definations';

import { RequestWithUser, IAuthController } from './definations';

export default class ActivityController extends Controller {
  constructor(private activityService: IActivityService, private authController: IAuthController) {
    super();
    this.setupRouter();
  }

  setupRouter(): void {
    this.router.use('/activitys', this.authController.requiredAuth);
    this.router.get('/activitys', this.wrapTryCatch(this.getList));
    this.router.get('/activitys/:id', this.wrapTryCatch(this.get));
  }

  private async getList(req: RequestWithUser, res: Response, next: NextFunction) {
    const list = await this.activityService.findAll({ userId: req.user.id });
    sendSuccessReponse(list, res);
  }

  private async get(req: RequestWithUser, res: Response, next: NextFunction) {
    const id = req.params.id;
    const activity = await this.activityService.findOne({ userId: req.user.id, id });

    if (!activity) return next(new NotFoundError());
    sendSuccessReponse(activity, res);
  }
}
