import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterUserProperties } from '../types';
import RegistrationError from '../errors/RegistrationError';
import { validateEmail } from '../utils/Validations';

export default class UserService {
  static async getUser(id: number): Promise<User | undefined> {
    const userRepository = getRepository<User>(User);

    return userRepository.findOne(id);
  }

  static async registerUser(
    userProperties: RegisterUserProperties
  ): Promise<User | null> {
    if (!validateEmail(userProperties.email)) {
      throw new RegistrationError(
        'Email address is not a proper email address.'
      );
    }

    if (!userProperties.password || !userProperties.passwordConfirmation) {
      throw new RegistrationError('You must provide a password.');
    }

    if (userProperties.password !== userProperties.passwordConfirmation) {
      throw new RegistrationError(
        'Password and Password Confirmation are not the same.'
      );
    }

    const userRepository = getRepository<User>(User);

    const existingUser = await userRepository.findOne({
      where: { email: userProperties.email },
    });

    if (existingUser) {
      throw new RegistrationError('Email is already taken.');
    }

    const user = new User();
    user.email = userProperties.email;
    user.encryptedPassword = await bcrypt.hash(userProperties.password, 8);

    return userRepository.save(user);
  }
}
