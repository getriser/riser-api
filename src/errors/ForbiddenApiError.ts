import ApiError from './ApiError';

export default class ForbiddenApiError extends ApiError {
  constructor(message: string) {
    super(403, message);
  }
}
