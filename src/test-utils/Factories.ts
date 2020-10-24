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
    content: faker.lorem.paragraph(),
    title: faker.lorem.sentence(),
  };

  return AnnouncementService.createAnnouncement(
    user.id,
    organization.id,
    params
  );
};
