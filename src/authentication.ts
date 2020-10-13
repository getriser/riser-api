import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from './config/config';
import UnauthorizedApiError from './errors/UnauthorizedApiError';

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'jwt') {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers['x-access-token'];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new UnauthorizedApiError('Authentication required.'));
      }
      jwt.verify(token, config.jwtSecret, function (err: any, decoded: any) {
        if (err) {
          reject(new UnauthorizedApiError('Could not verify token.'));
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
