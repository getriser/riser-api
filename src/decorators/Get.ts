import Request from './Request';

export const Get = (path: string): MethodDecorator => {
  return Request('get', path);
};
