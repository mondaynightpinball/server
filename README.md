# server
Express + Mongoose + S3 using ES6 and a lot of promises.

# API
* All POST and PUT routes accept application/json only, unless otherwise noted.
* POST and PUT all require Bearer Auth, unless otherwise noted.

POST /api/signup

GET /api/signin
requires: HTTP basic auth

POST /api/game

GET /api/game/:id

PUT /api/game/:id/join

PUT /api/game/:id/report-scores

POST /api/league

GET /api/league/:id

PUT /api/league/:id/admin

POST /api/machine

GET /api/machine/:id

DELETE /api/machine/:id

POST /api/game/:gameId/pic
accepts: Image upload

DELETE /api/game/:gameId/pic/:picId

POST /api/league/:id/season

GET /api/season/:id

PUT /api/season/:id/team

PUT /api/season/:id/venue

POST /api/team

GET /api/team/:id

PUT /api/team/:id/player

POST /api/venue

GET /api/venue/:id

DELETE /api/venue/:id

PUT /api/venue/:id/machine

DELETE /api/venue/:id/machine/:machineId
