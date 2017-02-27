'use strict';

const debug = require('debug')('mnp:team-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

// const Machine = require('../model/machine.js');

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleTeam = {
  name: 'Example Team',
  code: 'exm'
};

describe('Team Routes', function() {
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

  describe('POST /api/team', () => {
    describe('as unauthorized user and valid body', () => {
      it('should return 403, forbidden', done => {
        request.post(`${url}/api/team`)
        .set({ Authorization: `Bearer ${this.rando.token}`})
        .send(exampleTeam)
        .end( (err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
      });
    }); // root auth and valid body

    describe('with root auth and valid body', () => {
      it('should create a team and return 201', done => {
        request.post(`${url}/api/team`)
        .set({ Authorization: `Bearer ${this.root.token}`})
        .send(exampleTeam)
        .end( (err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(exampleTeam.name);
          expect(res.body.code).to.equal(exampleTeam.code);
          this.team = res.body;
          done();
        });
      });
    }); // root auth and valid body
  }); // POST /api/team

  describe('GET /api/team/:id', () => {
    describe('with a valid id', () => {
      it('should return a team', done => {
        request.get(`${url}/api/team/${this.team._id}`)
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(this.team);
          done();
        });
      });
    }); //valid id
  }); // GET /api/team/:id
});
