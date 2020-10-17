import NotFoundApiError from './NotFoundApiError';

export default class ResourceNotFoundError extends NotFoundApiError {
  constructor(message: string) {
    super(message);
  }
}
