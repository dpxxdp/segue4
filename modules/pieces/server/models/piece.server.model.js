'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Piece Schema
 */
var PieceSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  imageURL: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Piece', PieceSchema);
