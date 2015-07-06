#!/usr/bin/env node
'use strict';

!(function () {

  'use strict';

  require('babel/register')({ modules: 'common' });

  require('colors');

  var symlink = require('syn/lib/app/symlink');
  var httpServer = require('syn/server');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  function onError(error) {
    console.log('server error', error);
    error.stack.split(/\n/).forEach(console.log.bind(console));
  }

  var domain = require('domain').create();

  domain.on('error', onError).run(function () {
    symlink(domain.intercept(function () {
      new httpServer().on('error', console.log.bind(console));
    }));
  });
})();