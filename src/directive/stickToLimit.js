angular.module('angular-stick-to').directive('angularStickToLimit', [
  'LimitElementRegistry',
  'ElementFactory',
  function(LimitElementRegistry, ElementFactory) {
    return function(scope, el, attrs) {
      var simpleElement = ElementFactory.createSimpleElement(el);
      if (attrs.angularStickToLimit) {
        LimitElementRegistry[attrs.angularStickToLimit] = simpleElement;
        scope.$on('$destroy', function() {
          LimitElementRegistry[attrs.angularStickToLimit] = undefined;
        });
      }
    };
  }
]);
