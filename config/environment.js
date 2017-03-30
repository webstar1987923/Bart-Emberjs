/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'bart',
    environment: environment,
    rootURL: '/bart/', // '/' jm7752 1-19 3:13
    returl: 'http://m5labbizops02.gcsc.att.com:28125/bart/',
    locationType: 'auto',
    contentSecurityPolicy : {
      'font-src': "'self' data: use.typekit.net",
      'connect-src': "'self' http://m5labbizops01.gcsc.att.com:8443" // correct port jm7752 1-19 21:53
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      ajaxServiceHost: 'http://ccpup.ims.att.com:7001',
      apiHostURL: 'http://m5labbizops01.gcsc.att.com:28125'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
     ENV.APP.LOG_ACTIVE_GENERATION = true;
     ENV.APP.LOG_TRANSITIONS = true;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
     ENV.APP.LOG_VIEW_LOOKUPS = true;
      }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'auto';  //'none' 1-19 3:13

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    
  }

  return ENV;
};

//test filezilLA
