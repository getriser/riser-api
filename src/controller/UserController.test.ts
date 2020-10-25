import AuthService from '../services/AuthService';

const supertest = require('supertest');
import { app } from '../app';
import { RegisterUserProperties } from '../types';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import UserService from '../services/UserService';
const request = supertest(app);

describe('UserController', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('register', () => {
    it('registers a user', async (done) => {
      const registerParams: RegisterUserProperties = {
        email: 'blah@blah.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      };

      const response = await request
        .post('/users/register')
        .send(registerParams);

      expect(response.status).toEqual(200);

      const user = await UserService.getUser(response.body.id);

      expect(response.body.id).toEqual(user.id);
      expect(response.body.email).toEqual(user.email);

      const jwt = await AuthService.verifyToken(response.body.token);
      expect(jwt.userId).toEqual(user.id);

      done();
    });
  });
});
