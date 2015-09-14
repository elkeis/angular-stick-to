angular.module('angular-stick-to').service('AccessorFactory', [
  'StickyElementRegistry',
  'LimitElementRegistry',
  function(StickyElementRegistry, LimitElementRegistry) {
    this.createPrimaryLimitAccessor = function(value) {
      var intValue = getIntOrZero(value);
      return function() {
        var limitElement = StickyElementRegistry[value];
        if (limitElement) {
          return limitElement.getBottom();
        } else {
          return intValue;
        }
      };
    };

    this.createSecondaryLimitAccessor = function(limitName) {
      return function() {
        var limit = LimitElementRegistry[limitName];
        if (limit) {
          return limit.getTop();
        } else {
          return Infinity;
        }
      };
    };

    function getIntOrZero(value) {
      var int = parseInt(value);
      return isNaN(int) ? 0 : int;
    }
  }
]);
