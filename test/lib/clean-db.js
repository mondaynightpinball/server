'use strict';

const debug = require('debug')('mnp:clean-db');
const User = require('../../model/user.js');
const League = require('../../model/league.js');
const Season = require('../../model/season.js');
const Game = require('../../model/game.js');
const Pic = require('../../model/pic.js');
const Venue = require('../../model/venue.js');
const Team = require('../../model/team.js');
const Match = require('../../model/match.js');
const Promise = require('bluebird');

const del = require('del');
const dataDir = `${__dirname}/../../data`;

//NOTE: We are not connecting to mongoose here
//      because it's assumed that the server will
//      be running.

module.exports = function() {
  debug('working...');
  debug('dataDir',dataDir);

  return Promise.all([
    User.remove({}),
    League.remove({}),
    Season.remove({}),
    Venue.remove({}),
    Team.remove({}),
    Match.remove({}),
    Game.remove({}),
    Pic.remove({}),
    Promise.resolve(del(`${dataDir}/*`))
  ]);
};
