var express        = require('express')
  , app            = express()
  , bodyParser     = require('body-parser')
  , methodOverride = require('method-override')
  , logger         = require('morgan')
  , http           = require('http')
  , config         = require('./config');

app.set('views', config.paths.views);
app.set('view engine', config.viewEngine);
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

if (config.env == 'development') {
  app.use(require('errorhandler')());
}

require('./bootstrap')(app, function () {
  http.createServer(app).listen(config.port, function () {
    console.log('Server listening on http://localhost:' + config.port);
  });
});