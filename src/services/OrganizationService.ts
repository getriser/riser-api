import Organization from '../entity/Organization';
import { getRepository } from 'typeorm';
import OrganizationUser from '../entity/OrganizationUser';
import {
  CreateOrganizationParams,
  Member,
  OrganizationResponse,
  OrganizationUserRole,
  RegisterUserProperties,
} from '../types';
import UserService from './UserService';
import BadRequestApiError from '../errors/BadRequestApiError';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import { User } from '../entity/User';
import ForbiddenApiError from '../errors/ForbiddenApiError';
import AbstractService from './AbstractService';

export default class OrganizationService extends AbstractService {
  static async getOrganizations(
    loggedInUserId: number
  ): Promise<OrganizationResponse[]> {
    const user = await this.findUserOrThrow(loggedInUserId, [
      'organizationUsers',
      'organizationUsers.organization',
    ]);

    const organizationUsers = await user.organizationUsers;
    return Promise.all(
      organizationUsers.map(async (organizationUser) => {
        const organization = await organizationUser.organization;

        return {
          id: organization.id,
          name: organization.name,
          role: organizationUser.role,
        };
      })
    );
  }

  static async createOrganization(
    ownerId: number,
    organizationParams: CreateOrganizationParams
  ): Promise<Organization> {
    const user = await UserService.getUser(ownerId, ['organizationUsers']);
    if (!user) {
      throw new BadRequestApiError('User not found.');
    }

    const organizationRepository = getRepository<Organization>(Organization);

    const organization = new Organization();
    organization.name = organizationParams.name;

    const organizationUser = new OrganizationUser();
    organizationUser.role = OrganizationUserRole.OWNER;
    organizationUser.user = Promise.resolve(user);

    organization.organizationUsers = Promise.resolve([organizationUser]);

    return organizationRepository.save(organization);
  }

  static async getMembers(
    loggedInUserId: number,
    organizationId: number
  ): Promise<Member[]> {
    const organizationRepository = getRepository<Organization>(Organization);
    const organization = await organizationRepository.findOne(organizationId, {
      relations: ['organizationUsers', 'organizationUsers.user'],
    });

    if (!organization) {
      throw new ResourceNotFoundError('Organization not found.');
    }

    const user = await UserService.getUser(loggedInUserId, [
      'organizationUsers',
    ]);

    if (!user) {
      throw new ResourceNotFoundError('User not found.');
    }

    if (!(await this.isUserBelongToOrganization(user, organization))) {
      throw new ForbiddenApiError('You do not belong to that organization.');
    }

    const orgUsers = await organization.organizationUsers;

    return Promise.all(
      orgUsers.map(async (orgUser) => {
        const user = await orgUser.user;

        return {
          birthDate: user.birthDate,
          email: user.email,
          id: user.id,
          name: user.fullName,
          phoneNumber: user.phoneNumber,
          pronouns: user.pronouns,
          imageUrl: user.imageUrl,
          role: orgUser.role,
        };
      })
    );
  }

  public static async inviteMember(
    loggedInUserId: number,
    organizationId: number,
    userToInvite: RegisterUserProperties
  ): Promise<OrganizationUser> {
    const organizationRepository = getRepository<Organization>(Organization);
    const userRepository = getRepository<User>(User);
    const organizationUserRepository = getRepository<OrganizationUser>(
      OrganizationUser
    );
    const organization = await organizationRepository.findOne(organizationId, {
      relations: ['organizationUsers'],
    });

    if (!organization) {
      throw new ResourceNotFoundError('Organization not found.');
    }

    const user = await UserService.getUser(loggedInUserId, [
      'organizationUsers',
    ]);

    if (!user) {
      throw new ResourceNotFoundError('User not found.');
    }

    if (!(await this.isUserBelongToOrganization(user, organization))) {
      throw new ForbiddenApiError('You do not belong to that organization.');
    }

    let inviteUser = await userRepository.findOne({
      where: { email: userToInvite.email },
    });

    if (!inviteUser) {
      inviteUser = await UserService.registerUser(userToInvite);
    } else {
      const existingOrganizationUser = await organizationUserRepository.findOne(
        { where: { user: inviteUser, organization: organization } }
      );

      if (existingOrganizationUser) {
        throw new BadRequestApiError('User is already a member.');
      }
    }

    const organizationUser = new OrganizationUser();
    organizationUser.role = OrganizationUserRole.MEMBER;
    organizationUser.user = Promise.resolve(inviteUser);
    organizationUser.organization = Promise.resolve(organization);

    return organizationUserRepository.save(organizationUser);
  }

  private static async isUserBelongToOrganization(
    user: User,
    organization: Organization
  ): Promise<boolean> {
    const organizationUsers = await user.organizationUsers;
    const organizations = await Promise.all(
      organizationUsers.map((ou) => ou.organization)
    );

    return (
      organizations.filter((org) => org.id === organization.id).length !== 0
    );
  }
}
