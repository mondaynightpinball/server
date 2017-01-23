'use strict';

const cleanDb = require('../lib/clean-db.js');

const serverToggle = require('../lib/server-toggle.js');
const server = require('../../server.js');

serverToggle.start(server, function() {
  console.log('server started');
});

cleanDb()
.then( () => {
  console.log('success');
})
.catch( err => console.error(err))
.finally( () => serverToggle.stop(server, function() {
  console.log('server stopped');
}));
