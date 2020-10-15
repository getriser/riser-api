import { JWTToken } from './src/types';

declare global {
  namespace Express {
    export interface Request {
      user: JWTToken;
    }
  }
}
