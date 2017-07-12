'use strict';

const debug = require('debug')('mnp:server-toggle');

module.exports = exports = {};

exports.start = function(server, done) {
  if(!server.running) {
    server.listen(process.env.PORT, () => {
      server.running = true;
      debug('server up:', process.env.PORT); //server.port ?
      done();
    });
    return;
  }
  done(); // server already running.
};

exports.stop = function(server, done) {
  if(server.running) {
    server.close( err => {
      if(err) return done(err);
      server.running = false;
      debug('server down');
      done();
    });
    return;
  }
  done(); // server not running
};
