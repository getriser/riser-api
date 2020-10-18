import { Controller, Route, Post, Body, Tags } from 'tsoa';
import { RegisterUserProperties } from '../types';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

interface RegisterResponse {
  id: number;
  email: string;
  token: string;
}

@Tags('User Controller')
@Route('user')
export class UserController extends Controller {
  @Post('register')
  public async register(
    @Body() body: RegisterUserProperties
  ): Promise<RegisterResponse> {
    const user = await UserService.registerUser(body);
    const token = await AuthService.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }
}
