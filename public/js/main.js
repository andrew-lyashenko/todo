require.config({
  baseUrl: 'js',
  paths: {
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min',
    'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.1/lodash.min'
  },
  shim: {
    angular: {
      exports: 'angular',
      deps: ['lodash']
    }
  },
  deps: ['app']
});