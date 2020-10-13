import { Entity, Column } from 'typeorm';
import DomainObject from './DomainObject';

@Entity()
export class User extends DomainObject {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 100 })
  encryptedPassword: string;
}
