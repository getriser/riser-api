import DomainObject from './DomainObject';
import { DeleteDateColumn } from 'typeorm';

export default abstract class SoftDeletableDomainObject extends DomainObject {
  @DeleteDateColumn()
  deletedAt: Date;
}
