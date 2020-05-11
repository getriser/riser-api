export type HTTPMethod = 'get' | 'post' | 'delete' | 'options' | 'put';

export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: HTTPMethod;
  // Method name within our class responsible for this route
  methodName: string;
}
