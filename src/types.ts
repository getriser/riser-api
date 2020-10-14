export interface RegisterUserProperties {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface JWTToken {
  userId: number;
}
