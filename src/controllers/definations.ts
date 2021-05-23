import { Request, Response, NextFunction } from '@vtjs/core';
import User from '../entities/user.entity';

export type RequestWithUser = Request & { user: User };

export interface IAuthController {
  requiredAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
}
