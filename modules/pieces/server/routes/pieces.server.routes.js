'use strict';

/**
 * Module dependencies
 */
var piecesPolicy = require('../policies/pieces.server.policy'),
  pieces = require('../controllers/pieces.server.controller');

module.exports = function(app) {
  // Pieces Routes
  app.route('/api/pieces').all(piecesPolicy.isAllowed)
    .get(pieces.list)
    .post(pieces.create);

  app.route('/api/pieces/:pieceId').all(piecesPolicy.isAllowed)
    .get(pieces.read)
    .put(pieces.update)
    .delete(pieces.delete);

  // Finish by binding the Piece middleware
  app.param('pieceId', pieces.pieceByID);
};
