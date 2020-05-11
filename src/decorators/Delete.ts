import Request from './Request';

export const Delete = (path: string): MethodDecorator => {
  return Request('delete', path);
};
