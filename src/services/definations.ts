import { IBaseService } from '@vtjs/common';

import User from '../entities/user.entity';
import Task from '../entities/task.entity';
import Activity from '../entities/activity.entity';

export type JWTToken = {
  accessKey: string;
  exp: number;
};
export interface IAuthService {
  login(email: string, password: string): Promise<User & { token: JWTToken }>;
  verifyJWTToken(accessKey: string): Promise<User>;
}

export interface IUserService extends IBaseService<User> {
  createUser(user: Pick<User, 'email' | 'password'>): Promise<User>;
}

export interface ITaskService extends IBaseService<Task> {
  deleteTask(user: User, cond: Partial<Task>): Promise<boolean>;
  updateTask(user: User, cond: Partial<Task>, task: Partial<Task>): Promise<Task>;
}

export interface IActivityService extends IBaseService<Activity> {}
