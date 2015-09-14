angular.module('angular-stick-to').factory('postDigest', [
  '$rootScope',
  '$timeout',
  function($rootScope, $timeout) {

    return function postDigest(callback) {
      var sheduled = false;
      var removed = false;
      var remove = $rootScope.$watch(function() {
        if (!sheduled) {
          sheduled = true;
          $timeout(function() {
            if (!removed) {
              callback();
              sheduled = false;
            }
          },0, false);
        }
      });
      return function() {
        removed = true;
        remove();
      };
    };
  }
]);
