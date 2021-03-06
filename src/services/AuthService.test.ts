import AuthService from './AuthService';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import { RegisterUserProperties } from '../types';
import UserService from './UserService';
import * as faker from "faker";

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
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      });

      expect(user.id).toBeTruthy();

      done();
    });
  });

  describe('loginUser', () => {
    it('returns the user if it is valid', async (done) => {
      const userProperties: RegisterUserProperties = {
        email: 'example12@gmail.com',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
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
