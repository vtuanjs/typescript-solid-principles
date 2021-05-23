import bcrypt from 'bcrypt';

import { BaseService, ILogger, ServiceCache, AlreadyExistsError } from '@vtjs/common';

import { IUserService } from './definations';

import { BCRYPT_HASH_SALT } from '../configs';
import User from '../entities/user.entity';
import { IUserRepository } from '../repositories/definations';

type UserServiceProp = {
  repo: IUserRepository;
  logger: ILogger;
  serviceCache: ServiceCache;
};

export default class UserService extends BaseService<User> implements IUserService {
  repo: IUserRepository;

  constructor({ repo, logger, serviceCache }: UserServiceProp) {
    super(repo, serviceCache, logger);
  }

  async createUser({ email, password }: Pick<User, 'email' | 'password'>): Promise<User> {
    const findUser = await this.findOne({ email });
    if (findUser) throw new AlreadyExistsError();

    const hashPassword = await bcrypt.hash(password, BCRYPT_HASH_SALT);
    return this.create({
      email,
      password: hashPassword
    });
  }

  // Example handling another function that is NOT found in the Base Repository
  async deleteUserByEmail(email: string): Promise<boolean> {
    // Cache is build-in with all function in the Base Service
    // If you want handle it, please follow structure
    // Get Cache
    // const exampleHanleGetCache = await this.getCache({ email });
    // Set Cache
    // this.setCache({ email }, user)

    const raw = await this.repo.deleteByEmail(email);

    if (raw.ok == 1) {
      // Handle delete cache because you not using function in Base Service
      this.deleteCache({ email });
      return true;
    }
    return false;
  }
}
