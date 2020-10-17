import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import Organization from './Organization';
import { OrganizationUserRole } from '../types';
import { User } from './User';

@Entity()
export default class OrganizationUser extends DomainObject {
  @Column({ type: 'enum', enum: OrganizationUserRole })
  role: OrganizationUserRole;

  @ManyToOne(
    (type) => Organization,
    (organization) => organization.organizationUsers
  )
  organization: Promise<Organization>;

  @ManyToOne((type) => User, (user) => user.organizationUsers)
  user: Promise<User>;
}
