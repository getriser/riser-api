export interface RegisterUserProperties {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface JWTToken {
  userId: number;
}

export enum OrganizationUserRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export interface CreateOrganizationParams {
  name: string;
}

export interface CreateOrganizationResponse {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  pronouns: string;
  role: OrganizationUserRole;
}

export interface SuccessMessage {
  message: string;
}
