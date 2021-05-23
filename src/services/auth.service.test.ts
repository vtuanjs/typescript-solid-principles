import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import UserRepository from '../repositories/user.repository';

import AuthService from './auth.service';
import UserService from './user.service';

// Fake data
const user = {
  id: '60a9f5909119ff4a7f7824bd',
  email: 'vantuan130393@gmail.com',
  password: '$2b$10$SQ7.jKTDx740GKQc0YcFo.VkMl1Q7oeDiAnYh0e27i3yvls.Y6dVu',
  createdAt: '2021-05-23T06:26:24.823Z',
  updatedAt: '2021-05-23T06:26:24.823Z'
};

const loginObj = {
  email: 'vantuan130393@gmail.com',
  password: '123456'
};

// Fake Repositlry
const userRepository = new UserRepository();
stub(userRepository, 'findOne').resolves(user);

// Initialization
const userService = new UserService({
  repo: userRepository,
  logger: console,
  serviceCache: null
});

const authService = new AuthService({
  logger: console,
  userService
});

let accessToken;
describe('User login', () => {
  it('should be return user info', (done) => {
    authService
      .login(loginObj.email, loginObj.password)
      .then((result) => {
        expect(result).has.ownProperty('id');
        expect(result.email).to.eqls(user.email);
        expect(result).has.ownProperty('token');
        accessToken = result.token.accessKey;
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Verify token', () => {
  it('should be verify token', (done) => {
    authService
      .verifyJWTToken(accessToken)
      .then((result) => {
        expect(result).has.ownProperty('id');
        expect(result.email).to.eqls(user.email);
        done();
      })
      .catch((err) => done(err));
  });
});
