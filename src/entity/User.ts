import { Entity, Column, OneToMany, Index } from 'typeorm';
import DomainObject from './DomainObject';
import Announcement from './Announcement';
import OrganizationUser from './OrganizationUser';

@Entity()
export class User extends DomainObject {
  @Column({ unique: true, nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({ length: 100 })
  encryptedPassword: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  pronouns: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Announcement, (announcement) => announcement.author)
  announcements: Promise<Announcement[]>;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
    { cascade: true }
  )
  organizationUsers: Promise<OrganizationUser[]>;
}
