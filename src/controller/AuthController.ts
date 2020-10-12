import {
  Controller,
  Route,
  Path,
  Query,
  Get,
  Post,
  Security,
  Request,
} from 'tsoa';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

interface GenerateTokenResponse {
  token: string;
}

interface VerifyTokenResponse {
  userId: number;
}

@Route('auth')
export class AuthController extends Controller {
  @Post('token')
  public generateToken(): GenerateTokenResponse {
    const token = jwt.sign({ userId: 1 }, config.jwtSecret, {
      expiresIn: '24h',
    });

    return {
      token,
    };
  }

  @Post('verify')
  @Security('jwt')
  public verifyToken(@Request() request: any): VerifyTokenResponse {
    return {
      ...request.user,
    };
  }
}
