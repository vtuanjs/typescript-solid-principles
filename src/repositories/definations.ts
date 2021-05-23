import { IBaseRepository, DeleteResponse } from '@vtjs/mongoose';

import User from '../entities/user.entity';
import Task from '../entities/task.entity';
import Activity from '../entities/activity.entity';

export interface IUserRepository extends IBaseRepository<User> {
  // Example handling another function that is NOT found in the Base Repository
  deleteByEmail(email: string): Promise<DeleteResponse>;
}

export interface ITaskRepository extends IBaseRepository<Task> {}

export interface IActivityRepository extends IBaseRepository<Activity> {}
