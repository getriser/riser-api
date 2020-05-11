import Request from './Request';

export const Put = (path: string): MethodDecorator => {
  return Request('put', path);
};
