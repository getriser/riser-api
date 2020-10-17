import DomainObject from './DomainObject';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import OrganizationUser from './OrganizationUser';
import Announcement from './Announcement';

@Entity()
export default class Organization extends DomainObject {
  @Column()
  name: string;

  @OneToMany(() => Announcement, (announcement) => announcement.organization)
  announcements: Promise<Announcement[]>;

  @OneToMany(
    (type) => OrganizationUser,
    (organizationUser) => organizationUser.organization,
    { cascade: true }
  )
  organizationUsers: Promise<OrganizationUser[]>;
}
