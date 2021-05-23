import { BaseEntity } from '@vtjs/common';

export enum ActivityAction {
  CREATE_TASK = 'task.create',
  UPDATE_TASK = 'task.update',
  DELETE_TASK = 'task.delete',

  USER_LOGIN = 'user.login'
}

export default class Activity extends BaseEntity {
  userId: string;
  action: ActivityAction;
  refId: string;
  data: any;
}
