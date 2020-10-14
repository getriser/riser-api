import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserProperties } from '../types';

export default class UserService {
  static async registerUser(
    userProperties: UserProperties
  ): Promise<User | null> {
    const userRepository = getRepository<User>(User);

    const user = new User();
    user.email = userProperties.email;
    user.encryptedPassword = await bcrypt.hash(userProperties.password, 8);

    return userRepository.save(user);
  }
}
