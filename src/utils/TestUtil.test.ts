import TestUtil from './TestUtil';

describe('TestUtil', () => {
  describe('getTest', () => {
    test('returns test', () => {
      expect(TestUtil.getTest()).toEqual('test');
    });
  });
});
