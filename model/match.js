'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const matchSchema = Schema({
  seasonId: { type: ObjectId, ref: 'season' },
  week: { type: Number, min: 1, required: true },
  //NOTE: the venue and teams for a match will
  //      have a reference to a matching
  //      venue or team, but needs to be editable
  //      independent of the source object.
  venue: {
    venueId: { type: ObjectId }, //Link optional
    name: { type: String, required: true },
    machines: [{ type: ObjectId, ref: 'machine'}]
  },
  away: {
    teamId: { type: ObjectId }, //Link Optional
    name: { type: String, required: true },
    captains: [{ type: ObjectId, ref: 'player' }],
    lineup: [{ type: ObjectId, ref: 'player' }]
  },
  round: { type: Number, min: 1, max: 5, default: 1 },
  rounds: [
    {
      games: [{ type: ObjectId, ref: 'game' }]
    }
  ],
  state: {
    type: String,
    enum: [
      'scheduled', 'pregame', 'picking',
      'responding', 'playing', 'complete'
    ]
  }
});

module.exports = mongoose.model('match', matchSchema);
