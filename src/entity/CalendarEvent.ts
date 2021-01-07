import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import Organization from './Organization';
import { User } from './User';

@Index(['startDateUtc', 'endDateUtc'])
@Entity()
export default class CalendarEvent extends DomainObject {
  @Column()
  title: string;

  @Index()
  @Column({ type: 'timestamp' })
  startDateUtc: Date;

  @Index()
  @Column({ type: 'timestamp' })
  endDateUtc: Date;

  @Column()
  isAllDay: boolean;

  @Column()
  duration: number;

  @Column()
  isRecurring: boolean;

  @Column()
  recurrencePattern: string;

  @ManyToOne(() => Organization, (organization) => organization.calendarEvents)
  organization: Promise<Organization>;

  @RelationId((calendarEvent: CalendarEvent) => calendarEvent.organization)
  organizationId: number;

  @Index()
  @ManyToOne(() => User, (user) => user.calendarEvents)
  user: Promise<User>;

  @RelationId((calendarEvent: CalendarEvent) => calendarEvent.user)
  userId: number;
}
