import ConnectionUtil from '../test-utils/ConnectionUtil';
import UserService from './UserService';
import OrganizationService from './OrganizationService';
import AnnouncementService from './AnnouncementService';

describe('AnnouncementService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('createAnnouncement', () => {
    it('creates an announcement', async (done) => {
      const user = await UserService.registerUser({
        email: 'mike@mike.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      });

      const organization = await OrganizationService.createOrganization(
        user.id,
        {
          name: 'Organization Name',
        }
      );

      const announcementParams = {
        content: 'Come to Room 304 at 10pm',
        title: 'Free Tickets',
      };

      const announcement = await AnnouncementService.createAnnouncement(
        user.id,
        organization.id,
        announcementParams
      );

      expect(announcement.id).toBeTruthy();
      expect(announcement.draft).toBeTruthy();
      expect(announcement.title).toEqual(announcementParams.title);
      expect(announcement.content).toEqual(announcementParams.content);
      expect((await announcement.author).id).toEqual(user.id);
      expect((await announcement.organization).id).toEqual(organization.id);

      done();
    });
  });
});
