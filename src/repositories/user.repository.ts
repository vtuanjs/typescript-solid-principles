import { Schema, BaseRepository, Repository, DeleteResponse } from '@vtjs/mongoose';
import { IUserRepository } from './definations';
import User from '../entities/user.entity';

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: String
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true
  }
);

export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super('user', userSchema, 'users');
  }

  // Example handling another function that is NOT found in the Base Repository
  @Repository()
  async deleteByEmail(email: string): Promise<DeleteResponse> {
    return this.model.deleteOne({ email });
  }
}
