import UserService from './UserService';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import * as faker from "faker";

describe('UserService', () => {
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
});
