import DomainObject from './DomainObject';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import Organization from './Organization';
import { FileFolderType } from '../types';

@Entity()
export default class FileFolder extends DomainObject {
  @Column({ nullable: false })
  type: FileFolderType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  filePath: string;

  @Index()
  @ManyToOne(() => FileFolder, (fileFolder) => fileFolder.children)
  parent: Promise<FileFolder>;

  @Index()
  @ManyToOne(() => Organization, (organization) => organization.announcements)
  organization: Promise<Organization>;

  @Index()
  @ManyToOne(() => User, (user) => user.announcements)
  owner: Promise<User>;

  @OneToMany(() => FileFolder, (fileFolder) => fileFolder.parent)
  children: Promise<FileFolder[]>;
}
