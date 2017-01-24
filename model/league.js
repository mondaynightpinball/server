'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const debug = require('debug')('mnp:league');

const leagueSchema = Schema({
  name: { type: String },
  created: { type: Date, default: Date.now },
  playsOn: {
    type: String,
    enum: [
      'sunday','monday','tuesday',
      'wednesday','thursday','friday',
      'saturday'
    ],
    default: 'monday'
  },
  city: { type: String, required: true, unique: true },
  domain: {
    type: String,
    required: true,
    // validate: {
    //   validator: function(v) {
    //     //TODO: check that domain is a URL stem
    //     return true;
    //   },
    //   message: 'domain must be a valid url stem, including protocol'
    // },
    unique: true
  },
  seasons: [{ type: ObjectId, ref: 'season' }],
  admins: [{ type: ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('league', leagueSchema);
