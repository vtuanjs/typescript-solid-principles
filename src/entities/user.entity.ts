import { BaseEntity } from '@vtjs/common';

export default class User extends BaseEntity {
  email: string;
  password: string;
}
