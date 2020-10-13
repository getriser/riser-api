import { Connection, createConnection, getConnection } from 'typeorm';

export default class ConnectionUtil {
  static async connect(): Promise<Connection> {
    return createConnection('default');
  }

  static disconnect(): Promise<void> {
    return getConnection('default').close();
  }
}
