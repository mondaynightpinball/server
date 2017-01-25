'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('mnp:venue-route');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const jsonParser = require('body-parser').json();

const router = module.exports = new Router();

const Venue = require('../model/venue.js');

router.post('/api/venue', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/league/:id/venue');

  //If a league admin needs to be able to add a venue,
  //perhaps adding venues is something that should
  //be bound to a league operation.

  //TODO: Who can make a venue?
  if(req.user.username !== 'root') {
    return next(createError(403, 'forbidden'));
  }

  //TODO: Is there anything we need to add to req.body?

  new Venue(req.body).save()
  .then( venue => res.status(201).json(venue))
  .catch(next);
});

router.get('/api/venue/:id', function(req, res, next) {
  debug('GET /api/venue/:id',req.params.id);

  Venue.findById(req.params.id)
  .then( venue => {
    if(!venue) return next(createError(404, 'not found'));
    res.json(venue);
  })
  .catch(next);
});

router.put('/api/venue/:id/machine', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/venue/:id/machine');

  next();
});

router.delete('/api/venue/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/venue/:id');

  next();
});

router.delete('/api/venue/:id/machine/:machineId', bearerAuth, function(req, res, next) {
  debug('DELETE /api/venue/:id/machine/:machineId');

  next();
});
