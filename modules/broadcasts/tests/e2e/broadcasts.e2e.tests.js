'use strict';

describe('Broadcasts E2E Tests:', function () {
  describe('Test Broadcasts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/broadcasts');
      expect(element.all(by.repeater('broadcast in broadcasts')).count()).toEqual(0);
    });
  });
});
