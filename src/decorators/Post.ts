import Request from './Request';

export const Post = (path: string): MethodDecorator => {
  return Request('post', path);
};
