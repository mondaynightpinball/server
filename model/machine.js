'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const machineSchema = Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('machine', machineSchema);
