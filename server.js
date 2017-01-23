'use strict';

const express = require('express');
const debug = require('debug')('mnp:server');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

require('dotenv').load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(require('./route/auth-route.js'));
app.use(require('./route/pic-route.js'));
app.use(require('./route/game-route.js'));
app.use(require('./lib/error-middleware.js'));

const server = module.exports = app.listen(PORT, () => {
  debug('server up:', PORT);
});

server.running = true;
