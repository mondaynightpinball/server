'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('mnp:league-route');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const jsonParser = require('body-parser').json();

const League = require('../model/league.js');

const router = module.exports = new Router();

router.post('/api/league', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/league');

  if(req.user.username !== 'root') {
    return next(createError(403, 'forbidden'));
  }

  //TODO: Verify that req.user is a root admin
  new League(req.body).save()
  .then( league => res.status(201).json(league))
  .catch(next);
});

router.get('/api/league/:id', function(req, res, next) {
  debug('GET /api/league');

  League.findById(req.params.id)
  .then( league => res.json(league))
  .catch( () => next(createError(404, 'not found')));
});

//TODO: Do we need PUT or DELETE in the API?
//      I'm saying no for right now.

router.post('/api/league/:id/admin', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/league/:id/admin');

  //TODO: Assert that req.user is root or league admin.
  League.findById(req.params.id)
  .catch( () => next(createError(404, 'not found')))
  .then( league => {
    if(league.admins.indexOf(req.body.userId) !== -1) {
      return next(createError(400, 'already have requested admin'));
    }
    league.admins.push(req.body.userId);
    return league.save();
  })
  .then( () => res.status(201).send('admin added to league'))
  .catch(next);
});















//
