'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('mnp:season-route');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const jsonParser = require('body-parser').json();

const Season = require('../model/season.js');

const router = module.exports = new Router();

router.post('/api/season', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/season');

  //TODO: Only a league/root admin can add a season.

  next();
});
