'use strict';

// const debug = require('debug')('mnp:league-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

const url = `http://localhost:${process.env.PORT}`;

const mockUser = require('./lib/mock-user.js');
const exampleLeague = require('./data/example-league.json');

describe('League Routes', function() {
  before( done => serverToggle.start(server, done));
  before( done => { // CREATE A MOCK ROOT USER
    require('./lib/mock-root.js')()
    .then( user => {
      this.root = user;
      done();
    });
  });
  before( done => { // RANDO USER
    mockUser()
    .then( user => {
      this.rando = user;
      done();
    });
  });
  before( done => { // ADMIN USER
    mockUser()
    .then( user => {
      this.admin = user;
      done();
    });
  });

  after(require('./lib/clean-db.js'));
  after( done => serverToggle.stop(server, done));

  describe('POST /api/league', () => {
    describe('with root auth and valid body', () => {
      it('should create a new league, returning 201', done => {
        request.post(`${url}/api/league`)
        .set({ Authorization: `Bearer ${this.root.token}` })
        .send(exampleLeague)
        .end( (err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(exampleLeague.name);
          this.league = res.body;
          done();
        });
      });
    }); // with root auth and valid body

    describe('as non-root user', () => {
      it('should return a 403, forbidden', done => {
        request.post(`${url}/api/league`)
        .set({ Authorization: `Bearer ${this.rando.token}` })
        .send(exampleLeague)
        .end( (err, res) => {
          expect(res.status).to.equal(403);
          // TODO: Anything else to expect?
          done();
        });
      });
    }); // as non-root user

    //TODO: Tests for invalid bodies

  }); // POST /api/league

  describe('GET /api/league/:id', () => {
    describe('with a valid id', () => {
      it('should return 200 and json of the league', done => {
        request.get(`${url}/api/league/${this.league._id}`)
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          //TODO: expect res.body to be the league object.
          done();
        });
      });
    }); // valid id

    describe('with an unknown id', () => {
      it('should return a 404', done => {
        request.get(`${url}/api/league/abcd1234`)
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    }); // unknown id
  }); // GET /api/league/:id

  describe('PUT /api/league/:id/admin', () => {
    describe('as an unauthorized user', () => {
      it('should return a 403, forbidden', done => {
        request.put(`${url}/api/league/${this.league._id}/admin`)
        .set({ Authorization: `Bearer ${this.rando.token}` })
        .send({ userId: this.admin._id })
        .end( (err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
      });
    }); // unauthorized

    describe('with root auth and valid userId to add', () => {
      it('should add an admin to the league', done => {
        request.put(`${url}/api/league/${this.league._id}/admin`)
        .set({ Authorization: `Bearer ${this.root.token}` })
        .send({ userId: this.admin._id })
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    }); // with root and valid userId

    describe('with root auth and unknown userId', () => {
      it('should return a 400 and indicate bad user', done => {
        request.put(`${url}/api/league/${this.league._id}/admin`)
        .set({ Authorization: `Bearer ${this.root.token}` })
        .send({ userId: 'bogus1234' })
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); // with root and unknown user

    describe('as league admin and valid userId', () => {
      it('should add an admin to the league', done => {
        request.put(`${url}/api/league/${this.league._id}/admin`)
        .set({ Authorization: `Bearer ${this.admin.token}` })
        .send({ userId: this.rando._id })
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    }); // as league admin and valid userId

    describe('as league admin and unknown userId', () => {
      it('should return a 400 and indicate bad user', done => {
        request.put(`${url}/api/league/${this.league._id}/admin`)
        .set({ Authorization: `Bearer ${this.admin.token}` })
        .send({ userId: 'bogus1324' })
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); // as league admin and unknown user
  }); // PUT /api/league/:id/admin


});
