'use strict';

describe('Scrambles E2E Tests:', function () {
  describe('Test Scrambles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/scrambles');
      expect(element.all(by.repeater('scramble in scrambles')).count()).toEqual(0);
    });
  });
});
