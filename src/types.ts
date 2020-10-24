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

export interface Author {
  id: number;
  name: string;
}

export interface AnnouncementResponse {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  numberOfComments: number;
  createdAt: Date;
  author: Author;
}

export interface SuccessMessage {
  message: string;
}

export interface CreateAnnouncementParams {
  title: string;
  content: string;
}

export interface CreateAnnouncementBodyParams extends CreateAnnouncementParams {
  organizationId: number;
}

export interface UpdateAnnouncementParams {
  title: string;
  content: string;
}
