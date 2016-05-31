'use strict';

/**
 * Module dependencies
 */
var bugsPolicy = require('../policies/bugs.server.policy'),
  bugs = require('../controllers/bugs.server.controller');

module.exports = function(app) {
  // Bugs Routes
  app.route('/api/bugs').all(bugsPolicy.isAllowed)
    .get(bugs.list)
    .post(bugs.create);

  app.route('/api/bugs/:bugId').all(bugsPolicy.isAllowed)
    .get(bugs.read)
    .put(bugs.update)
    .delete(bugs.delete);

  // Finish by binding the Bug middleware
  app.param('bugId', bugs.bugByID);
};
