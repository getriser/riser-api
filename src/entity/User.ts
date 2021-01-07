import { Entity, Column, OneToMany, Index } from 'typeorm';
import DomainObject from './DomainObject';
import Announcement from './Announcement';
import OrganizationUser from './OrganizationUser';
import config from '../config/config';
import Comment from './Comment';
import CalendarEvent from './CalendarEvent';

@Entity()
export class User extends DomainObject {
  @Column({ unique: true, nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({ length: 100 })
  encryptedPassword: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  pronouns: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  imagePath: string;

  @OneToMany(() => Announcement, (announcement) => announcement.author)
  announcements: Promise<Announcement[]>;

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.user)
  calendarEvents: Promise<CalendarEvent[]>;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
    { cascade: true }
  )
  organizationUsers: Promise<OrganizationUser[]>;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Promise<Comment[]>;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get imageUrl(): string | undefined {
    if (this.imagePath) {
      return `${config.assetPath}${this.imagePath}`;
    }
  }
}
