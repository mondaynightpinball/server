'use strict';

const debug = require('debug')('mnp:season-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const server = require('../server.js');
const serverToggle = require('./lib/server-toggle.js');

const url = `http://localhost:${process.env.PORT}`;

const League = require('../model/league.js');
const Team = require('../model/team.js');
const Venue = require('../model/venue.js');
const mockUser = require('./lib/mock-user.js');
const exampleLeague = require('./data/example-league.json');

describe('Season Routes', function() {
  before( done => serverToggle.start(server, done));
  before( done => { // CREATE ADMIN USER
    mockUser()
    .then( user => {
      this.admin = user;
      exampleLeague.admins.push(user);
      done();
    });
  });
  before( done => { // CREATE EXAMPLE LEAGUE
    new League(exampleLeague).save()
    .then( league => {
      this.league = league;
      done();
    });
  });
  after(require('./lib/clean-db.js'));
  after( done => serverToggle.stop(server, done));

  //TODO: POST as root

  describe('POST /api/league/:id/season', () => {
    describe('as admin of league', () => {
      it('should create a new season in the league', done => {
        request.post(`${url}/api/league/${this.league._id}/season`)
        .set({ Authorization: `Bearer ${this.admin.token}`})
        .end( (err, res) => {
          debug(res.body);
          expect(res.status).to.equal(201);
          expect(res.body.leagueId).to.equal(this.league._id.toString());
          expect(res.body.num).to.equal(1);
          this.season = res.body;
          done();
        });
      });
    }); // as admin of league
  }); // POST /api/league/:id/season

  describe('GET /api/season/:id', () => {
    describe('with a valid season id', () => {
      it('should return the season json', done => {
        request.get(`${url}/api/season/${this.season._id}`)
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    }); // valid season id

    describe('with a bogus season id', () => {
      it('should return 404', done => {
        request.get(`${url}/api/season/bogus13342`)
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          debug(res.body);
          done();
        });
      });
    }); // bogus season id
  }); // GET /api/season/:id

  describe('PUT /api/season/:id/team', () => {
    before( done => {
      new Team({
        name: 'Example Team',
        code: 'EXT'
      }).save()
      .then( team => {
        debug(team);
        this.team = team;
        done();
      });
    });
    describe('as admin and valid team id', () => {
      it('should add the team to the season', done => {
        request.put(`${url}/api/season/${this.season._id}/team`)
        .set({ Authorization: `Bearer ${this.admin.token}` })
        .send({ teamId: this.team._id })
        .end( (err, res) => {
          debug('STATUS:',res.status);
          debug('BODY:',res.body);
          expect(res.body.teams[0]).to.equal(this.team._id.toString());
          done();
        });
      });
    });
  }); // PUT /api/season/:id/team

  describe('PUT /api/season/:id/venue', () => {
    before( done => {
      new Venue({
        name: 'Example Venue',
        code: 'EXV'
      }).save()
      .then( venue => {
        debug(venue);
        this.venue = venue;
        done();
      });
    });
    describe('as admin and valid venue id', () => {
      it('should add the venue to the season', done => {
        request.put(`${url}/api/season/${this.season._id}/venue`)
        .set({ Authorization: `Bearer ${this.admin.token}` })
        .send({ venueId: this.venue._id })
        .end( (err, res) => {
          debug('STATUS:',res.status);
          debug('BODY:',res.body);
          expect(res.body.venues[0]).to.equal(this.venue._id.toString());
          done();
        });
      });
    });
  }); // PUT /api/season/:id/team

  //TODO: PUT /api/season/:id/match
  //TODO: More broadly, can we mock an entire season?

  //TODO: What else do we need to test for seasons?
});
