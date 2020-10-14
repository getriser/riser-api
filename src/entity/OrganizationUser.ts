import DomainObject from './DomainObject';
import { Column, Entity, ManyToOne } from 'typeorm';
import Organization from './Organization';
import { OrganizationUserRole } from '../types';

@Entity()
export default class OrganizationUser extends DomainObject {
  @Column()
  userId: number;

  @Column()
  organizationId: number;

  @Column({ type: 'enum', enum: OrganizationUserRole })
  role: OrganizationUserRole;

  @ManyToOne(
    (type) => Organization,
    (organization) => organization.organizationUsers
  )
  organization: Organization;
}
