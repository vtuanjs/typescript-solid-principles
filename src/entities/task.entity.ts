import { BaseEntity } from '@vtjs/common';

export default class Task extends BaseEntity {
  userId: string;
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  deadline: string | Date;
}
