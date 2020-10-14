import Organization from '../entity/Organization';
import { getRepository } from 'typeorm';
import OrganizationUser from '../entity/OrganizationUser';
import { CreateOrganizationParams, OrganizationUserRole } from '../types';
import UserService from './UserService';
import BadRequestApiError from '../errors/BadRequestApiError';

export default class OrganizationService {
  static async createOrganization(
    ownerId: number,
    organizationParams: CreateOrganizationParams
  ): Promise<Organization> {
    const user = UserService.getUser(ownerId);
    if (!user) {
      throw new BadRequestApiError('User not found.');
    }

    const organizationRepository = getRepository<Organization>(Organization);

    const organization = new Organization();
    organization.name = organizationParams.name;

    const organizationUser = new OrganizationUser();
    organizationUser.role = OrganizationUserRole.OWNER;
    organizationUser.userId = ownerId;

    organization.organizationUsers = [organizationUser];

    return organizationRepository.save(organization);
  }
}
