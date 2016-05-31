'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Scramble = mongoose.model('Scramble'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Scramble
 */
exports.create = function(req, res) {
  var scramble = new Scramble(req.body);
  scramble.user = req.user;

  scramble.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scramble);
    }
  });
};

/**
 * Show the current Scramble
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var scramble = req.scramble ? req.scramble.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  scramble.isCurrentUserOwner = req.user && scramble.user && scramble.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(scramble);
};

/**
 * Update a Scramble
 */
exports.update = function(req, res) {
  var scramble = req.scramble ;

  scramble = _.extend(scramble , req.body);

  scramble.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scramble);
    }
  });
};

/**
 * Delete an Scramble
 */
exports.delete = function(req, res) {
  var scramble = req.scramble ;

  scramble.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scramble);
    }
  });
};

/**
 * List of Scrambles
 */
exports.list = function(req, res) { 
  Scramble.find().sort('-created').populate('user', 'displayName').exec(function(err, scrambles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scrambles);
    }
  });
};

/**
 * Scramble middleware
 */
exports.scrambleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Scramble is invalid'
    });
  }

  Scramble.findById(id).populate('user', 'displayName').exec(function (err, scramble) {
    if (err) {
      return next(err);
    } else if (!scramble) {
      return res.status(404).send({
        message: 'No Scramble with that identifier has been found'
      });
    }
    req.scramble = scramble;
    next();
  });
};
