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

require('fs').readdirSync('./route').forEach( route => {
  app.use(require(`./route/${route}`));
});

app.use(require('./lib/error-middleware.js'));

const server = module.exports = app.listen(PORT, () => {
  debug('server up:', PORT);
});

server.running = true;
