import { Controller, Route, Post, Body } from 'tsoa';
import AuthService from '../services/AuthService';
import UnauthorizedApiError from '../errors/UnauthorizedApiError';

interface LoginResponse {
  token: string;
}

interface LoginBody {
  email: string;
  password: string;
}

@Route('auth')
export class AuthController extends Controller {
  @Post('login')
  public async login(@Body() body: LoginBody): Promise<LoginResponse> {
    const user = await AuthService.loginUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedApiError('Unrecognized email / password.');
    }

    const token = await AuthService.generateToken(user);

    return {
      token,
    };
  }
}
