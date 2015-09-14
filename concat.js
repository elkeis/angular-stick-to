/* global require*/
var glob = require('glob');
var concat = require('concat');

// options is optional
glob('src/**/*.js', {nosort: true}, function(er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.

  concat(files, 'ngStickTo.js', function(error) {
    console.log(error);
  });
});
