'use strict';

// const debug = require('debug')('mnp:game-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

const url = `http://localhost:${process.env.PORT}`;

// const mockUser = require('./lib/mock-user.js');
const exampleLeague = require('./data/example-league.json');

describe('League Routes', function() {
  before( done => serverToggle.start(server, done));
  before( done => {
    require('./lib/mock-root.js')()
    .then( user => {
      this.root = user;
      done();
    });
  });
  after(require('./lib/clean-db.js'));
  after( done => serverToggle.stop(server, done));

  describe('POST /api/league', () => {
    describe('with root auth and valid body', () => {
      it('should create a new league, returning 201', done => {
        request.post(`${url}/api/league`)
        .set({
          Authorization: `Bearer ${this.root.token}`
        })
        .send(exampleLeague)
        .end( (err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(exampleLeague.name);
          done();
        });
      });
    }); // with root auth and valid body

    //TODO: Error tests
  }); // POST /api/league

  describe('GET /api/league/:id', () => {
    describe('with a valid id', () => {
      it('should return 200 and json of the league', done => {
        expect(true).to.equal(false);
        done();
      });
    });
    //TODO: Add error tests
  }); // GET /api/league/:id

  describe('PUT /api/league/:id/admin', () => {
    describe('with root auth and valid userId to add', () => {
      it('should add an admin to the league', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // with root and valid userId

    describe('with root auth and unknown userId', () => {
      it('should return a 400 and indicate bad user', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // with root and unknown user

    describe('as league admin and valid userId', () => {
      it('should add an admin to the league', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // as league admin and valid userId

    describe('as league admin and unknown userId', () => {
      it('should return a 400 and indicate bad user', done => {
        expect(true).to.equal(false);
        done();
      });
    }); // as league admin and unknown user

    describe('as an unauthorized user', () => {
      it('should return a 403, forbidden', done => {
        expect(true).to.equal(false);
        done();
      });
    });
  }); // PUT /api/league/:id/admin


});
