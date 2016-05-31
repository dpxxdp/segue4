'use strict';

describe('Bugs E2E Tests:', function () {
  describe('Test Bugs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bugs');
      expect(element.all(by.repeater('bug in bugs')).count()).toEqual(0);
    });
  });
});
