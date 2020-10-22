import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './User';
import Organization from './Organization';

@Entity()
export default class Announcement extends DomainObject {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  draft: boolean;

  @Column()
  numberOfComments: number = 0;

  @Index()
  @ManyToOne(() => Organization, (organization) => organization.announcements)
  organization: Promise<Organization>;

  @Index()
  @ManyToOne(() => User, (user) => user.announcements)
  author: Promise<User>;
}
