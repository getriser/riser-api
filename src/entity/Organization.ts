import DomainObject from './DomainObject';
import { Column, Entity, OneToMany } from 'typeorm';
import OrganizationUser from './OrganizationUser';
import Announcement from './Announcement';
import CalendarEvent from './CalendarEvent';

@Entity()
export default class Organization extends DomainObject {
  @Column()
  name: string;

  @OneToMany(() => Announcement, (announcement) => announcement.organization)
  announcements: Promise<Announcement[]>;

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.organization)
  calendarEvents: Promise<CalendarEvent[]>;

  @OneToMany(
    (type) => OrganizationUser,
    (organizationUser) => organizationUser.organization,
    { cascade: true }
  )
  organizationUsers: Promise<OrganizationUser[]>;
}
