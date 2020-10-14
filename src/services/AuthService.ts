import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JWTToken, UserProperties } from '../types';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export default class AuthService {
  static async loginUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const userRepository = getRepository<User>(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.encryptedPassword
    );

    if (isValidPassword) {
      return user;
    }

    return null;
  }

  static async verifyToken(token: string): Promise<JWTToken | null> {
    return new Promise((resolve) => {
      jwt.verify(token, config.jwtSecret, function (
        err: unknown,
        decoded: JWTToken
      ) {
        if (err) {
          resolve(null);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  static async generateToken(user: User): Promise<string> {
    const jwtToken: JWTToken = {
      userId: user.id,
    };

    return jwt.sign(jwtToken, config.jwtSecret, {
      expiresIn: '24h',
    });
  }
}
