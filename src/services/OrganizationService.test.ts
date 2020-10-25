import UserService from './UserService';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import OrganizationService from './OrganizationService';
import { CreateOrganizationParams, OrganizationUserRole } from '../types';
import OrganizationUser from '../entity/OrganizationUser';
import {
  createOrganization,
  createUser,
  DEFAULT_PASSWORD,
} from '../test-utils/Factories';

describe('OrganizationService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('getOrganizations', () => {
    it('returns all of the organizations that the user belongs to', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

      const invitedOrganizationOwner = await createUser();
      const invitedOrganization = await createOrganization(
        invitedOrganizationOwner
      );

      await OrganizationService.inviteMember(
        invitedOrganizationOwner.id,
        invitedOrganization.id,
        {
          email: user.email,
          password: DEFAULT_PASSWORD,
          passwordConfirmation: DEFAULT_PASSWORD,
        }
      );

      const organizations = await OrganizationService.getOrganizations(user.id);
      expect(organizations).toHaveLength(2);

      const ownerOrganizationResponse = organizations.filter(
        (org) => org.id === organization.id
      )[0];

      expect(ownerOrganizationResponse.id).toEqual(organization.id);
      expect(ownerOrganizationResponse.name).toEqual(organization.name);
      expect(ownerOrganizationResponse.role).toEqual(
        OrganizationUserRole.OWNER
      );

      const invitedOrganizationResponse = organizations.filter(
        (org) => org.id === invitedOrganization.id
      )[0];

      expect(invitedOrganizationResponse.id).toEqual(invitedOrganization.id);
      expect(invitedOrganizationResponse.name).toEqual(
        invitedOrganization.name
      );
      expect(invitedOrganizationResponse.role).toEqual(
        OrganizationUserRole.MEMBER
      );

      done();
    });
  });

  describe('createOrganization', () => {
    it('creates an organization and makes the user the owner', async (done) => {
      const user = await UserService.registerUser({
        email: 'example987@gmail.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      });

      const organizationParams: CreateOrganizationParams = {
        name: 'My Awesome Group',
      };

      const organization = await OrganizationService.createOrganization(
        user.id,
        organizationParams
      );

      const organizationUsers = await organization.organizationUsers;

      expect(organization.id).toBeTruthy();
      expect(organization.name).toEqual(organizationParams.name);
      expect(organizationUsers.length).toEqual(1);

      const organizationUser: OrganizationUser = organizationUsers[0];
      expect((await organizationUser.user).id).toEqual(user.id);
      expect((await organizationUser.organization).id).toEqual(organization.id);
      expect(organizationUser.role).toEqual(OrganizationUserRole.OWNER);

      done();
    });
  });

  describe('getMembers', () => {
    it('gets members to an organization', async (done) => {
      const user = await UserService.registerUser({
        email: 'tom@tom.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      });

      const organization = await OrganizationService.createOrganization(
        user.id,
        { name: 'Some Organization' }
      );

      const members = await OrganizationService.getMembers(
        user.id,
        organization.id
      );

      expect(members.length).toEqual(1);
      expect(members[0].id).toEqual(user.id);
      expect(members[0].email).toEqual(user.email);
      expect(members[0].role).toEqual(OrganizationUserRole.OWNER);

      done();
    });
  });

  describe('inviteMember', () => {
    it('invites a member to an organization', async (done) => {
      const user = await UserService.registerUser({
        email: 'tom@tom2.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234',
      });

      const organization = await OrganizationService.createOrganization(
        user.id,
        { name: 'A Different Organization' }
      );

      let members = await OrganizationService.getMembers(
        user.id,
        organization.id
      );

      expect(members.length).toEqual(1);
      expect(members[0].id).toEqual(user.id);
      expect(members[0].email).toEqual(user.email);
      expect(members[0].role).toEqual(OrganizationUserRole.OWNER);

      await OrganizationService.inviteMember(user.id, organization.id, {
        email: 'anewmember@example.com',
        password: 'blahblah',
        passwordConfirmation: 'blahblah',
      });

      members = await OrganizationService.getMembers(user.id, organization.id);
      expect(members.length).toEqual(2);
      expect(members[1].email).toEqual('anewmember@example.com');
      expect(members[1].role).toEqual(OrganizationUserRole.MEMBER);

      done();
    });
  });
});
