export const RequireUser = (): MethodDecorator => {
  return (target, propertyKey: string): void => {
    Reflect.defineMetadata('requireUser', 'true', target.constructor, propertyKey);
  };
};
