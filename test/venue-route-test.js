'use strict';

// const debug = require('debug')('mnp:venue-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

const url = `http://localhost:${process.env.PORT}`;

describe('Venue Routes', function() {
  before( done => serverToggle.start(server, done));
  before( done => { // CREATE A MOCK ROOT USER
    require('./lib/mock-root.js')()
    .then( user => {
      this.root = user;
      done();
    });
  });
  before( done => {
    require('./lib/mock-user.js')()
    .then( user => {
      this.rando = user;
      done();
    });
  });
  after(require('./lib/clean-db.js'));
  after( done => serverToggle.stop(server, done));

  describe('POST /api/venue', () => {
    describe('as root user and valid body', () => {
      it('should return 201 and a new venue', done => {
        request.post(`${url}/api/venue`)
        .set({ Authorization: `Bearer ${this.root.token}` })
        .send({
          name: 'Example Venue',
          code: 'VEN'
        })
        .end( (err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal('Example Venue');
          //TODO: Expect more
          this.venue = res.body;
          done();
        });
      });
    }); // as root and valid body

    describe('as unauthorized user and valid body', () => {
      it('should return 403', done => {
        request.post(`${url}/api/venue`)
        .set({ Authorization: `Bearer ${this.rando.token}` })
        .send({
          name: 'AAA Venue',
          code: 'AAA'
        })
        .end( (err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
      });
    }); // as unauthorized and valid body

  }); // POST /api/venue

  describe('GET /api/venue/:id', () => {
    describe('with a valid id', () => {
      it('should return a venue', done => {
        request.get(`${url}/api/venue/${this.venue._id}`)
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.venue.name);
          done();
        });
      });
    }); // valid id
  }); // GET /api/venue/:id
});
