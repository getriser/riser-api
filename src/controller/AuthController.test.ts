import AuthService from '../services/AuthService';

const supertest = require('supertest');
import { app } from '../app';
import { JWTToken } from '../types';
import ConnectionUtil from '../test-utils/ConnectionUtil';
const request = supertest(app);

describe('AuthController', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('login', () => {
    it('throws a 401 error if user is not found', async (done) => {
      const response = await request.post('/auth/login').send({
        email: 'blah@blah.com',
        password: 'abcd1234',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unrecognized email / password.');

      done();
    });

    it('logins the user', async (done) => {
      const user = await AuthService.registerUser({
        email: 'm@blah.com',
        password: 'abcd1234',
      });

      const response = await request.post('/auth/login').send({
        email: user.email,
        password: 'abcd1234',
      });

      expect(response.status).toBe(200);

      const parsedJwtToken: JWTToken = await AuthService.verifyToken(
        response.body.token
      );

      expect(parsedJwtToken).not.toBeNull();
      expect(parsedJwtToken.userId).toEqual(user.id);

      done();
    });
  });
});
