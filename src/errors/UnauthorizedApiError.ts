import ApiError from './ApiError';

export default class UnauthorizedApiError extends ApiError {
  constructor(message: string) {
    super(401, message);
  }
}
