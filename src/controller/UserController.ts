import { Controller, Route, Post, Body } from 'tsoa';
import { RegisterUserProperties } from '../types';
import UserService from '../services/UserService';

interface RegisterResponse {
  id: number;
  email: string;
}

@Route('user')
export class AuthController extends Controller {
  @Post('register')
  public async register(
    @Body() body: RegisterUserProperties
  ): Promise<RegisterResponse> {
    const user = await UserService.registerUser(body);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
