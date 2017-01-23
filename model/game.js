'use strict';

const createError = require('http-errors');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const debug = require('debug')('mnp:game');

const gameSchema = Schema({
  // userId is who created the game.
  userId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, required: true, default: Date.now },
  //TODO: Q: Is it possible to specify a field that is
  //          multiple choice?
  //TODO: Maybe have type be Number, but we should have constants to
  //      represent the discrete values.
  type: { type: String, required: true },
  // machine: { type: Schema.Types.ObjectId, ref: 'machine', required: true },
  // venue: { type: Schema.Types.ObjectId, ref: 'venue', required: true },
  players: [{ type: Schema.Types.ObjectId }], // Size based on type
  //TODO:should scores be an object { 1: Number, 2: Number, 3: Number, 4: Number }
  scores: [{ type: Number }]
});

//TODO: Who is allowed to call this? Add a reportedBy param?
gameSchema.methods.reportScores = function(playerId, scores) {
  debug('reportScores');

  if(!scores) return Promise.reject(createError(400, 'scores required'));

  if(this.type === 'singles' && this.players.length !== 2) {
    return Promise.reject(createError(400, 'incorrect number of players before reporting'));
  }

  if(this.type === 'doubles' && this.players.length !== 4) {
    return Promise.reject(createError(400, 'incorrect number of players before reporting'));
  }

  if(!Array.isArray(scores)) {
    return Promise.reject(createError(400, 'scores should be an array'));
  }

  //TODO: Verify that scores is an array of number, or let save() validate it?

  if(scores.length !== this.players.length) {
    return Promise.reject(createError(400, 'incorrect number of scores'));
  }

  //TODO: Only overwrite non-zero values from scores?
  this.scores = scores;

  return Promise.resolve(this);
};

gameSchema.methods.join = function(playerId) {
  debug('join');

  //TODO: Allow for 2, 3, or 4 player games.
  if(this.players.length > 1) {
    return Promise.reject(createError(400, 'game full'));
  }

  this.players.push(playerId);
  return Promise.resolve(this);
};

module.exports = mongoose.model('game', gameSchema);
