'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Piece = mongoose.model('Piece'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Piece
 */
exports.create = function (req, res) {
  var piece = new Piece(req.body);
  piece.user = req.user;

  var message = null;
  var upload = multer(config.uploads.pieceUpload).single('newPiece');
  var uploadFileFilter = require(path.resolve('./config/lib/multer')).uploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = uploadFileFilter;

  if (piece) {
    if (piece.user) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          return res.status(400).send({
            message: 'Error occurred while uploading image'
          });
        } else {
          piece.imageURL = config.uploads.pieceUpload.dest + req.file.filename;

          piece.save(function (saveError) {
            if (saveError) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(saveError)
              });
            } else {
              req.login(piece.user, function (err) {
                if (err) {
                  res.status(400).send(err);
                } else {
                  res.json(piece);
                }
              });
            }
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'User is not signed in'
      });
    }
  } else {
    res.status(400).send({
      message: 'Unable to create new piece'
    });
  }
};

/**
 * Show the current Piece
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var piece = req.piece ? req.piece.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  piece.isCurrentUserOwner = req.user && piece.user && piece.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(piece);
};

/**
 * Update a Piece
 */
exports.update = function (req, res) {
  var piece = req.piece;

  piece = _.extend(piece, req.body);

  piece.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(piece);
    }
  });
};

/**
 * Delete an Piece
 */
exports.delete = function (req, res) {
  var piece = req.piece;
  //TODO: remove piece.imageURL from filesystem

  piece.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(piece);
    }
  });
};

/**
 * List of Pieces
 */
exports.list = function (req, res) {
  Piece.find().sort('-created').populate('user', 'displayName').exec(function (err, pieces) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pieces);
    }
  });
};

/**
 * Piece middleware
 */
exports.pieceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Piece is invalid'
    });
  }

  Piece.findById(id).populate('user', 'displayName').exec(function (err, piece) {
    if (err) {
      return next(err);
    } else if (!piece) {
      return res.status(404).send({
        message: 'No Piece with that identifier has been found'
      });
    }
    req.piece = piece;
    next();
  });
};
