import DomainObject from './DomainObject';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import Organization from './Organization';

@Entity()
export default class Announcement extends DomainObject {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.announcements)
  organization: Organization;

  @ManyToOne(() => User, (user) => user.announcements)
  author: User;
}
