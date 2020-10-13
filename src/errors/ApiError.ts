// For some reason, I couldn't get this to extend Error.
// The app handler was treating this as instanceof Error instead
// of instanceof ApiError.
export default class ApiError {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    this.message = message;
    this.status = status;
  }
}
