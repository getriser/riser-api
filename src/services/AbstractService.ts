import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import Organization from '../entity/Organization';
import ForbiddenApiError from '../errors/ForbiddenApiError';
import { OrganizationUserRole } from '../types';

export default abstract class AbstractService {
  protected static async findUserOrThrow(
    userId: number,
    relations: string[] = ['organizationUsers']
  ): Promise<User> {
    const userRepository = getRepository<User>(User);

    const user = await userRepository.findOne(userId, { relations });

    if (!user) {
      throw new ResourceNotFoundError('User not found.');
    }

    return user;
  }

  protected static async findOrganizationOrThrow(
    organizationId: number,
    relations: string[] = ['organizationUsers']
  ): Promise<Organization> {
    const organizationRepository = getRepository<Organization>(Organization);
    const organization = await organizationRepository.findOne(organizationId, {
      relations,
    });

    if (!organization) {
      throw new ResourceNotFoundError('Organization not found.');
    }

    return organization;
  }

  protected static async throwIfNotBelongsToOrganization(
    user: User,
    organization: Organization
  ): Promise<void> {
    const organizationUsers = await user.organizationUsers;

    const belongsToOrganization =
      organizationUsers.filter(
        (orgUser) => orgUser.organizationId === organization.id
      ).length !== 0;

    if (!belongsToOrganization) {
      throw new ForbiddenApiError('You do not belong to that organization.');
    }
  }

  protected static async throwIfNotRequiredRole(
    user: User,
    organization: Organization,
    role: OrganizationUserRole
  ): Promise<void> {
    const organizationUsers = await user.organizationUsers;

    const [organizationUser] = organizationUsers.filter(
      (orgUser) => orgUser.organizationId === organization.id
    );

    if (!organizationUser || organizationUser.role !== role) {
      throw new ForbiddenApiError(
        'You do not have permission to perform this action.'
      );
    }
  }
}
