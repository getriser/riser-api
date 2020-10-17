import ApiError from './ApiError';

export default class NotFoundApiError extends ApiError {
  constructor(message: string) {
    super(404, message);
  }
}
