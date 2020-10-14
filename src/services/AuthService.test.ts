import AuthService from './AuthService';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import { UserProperties } from '../types';
import UserService from './UserService';

describe('AuthService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('registerUser', () => {
    it('registers the user', async (done) => {
      const user = await UserService.registerUser({
        email: 'example@gmail.com',
        password: 'abcd1234',
      });

      expect(user.id).toBeTruthy();

      done();
    });
  });

  describe('loginUser', () => {
    it('returns the user if it is valid', async (done) => {
      const userProperties: UserProperties = {
        email: 'example12@gmail.com',
        password: 'abcd1234',
      };

      await UserService.registerUser(userProperties);

      let loggedInUser = await AuthService.loginUser(
        userProperties.email,
        userProperties.password
      );

      expect(loggedInUser).toBeTruthy();

      loggedInUser = await AuthService.loginUser(
        userProperties.email,
        'wrong-password'
      );

      expect(loggedInUser).toBeNull();

      done();
    });
  });
});
