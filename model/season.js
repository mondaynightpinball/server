'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const seasonSchema = Schema({
  leagueId: { type: ObjectId, required: true },
  num: { type: Number, required: true, min: 1 },
  teams: [{ type: ObjectId, ref: 'team' }],
  //TODO: Add schedule
  venues: [{ type: ObjectId, ref: 'venue' }]
});

module.exports = mongoose.model('season', seasonSchema);
