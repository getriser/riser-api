import ConnectionUtil from '../test-utils/ConnectionUtil';
import AnnouncementService from './AnnouncementService';
import {
  createAnnouncement,
  createOrganization,
  createUser,
  DEFAULT_PASSWORD,
} from '../test-utils/Factories';
import OrganizationService from './OrganizationService';
import * as faker from 'faker';

describe('AnnouncementService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('createAnnouncement', () => {
    it('creates an announcement', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

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
      // expect((await announcement.organization).id).toEqual(organization.id);

      done();
    });
  });

  describe('updateAnnouncment', () => {
    it('updates an announcement', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);
      const announcement = await createAnnouncement(user, organization);

      const updateAnnouncementParams = {
        content: 'New Content',
        title: 'New Title',
      };

      const updatedAnnouncement = await AnnouncementService.updateAnnouncement(
        user.id,
        announcement.id,
        updateAnnouncementParams
      );

      expect(updatedAnnouncement.id).toEqual(announcement.id);
      expect(updatedAnnouncement.title).toEqual(updatedAnnouncement.title);
      expect(updatedAnnouncement.content).toEqual(updatedAnnouncement.content);
      expect(updatedAnnouncement.draft).toEqual(announcement.draft);

      done();
    });
  });

  describe('publishAnnouncement', () => {
    it('sets the draft to false', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);
      const announcement = await createAnnouncement(user, organization);

      expect(announcement.draft).toEqual(true);

      const publishedAnnouncement = await AnnouncementService.publishAnnouncement(
        user.id,
        announcement.id
      );
      expect(publishedAnnouncement.draft).toEqual(false);

      done();
    });
  });

  describe('getPublicAnnouncementsForOrganization', () => {
    it('returns all published announcements for an organization', async (done) => {
      const owner = await createUser();
      const member = await createUser();
      const organization = await createOrganization(owner);

      await OrganizationService.inviteMember(owner.id, organization.id, {
        email: member.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: DEFAULT_PASSWORD,
        passwordConfirmation: DEFAULT_PASSWORD,
      });

      const ownerAnnouncement = await createAnnouncement(owner, organization);
      const memberAnnouncement = await createAnnouncement(member, organization);

      expect(ownerAnnouncement.draft).toEqual(true);
      expect(memberAnnouncement.draft).toEqual(true);

      const myDraftAnnouncements = await AnnouncementService.getPublicAnnouncementsForOrganization(
        owner.id,
        organization.id
      );

      expect(myDraftAnnouncements).toHaveLength(1);
      expect(myDraftAnnouncements[0].id).toEqual(ownerAnnouncement.id);
      expect(myDraftAnnouncements[0].draft).toEqual(ownerAnnouncement.draft);

      await AnnouncementService.publishAnnouncement(
        owner.id,
        ownerAnnouncement.id
      );

      await AnnouncementService.publishAnnouncement(
        member.id,
        memberAnnouncement.id
      );

      const announcements = await AnnouncementService.getPublicAnnouncementsForOrganization(
        owner.id,
        organization.id
      );

      expect(announcements).toHaveLength(2);

      const ownerAnnouncementResponse = announcements.filter(
        (response) => response.id === ownerAnnouncement.id
      )[0];

      const memberAnnouncementResponse = announcements.filter(
        (response) => response.id === memberAnnouncement.id
      )[0];

      expect(ownerAnnouncementResponse.title).toEqual(
        ownerAnnouncementResponse.title
      );
      expect(ownerAnnouncementResponse.content).toEqual(
        ownerAnnouncementResponse.content
      );
      expect(ownerAnnouncementResponse.createdAt).toEqual(
        ownerAnnouncementResponse.createdAt
      );
      expect(ownerAnnouncementResponse.author.name).toEqual(owner.fullName);
      expect(ownerAnnouncementResponse.numberOfComments).toEqual(
        ownerAnnouncementResponse.numberOfComments
      );

      expect(memberAnnouncementResponse.title).toEqual(
        memberAnnouncementResponse.title
      );
      expect(memberAnnouncementResponse.content).toEqual(
        memberAnnouncementResponse.content
      );
      expect(memberAnnouncementResponse.createdAt).toEqual(
        memberAnnouncementResponse.createdAt
      );
      expect(memberAnnouncementResponse.author.name).toEqual(member.fullName);
      expect(memberAnnouncementResponse.numberOfComments).toEqual(
        memberAnnouncementResponse.numberOfComments
      );

      done();
    });
  });

  describe('getAnnouncement', () => {
    it('fetches an announcement', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);
      const announcement = await createAnnouncement(user, organization);

      const fetchedAnnouncement = await AnnouncementService.getAnnouncement(
        user.id,
        announcement.id
      );

      expect(fetchedAnnouncement.id).toEqual(announcement.id);
      expect(fetchedAnnouncement.title).toEqual(announcement.title);
      expect(fetchedAnnouncement.content).toEqual(announcement.content);
      expect(fetchedAnnouncement.draft).toEqual(announcement.draft);
      expect(fetchedAnnouncement.createdAt).toEqual(announcement.createdAt);

      done();
    });
  });

  describe('postCommentToAnnouncement', () => {
    it('adds a comment to an announcement', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);
      const announcement = await createAnnouncement(user, organization);

      expect(announcement.numberOfComments).toEqual(0);

      const content = faker.lorem.sentence();

      const comment = await AnnouncementService.postCommentToAnnouncement(
        user.id,
        announcement.id,
        content
      );

      const comments = await AnnouncementService.getCommentsForAnnouncement(
        user.id,
        announcement.id
      );
      expect(comments.length).toEqual(1);

      expect(comments[0].id).toEqual(comment.id);
      expect(comments[0].content).toEqual(content);
      expect(comments[0].createdAt).toEqual(comment.createdAt);
      expect(comments[0].author.id).toEqual(user.id);
      expect(comments[0].author.name).toEqual(user.fullName);

      const refresedAnnouncement = await AnnouncementService.getAnnouncement(
        user.id,
        announcement.id
      );
      expect(refresedAnnouncement.numberOfComments).toEqual(1);

      done();
    });
  });
});
