'use strict';

/**
 * Module dependencies
 */
var broadcastsPolicy = require('../policies/broadcasts.server.policy'),
  broadcasts = require('../controllers/broadcasts.server.controller');

module.exports = function(app) {
  // Broadcasts Routes
  app.route('/api/broadcasts').all(broadcastsPolicy.isAllowed)
    .get(broadcasts.list)
    .post(broadcasts.create);

  app.route('/api/broadcasts/:broadcastId').all(broadcastsPolicy.isAllowed)
    .get(broadcasts.read)
    .put(broadcasts.update)
    .delete(broadcasts.delete);

  // Finish by binding the Broadcast middleware
  app.param('broadcastId', broadcasts.broadcastByID);
};
