import UserService from '../services/UserService';
import * as faker from 'faker';
import { User } from '../entity/User';
import OrganizationService from '../services/OrganizationService';
import Organization from '../entity/Organization';
import AnnouncementService from '../services/AnnouncementService';
import { CreateAnnouncementParams } from '../types';

export const DEFAULT_PASSWORD = 'abcd1234';

export const createUser = async (): Promise<User> => {
  return UserService.registerUser({
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: DEFAULT_PASSWORD,
    passwordConfirmation: DEFAULT_PASSWORD,
  });
};

export const createOrganization = async (user: User): Promise<Organization> => {
  return OrganizationService.createOrganization(user.id, {
    name: faker.company.companyName(),
  });
};

export const createAnnouncement = async (
  user: User,
  organization: Organization
) => {
  const params: CreateAnnouncementParams = {
    content: faker.lorem.paragraphs(4),
    title: faker.lorem.sentence(),
  };

  return AnnouncementService.createAnnouncement(
    user.id,
    organization.id,
    params
  );
};

export const createMulterFile = (fileName: string): Express.Multer.File => {
  const file: Express.Multer.File = {
    buffer: undefined,
    destination: '',
    encoding: '',
    fieldname: '',
    filename: '',
    mimetype: '',
    originalname: fileName,
    path: '',
    size: 0,
    stream: undefined,
  };

  return file;
};
