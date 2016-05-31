'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Scramble Schema
 */
var ScrambleSchema = new Schema({
  content: {
    type: String,
    default: '',
    required: 'Content required',
    trim: true
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

mongoose.model('Scramble', ScrambleSchema);
