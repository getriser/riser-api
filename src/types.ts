export interface RegisterUserProperties {
  email: string;
  firstName: string;
  lastName: string;
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
  imageUrl: string;
  role: OrganizationUserRole;
}

export interface Author {
  id: number;
  name: string;
}

export interface AnnouncementResponse {
  id: number;
  title: string;
  draft: boolean;
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

export interface PostCommentAnnouncementParams {
  content: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  role: OrganizationUserRole;
}

export enum CommentResourceType {
  ANNOUNCEMENT,
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: Date;
  author: Author;
}

export enum FileFolderType {
  FOLDER = 'FOLDER',
  FILE = 'FILE',
}

export interface FileResponse {
  id: number;
  type: FileFolderType;
  filePath: string;
}

export interface CreateFolderParams {
  name: string;
}
