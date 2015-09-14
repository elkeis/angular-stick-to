/* global module, require*/
module.exports = function(config) {
  require('./karma.conf.js')(config);
  config.set({
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome'],
    reporters: ['dots', 'html'],
    preprocessors: {}
  });
};
