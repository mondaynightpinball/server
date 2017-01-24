'use strict';

// const debug = require('debug')('mnp:game-route-test');
const expect = require('chai').expect;
// const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

// const url = `http://localhost:${process.env.PORT}`;

// const mockUser = require('./lib/mock-user.js');

describe('Season Routes', function() {
  before( done => serverToggle.start(server, done));

  describe('POST /api/league/:id/season', () => {
    describe('as admin of league', () => {
      it('should create a new season in the league', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // as admin of league
  }); // POST /api/league/:id/season

  describe('GET /api/season/:id', () => {
    describe('with a valid season id', () => {
      it('should return the season json', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // valid season id
  }); // GET /api/season/:id

  //TODO: What else do we need to test for seasons?
});
