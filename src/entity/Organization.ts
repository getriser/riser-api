import DomainObject from './DomainObject';
import { Column, Entity, OneToMany } from 'typeorm';
import OrganizationUser from './OrganizationUser';
import Announcement from './Announcement';

@Entity()
export default class Organization extends DomainObject {
  @Column()
  name: string;

  @OneToMany(() => Announcement, (announcement) => announcement.organization)
  announcements: Announcement[];

  @OneToMany(
    (type) => OrganizationUser,
    (organizationUser) => organizationUser.organization,
    { cascade: true }
  )
  organizationUsers: OrganizationUser[];
}
