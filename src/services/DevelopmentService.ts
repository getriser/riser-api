import AbstractService from './AbstractService';
import UserService from './UserService';
import {
  createAnnouncement,
  createOrganization,
  DEFAULT_PASSWORD,
} from '../test-utils/Factories';
import AnnouncementService from './AnnouncementService';
import OrganizationService from './OrganizationService';
import * as faker from 'faker';

export default class DevelopmentService extends AbstractService {
  static async initializeDevelopmentData(): Promise<void> {
    const owner = await UserService.registerUser({
      email: 'owner1@example.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: DEFAULT_PASSWORD,
      passwordConfirmation: DEFAULT_PASSWORD,
    });

    const organization = await createOrganization(owner);
    const announcement1 = await createAnnouncement(owner, organization);
    const announcement2 = await createAnnouncement(owner, organization);
    const announcement3 = await createAnnouncement(owner, organization);

    await OrganizationService.inviteMember(owner.id, organization.id, {
      email: 'member1@example.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: DEFAULT_PASSWORD,
      passwordConfirmation: DEFAULT_PASSWORD,
    });

    await OrganizationService.inviteMember(owner.id, organization.id, {
      email: 'member2@example.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: DEFAULT_PASSWORD,
      passwordConfirmation: DEFAULT_PASSWORD,
    });

    await OrganizationService.inviteMember(owner.id, organization.id, {
      email: 'member3@example.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: DEFAULT_PASSWORD,
      passwordConfirmation: DEFAULT_PASSWORD,
    });

    await AnnouncementService.publishAnnouncement(owner.id, announcement1.id);
    await AnnouncementService.publishAnnouncement(owner.id, announcement2.id);
    await AnnouncementService.publishAnnouncement(owner.id, announcement3.id);
  }
}
