'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bug = mongoose.model('Bug'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bug
 */
exports.create = function(req, res) {
  var bug = new Bug(req.body);
  bug.user = req.user;

  bug.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bug);
    }
  });
};

/**
 * Show the current Bug
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bug = req.bug ? req.bug.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bug.isCurrentUserOwner = req.user && bug.user && bug.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(bug);
};

/**
 * Update a Bug
 */
exports.update = function(req, res) {
  var bug = req.bug ;

  bug = _.extend(bug , req.body);

  bug.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bug);
    }
  });
};

/**
 * Delete an Bug
 */
exports.delete = function(req, res) {
  var bug = req.bug ;

  bug.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bug);
    }
  });
};

/**
 * List of Bugs
 */
exports.list = function(req, res) { 
  Bug.find().sort('-created').populate('user', 'displayName').exec(function(err, bugs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bugs);
    }
  });
};

/**
 * Bug middleware
 */
exports.bugByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bug is invalid'
    });
  }

  Bug.findById(id).populate('user', 'displayName').exec(function (err, bug) {
    if (err) {
      return next(err);
    } else if (!bug) {
      return res.status(404).send({
        message: 'No Bug with that identifier has been found'
      });
    }
    req.bug = bug;
    next();
  });
};
