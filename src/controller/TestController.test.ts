const supertest = require('supertest');
import { app } from '../app';
const request = supertest(app);

describe('TestController', () => {
  describe('getHello', () => {
    it('returns the id', async (done) => {
      const response = await request.get('/tests/45');
      expect(response.status).toBe(200);
      expect(response.body.userId).toEqual(45);

      done();
    });

    it('optionally returns the name', async (done) => {
      const response = await request.get('/tests/45?name=test');
      expect(response.status).toBe(200);
      expect(response.body.userId).toEqual(45);
      expect(response.body.name).toEqual('test');

      done();
    });
  });
});
