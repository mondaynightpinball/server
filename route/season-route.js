'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('mnp:season-route');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const jsonParser = require('body-parser').json();

const League = require('../model/league.js');
const Season = require('../model/season.js');

const router = module.exports = new Router();

const middle = [ bearerAuth, jsonParser ];

router.post('/api/league/:id/season', middle, function(req, res, next) {
  debug('POST /api/league/:id/season');

  League.findById(req.params.id)
  .catch( () => next(createError(404, 'not found')))
  .then( league => {
    if( !(
      req.user.username === 'root' ||
      league.admins.indexOf(req.user._id) !== -1)
    ) {
      return next(createError(403, 'forbidden'));
    }
    return new Season({
      leagueId: league._id,
      num: league.seasons.length + 1
    }).save();
  })
  .then( season => res.status(201).json(season))
  .catch(next);
});

router.get('/api/season/:id', function(req, res, next) {
  debug('GET /api/season/:id');

  Season.findById(req.params.id)
  .then( season => {
    if(!season) return next(createError(404, 'not found'));
    res.json(season);
  })
  // .catch(next);
  .catch( () => next(createError(404, 'not found')));
});

router.put('/api/season/:id/team', middle, function(req, res, next) {
  debug('PUT /api/season/:id/team');

  Season.findById(req.params.id)
  .then( season => {
    if(!season) return next(createError(404, 'not found'));
    if(season.teams.indexOf(req.body.teamId) !== -1) {
      return res.status(202).json(season);
    }
    season.teams.push(req.body.teamId);
    return season.save();
  })
  .then( season => res.status(202).json(season))
  .catch(next);
});

router.put('/api/season/:id/venue', middle, function(req, res, next) {
  debug('PUT /api/season/:id/venue');

  Season.findById(req.params.id)
  .then( season => {
    if(!season) return next(createError(404, 'not found'));
    if(season.venues.indexOf(req.body.venueId) !== -1) {
      return res.status(202).json(season);
    }
    season.venues.push(req.body.venueId);
    return season.save();
  })
  .then( season => res.status(202).json(season))
  .catch(next);
});
