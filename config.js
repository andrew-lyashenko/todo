var path       = require('path')
  , basePath   = process.cwd();

module.exports = {

  port          : process.env.PORT || 3003,
  environment   : process.env.NODE_ENV || 'development',

  viewEngine    : 'jade',

  routes        : {
    'get /': 'index.index',
    'get /todos': 'todo.find',
    'post /todo': 'todo.create',
    'put /todo/:id': 'todo.update',
    'delete /todo/:id': 'todo.destroy',
    'post /todo/mass-destroy': 'todo.destroy',
  },

  paths: {
    public      : path.join(basePath, 'public'),
    views       : path.join(basePath, 'app/views'),
    controllers : path.join(basePath, 'app/controllers'),
    models      : path.join(basePath, 'app/models')
  },

  models: {
    migrate     : 'safe',
    connection  : 'localMongo'
  },

  connections: {
    localMongo: {
      adapter : 'sails-mongo',
      host    : 'localhost',
      port    : 27017,
      database: 'todo-test'
    }
  },

};