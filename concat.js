/* global require, console*/
var glob = require('glob');
var concat = require('concat');
var minify = require('minify');
var fs = require('fs');

var RESULT_FILE_NAME = 'angularStickTo.js';
var MIN_FILE_NAME = 'angularStickTo.min.js';

glob('src/**/*.js', {nosort: true}, function(er, files) {

  concat(files, RESULT_FILE_NAME, function(error) {
    console.log(error || 'concatenated into ' + RESULT_FILE_NAME);
    minify(RESULT_FILE_NAME, function(error, data) {
      console.log(error || '');
      if (!error) {
        fs.writeFile(MIN_FILE_NAME, data, function(error) {
          console.log(error || 'minified code assembled into ' + MIN_FILE_NAME);
        });
      }
    });
  });
});
