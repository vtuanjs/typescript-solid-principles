import { compare } from 'bcrypt';

import { ILogger, NotFoundError, ValidationError } from '@vtjs/common';
import { verifyJWT, generateJWt } from '@vtjs/auth';

import { IUserService, IAuthService, JWTToken } from './definations';

import User from '../entities/user.entity';
import { JWT_SECRET_KEY, JWt_EXPIRES_IN, JWt_EXPIRES_DAYS } from '../configs';

type AuthServiceProp = {
  logger: ILogger;
  userService: IUserService;
};

type JWTDecoded = {
  id: string;
  exp: number;
};

export default class AuthService implements IAuthService {
  logger: ILogger;
  userService: IUserService;

  constructor({ logger, userService }: AuthServiceProp) {
    this.logger = logger;
    this.userService = userService;
  }

  async login(email: string, password: string): Promise<User & { token: JWTToken }> {
    const findUser = await this.userService.findOne({ email });
    if (!findUser) throw new NotFoundError();

    await compare(password, findUser.password).catch((e) => {
      throw new ValidationError();
    });

    delete findUser.password;
    const token = this.generateJWTToken(findUser.id);

    return {
      ...findUser,
      token
    };
  }

  private generateJWTToken(id: string): JWTToken {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + JWt_EXPIRES_DAYS);
    const convertExpToNumber = Math.floor(exp.getTime() / 1000);

    const accessKey = generateJWt(
      {
        id
      },
      {
        secretKey: JWT_SECRET_KEY,
        expiresIn: JWt_EXPIRES_IN
      }
    );

    return {
      accessKey,
      exp: convertExpToNumber
    };
  }

  async verifyJWTToken(accessKey: string): Promise<User> {
    const decoded: JWTDecoded = verifyJWT({
      token: accessKey,
      secretKey: JWT_SECRET_KEY
    });

    if (!decoded?.id) throw new ValidationError();
    const findUser = await this.userService.findOne({ id: decoded.id });

    return findUser;
  }
}
