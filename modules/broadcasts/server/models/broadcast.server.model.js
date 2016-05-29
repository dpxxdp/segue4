'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Broadcast Schema
 */
var BroadcastSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Subject Required',
    trim: true
  },
  content: {
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

mongoose.model('Broadcast', BroadcastSchema);
