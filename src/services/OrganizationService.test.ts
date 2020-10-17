import UserService from './UserService';
import ConnectionUtil from '../test-utils/ConnectionUtil';
import OrganizationService from './OrganizationService';
import { CreateOrganizationParams, OrganizationUserRole } from '../types';

describe('OrganizationService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
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

      expect(organization.id).toBeTruthy();
      expect(organization.name).toEqual(organizationParams.name);
      expect((await organization.organizationUsers).length).toEqual(1);

      const organizationUser = organization.organizationUsers[0];
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

      done();
    });
  });
});
