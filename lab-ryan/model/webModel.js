'use strict';

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const Schema = mongoose.Schema;

const webSchema = Schema({
  userId: { 
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true
  }
});

const Web = mongoose.model('Web', webSchema);

module.exports = Web;