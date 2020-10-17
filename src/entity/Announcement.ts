import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './User';
import Organization from './Organization';

@Entity()
@Index(['authorId', 'organizationId'])
export default class Announcement extends DomainObject {
  @Column()
  title: string;

  @Column()
  content: string;

  // TODO: Remove these, because the @ManyToOne already does it.
  @Column()
  @Index()
  authorId: number;

  @Column()
  @Index()
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.announcements)
  organization: Promise<Organization>;

  @ManyToOne(() => User, (user) => user.announcements)
  author: Promise<User>;
}
