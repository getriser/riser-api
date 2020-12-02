import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { User } from './User';
import Organization from './Organization';
import { FileFolderType } from '../types';
import SoftDeletableDomainObject from './SoftDeletableDomainObject';

@Entity()
export default class FileFolder extends SoftDeletableDomainObject {
  @Column({ nullable: false })
  type: FileFolderType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @Index()
  @ManyToOne(() => FileFolder, (fileFolder) => fileFolder.children)
  parent: Promise<FileFolder>;

  @RelationId((fileFolder: FileFolder) => fileFolder.parent)
  parentId: number;

  @Index()
  @ManyToOne(() => Organization, (organization) => organization.announcements)
  organization: Promise<Organization>;

  @Index()
  @ManyToOne(() => User, (user) => user.announcements)
  owner: Promise<User>;

  @OneToMany(() => FileFolder, (fileFolder) => fileFolder.parent)
  children: Promise<FileFolder[]>;
}
