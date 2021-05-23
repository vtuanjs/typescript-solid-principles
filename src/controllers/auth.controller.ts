import { Controller, Request, Response, NextFunction, sendSuccessReponse } from '@vtjs/core';
import { UnauthorizedError, ValidationError, ILogger } from '@vtjs/common';
import { IEventBus } from '@vtjs/rabbitmq';

import { ActivityAction } from '../entities/activity.entity';
import User from '../entities/user.entity';

import { IAuthService } from '../services/definations';
import { ActivityCreateEvent } from '../events/definations';

import { RequestWithUser, IAuthController } from './definations';

export default class AuthController extends Controller implements IAuthController {
  constructor(
    private authService: IAuthService,
    private eventBus: IEventBus,
    private logger: ILogger
  ) {
    super();
    this.requiredAuth = this.requiredAuth.bind(this);
    this.setupRouter();
  }

  setupRouter(): void {
    this.router.post('/auth/login', this.wrapTryCatch(this.login));
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as User;

    if (!email || !password) {
      return next(new ValidationError());
    }

    const user = await this.authService.login(email, password);
    if (!user) {
      return next(new UnauthorizedError());
    }

    this.eventBus
      .publish(
        new ActivityCreateEvent({
          userId: user.id,
          action: ActivityAction.USER_LOGIN,
          refId: user.id,
          data: null
        })
      )
      .catch((e) => this.logger.error('Publish event error: ', e));

    sendSuccessReponse(user, res);
  }

  async requiredAuth(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.headers['access-token']) {
        return next(new ValidationError('Missing token in header'));
      }

      const user = await this.authService.verifyJWTToken(req.headers['access-token'] as string);
      if (!user) {
        return next(new UnauthorizedError());
      }

      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }
}
