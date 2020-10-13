import ApiError from './ApiError';

export default class BadRequestApiError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}
