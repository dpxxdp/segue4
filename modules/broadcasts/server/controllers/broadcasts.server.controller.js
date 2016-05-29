'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Broadcast = mongoose.model('Broadcast'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Broadcast
 */
exports.create = function(req, res) {
  var broadcast = new Broadcast(req.body);
  //broadcast.user = req.user;

  broadcast.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(broadcast);
    }
  });
};

/**
 * Show the current Broadcast
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var broadcast = req.broadcast ? req.broadcast.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  broadcast.isCurrentUserOwner = req.user && broadcast.user && broadcast.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(broadcast);
};

/**
 * Update a Broadcast
 */
exports.update = function(req, res) {
  var broadcast = req.broadcast ;

  broadcast = _.extend(broadcast , req.body);

  broadcast.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(broadcast);
    }
  });
};

/**
 * Delete an Broadcast
 */
exports.delete = function(req, res) {
  var broadcast = req.broadcast ;

  broadcast.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(broadcast);
    }
  });
};

/**
 * List of Broadcasts
 */
exports.list = function(req, res) { 
  Broadcast.find().sort('-created').populate('user', 'displayName').exec(function(err, broadcasts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(broadcasts);
    }
  });
};

/**
 * Broadcast middleware
 */
exports.broadcastByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Broadcast is invalid'
    });
  }

  Broadcast.findById(id).populate('user', 'displayName').exec(function (err, broadcast) {
    if (err) {
      return next(err);
    } else if (!broadcast) {
      return res.status(404).send({
        message: 'No Broadcast with that identifier has been found'
      });
    }
    req.broadcast = broadcast;
    next();
  });
};
