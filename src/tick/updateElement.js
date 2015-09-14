angular.module('ng-stick-to').factory('updateElement', [
  function() {
    return function updateElement(element) {
      var primaryLimitOverflow =
        element.getPrimaryLimit() - element.getPristineTop();
      if (primaryLimitOverflow > 0) {
        var secondaryLimitOverflow =
          element.getPristineBottom() - element.getSecondaryLimit();
        if (secondaryLimitOverflow > 0) {
          element.setSyntheticOffset(-secondaryLimitOverflow);
        } else {
          var secondaryLimitGap = -secondaryLimitOverflow;
          if (secondaryLimitGap < primaryLimitOverflow) {
            element.setSyntheticOffset(secondaryLimitGap);
          } else {
            element.setSyntheticOffset(primaryLimitOverflow);
          }
        }
      } else {
        element.setSyntheticOffset(0);
      }
    };
  }
]);
