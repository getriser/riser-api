import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from './User';
import { CommentResourceType } from '../types';

@Entity()
@Index(['resourceType', 'resourceId'])
export default class Comment extends DomainObject {
  @Column({ nullable: false })
  resourceType: CommentResourceType;

  @Column({ nullable: false })
  resourceId: number;

  @Column({ nullable: false })
  content: string;

  @Index()
  @ManyToOne(() => User, (user) => user.comments)
  author: User;
}
