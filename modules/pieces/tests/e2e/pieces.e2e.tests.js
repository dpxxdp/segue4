'use strict';

describe('Pieces E2E Tests:', function () {
  describe('Test Pieces page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pieces');
      expect(element.all(by.repeater('piece in pieces')).count()).toEqual(0);
    });
  });
});
