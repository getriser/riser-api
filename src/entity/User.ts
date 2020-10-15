import { Entity, Column, OneToMany } from 'typeorm';
import DomainObject from './DomainObject';
import Announcement from './Announcement';

@Entity()
export class User extends DomainObject {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 100 })
  encryptedPassword: string;

  @OneToMany(() => Announcement, (announcement) => announcement.author)
  announcements: Announcement[];
}
