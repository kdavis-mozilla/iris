(function() {
  'use strict';

  var express = require('express');
  var fs = require('fs');
  var https = require('https');
  var swig = require('swig');
  var bodyParser = require('body-parser');
  var compress = require('compression')();
  var errorHandler = require('errorhandler');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var flash = require('connect-flash');
  var configs = require('./config');
  var app = express();

  // template
  app.engine('.html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set('view options', {layout: false});
  // Swig will cache templates for you, but you can disable
  // that and use Express's caching instead, if you like:
  app.set('view cache', false);
  // To disable Swig's cache, do the following:
  swig.setDefaults({cache: false});
  // NOTE: You should always cache templates in a production environment.
  // Don't leave both of these to `false` in production!

  // configure app to use bodyParser()
  // this will let us get the data from a POST via
  // POST: {"name":"foo","color":"red"} or
  // POST: name=foo&color=red
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser(configs.secret));
  app.use(session({
    secret: configs.secret,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
  }));
  app.use(flash());

  // gzip
  app.use(compress);

  // static files, cached and expire in 30 days
  // change path / to /public if need dynamic web
  var staticPath = configs.isDynamic ? '/public' : '/';
  app.use(staticPath, express.static('public', {maxAge: 2592000000}));

  // mime
  express.static.mime.define(
    {'application/x-web-app-manifest+json': ['webapp']});
  express.static.mime.define({'text/cache-manifest': ['appcache']});
  express.static.mime.define({'image/x-icon': ['ico']});
  // express.static.mime.define({'audio/ogg': ['ogg']});
  // express.static.mime.define({'audio/mp4': ['m4a']});

  if (configs.isDynamic) {
    require('./routes/urls')(app);
  }

  if (configs.debug) {
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
  } else {
    // Handle 404
    app.use(function(req, res) {
      res.send('404: Page not Found', 404);
    });

    // Handle 500
    app.use(function(error, req, res, next) {
      res.send('500: Internal Server Error', 500);
    });

    app.use(errorHandler());
  }

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  var terminator = function(sig) {
    if (typeof sig === 'string') {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };

  //  Process on exit and signals.
  process.on('exit', function() { terminator(); });

  // Removed 'SIGPIPE' from the list - bugz 852598.
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
  ].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
  });

  //  Set the environment variables we need.
  var APP_PORT = process.env.VCAP_APP_PORT ||
    process.env.OPENSHIFT_NODEJS_PORT || configs.port;
  var APP_IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '';
  if (typeof APP_IPADDRESS === 'undefined') {
    //  Log errors but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No IP address var, using 127.0.0.1');
    APP_IPADDRESS = '127.0.0.1';
  }

  if (configs.sshSupport) {
    var options = {
      key: fs.readFileSync(configs.privatekeyPath),
      cert: fs.readFileSync(configs.certificatePath),
    };
    https.createServer(options, app).listen(443, APP_IPADDRESS, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), APP_IPADDRESS, 443);
    });
  } else {
    app.listen(APP_PORT, APP_IPADDRESS, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), APP_IPADDRESS, APP_PORT);
    });
  }
}());
