'use strict';

const debug = require('debug')('mnp:team');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const teamSchema = Schema({
  name: { type: String, required: true },
  //NOTE: We might only need team codes to be unique
  //      in the context of a given league.
  code: { type: String, required: true, unique: true },
  venueId: { type: ObjectId, ref: 'venue' },
  captain: { type: ObjectId, ref: 'player' },
  coCaptain: { type: ObjectId, ref: 'player' },
  roster: [{ type: ObjectId, ref: 'player' }]
});

teamSchema.methods.addPlayer = function(player) {
  debug('player:',player);
  //TODO: Use role to potentially set captain or co-captain.
  //TODO: Check for existence of the player already.
  this.roster.push(player.playerId);
  return this.save();
};

module.exports = mongoose.model('team', teamSchema);
