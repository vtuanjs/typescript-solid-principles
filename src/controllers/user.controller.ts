import { Controller, Request, Response, NextFunction, sendSuccessReponse } from '@vtjs/core';

import User from '../entities/user.entity';
import { IUserService } from '../services/definations';

export default class UserController extends Controller {
  constructor(private userService: IUserService) {
    super();
    this.setupRouter();
  }

  setupRouter(): void {
    this.router.post('/users', this.wrapTryCatch(this.create));
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as User;

    const user = await this.userService.createUser({ email, password });
    sendSuccessReponse(user, res);
  }
}
