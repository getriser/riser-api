import Request from './Request';

export const Options = (path: string): MethodDecorator => {
  return Request('options', path);
};
