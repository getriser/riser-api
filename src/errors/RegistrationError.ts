import BadRequestApiError from './BadRequestApiError';

export default class RegistrationError extends BadRequestApiError {
  constructor(message: string) {
    super(message);
  }
}
