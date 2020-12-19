import { Controller, Route, Tags, Get } from 'tsoa';
import { SuccessMessage } from '../types';

@Tags('Health Controller')
@Route('health')
export class HealthController extends Controller {
  @Get('/')
  public async ping(): Promise<SuccessMessage> {
    return Promise.resolve({ message: 'Ok.' });
  }
}
