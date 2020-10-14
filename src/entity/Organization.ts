import DomainObject from './DomainObject';
import { Column, Entity, OneToMany } from 'typeorm';
import OrganizationUser from './OrganizationUser';

@Entity()
export default class Organization extends DomainObject {
  @Column()
  name: string;

  @OneToMany(
    (type) => OrganizationUser,
    (organizationUser) => organizationUser.organization,
    { cascade: true }
  )
  organizationUsers: OrganizationUser[];
}
