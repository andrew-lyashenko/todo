var async     = require('async')
  , _         = require('lodash')
  , glob      = require('glob')
  , path      = require('path')
  , static    = require('serve-static')
  , util      = require('util')
  , Waterline = require('waterline')
  , orm       = new Waterline()
  , config    = require('./config');

module.exports = function (app, callback) {

  var pipeline = [];

  // Load Controllers
  pipeline.push(function (next) {

    var cwd         = config.paths.controllers
      , controllers = {};

    glob('*.js', { cwd: cwd }, function (err, files) {
      if (err) return next(err);

      _.each(files, function (file) {
        var name = path.basename(file, '.js').toLowerCase();
        controllers[name] = require( path.join(cwd, file) );
      });

      next(null, controllers);
    });

  }); // END Load Controllers


  // Bind Routes
  pipeline.push(function (controllers, next) {

    _.each(config.routes, function (val, key) {
      var route          = key.split(' ')
        , routeOptions   = val.split('.')
        , type           = route[0].toLowerCase()
        , path           = route[1]
        , controllerName = _.trim(routeOptions[0].toLowerCase())
        , actionName     = _.trim(routeOptions[1]) || 'index';

      if (!controllers[controllerName]) {
        return console.error(
          util.format('"%s" Controller Not Found', controllerName)
        );
      }

      if (!controllers[controllerName][actionName]) {
        return console.error(
          util.format('Action "%s" Not Found in "%s" Controller', actionName, controllerName)
        );
      }

      app[type](path, controllers[controllerName][actionName]);
    });

    next(null);

  }); // END Bind Routes


  // Load Models
  pipeline.push(function (next) {

    var cwd = config.paths.models;

    glob('*.js', { cwd: cwd }, function (err, files) {
      if (err) return next(err);

      _.each(files, function (file) {
        var name   = path.basename(file, '.js').toLowerCase()
          , module = require( path.join(cwd, file) )
          , data   = _.extend({
              identity: name,
              connection: config.models.connection
            }, module)
          , model  = Waterline.Collection.extend(data);
        orm.loadCollection(model);
      });

      next(null);
    });

  }); // END Load Models


  // Bind Default Routes
  pipeline.push(function (next) {

    app.use(static(config.paths.public));

    app.use(function(req, res){
      res.status(404);
      if (req.accepts('html')) return res.render('404', {title: '404 Not Found'});
      if (req.accepts('json')) return res.send({error: 'Not Found'});
      res.type('txt').send('Not Found');
    });

    next(null);

  }); // END Bind Default Routes


  // Initialize ORM
  pipeline.push(function (next) {

    orm.initialize({
      connections: config.connections,
      adapters: {
        'sails-mongo': require('sails-mongo')
      },
      defaults: {
        migrate: config.models.migrate
      }
    }, function(err, models) {
      if(err) return next(err);

      _.each(models.collections, function (model) {
        var modelName = _.upperFirst(model.identity);
        GLOBAL[modelName] = model;
      });

      next(null);
    });

  }); // END Initialize ORM


  async.waterfall(pipeline, function (err) {
    if (err) console.error(err);
    callback();
  });

}