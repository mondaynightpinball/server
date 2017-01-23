'use strict';

const debug = require('debug')('mnp:clean-db');
const User = require('../../model/user.js');
const Game = require('../../model/game.js');
const Pic = require('../../model/pic.js');
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
    Game.remove({}),
    Pic.remove({}),
    Promise.resolve(del(`${dataDir}/*`))
  ]);
};
