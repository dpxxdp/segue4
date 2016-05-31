'use strict';

/**
 * Module dependencies
 */
var scramblesPolicy = require('../policies/scrambles.server.policy'),
  scrambles = require('../controllers/scrambles.server.controller');

module.exports = function(app) {
  // Scrambles Routes
  app.route('/api/scrambles').all(scramblesPolicy.isAllowed)
    .get(scrambles.list)
    .post(scrambles.create);

  app.route('/api/scrambles/:scrambleId').all(scramblesPolicy.isAllowed)
    .get(scrambles.read)
    .put(scrambles.update)
    .delete(scrambles.delete);

  // Finish by binding the Scramble middleware
  app.param('scrambleId', scrambles.scrambleByID);
};
